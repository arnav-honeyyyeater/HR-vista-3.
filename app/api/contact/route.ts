import { NextResponse } from "next/server";
import { z } from "zod";
import { addContact } from "@/lib/data/store";

export const runtime = "nodejs";

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = ContactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const contact = await addContact(parsed.data);
  return NextResponse.json({ ok: true, id: contact.id }, { status: 201 });
}
