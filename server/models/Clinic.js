const mongoose = require("mongoose");

// Single, simple schema with only the fields you requested
// No Mixed/SchemaTypes usage, easy and beginner‑friendly
const ClinicSchema = new mongoose.Schema(
  {
    // Hospital/Clinic name
    name: { type: String, required: true, trim: true },

    // Rating (0–5)
    rating: { type: Number, min: 0, max: 5, default: 0 },

    // Hours in a Google‑like display format
    // Example item: { day: "Friday", label: "Open 24 hours" } or { day: "Monday", label: "6am – 5pm" }
    hours: {
      type: [
        {
          day: { type: String, trim: true },
          label: { type: String, trim: true },
        },
      ],
      default: [],
    },

    // Address (free text)
    address: { type: String, default: "", trim: true },

    // Coordinates (simple lat/lng numbers)
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },

    // Phone number
    phone: { type: String, default: "", trim: true },

    // Doctors managed by admin (name/specialty/phone)
    doctors: {
      type: [
        {
          name: { type: String, trim: true },
          specialty: { type: String, trim: true, default: "" },
          phone: { type: String, trim: true, default: "" },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

ClinicSchema.methods.toJSON = function () {
  return {
    id: this._id,
    name: this.name,
    rating: this.rating,
    hours: this.hours,
    address: this.address,
    coordinates: this.coordinates,
    phone: this.phone,
    doctors: this.doctors,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Clinic", ClinicSchema);


