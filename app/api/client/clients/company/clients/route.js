import connectMongoDB from "@libs/mongodb"
import Client from "@models/clientModel"
import Plan from "@models/planModel"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function GET(request) {
    await connectMongoDB()

    const url = request.nextUrl
    const email = url.searchParams.get('email')
    const page = parseInt(url.searchParams.get('page')) || 1
    const limit = 10
    const term = url.searchParams.get('term') || null

    if (!email) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const skip = (page - 1) * limit

    let query = { user: email }

    let totalPages

    if(term !== null){
        query.name = { $regex: term, $options: 'i' };
    }

    const clients = await Client.find( query, '_id name ced email phone address plan updatedAt')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec()

    const plans = await Plan.find( { user: email },  'id name dura asis cost updatedAt')
    .sort({ updatedAt: -1 })
    .exec()

    const totalCli = await Client.countDocuments(query)

    totalPages = Math.ceil(totalCli/limit)

    return NextResponse.json({ 
        clients,
        plans,
        currentPage: page, 
        totalPages,
    })
    
}

export async function POST(request) {
    const { ced, name, email, phone, address, plan, user } = await request.json()
    await connectMongoDB()

    await Client.create({ ced, name: name.toUpperCase(), email, phone, address, plan: plan, payments: null, attent: null, user })
    return NextResponse.json({ message: "Data created" }, { status: 200 })
}

export async function DELETE(request) {
    const { id } = await request.json()
    await connectMongoDB()

    const result = await Client.findOneAndDelete({ _id: id })

    if (result) {
        return NextResponse.json({ message: "Client deleted successfully" }, { status: 200 })
    } else {
        return NextResponse.json({ message: "Client not found" }, { status: 404 })
    }
}

export async function PUT(request) {
    const { id, data } = await request.json();
    await connectMongoDB();

    await Client.findOneAndUpdate(
        { _id: id },
        {
            $set: { // Use $set to update fields
                ced: data.ced,
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                'plan.asis': data.plan.asis,
                'plan.deud': data.plan.deud,
                'plan.ini': data.plan.ini,
                'plan.end': data.plan.end,
                'plan.dura': data.plan.dura,
                'plan.name': data.plan.name,
                'plan.id': data.plan.id
            }
        },
        { new: true }
    )

    return NextResponse.json({ message: "Data created" }, { status: 200 })

}