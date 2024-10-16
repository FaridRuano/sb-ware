import connectMongoDB from "@libs/mongodb"
import { NextResponse } from 'next/server'
import User from "@models/userModel"
import Client from "@models/clientModel"

export async function GET (request) {
    try{
        await connectMongoDB()
        
        const url = request.nextUrl
        const email = url.searchParams.get('email')

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json(
                { message: 'No se ha encontrado' },
                { status: 200 }
            )
        }

        const totalClients = await Client.countDocuments({ userEmail: email });

        return NextResponse.json(
            { 
                id: user._id,
                name: user.name,
                email: user.email,
                sub: user.sub,
                business: user.business,
                totalCli: totalClients,
            },
            { status: 200 },
        )

    }catch{
        return NextResponse.json(
            { message: 'Something went wrong'},
            { status: 500 }
        )
    }
}

export async function POST (request) {
    
    try{

        await connectMongoDB()
        

        const url = request.nextUrl
        const email = url.searchParams.get('email')

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json(
                { message: 'No se ha encontrado'},
                { status: 200 }
            )
        }

        const { name, ruc, emailRuc, phone, address  } = await request.json()

        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id},
            {
                $set: {
                    'business.name': name,
                    'business.ruc': ruc,
                    'business.email': emailRuc,
                    'business.phone': phone,
                    'business.address': address,

                }
            },
            { new: true }
        )

        return NextResponse.json(
            { 
                status: 'Sucesss',
                data: updatedUser
            },
            { status: 200 },
        )
    }catch{
        return NextResponse.json(
            { message: 'Something went wrong' },
            { status: 500 }
        )
    }
}