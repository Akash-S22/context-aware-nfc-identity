const { checkAccess } = require("../services/accessService");

const evaluateAccess = async (req, res) => {
    try {
        const { tagId } = req.params;
        const { action } = req.body;

        if (!action) {
            return res.status(400).json({
                message: "Action is required"
            });
        }

        const result = await checkAccess({
            user: req.user,
            tagId,
            action
        });

        if (!result.allowed) {
            return res.status(403).json({
                allowed: false,
                reason: result.reason
            });
        }

        res.status(200).json({
            allowed: true,
            reason: result.reason,

            tag: {
                tagId: result.tag.tagId,
                type: result.tag.type,
                status: result.tag.status
            },

            policy: {
                name: result.policy.name,
                allowedRoles: result.policy.allowedRoles,
                allowedActions: result.policy.allowedActions
            },

            resources: result.resources
        });
    } catch (error) {
        res.status(500).json({
            message: "Access evaluation failed",
            error: error.message
        });
    }
};

module.exports = {
    evaluateAccess
};