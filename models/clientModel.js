import mongoose, { Schema, mongo } from "mongoose";
require('mongoose-double')(mongoose);

const SchemaTypes = mongoose.Schema.Types;

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
    }
)


const Client = mongoose.models.Clients || mongoose.model("Clients", clientSchema)

export default Client