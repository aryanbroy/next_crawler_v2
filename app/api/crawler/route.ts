import { Dataset } from "crawlee";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dataset = await Dataset.open("default");
    const { items } = await dataset.getData();
    console.log(items);
    return NextResponse.json({ message: "Working route" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error in route" }, { status: 402 });
  }
}
