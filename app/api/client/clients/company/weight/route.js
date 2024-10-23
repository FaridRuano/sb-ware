import connectMongoDB from "@libs/mongodb"
import Client from "@models/clientModel"
import { NextResponse } from "next/server"
import { TZDate } from "@date-fns/tz";

export async function POST(request) {
    const { weight, height, id } = await request.json()

    if(!weight || !height){
        return NextResponse.json({ message: 'Data not found' }, { status: 404 })
    }

    await connectMongoDB()

    const date = new Date();

    try {

        const user = await Client.findOneAndUpdate(
            { _id: id },
            {  
                $push: { weights: {weight: weight, height: height, date: date} } 
            },
            { new: true }
        )

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request) {
    const { date, id } = await request.json()

    if(!date || !id){
        return NextResponse.json({ message: 'Data not found' }, { status: 404 })
    }

    await connectMongoDB()
    
    const dateToDelete = new Date(date); 

    try {

        const user = await Client.findOneAndUpdate(
            { _id: id },
            {  
                $pull: { weights: { 
                    date: {
                        $gte: new Date(dateToDelete.getTime() - 1000), 
                        $lte: new Date(dateToDelete.getTime() + 1000) 
                    }
                }}
            },
            { new: true }
        )

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}