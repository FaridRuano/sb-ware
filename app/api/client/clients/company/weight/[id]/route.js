import connectMongoDB from "@libs/mongodb"
import Client from "@models/clientModel"
import { Db } from "mongodb"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function POST(request, context) {
    const { params } = context

    if(!params){
        return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    await connectMongoDB()

    const userId = params.id

    try {

        const user = await Client.findOneAndUpdate(
            { _id: userId },
            {  
                $set: { weights: [] }
            },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}