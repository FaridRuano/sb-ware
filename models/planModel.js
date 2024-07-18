import mongoose, { Schema, mongo } from "mongoose";

const planSchema = new Schema(
    {
        id:Number,
        name:String,
        dura:Number,
        asis:Number,
        cost:Number
    },
    {
        timestamps: true,
    }
)

const Plan = mongoose.models.Plans || mongoose.model("Plans", planSchema)

export default Plan