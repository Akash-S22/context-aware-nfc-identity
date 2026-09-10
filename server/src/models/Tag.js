const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
    {
        tagId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        type: {
            type: String,
            enum: ["PERSON", "VEHICLE", "ASSET", "DOCUMENT"],
            required: true
        },

        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE"
        },

        emergencyEnabled: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Tag", tagSchema);