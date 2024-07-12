import connectMongoDB from "@libs/mongodb"
import Client from "@models/clientModel"
import Plan from "@models/planModel"
import { NextRequest, NextResponse } from "next/server"



export async function GET() {
    await connectMongoDB();
    let clients = await Client.find();

    // Ordena los clientes por la fecha más reciente en su array de payments
    clients = clients.sort((a, b) => {
        const dateA = new Date(Math.max(...a.payments.map(payment => new Date(payment.date))));
        const dateB = new Date(Math.max(...b.payments.map(payment => new Date(payment.date))));
        return dateB - dateA;
    }).slice(0, 4);

    const recentPays = clients.map(client => ({
        id: client.id,  // Asegúrate de usar el campo correcto para el ID, por ejemplo, _id si estás usando MongoDB
        name: client.name,
        date:new Date(Math.max(...client.attent.map(att => new Date(att)))),
        plan: client.plan[0].name,  // Extrae solo el campo 'name' de cada plan
        amount: client.payments.reduce((sum, payment) => sum + payment.amount, 0)
    }));

    const recentClientsSortedById = clients.slice(0, 3).sort((a, b) => b.id - a.id);

    // Obtener los últimos 3 clientes para recentClients
    const recentClients = recentClientsSortedById.map(client => ({
        id: client.id,  // Asegúrate de usar el campo correcto para el ID, por ejemplo, _id si estás usando MongoDB
        name: client.name,
        plan: client.plan[0].name,  // Extrae solo el campo 'name' de cada plan
    }));

    const recentAsistanceSortedByAttent = clients.sort((a, b) => {
        const dateA = new Date(Math.max(...a.attent.map(att => new Date(att))));
        const dateB = new Date(Math.max(...b.attent.map(att => new Date(att))));
        return dateB - dateA;
    });

    // Obtener los clientes para recentAsistance
    const recentAsistance = recentAsistanceSortedByAttent.map(client => ({
        id: client.id,  // Asegúrate de usar el campo correcto para el ID, por ejemplo, _id si estás usando MongoDB
        name: client.name,
        attent: new Date(Math.max(...client.attent.map(att => new Date(att))))
    }));

    

    const nopaids = clients.filter(client => client.payments.length === 0).length;
    const paids = clients.filter(client => client.payments.length > 0).length;
    const totalClients = await Client.countDocuments();

    const totalAmount = clients.reduce((sum, client) => {
        return sum + client.payments.reduce((total, payment) => total + payment.amount, 0);
    }, 0);
    const monthlyAverage = calculateMonthlyAverage(clients);
    return NextResponse.json({ recentPays,recentClients,recentAsistance,nopaids,paids ,totalClients,totalAmount,monthlyAverage });
    
}

function calculateMonthlyAverage(clients) {
    const monthlyAverage = {};

    clients.forEach(client => {
        client.payments.forEach(payment => {
            const date = new Date(payment.date);
            const monthYear = date.toISOString().slice(0, 7); // Obtener YYYY-MM del campo date

            if (!monthlyAverage[monthYear]) {
                monthlyAverage[monthYear] = {
                    totalAmount: 0,
                    count: 0
                };
            }

            monthlyAverage[monthYear].totalAmount += payment.amount;
            monthlyAverage[monthYear].count++;
        });
    });

    // Encontrar el último mes con datos y calcular su promedio
    const keys = Object.keys(monthlyAverage);
    if (keys.length > 0) {
        const lastMonth = keys[keys.length - 1];
        const average = monthlyAverage[lastMonth].totalAmount / monthlyAverage[lastMonth].count;
        return  average ;
    }

    return null;
}