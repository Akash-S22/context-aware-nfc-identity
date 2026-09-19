const Tag = require("../models/Tag");
const AccessPolicy = require("../models/AccessPolicy");
const Resource = require("../models/Resource");

const checkAccess = async ({
    user,
    tagId,
    action
}) => {
    const tag = await Tag.findOne({ tagId });

    if (!tag) {
        return {
            allowed: false,
            reason: "TAG_NOT_FOUND"
        };
    }

    if (tag.status !== "ACTIVE") {
        return {
            allowed: false,
            reason: "TAG_INACTIVE"
        };
    }

    if (!user) {
        return {
            allowed: false,
            reason: "AUTHENTICATION_REQUIRED"
        };
    }

    // Find active policies for this tag and requested action
    const policies = await AccessPolicy.find({
        tag: tag._id,
        enabled: true,
        allowedActions: action
    });

    let accessGranted = false;
    let matchedPolicy = null;

    for (const policy of policies) {

        // Owner-based policy
        if (
            policy.accessScope === "OWNER" &&
            tag.owner &&
            tag.owner.toString() === user.userId
        ) {
            accessGranted = true;
            matchedPolicy = policy;
            break;
        }

        // Role-based policy
        if (
            policy.accessScope === "ROLE" &&
            policy.allowedRoles.includes(user.role)
        ) {
            accessGranted = true;
            matchedPolicy = policy;
            break;
        }
    }

    if (!accessGranted) {
        return {
            allowed: false,
            reason: "ACCESS_DENIED"
        };
    }

    const resources = await Resource.find({
        tag: tag._id,
        active: true,
            type: { $ne: "EMERGENCY" }
    }).sort({ createdAt: -1 });

    return {
        allowed: true,
        reason: "ACCESS_GRANTED",
        tag,
        policy: matchedPolicy,
        resources
    };
};

module.exports = {
    checkAccess
};