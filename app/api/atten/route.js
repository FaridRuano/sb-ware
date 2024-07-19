import connectMongoDB from "@libs/mongodb"
import Client from "@models/clientModel"
import { NextResponse } from 'next/server';

export async function GET() {
    await connectMongoDB();
    const clients = await Client.find();
    
    // Crear un array para almacenar los resultados con nombre y fechas
    const clientDates = [];

    clients.forEach(client => {
        client.attent.forEach(date => {
            clientDates.push({id:client.id, name: client.name, date: new Date(date) });
        });
    });

    // Ordenar los resultados por fecha desde la más reciente a la más antigua
    clientDates.sort((a, b) => b.date - a.date);

    // Retornar la respuesta con el formato solicitado
    return NextResponse.json({ clients: clientDates });
}

export async function DELETE(request) {
    await connectMongoDB();
    
    // Obtener los datos del cuerpo de la solicitud
    const { id ,date} = await request.json();
    const attentDate = new Date(date).toISOString();
    
    // Encontrar el cliente y eliminar el pago correspondiente
    const client = await Client.findOne({ id: id });

    if (client) {
        // Encontrar el índice del elemento que coincide con la fecha
        const index = client.attent.findIndex(attentDateItem => new Date(attentDateItem).toISOString() === attentDate);
        
        if (index !== -1) {
            // Eliminar el elemento del array `attent`
            client.attent.splice(index, 1);
            await client.save();
            return NextResponse.json({ message: 'Attent date deleted successfully' });
        } else {
            return NextResponse.json({ message: 'Attent date not found' }, { status: 404 });
        }
    } else {
        return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }
}