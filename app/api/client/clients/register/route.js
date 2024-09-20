import connectMongoDB from "@libs/mongodb"
import Client from "@models/clientModel"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function GET(request) {
    await connectMongoDB()

    const url = request.nextUrl
    const email = url.searchParams.get('email')
    const id = url.searchParams.get('id') || null

    if (!email) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if(id === null || id === undefined){
        return NextResponse.json({ message: "Id Plan not found" }, { status: 404 })
    }

    const clients = await Client.find( { 
        user: email,
        "plan.id" : { $eq : id},
    },  '_id name plan attent')
    .sort({ updatedAt: -1 })
    .exec()

    return NextResponse.json({ 
        clients,
    })
}

export async function PUT(request) {
    await connectMongoDB();

    const url = request.nextUrl
    const email = url.searchParams.get('email')
    const id = url.searchParams.get('id') || null

    if (!email) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const client = await Client.findOne({ _id: id })

    if (!client) {
        return NextResponse.json({ message: "Client not found" }, { status: 404 })
    }

    const current = new Date()

    await Client.updateOne(
        { _id: id, attent: null },
        { $set: { attent: [] } }
    );

    const updatedClient = await Client.findOneAndUpdate(
        { _id: id },
        {
            $push: { attent: current },
            $inc: { "plan.asis": -1 },
        },
        { new: true }
    )

    if(updatedClient){
        return NextResponse.json({ message: "Attendance registered successfully", data: true }, { status: 200 });
    }else{
        return NextResponse.json({ message: "Errory", data: false }, { status: 404 });
    }

}
