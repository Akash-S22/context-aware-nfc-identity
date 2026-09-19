const Tag = require("../models/Tag");
const AccessPolicy = require("../models/AccessPolicy");
const Resource = require("../models/Resource");

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

    // Check whether the tag is active
    if (tag.status !== "ACTIVE") {
        return {
            allowed: false,
            reason: "TAG_INACTIVE"
        };
    }

    // Normal access requires authentication
    if (!user) {
        return {
            allowed: false,
            reason: "AUTHENTICATION_REQUIRED"
        };
    }

    // Find an active policy matching the user's role and requested action
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

    // Get active resources associated with this tag
    const resources = await Resource.find({
        tag: tag._id,
        active: true
    }).sort({ createdAt: -1 });

    return {
        allowed: true,
        reason: "ACCESS_GRANTED",
        tag,
        policy,
        resources
    };
};

module.exports = {
    checkAccess
};