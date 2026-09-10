const express = require("express");

const {
    evaluateAccess
} = require("../controllers/accessController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/evaluate/:tagId",
    protect,
    evaluateAccess
);

module.exports = router;