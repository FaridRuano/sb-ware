import mongoose, { Schema, mongo } from "mongoose";
require('mongoose-double')(mongoose);

const SchemaTypes = mongoose.Schema.Types;

const planSchema = new Schema(
    {
        id: Number,
        name: String,
        dura: Number,
        asis: Number,
        cost: Number,
        user: String,
    },
    {
        timestamps: true,
    }
)

const Plan = mongoose.models.Plans || mongoose.model("Plans", planSchema)

export default Plan