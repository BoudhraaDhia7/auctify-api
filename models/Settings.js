import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const SettingsSchema = new mongoose.Schema(
    {
        title: { type: String ,unique:true},
        variable: { type: String },
        unit: { type: String },
    },
    {
        timestamps: { createdAt: "created_at" },
        toJSON: { virtuals: true },
    }
);

export const SettingModel = mongoose.model("settings", SettingsSchema);
