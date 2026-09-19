const Tag = require("../models/Tag");
const Resource = require("../models/Resource");

const emergencyAccess = async (req, res) => {
    try {
        const { tagId } = req.params;

        // Find the tag
        const tag = await Tag.findOne({ tagId });

        if (!tag) {
            return res.status(404).json({
                message: "Tag not found"
            });
        }

        // Emergency access is only available for active tags
        if (tag.status !== "ACTIVE") {
            return res.status(403).json({
                message: "Tag is inactive"
            });
        }

        // Check whether emergency mode is enabled
        if (!tag.emergencyEnabled) {
            return res.status(403).json({
                message: "Emergency access is not enabled"
            });
        }

        // Only retrieve resources explicitly marked as emergency
        const resources = await Resource.find({
            tag: tag._id,
            type: "EMERGENCY",
            active: true
        }).select(
            "name description content type"
        );

        res.status(200).json({
            emergencyAccess: true,
            tag: {
                tagId: tag.tagId,
                type: tag.type
            },
            resources
        });

    } catch (error) {
        res.status(500).json({
            message: "Emergency access failed",
            error: error.message
        });
    }
};

module.exports = {
    emergencyAccess
};