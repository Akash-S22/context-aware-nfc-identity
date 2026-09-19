const mongoose = require("mongoose");

const accessPolicySchema = new mongoose.Schema(
    {
        tag: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        accessScope: {
            type: String,
            enum: ["OWNER", "ROLE"],
            required: true,
            default: "OWNER"
        },

        allowedRoles: {
            type: [String],
            enum: ["USER", "ADMIN"],
            default: []
        },

        allowedActions: {
            type: [String],
            enum: ["VIEW", "DOWNLOAD", "EDIT"],
            default: ["VIEW"]
        },

        enabled: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "AccessPolicy",
    accessPolicySchema
);