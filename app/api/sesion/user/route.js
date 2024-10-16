import connectMongoDB from "@libs/mongodb"
import { NextResponse } from 'next/server';
import User from "@models/userModel"

export async function POST (request) {

    try {
        const { id } = await request.json()

        await connectMongoDB()

        const existingUser = await User.findById(id);

        if (existingUser) {
            return NextResponse.json(
                { 
                    message: 'User exists ' + id,
                    data: existingUser
                },
                { status: 200 },
            );
        }else{
            return NextResponse.json(
                { message: 'User does not exists ' + id },
                { status: 200 }
            )
        }

    } catch (error) {
        return NextResponse.json(
            { message: 'Something went wrong', error },
            { status: 500 }
        )
    }

}
