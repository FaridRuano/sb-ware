import connectMongoDB from "@libs/mongodb"
import { NextResponse } from 'next/server';
import User from "@models/userModel"
import bcrypt from 'bcrypt';

export async function POST (request) {

    try {
        const { name, email, password } = await request.json()

        await connectMongoDB()

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { 
                    message: 'User already exists',
                    error: true
                },
                { status: 200 },
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const subObject = {
            active: false,
            plan: '',
            paydate: new Date(),
            cost: 0,
            space: 0,
            pays: null,
        }

        const businessObject = {
            name: '',
            ruc: '',
            email: email,
            phone: '',
            address: '',

        }

        await User.create({ name, email, password: hashedPassword, sub: subObject, business: businessObject })


        return NextResponse.json(
            { message: 'User Created' },
            { status: 200 }

        )
    } catch (error) {
        return NextResponse.json(
            { message: 'Something went wrong', error },
            { status: 500 }
        )
    }

}
