import connectMongoDB from "@libs/mongodb"
import Client from "@models/clientModel"
import Plan from "@models/planModel"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request) {
    const { ced, name, plan, asis, debt, email, phone, address, payments, atten } = await request.json()
    await connectMongoDB()

    const highestIdClient = await Client.findOne().sort({ id: -1 }).exec();
    const newId = highestIdClient ? highestIdClient.id + 1 : 1

    await Client.create({ ced, name, plan, asis, debt, id: newId, email, phone, address, payments, atten })
    return NextResponse.json({ message: "Data created" }, { status: 200 })
}

// export async function GET() {
//     await connectMongoDB()
//     // const clients = await Client.find()
//     // return NextResponse.json({clients})
//     const clients = await Client.find();
//     const plans = await Plan.find();

//     // Crear un diccionario para una búsqueda rápida de planes por ID
//     const planDict = {};
//     plans.forEach(plan => {
//         planDict[plan.id] = plan.name;
//     });

//     // Mapear clientes para reemplazar el campo 'plan' con el nombre del plan
//     const clientsWithPlanNames = clients.map(client => {
//         return {
//             ...client._doc,
//             plan: planDict[client.plan] || client.plan // Si no se encuentra el plan, dejar el ID
//         };
//     });

//     return NextResponse.json({ clients: clientsWithPlanNames });
// }
export async function GET() {
    await connectMongoDB()
    const clients = await Client.find()
    return NextResponse.json({ clients })
}

export async function DELETE(request) {
    const { id } = await request.json();
    await connectMongoDB();
    const result = await Client.findOneAndDelete({ id: id });
    if (result) {
        return NextResponse.json({ message: "Client deleted successfully" }, { status: 200 });
    } else {
        return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }
}


export async function PUT(request) {
    const { action, id, data } = await request.json();
    console.log(action)
    await connectMongoDB();

    if (action === 'renew') {

        const client = await Client.findOne({ id: id });
        if (!client) {
            return NextResponse.json({ message: "Client not found" }, { status: 404 });
        }

        const lastPlan = client.plan[client.plan.length - 1];
        const debt = client.debt
        if (!lastPlan || !lastPlan.dura) {
            return NextResponse.json({ message: "No valid plan found for the client" }, { status: 400 });
        }

        // Calcular la nueva fecha de finalización sumando los días de duración al startDate
        const newIni = new Date(data);
        const newEnd = new Date(newIni);
        newEnd.setDate(newEnd.getDate() + lastPlan.dura);

        const updateQuery = {};
        updateQuery[`plan.${0}.ini`] = newIni;
        updateQuery[`plan.${0}.end`] = newEnd;
        // Actualizar el cliente con el nuevo plan y fechas
        const updatedClient = await Client.findOneAndUpdate(
            { id: id },
            {
                dura: lastPlan.dura,
                //ini: newIni,
                //end: newEnd,
                asis: lastPlan.asis,
                debt: debt + lastPlan.cost,
                $set: updateQuery,
            },
            { new: true }
        );

        return NextResponse.json({ message: "Data created" }, { status: 200 })

    } else if (action === 'registerPayment') {
        const client = await Client.findOne({ id: id });

        if (!client) {
            return NextResponse.json({ message: "Client not found" }, { status: 404 });
        }

        // Actualizar el saldo (debt) del cliente y obtener el cliente actualizado
        const updatedClient = await Client.findOneAndUpdate(
            { id: id },
            {
                $inc: { debt: -data[0] }, // Decrementar la deuda
                $push: { payments: { amount: data[0], date: data[1] } } // Agregar nuevo pago al array
            },
            { new: true }
        );
        return NextResponse.json({ message: "Data created" }, { status: 200 })

    } else if (action === 'registerAttendance') {

        const client = await Client.findOneAndUpdate(
            { id: id },
            {
                $push: { attent: data },
                $inc: { asis: -1 },
            },
            { new: true }
        );

        if (client) {
            return NextResponse.json({ message: "Attendance registered successfully", client }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Client not found" }, { status: 404 });
        }

    }
    else if (action === 'change') {
        const client = await Client.findOne({ id: id });
        if (!client) {
            return NextResponse.json({ message: "Client not found" }, { status: 404 });
        }

        //const lastPlan = client.plan[client.plan.length - 1];
        const plan = data[0]
        console.log(plan)
        //const date = data[1]
        const debt = client.debt
        // if (!lastPlan || !lastPlan.duration) {
        //     return NextResponse.json({ message: "No valid plan found for the client" }, { status: 400 });
        // }

        // Calcular la nueva fecha de finalización sumando los días de duración al startDate
        const newIni = new Date(plan.ini);
        const newEnd = new Date(newIni);
        newEnd.setDate(newEnd.getDate() + plan.dura);
        const updateQuery = {};
        //updateQuery[`plan.${0}.ini`] = newIni;
        const newEndString = newEnd.toISOString();
        updateQuery[`plan.${0}.end`] = newEndString;

        // Actualizar el cliente con el nuevo plan y fechas
        const updatedClient = await Client.findOneAndUpdate(
            { id: id },
            {
                dura: plan.dura,
                //ini: newIni,
                //end: newEnd,
                asis: plan.asis,
                debt: debt + plan.cost,
                plan: plan,
                //$set: updateQuery,
            },
            { new: true }
        );
        const updatedClient2 = await Client.findOneAndUpdate(
            { id: id },
            {
                $set: updateQuery,
            },
            { new: true }
        );
        return NextResponse.json({ message: "Data created" }, { status: 200 })

    }
    else if (action === "update") {
        // Actualizar el plan 
        console.log(data.name)
        const updatedPlan = await Client.findOneAndUpdate(
            { id: id },
            {
                ced: data[0].ced,
                name: data[0].name,
                plan: data[0].plan,
                asis: data[0].asisPlan,
                debt: data[0].durationPlan,
                email: data[0].email,
                phone: data[0].phone,
                address: data[0].address,
            },
            { new: true }
        );

        

        return NextResponse.json({ message: "Data created" }, { status: 200 })

    }
    else {
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
}