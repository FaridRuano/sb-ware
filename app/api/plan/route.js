import connectMongoDB from "@libs/mongodb"
import Plan from "@models/planModel"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request) {
    const { name, duration, asis, costo } = await request.json()
    await connectMongoDB()
    const highestIdClient = await Plan.findOne().sort({ id: -1 }).exec();
    const newId = highestIdClient ? highestIdClient.id + 1 : 1

    await Plan.create({ id: newId, name, duration, asis, costo })
    return NextResponse.json({ message: "Data created" }, { status: 200 })
}

export async function GET() {
    await connectMongoDB()
    const plans = await Plan.find()
    return NextResponse.json({ plans })
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
    const { id,name,duration,asis,costo } = await request.json();
    console.log(id,name)
    await connectMongoDB();


    // Actualizar el plan 
    const updatedPlan = await Plan.findOneAndUpdate(
        { id: id },
        {
            name: name,
            duration: duration,
            asis: asis,
            costo: costo,
        },
        { new: true }
    );

    return NextResponse.json({ message: "Data created" }, { status: 200 })


}