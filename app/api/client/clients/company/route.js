import connectMongoDB from "@libs/mongodb"
import Client from "@models/clientModel"
import Plan from "@models/planModel"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function GET(request) {
    await connectMongoDB()

    const url = request.nextUrl
    const email = url.searchParams.get('email')
    const limit = 4

    if (!email) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    let query = { user: email }

    const clients = await Client.find( query, 'name email phone updatedAt')
    .sort({ updatedAt: -1 })
    .limit(limit)
    .exec()

    const plans = await Plan.find( query,  'name dura asis cost updatedAt')
    .sort({ updatedAt: -1 })
    .limit(limit)
    .exec()

    const allClients = await Client.find(query, 'name attent payments')
    
    const attentDates = []

    allClients.forEach(client => {
    if (client.attent && Array.isArray(client.attent)) {
        client.attent.forEach(date => {
            attentDates.push({ name: client.name, date: new Date(date) })
        })
    }
    })

    const lastAtt = attentDates
    .sort((a, b) => b.date - a.date)
    .slice(0, 4)

    const paymentDates = []

    allClients.forEach(client => {
        if (client.payments && Array.isArray(client.payments)) {
            client.payments.forEach(payment => {
                paymentDates.push({
                    name: client.name,
                    date: new Date(payment.date),
                    amount: payment.amount
                })
            })
        }
    })

    const lastPays = paymentDates
    .sort((a, b) => b.date - a.date)
    .slice(0, 4)

    return NextResponse.json({ 
        clients,
        plans,
        attents: lastAtt,
        payments: lastPays
    })
    
}
