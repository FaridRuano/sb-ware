import connectMongoDB from "@libs/mongodb"
import Client from "@models/clientModel"
import { NextResponse } from 'next/server';

export async function GET() {
    await connectMongoDB();
    const clients = await Client.find();

    // Crear un array para almacenar los resultados con nombre, fecha y monto
    const paymentDates = [];

    clients.forEach(client => {
        client.payments.forEach(payment => {
            paymentDates.push({ id:client.id,name: client.name, date: new Date(payment.date), amount: payment.amount });
        });
    });

    // Ordenar los resultados por fecha desde la más reciente a la más antigua
    paymentDates.sort((a, b) => b.date - a.date);

    // Retornar la respuesta con el formato solicitado
    return NextResponse.json({ payments: paymentDates });
}

export async function DELETE(request) {
    await connectMongoDB();
    
    // Obtener los datos del cuerpo de la solicitud
    const { id ,date} = await request.json();
    const paymentDate = new Date(date).toISOString();
    // Encontrar el cliente y eliminar el pago correspondiente
    const client = await Client.findOne({ id: id });

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