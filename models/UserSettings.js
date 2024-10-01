import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const UserSettingsSchema = new mongoose.Schema(
    {
        idUser:
            {
                type: ObjectId,
                  ref: "companies",
                 required: true,
            },
            variable: { type: String },
            value:{type :String},
            defaultVal :{type:Boolean, default: false }

    },
    {
        timestamps: { createdAt: "created_at" },

    }
);

export const UserSettingModel = mongoose.model("userSettings", UserSettingsSchema);
