import connectMongoDB from "@libs/mongodb"
import Client from "@models/clientModel"
import { NextResponse } from "next/server"

function calculateMonthlyAverage(clients) {
    let totalAmount = 0;
    let monthsCounted = 3; // We will divide by 3 as per the requirement

    // Get the current date and calculate the date 3 months ago
    const currentDate = new Date();
    const threeMonthsAgo = new Date(currentDate);
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

    clients.forEach(client => {
        if (client.payments !== null && Array.isArray(client.payments)) {
            client.payments.forEach(payment => {
                const paymentDate = new Date(payment.date);

                // Only sum payments that fall within the last 3 months
                if (paymentDate >= threeMonthsAgo) {
                    totalAmount += payment.amount;
                }
            });
        }
    });

    // Calculate the average by dividing by 3 (for the 3 months)
    const average = totalAmount / monthsCounted;

    return average || null;
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
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
    
        const planEndDate = new Date(client.plan.end)
        const isCurrentMonth = planEndDate.getMonth() === currentMonth && planEndDate.getFullYear() === currentYear
    
        return isCurrentMonth ? sum + (client.plan.deud || 0) : sum
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

    const allAttents = []

    clients.forEach(client => {
        if (Array.isArray(client.attent) && client.attent.length > 0) {
            client.attent.forEach(att => {
                allAttents.push({
                    id: client.id,
                    name: client.name,
                    plan: client.plan?.name || 'No Plan', 
                    attent: new Date(att), 
                })
            })
        }
    })

    const recentAttent = allAttents
        .sort((a, b) => b.attent - a.attent)
        .slice(0, 3)

    const noPaids = clients.filter(client => (client.plan.deud) > 0).length

    const paids = clients.filter(client => (client.plan.deud) === 0).length

    const totalClients = await Client.countDocuments({ user:email })

    const totalAmount = clients.reduce((sum, client) => {
        const payments = client.payments || []
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
    
        // Filter payments to include only those made in the current month and year
        const clientTotal = payments
            .filter(payment => {
                const paymentDate = new Date(payment.date)
                return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear
            })
            .reduce((total, payment) => total + payment.amount, 0)
    
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
