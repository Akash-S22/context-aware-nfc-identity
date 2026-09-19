const express = require("express");

const {
    emergencyAccess
} = require("../controllers/emergencyController");

const router = express.Router();

router.get("/:tagId", emergencyAccess);

module.exports = router;