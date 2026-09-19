const express = require("express");

const {
    createResource,
    getResources,
    updateResource,
    deleteResource
} = require("../controllers/resourceController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createResource);

router.get("/", getResources);

router.patch("/:id", updateResource);

router.delete("/:id", deleteResource);

module.exports = router;