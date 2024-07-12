import mongoose, { Schema, mongo } from "mongoose";


const clientSchema = new Schema(
    {
        ced:String,
        name: String,
        plan: [],
        ini: Date,
        end: Date,
        asis: Number,
        debt: Number,
        id:Number,
        email:String,
        phone:String,
        address:String,
        payments:[],
        attent:[]
    },
    {
        timestamps: true,
    }
)


const Client = mongoose.models.Clients || mongoose.model("Clients", clientSchema)

export default Client