import { NextResponse } from "next/server";
import { z } from "zod";
import { addRegistration } from "@/lib/data/store";

export const runtime = "nodejs";

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  organisation: z.string().optional(),
  role: z.enum(["student", "professional", "corporate"]),
  dietary: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const registration = await addRegistration(parsed.data);
  return NextResponse.json({ ok: true, id: registration.id }, { status: 201 });
}
