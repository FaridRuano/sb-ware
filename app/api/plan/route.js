import connectMongoDB from "@libs/mongodb"
import Plan from "@models/planModel"
import { NextRequest, NextResponse } from "next/server"

export async function POST (request) {
    const { id,name,duration,asis,costo } = await request.json()
    await connectMongoDB()

    await Plan.create({ id,name,duration,asis,costo  })
    return NextResponse.json({message: "Data created"}, {status: 200})
}

export async function GET () {
    await connectMongoDB()
    const plans = await Plan.find()
    return NextResponse.json({plans})
}