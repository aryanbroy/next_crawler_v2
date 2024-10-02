import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

type CrawlError = {
  stdout: string;
};

const execPromise = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    const { stdout, stderr } = await execPromise(`tsx crawler/crawl.ts ${url}`);

    if (stderr) {
      console.log(stderr);
      return NextResponse.json(
        { message: "Error crawling this playlist" },
        { status: 402 }
      );
    }

    const startDelimiter = "---RESULT_START---";
    const endDelimiter = "---RESULT_END---";
    const startIndex = stdout.indexOf(startDelimiter);
    const endIndex = stdout.indexOf(endDelimiter);

    const result = stdout.slice(startIndex + startDelimiter.length, endIndex);
    const finalResult = JSON.parse(result);

    return NextResponse.json(finalResult, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message:
          (error as CrawlError).stdout || "Error while running the crawler",
      },
      { status: 402 }
    );
  }
}
