import connectMongoDB from "@libs/mongodb"
import Client from "@models/clientModel"
import { NextResponse } from 'next/server';

export async function GET(request) {
    await connectMongoDB()

    const url = request.nextUrl
    const email = url.searchParams.get('email')

    if (!email) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const clients = await Client.find({ user: email })

    const paymentDates = []

    clients.forEach(client => {
        if (client.payments && Array.isArray(client.payments)) {
            client.payments.forEach(payment => {
                paymentDates.push({
                    id: client._id,
                    name: client.name,
                    date: new Date(payment.date),
                    amount: payment.amount
                })
            })
        }
    })

    paymentDates.sort((a, b) => b.date - a.date)

    return NextResponse.json({ payments: paymentDates })
}

export async function DELETE(request) {
    await connectMongoDB();
    
    // Obtener los datos del cuerpo de la solicitud
    const { id ,date} = await request.json();
    const paymentDate = new Date(date).toISOString();
    // Encontrar el cliente y eliminar el pago correspondiente
    const client = await Client.findOne({ _id: id });

    if (client) {
        // Encontrar el índice del elemento que coincide con la fecha
        const index = client.payments.findIndex(paymentDateItem => new Date(paymentDateItem.date).toISOString() === paymentDate);
        
        if (index !== -1) {
            // Eliminar el elemento del array `attent`
            client.payments.splice(index, 1);
            await client.save();
            return NextResponse.json({ message: 'Attent date deleted successfully' });
        } else {
            return NextResponse.json({ message: 'Attent date not found' }, { status: 404 });
        }
    } else {
        return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }
}