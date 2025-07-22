import { connectToDB } from "@/lib/db";
import User from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try {
        const {email,password} = await request.json();

        // validation
        if(!email || !password){
            return NextResponse.json(
                {error: "Email and Password are required"},
                {status: 400}
            )
        }

        // check exisiting user
        await connectToDB();

        const existingUser = await User.findOne({email})
        if(existingUser){
            return NextResponse.json(
                {error: "User already register"},
                {status:400}
            )
        }

        // create user
        await User.create({
            email,
            password
        })
        return NextResponse.json(
            {message: "User register successfull"},
            {status:400}
        );
    } catch (error) {
        console.error("Registration error", error);
        return NextResponse.json(
            {error: "Failed to register user"},
            {status:400}
        )
    }
}