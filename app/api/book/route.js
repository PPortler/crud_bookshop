import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Books from "@/models/books";

export async function POST(req){
    const {title,description,url} = await req.json();
    await connectDB();
    await Books.create({ title, description , url})
    return NextResponse.json({message:"Post Book Complete"},{status: 201})
}

export async function GET(){
    await connectDB();
    const books = await Books.find({})
    return NextResponse.json({ books })
}

