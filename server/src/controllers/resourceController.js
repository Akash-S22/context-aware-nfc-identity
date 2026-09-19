const Resource = require("../models/Resource");
const Tag = require("../models/Tag");


// Create resource
const createResource = async (req, res) => {
    try {
        const {
            tagId,
            name,
            type,
            description,
            content
        } = req.body;

        if (!tagId || !name || !type) {
            return res.status(400).json({
                message: "tagId, name and type are required"
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

        const resource = await Resource.create({
            tag: tag._id,
            name,
            type,
            description,
            content
        });

        res.status(201).json({
            message: "Resource created successfully",
            resource
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create resource",
            error: error.message
        });
    }
};


// Get resources belonging to user's tags
const getResources = async (req, res) => {
    try {
        const userTags = await Tag.find({
            owner: req.user.userId
        }).select("_id");

        const tagIds = userTags.map(tag => tag._id);

        const resources = await Resource.find({
            tag: { $in: tagIds }
        })
            .populate("tag", "tagId type status")
            .sort({ createdAt: -1 });

        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch resources",
            error: error.message
        });
    }
};


// Update resource
const updateResource = async (req, res) => {
    try {
        const resource = await Resource.findById(
            req.params.id
        );

        if (!resource) {
            return res.status(404).json({
                message: "Resource not found"
            });
        }

        const tag = await Tag.findOne({
            _id: resource.tag,
            owner: req.user.userId
        });

        if (!tag) {
            return res.status(403).json({
                message: "You do not own this resource"
            });
        }

        const {
            name,
            type,
            description,
            content,
            active
        } = req.body;

        if (name !== undefined) {
            resource.name = name;
        }

        if (type !== undefined) {
            resource.type = type;
        }

        if (description !== undefined) {
            resource.description = description;
        }

        if (content !== undefined) {
            resource.content = content;
        }

        if (active !== undefined) {
            resource.active = active;
        }

        await resource.save();

        res.status(200).json({
            message: "Resource updated successfully",
            resource
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update resource",
            error: error.message
        });
    }
};


// Delete resource
const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(
            req.params.id
        );

        if (!resource) {
            return res.status(404).json({
                message: "Resource not found"
            });
        }

        const tag = await Tag.findOne({
            _id: resource.tag,
            owner: req.user.userId
        });

        if (!tag) {
            return res.status(403).json({
                message: "You do not own this resource"
            });
        }

        await resource.deleteOne();

        res.status(200).json({
            message: "Resource deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete resource",
            error: error.message
        });
    }
};


module.exports = {
    createResource,
    getResources,
    updateResource,
    deleteResource
};