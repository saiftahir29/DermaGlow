const express = require("express");
const mongoose = require("mongoose");
const { auth, admin } = require("../../middlewares");
const { ResponseHandler } = require("../../utils");

const Clinic = mongoose.model("Clinic");

const router = express.Router();

// Create clinic (admin only)
router.post("/", auth.required, auth.user, admin.isAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.name) return ResponseHandler.badRequest(res, "Clinic name is required");
    const clinic = await Clinic.create(body);
    return ResponseHandler.ok(res, clinic);
  } catch (err) {
    return ResponseHandler.badRequest(res, err.message);
  }
});

// List clinics (simple pagination)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1, 10);
    const limit = parseInt(req.query.limit || 20, 10);
    const skip = (page - 1) * limit;
    const [ items, total ] = await Promise.all([
      Clinic.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Clinic.countDocuments({})
    ]);
    return ResponseHandler.ok(res, { items, page, limit, total });
  } catch (err) {
    return ResponseHandler.badRequest(res, err.message);
  }
});

// Get clinic by id
router.get("/:id", async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) return ResponseHandler.notFound(res, "Clinic not found");
    return ResponseHandler.ok(res, clinic);
  } catch (err) {
    return ResponseHandler.badRequest(res, err.message);
  }
});

// Update clinic (admin only)
router.put("/:id", auth.required, auth.user, admin.isAdmin, async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!clinic) return ResponseHandler.notFound(res, "Clinic not found");
    return ResponseHandler.ok(res, clinic);
  } catch (err) {
    return ResponseHandler.badRequest(res, err.message);
  }
});

// Delete clinic (admin only)
router.delete("/:id", auth.required, auth.user, admin.isAdmin, async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndDelete(req.params.id);
    if (!clinic) return ResponseHandler.notFound(res, "Clinic not found");
    return ResponseHandler.ok(res, "Clinic deleted successfully");
  } catch (err) {
    return ResponseHandler.badRequest(res, err.message);
  }
});

module.exports = router;


