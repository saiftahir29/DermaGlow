from ultralytics import YOLO
import sys
import json

def check_model(model_path):
    try:
        model = YOLO(model_path)
        print(json.dumps({
            "status": "success",
            "names": model.names
        }))
    except Exception as e:
        print(json.dumps({
            "status": "error",
            "message": str(e)
        }))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        check_model(sys.argv[1])
    else:
        print(json.dumps({"status": "error", "message": "No model path provided"}))
