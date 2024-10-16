import connectMongoDB from "@libs/mongodb"
import Plan from "@models/planModel"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function GET(request) {
    await connectMongoDB()

    const url = request.nextUrl
    const email = url.searchParams.get('email')

    if (!email) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const plans = await Plan.find( { user: email },  'id name updatedAt')
    .sort({ updatedAt: -1 })
    .exec()

    return NextResponse.json({ 
        plans,
    })
    
}
