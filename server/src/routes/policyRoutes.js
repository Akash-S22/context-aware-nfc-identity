const express = require("express");

const {
    createPolicy,
    getPolicies,
    updatePolicy,
    deletePolicy
} = require("../controllers/policyController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createPolicy);

router.get("/", getPolicies);

router.patch("/:id", updatePolicy);

router.delete("/:id", deletePolicy);

module.exports = router;