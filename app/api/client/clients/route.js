import connectMongoDB from "@libs/mongodb"
import Client from "@models/clientModel"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function POST(request) {
    const { ced, name, email, phone, address, plan, user } = await request.json()
    await connectMongoDB()

    const highestIdClient = await Client.findOne().sort({ id: -1 }).exec()
    const newId = highestIdClient ? highestIdClient.id + 1 : 1

    await Client.create({ id: newId, ced, name, email, phone, address, plan: plan, payments: null, attent: null, user })
    return NextResponse.json({ message: "Data created" }, { status: 200 })
}

export async function GET(request) {
    await connectMongoDB()

    const url = request.nextUrl
    const email = url.searchParams.get('email')

    if (!email) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const clients = await Client.find({ user: email })
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

        const client = await Client.findOne({ id: id });
        if (!client) {
            return NextResponse.json({ message: "Client not found" }, { status: 404 });
        }

        const lastPlan = client.plan[client.plan.length - 1];
        const deud = client.deud
        if (!lastPlan || !lastPlan.dura) {
            return NextResponse.json({ message: "No valid plan found for the client" }, { status: 400 });
        }

        // Calcular la nueva fecha de finalización sumando los días de duración al startDate
        const newIni = new Date(data);
        const newEnd = new Date(newIni);
        newEnd.setDate(newEnd.getDate() + lastPlan.dura);

        const updateQuery = {};
        updateQuery[`plan.${0}.ini`] = newIni;
        updateQuery[`plan.${0}.end`] = newEnd;
        // Actualizar el cliente con el nuevo plan y fechas
        const updatedClient = await Client.findOneAndUpdate(
            { id: id },
            {
                dura: lastPlan.dura,
                //ini: newIni,
                //end: newEnd,
                asis: lastPlan.asis,
                deud: deud + lastPlan.cost,
                $set: updateQuery,
            },
            { new: true }
        );

        return NextResponse.json({ message: "Data created" }, { status: 200 })

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
        const client = await Client.findOne({ id: id });
        if (!client) {
            return NextResponse.json({ message: "Client not found" }, { status: 404 });
        }

        //const lastPlan = client.plan[client.plan.length - 1];
        const plan = data[0]
        console.log(plan)
        //const date = data[1]
        const deud = client.deud
        // if (!lastPlan || !lastPlan.duration) {
        //     return NextResponse.json({ message: "No valid plan found for the client" }, { status: 400 });
        // }

        // Calcular la nueva fecha de finalización sumando los días de duración al startDate
        const newIni = new Date(plan.ini);
        const newEnd = new Date(newIni);
        newEnd.setDate(newEnd.getDate() + plan.dura);
        const updateQuery = {};
        //updateQuery[`plan.${0}.ini`] = newIni;
        const newEndString = newEnd.toISOString();
        updateQuery[`plan.${0}.end`] = newEndString;

        // Actualizar el cliente con el nuevo plan y fechas
        const updatedClient = await Client.findOneAndUpdate(
            { id: id },
            {
                dura: plan.dura,
                //ini: newIni,
                //end: newEnd,
                asis: plan.asis,
                deud: deud + plan.cost,
                plan: plan,
                //$set: updateQuery,
            },
            { new: true }
        );
        const updatedClient2 = await Client.findOneAndUpdate(
            { id: id },
            {
                $set: updateQuery,
            },
            { new: true }
        );
        return NextResponse.json({ message: "Data created" }, { status: 200 })

    }else if (action === "update") {

        await Client.findOneAndUpdate(
            { id: id },
            {
                ced: data.ced,
                name: data.name,
                plan: data.plan,
                asis: data.asisPlan,
                deud: data.durationPlan,
                email: data.email,
                phone: data.phone,
                address: data.address,
            },
            { new: true }
        );

        return NextResponse.json({ message: "Data created" }, { status: 200 })

    }
    else {
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
}