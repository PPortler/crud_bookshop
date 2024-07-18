import Books from "@/models/books";
import { connectDB } from "@/lib/database";
import { NextResponse } from "next/server";

export async function PUT(req){
    const id = req.nextUrl.pathname.split('/').pop();
    const { newTitle:title, newDescription:description, newUrl:url} = await req.json();
    await connectDB();
    await Books.findByIdAndUpdate(id, { title,description,url })
    return NextResponse.json({message:"Book Updated"},{status:200})
}

export async function GET(req){
    const id = req.nextUrl.pathname.split('/').pop();
    const book_id = await Books.findOne({ _id:id })
    return NextResponse.json({ book_id })
}

export async function DELETE(req){
    const id = req.nextUrl.pathname.split('/').pop();
    await connectDB();
    await Books.findByIdAndDelete(id)
    return NextResponse.json({message:"Book Deleted"},{status:200})
}
