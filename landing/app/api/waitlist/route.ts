import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, company } = body as { email?: string; company?: string };

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    console.log("[waitlist]", { email, company, at: new Date().toISOString() });

    const webhook = process.env.WAITLIST_WEBHOOK_URL;
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, source: "landing" }),
      }).catch((err) => console.error("[waitlist webhook]", err));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[waitlist]", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
