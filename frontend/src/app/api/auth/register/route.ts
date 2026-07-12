import { z } from "zod";
import { fail, ok } from "@/lib/response";
import { hashPassword, publicUser, setSessionCookie } from "@/lib/auth";
import { User } from "@/models";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const existing = await User.findOne({ where: { email: body.email.toLowerCase() } });
    if (existing) return fail("Email already registered", 409);
    const user = await User.create({
      name: body.name,
      email: body.email.toLowerCase(),
      passwordHash: await hashPassword(body.password),
      role: "user",
      authProvider: "local",
      emailVerified: false,
    });
    const safeUser = publicUser(user);
    await setSessionCookie(safeUser);
    return ok({ user: safeUser }, { status: 201 });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Cannot register", 400);
  }
}
