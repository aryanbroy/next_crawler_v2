import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({ message: "Working route" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error in route" }, { status: 402 });
  }
}
