import mongoose from "mongoose"

const connectMongoDB = async ()  => {
    try{
        await mongoose.connect(process.env.NEXT_MONGODB_URI)
        console.log("Connected to MongoDB.")
    }catch (e) {
        console.log(e)
    }
}

export default connectMongoDB