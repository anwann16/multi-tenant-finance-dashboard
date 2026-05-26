import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ProfileSchema, ChangePasswordSchema } from "@/lib/validators";

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function getCurrentUser() {
  const session = await requireAuth();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  if (!user) throw new Error("User not found");
  return user;
}

export async function updateProfile(input: { name?: string; email?: string }) {
  const parsed = ProfileSchema.partial().safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.issues.map((e) => e.message).join(", "));

  const session = await requireAuth();
  const data: { name?: string; email?: string } = {};
  if (parsed.data.name !== undefined) data.name = parsed.data.name;
  if (parsed.data.email !== undefined) data.email = parsed.data.email;

  if (Object.keys(data).length === 0) return;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return user;
}

export async function changePassword(input: { currentPassword: string; newPassword: string }) {
  const parsed = ChangePasswordSchema.partial().safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.issues.map((e) => e.message).join(", "));

  const session = await requireAuth();
  const account = await prisma.account.findFirst({
    where: { userId: session.user.id, providerId: "credentials" },
    select: { id: true, password: true },
  });
  if (!account?.password) throw new Error("Akun tidak memiliki password");

  const bcrypt = await import("bcryptjs");
  const valid = await bcrypt.compare(input.currentPassword, account.password);
  if (!valid) throw new Error("Password saat ini salah");

  const hashed = await bcrypt.hash(input.newPassword, 12);
  await prisma.account.update({ where: { id: account.id }, data: { password: hashed } });
}
