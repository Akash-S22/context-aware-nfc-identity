const AccessPolicy = require("../models/AccessPolicy");
const Tag = require("../models/Tag");


// Create a policy
const createPolicy = async (req, res) => {
    try {
        const {
            tagId,
            name,
            allowedRoles,
            allowedActions
        } = req.body;

        if (!tagId || !name) {
            return res.status(400).json({
                message: "tagId and name are required"
            });
        }

        const tag = await Tag.findOne({
            tagId,
            owner: req.user.userId
        });

        if (!tag) {
            return res.status(404).json({
                message: "Tag not found"
            });
        }

        const policy = await AccessPolicy.create({
            tag: tag._id,
            name,
            allowedRoles: allowedRoles || ["USER"],
            allowedActions: allowedActions || ["VIEW"]
        });

        res.status(201).json({
            message: "Policy created successfully",
            policy
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create policy",
            error: error.message
        });
    }
};


// Get policies belonging to user's tags
const getPolicies = async (req, res) => {
    try {
        const userTags = await Tag.find({
            owner: req.user.userId
        }).select("_id");

        const tagIds = userTags.map(tag => tag._id);

        const policies = await AccessPolicy.find({
            tag: { $in: tagIds }
        })
            .populate("tag", "tagId type status")
            .sort({ createdAt: -1 });

        res.status(200).json(policies);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch policies",
            error: error.message
        });
    }
};


// Update policy
const updatePolicy = async (req, res) => {
    try {
        const {
            name,
            allowedRoles,
            allowedActions,
            enabled
        } = req.body;

        const policy = await AccessPolicy.findById(
            req.params.id
        );

        if (!policy) {
            return res.status(404).json({
                message: "Policy not found"
            });
        }

        const tag = await Tag.findOne({
            _id: policy.tag,
            owner: req.user.userId
        });

        if (!tag) {
            return res.status(403).json({
                message: "You do not own this tag"
            });
        }

        if (name !== undefined) {
            policy.name = name;
        }

        if (allowedRoles !== undefined) {
            policy.allowedRoles = allowedRoles;
        }

        if (allowedActions !== undefined) {
            policy.allowedActions = allowedActions;
        }

        if (enabled !== undefined) {
            policy.enabled = enabled;
        }

        await policy.save();

        res.status(200).json({
            message: "Policy updated successfully",
            policy
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update policy",
            error: error.message
        });
    }
};


// Delete policy
const deletePolicy = async (req, res) => {
    try {
        const policy = await AccessPolicy.findById(
            req.params.id
        );

        if (!policy) {
            return res.status(404).json({
                message: "Policy not found"
            });
        }

        const tag = await Tag.findOne({
            _id: policy.tag,
            owner: req.user.userId
        });

        if (!tag) {
            return res.status(403).json({
                message: "You do not own this tag"
            });
        }

        await policy.deleteOne();

        res.status(200).json({
            message: "Policy deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete policy",
            error: error.message
        });
    }
};


module.exports = {
    createPolicy,
    getPolicies,
    updatePolicy,
    deletePolicy
};