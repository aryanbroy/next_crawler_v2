import { NextResponse } from "next/server";
import path from "path";
import * as fs from "fs/promises";

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), "data", "crawled-data.json");
    const readData = await fs.readFile(dataPath, "utf-8");
    console.log(readData);
    return NextResponse.json(JSON.parse(readData), { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error in route" }, { status: 402 });
  }
}
