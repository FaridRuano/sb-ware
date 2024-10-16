import connectMongoDB from "@libs/mongodb"
import Client from "@models/clientModel"
import Plan from "@models/planModel"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function POST(request) {
    const { ced, name, email, phone, address, plan, user } = await request.json()
    await connectMongoDB()

    await Client.create({ ced, name: name.toUpperCase(), email, phone, address, plan: plan, payments: null, attent: null, user })
    return NextResponse.json({ message: "Data created" }, { status: 200 })
}

export async function GET(request) {
    await connectMongoDB()

    const url = request.nextUrl
    const email = url.searchParams.get('email')
    const page = parseInt(url.searchParams.get('page')) || 1
    const limit = parseInt(url.searchParams.get('limit')) || 10
    const type = parseInt(url.searchParams.get('type')) || 1
    const term = url.searchParams.get('term') || null

    if (!email) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const skip = (page - 1) * limit

    let query = { user: email }

    if(term !== null){
        query.name = { $regex: term, $options: 'i' };
    }

    const totalCli = await Client.countDocuments({ user:email })

    const current = new Date();

    const totalCliActive = await Client.countDocuments({
        user: email,
        'plan.asis': { $gt: 0 },
        'plan.end': { $gt: current }
    })
    
    const totalCliInactive = await Client.countDocuments({
        user: email,
        $or: [
            { 'plan.asis': { $eq: 0 } }, // No remaining attendance
            { 'plan.end': { $lt: current } } // Plan end date has passed (strictly before today)
        ]
    })

    let clients

    let totalPages

    if(type === 1){

        clients = await Client.find(query, 'name plan updatedAt')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec()

        totalPages = Math.ceil(totalCli/limit)

    } else if (type === 2) {
        
        clients = await Client.find({
            user: email,
            'plan.asis': { $gt: 0 },
            'plan.end': { $gt: current }
        }, 'name plan updatedAt')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec()
        
        totalPages = Math.ceil(totalCliActive/limit)
        

    } else if (type === 3) {
        
        clients = await Client.find({
            user: email,
            $or: [
                { 'plan.asis': { $eq: 0 } }, 
                { 'plan.end': { $lt: current } }
            ]
        }, 'name plan updatedAt')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec()

        totalPages = Math.ceil(totalCliInactive/limit)
        

    } else {
        return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }
    
    return NextResponse.json({ 
        clients,
        totalPages: totalPages, 
        currentPage: page, 
        totalCli, 
        totalCliActive, 
        totalCliInactive 
    })
    
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
    const { action, id, data } = await request.json();
    await connectMongoDB();

    if (action === 'renew') {

        
        const client = await Client.findById( id );
        if (!client) {
            return NextResponse.json({ message: "Client not found" }, { status: 404 });
        }

        const lastPlan = client.plan.id

        const plan = await Plan.findOne({id: lastPlan})

        const { ini, end } = data

        let newIni = new Date(ini)
        let newEnd = new Date(end)
        
        if (plan.dura === 30) {

            newEnd.setMonth(newEnd.getMonth() + 1)
            newIni.setMonth(newIni.getMonth() + 1)
            
        } else {
            newEnd = new Date(newIni)
            newEnd.setDate(newEnd.getDate() + plan.dura)
        }

        await Client.findOneAndUpdate(
            { _id: id },
            {
                "plan.name": plan.name,
                "plan.dura": plan.dura,
                "plan.asis": plan.asis,
                "plan.deud": plan.cost,
                "plan.ini": newIni,
                "plan.end": newEnd,

            },
            { new: true }
        );
        return NextResponse.json({ message: "Client updated!"}, { status: 200 })

    } else if (action === 'registerPayment') {

        const client = await Client.findOne({ _id: id });

        if (!client) {
            return NextResponse.json({ message: "Client not found" }, { status: 404 })
        }


        await Client.updateOne(
            { _id: id, payments: null },
            { 
                $set: { payments: []},
            },
        )

        const currentdeud = client.plan.deud.valueOf();

        const decrementedValue = currentdeud - data.amount;

        const updatedClient = await Client.findOneAndUpdate(
            { _id: id },
            {
                $set: { "plan.deud": new mongoose.Types.Double(decrementedValue) },
                $push: { payments: { amount: data.amount, date: data.date } }
            },
            { new: true }
        )

        if (updatedClient) {
            return NextResponse.json({ message: "Attendance registered successfully", client }, { status: 200 })
        } else {
            return NextResponse.json({ message: "Client not found" }, { status: 404 })
        }

    } else if (action === 'registerAttendance') {

        const client = await Client.findOne({ _id: id })

        if (!client) {
            return NextResponse.json({ message: "Client not found" }, { status: 404 })
        }

        await Client.updateOne(
            { _id: id, attent: null },
            { $set: { attent: [] } }
        );

        const updatedClient = await Client.findOneAndUpdate(
            { _id: id },
            {
                $push: { attent: data },
                $inc: { "plan.asis": -1 },
            },
            { new: true }
        )

        if (updatedClient) {
            return NextResponse.json({ message: "Attendance registered successfully", client }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Client not found" }, { status: 404 });
        }

    }else if (action === 'change') {

        const client = await Client.findById( id );
        
        if (!client) {
            return NextResponse.json({ message: "Client not found" }, { status: 404 });
        }

        const plan = data.plan
        const newIni = new Date(data.date);
        const newEnd = new Date(newIni);
        newEnd.setDate(newEnd.getDate() + plan.dura);

        await Client.findOneAndUpdate(
            { _id: id },
            {
                "plan.name": plan.name,
                "plan.id": plan.id,
                "plan.dura": plan.dura,
                "plan.asis": plan.asis,
                "plan.deud": plan.cost,
                "plan.ini": newIni,
                "plan.end": newEnd,

            },
            { new: true }
        )

        
        return NextResponse.json({ message: "Client updated!"}, { status: 200 })
        
    }else if (action === "update") {

        await Client.findOneAndUpdate(
            { id: id },
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
    else {
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
}