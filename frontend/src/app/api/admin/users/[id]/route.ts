import { z } from "zod";
import { readSession } from "@/lib/auth";
import { fail, ok } from "@/lib/response";
import { User } from "@/models";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const schema = z.object({ role: z.enum(["user", "admin"]) });

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await readSession();
  if (!session || session.role !== "admin") return fail("Forbidden", 403);

  const userId = Number(params.id);
  if (!userId) return fail("Tai khoan khong hop le", 400);
  if (userId === session.id) return fail("Khong the thay doi role cua chinh ban", 400);

  try {
    const body = schema.parse(await request.json());
    const user = await User.findByPk(userId);
    if (!user) return fail("Khong tim thay tai khoan", 404);
    if (user.role === "admin" && body.role === "user" && await User.count({ where: { role: "admin" } }) <= 1) return fail("He thong phai co it nhat mot admin", 400);

    await user.update({ role: body.role });
    return ok({ id: user.id, role: user.role });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Khong the cap nhat tai khoan", 400);
  }
}
