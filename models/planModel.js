import mongoose, { Schema, mongo } from "mongoose";

const planSchema = new Schema(
    {
        id:Number,
        name:String,
        duration:Number,
        asis:Number,
        costo:Number
    },
    {
        timestamps: true,
    }
)

const Plan = mongoose.models.Plan || mongoose.model("Plan", planSchema)

export default Plan