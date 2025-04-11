import mongoose, { Schema, mongo } from "mongoose";

const SchemaTypes = mongoose.Schema.Types;

const paySchema = new Schema({
    date: Date,
    amount: Number,
    auth: Number,
    plan: String,
})

const subSchema = new Schema({
    active: Boolean,
    plan: String,
    paydate: Date,
    cost: Number,
    space: Number,
    pays: [paySchema],
})

const businessSchema = new Schema({
    name: String,
    ruc: String,
    email: String,
    phone: String,
    address: String,
})

const userSchema = new Schema(
    {
        name: String,
        email: String,
        password: String,
        sub: subSchema,
        business: businessSchema,
    },
    {
        timestamps: true,
    }
)

const User = mongoose.models.Users || mongoose.model('Users', userSchema)

export default User