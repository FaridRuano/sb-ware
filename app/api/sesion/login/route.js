import connectMongoDB from "@libs/mongodb"
import { NextResponse } from 'next/server'
import User from "@models/userModel"
import bcrypt from 'bcrypt'

export async function GET (request) {
    try{
        await connectMongoDB()
        
        const url = request.nextUrl
        const email = url.searchParams.get('email')

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json(
                { message: 'No se ha encontrado', error: 'no-exists' },
                { status: 200 }
            )
        }

        return NextResponse.json(
            { user: {
                id: user._id,
                name: user.name,
                email: user.email,
                sub: user.sub
            } },
            { status: 200 },
        )

    }catch{
        return NextResponse.json(
            { message: 'Something went wrong', email },
            { status: 500 }
        )
    }
}

export async function POST (request) {

    try {
        const { email, password } = await request.json()

        await connectMongoDB()

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json(
                { message: 'No se ha encontrado', error: 'no-exists' },
                { status: 200 }
            )
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return NextResponse.json(
                { message: 'No coinciden', error: 'no-match' },
                { status: 200 }
            )
        }


        return NextResponse.json(
            { user: {
                id: user._id,
                name: user.name,
                email: user.email,
                sub: user.sub
            } },
            { status: 200 },
        )


    } catch (error) {
        return NextResponse.json(
            { message: 'Something went wrong', error },
            { status: 500 }
        )
    }
}


