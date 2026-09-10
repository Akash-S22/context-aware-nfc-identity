const Tag = require("../models/Tag");
const AccessPolicy = require("../models/AccessPolicy");

const checkAccess = async ({
    user,
    tagId,
    action
}) => {
    // Find the NFC tag
    const tag = await Tag.findOne({ tagId });

    if (!tag) {
        return {
            allowed: false,
            reason: "TAG_NOT_FOUND"
        };
    }

    // Inactive tags cannot be accessed normally
    if (tag.status !== "ACTIVE") {
        return {
            allowed: false,
            reason: "TAG_INACTIVE"
        };
    }

    // Authentication is required for normal access
    if (!user) {
        return {
            allowed: false,
            reason: "AUTHENTICATION_REQUIRED"
        };
    }

    // Find an active policy for this tag
    const policy = await AccessPolicy.findOne({
        tag: tag._id,
        enabled: true,
        allowedRoles: user.role,
        allowedActions: action
    });

    if (!policy) {
        return {
            allowed: false,
            reason: "ACCESS_DENIED"
        };
    }

    return {
        allowed: true,
        reason: "ACCESS_GRANTED",
        tag,
        policy
    };
};

module.exports = {
    checkAccess
};