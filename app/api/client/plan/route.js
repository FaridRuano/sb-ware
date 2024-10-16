import connectMongoDB from "@libs/mongodb"
import Plan from "@models/planModel"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request) {

    const { name, dura, asis, cost, user } = await request.json()

    await connectMongoDB()

    const highestIdClient = await Plan.findOne().sort({ id: -1 }).exec();

    const newId = highestIdClient ? highestIdClient.id + 1 : 1

    await Plan.create({ id: newId, name, dura, asis, cost, user })

    return NextResponse.json(
        { message: "Data created" }, 
        { status: 200 }
    )
}

export async function GET(request) {
    await connectMongoDB()

    const url = request.nextUrl
    const email = url.searchParams.get('email')

    if (!email) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    const plans = await Plan.find({ user: email });

    return NextResponse.json(
        { plans }
    )
}

export async function DELETE(request) {
    const { id } = await request.json();
    await connectMongoDB();
    const result = await Plan.findOneAndDelete({ id: id });
    if (result) {
        return NextResponse.json({ message: "Client deleted successfully" }, { status: 200 });
    } else {
        return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }
}


export async function PUT(request) {
    const { id,name,dura,asis,cost } = await request.json();

    await connectMongoDB();


    // Actualizar el plan 
    const updatedPlan = await Plan.findOneAndUpdate(
        { id: id },
        {
            name: name,
            dura: dura,
            asis: asis,
            cost: cost,
        },
        { new: true }
    );

    return NextResponse.json({ message: "Data created" }, { status: 200 })


}