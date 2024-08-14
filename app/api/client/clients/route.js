import connectMongoDB from "@libs/mongodb"
import Client from "@models/clientModel"
import Plan from "@models/planModel"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function POST(request) {
    const { ced, name, email, phone, address, plan, user } = await request.json()
    await connectMongoDB()

    const highestIdClient = await Client.findOne().sort({ id: -1 }).exec()
    const newId = highestIdClient ? highestIdClient.id + 1 : 1

    await Client.create({ id: newId, ced, name: name.toUpperCase(), email, phone, address, plan: plan, payments: null, attent: null, user })
    return NextResponse.json({ message: "Data created" }, { status: 200 })
}

export async function GET(request) {
    await connectMongoDB()

    const url = request.nextUrl
    const email = url.searchParams.get('email')

    if (!email) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const clients = await Client.find({ user: email }).sort({ createdAt: -1 }).exec()
    return NextResponse.json({ clients })
}

export async function DELETE(request) {
    const { id } = await request.json()
    await connectMongoDB()

    const result = await Client.findOneAndDelete({ id: id })

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

        const plan = await Plan.findOne({id: lastPlan});

        const newIni = new Date(data);
        const newEnd = new Date(newIni);
        newEnd.setDate(newEnd.getDate() + plan.dura);

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