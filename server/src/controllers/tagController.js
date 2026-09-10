const Tag = require("../models/Tag");


// Create a new NFC tag
const createTag = async (req, res) => {
    try {
        const { tagId, type, emergencyEnabled } = req.body;

        if (!tagId || !type) {
            return res.status(400).json({
                message: "tagId and type are required"
            });
        }

        const existingTag = await Tag.findOne({ tagId });

        if (existingTag) {
            return res.status(409).json({
                message: "Tag already exists"
            });
        }

        const tag = await Tag.create({
            tagId,
            type,
            emergencyEnabled: emergencyEnabled || false,
            owner: req.user.userId
        });

        res.status(201).json({
            message: "Tag created successfully",
            tag
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create tag",
            error: error.message
        });
    }
};


// Get tags belonging to logged-in user
const getTags = async (req, res) => {
    try {
        const tags = await Tag.find({
            owner: req.user.userId
        }).sort({ createdAt: -1 });

        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch tags",
            error: error.message
        });
    }
};


// Get one tag belonging to logged-in user
const getTagById = async (req, res) => {
    try {
        const tag = await Tag.findOne({
            tagId: req.params.tagId,
            owner: req.user.userId
        });

        if (!tag) {
            return res.status(404).json({
                message: "Tag not found"
            });
        }

        res.status(200).json(tag);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch tag",
            error: error.message
        });
    }
};


// Activate / deactivate tag
const updateTagStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["ACTIVE", "INACTIVE"].includes(status)) {
            return res.status(400).json({
                message: "Status must be ACTIVE or INACTIVE"
            });
        }

        const tag = await Tag.findOneAndUpdate(
            {
                tagId: req.params.tagId,
                owner: req.user.userId
            },
            { status },
            { new: true }
        );

        if (!tag) {
            return res.status(404).json({
                message: "Tag not found"
            });
        }

        res.status(200).json({
            message: "Tag status updated",
            tag
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update tag status",
            error: error.message
        });
    }
};


// Delete tag
const deleteTag = async (req, res) => {
    try {
        const tag = await Tag.findOneAndDelete({
            tagId: req.params.tagId,
            owner: req.user.userId
        });

        if (!tag) {
            return res.status(404).json({
                message: "Tag not found"
            });
        }

        res.status(200).json({
            message: "Tag deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete tag",
            error: error.message
        });
    }
};


module.exports = {
    createTag,
    getTags,
    getTagById,
    updateTagStatus,
    deleteTag
};