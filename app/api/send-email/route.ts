import { NextResponse } from "next/server";
import { sendVaultEmail } from "@/lib/email/nodemailer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await sendVaultEmail(body);

    return NextResponse.json({
      success: true,
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
