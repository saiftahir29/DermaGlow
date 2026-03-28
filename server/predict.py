import sys
import json
from ultralytics import YOLO
import os

def predict(image_path, model_path="exp-2.pt"):
    if not os.path.exists(model_path):
        return {"status": "error", "message": f"Model file {model_path} not found"}
    
    try:
        model = YOLO(model_path)
        results = model.predict(image_path, conf=0.25, verbose=False)
        
        detections = []
        for r in results:
            for box in r.boxes:
                # cls is the class index
                # conf is the confidence score
                # xyxy is the bounding box coordinates
                class_id = int(box.cls[0])
                label = model.names[class_id]
                confidence = float(box.conf[0])
                
                detections.append({
                    "label": label,
                    "confidence": round(confidence, 4),
                    "box": box.xyxy[0].tolist()
                })
        
        # Aggregate detections by label
        summary = {}
        for d in detections:
            label = d["label"]
            if label not in summary:
                summary[label] = 0
            summary[label] += 1
            
        return {
            "status": "success",
            "detections": detections,
            "summary": summary
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"status": "error", "message": "No image path provided"}))
        sys.exit(1)
        
    image_path = sys.argv[1]
    result = predict(image_path)
    print(json.dumps(result))
