import mongoose, { Schema, mongo } from "mongoose";

const planCliSchema = new Schema({
    id: Number,
    name: String,
    dura: Number,
    asis: Number,
    deud: Number,
    ini: Date,
    end: Date,
})

const clientSchema = new Schema(
    {
        id:Number,
        ced: String,
        name: String,
        email:String,
        phone:String,
        address:String,
        plan: planCliSchema,
        payments:[],
        attent:[],
        user: String,
    },
    {
        timestamps: true,
        strict: false
    },
)


const Client = mongoose.models.Clients || mongoose.model("Clients", clientSchema)

export default Client