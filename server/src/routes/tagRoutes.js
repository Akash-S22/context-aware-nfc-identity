const express = require("express");

const {
    createTag,
    getTags,
    getTagById,
    updateTagStatus,
    updateEmergencyStatus,
    deleteTag
} = require("../controllers/tagController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createTag);

router.get("/", getTags);

router.get("/:tagId", getTagById);

router.patch("/:tagId/status", updateTagStatus);

router.patch(
    "/:tagId/emergency",
    updateEmergencyStatus
);

router.delete("/:tagId", deleteTag);

module.exports = router;