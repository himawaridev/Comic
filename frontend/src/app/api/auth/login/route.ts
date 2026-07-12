import { z } from "zod";
import { fail, ok } from "@/lib/response";
import { publicUser, setSessionCookie, verifyPassword } from "@/lib/auth";
import { User } from "@/models";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const user = await User.findOne({ where: { email: body.email.toLowerCase() } });
    if (!user) return fail("Invalid email or password", 401);
    if (user.getDataValue("authProvider") === "google") return fail("Tai khoan nay dang nhap bang Google", 401);
    const valid = await verifyPassword(body.password, user.passwordHash);
    if (!valid) return fail("Invalid email or password", 401);
    const safeUser = publicUser(user);
    await setSessionCookie(safeUser);
    return ok({ user: safeUser });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Cannot login", 400);
  }
}
