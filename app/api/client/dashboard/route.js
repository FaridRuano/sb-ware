import connectMongoDB from "@libs/mongodb"
import Client from "@models/clientModel"
import { NextResponse } from "next/server"

function calculateMonthlyAverage(clients) {
    const monthlyAverage = {}

    clients.forEach(client => {
        if(client.payments !== null && Array.isArray(client.payments)){
            client.payments.forEach(payment => {
                const date = new Date(payment.date)
                const monthYear = date.toISOString().slice(0, 7)
    
                if (!monthlyAverage[monthYear]) {
                    monthlyAverage[monthYear] = {
                        totalAmount: 0,
                        count: 0
                    }
                }
    
                monthlyAverage[monthYear].totalAmount += payment.amount
                monthlyAverage[monthYear].count++
            })
        }
    })

    const keys = Object.keys(monthlyAverage)
    if (keys.length > 0) {
        const lastMonth = keys[keys.length - 1]
        const average = monthlyAverage[lastMonth].totalAmount / monthlyAverage[lastMonth].count
        return  average 
    }

    return null
}

export async function GET(request) {
    await connectMongoDB()

    const url = request.nextUrl
    const email = url.searchParams.get('email')

    if (!email) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    let clients = await Client.find({ user: email })

    let allPayments = [];

    clients.forEach(client => {
        if(client.payments !== null && Array.isArray(client.payments)){
            client.payments.forEach((payment=>{
                allPayments.push({
                    clientId: client.id,
                    clientName: client.name,
                    clientPlan: client.plan.name,
                    paymentDate: new Date(payment.date),
                    paymentAmount: payment.amount
                })
            }))
        }
    })

    

    const totalDebt = clients.reduce((sum, client) => {
        return sum + (client.plan.deud || 0)
    }, 0)

    allPayments = allPayments.sort((a, b) => b.paymentDate - a.paymentDate).slice(0, 4)

    const recentPays = allPayments.map(payment => ({
        id: payment.clientId,
        name: payment.clientName,
        date: payment.paymentDate,
        plan: payment.clientPlan,
        amount: payment.paymentAmount
    }))

    const recentClientsSortedById = clients.slice(0, 3).sort((a, b) => b.id - a.id)

    const recentClients = recentClientsSortedById.map(client => ({
        id: client.id,  
        name: client.name,
        plan: client.plan.name,  
    }))

    const allAttents = [];

    clients.forEach(client => {
        if (Array.isArray(client.attent) && client.attent.length > 0) {
            client.attent.forEach(att => {
                allAttents.push({
                    id: client.id,
                    name: client.name,
                    plan: client.plan?.name || 'No Plan', 
                    attent: new Date(att), 
                });
            });
        }
    });

    const recentAttent = allAttents
        .sort((a, b) => b.attentDate - a.attentDate)
        .slice(0, 3); 

    const noPaids = clients.filter(client => (client.plan.deud) > 0).length

    const paids = clients.filter(client => (client.plan.deud) === 0).length

    const totalClients = await Client.countDocuments({ user:email })

    const totalAmount = clients.reduce((sum, client) => {
        const payments = client.payments || []
        const clientTotal = payments.reduce((total, payment) => total + payment.amount, 0)
        return sum + clientTotal
    }, 0)

    const monthlyAverage = calculateMonthlyAverage(clients)

    return NextResponse.json({ 
        totalDebt,
        recentPays,
        recentClients,
        recentAttent,
        noPaids,
        paids,
        totalClients,
        totalAmount,
        monthlyAverage
    })
    
}
