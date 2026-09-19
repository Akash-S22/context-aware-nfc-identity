const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
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

        type: {
            type: String,
            enum: ["PROFILE", "DOCUMENT", "SERVICE", "EMERGENCY"],
            required: true
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        content: {
            type: String,
            default: ""
        },

        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Resource", resourceSchema);