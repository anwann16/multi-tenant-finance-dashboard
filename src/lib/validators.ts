import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export const KantorSchema = z.object({
  name: z.string().min(2, "Nama kantor minimal 2 karakter"),
  address: z.string().optional(),
  description: z.string().optional(),
  pettyCashLimit: z.number().min(0, "Limit petty cash tidak boleh negatif").optional(),
});

export const TransaksiSchema = z.object({
  kategoriId: z.string().uuid("Kategori tidak valid"),
  tanggal: z.string().or(z.date()),
  deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
  nominal: z.number().positive("Nominal harus lebih dari 0"),
  metodeBayar: z.enum(["TUNAI", "TRANSFER", "CARD"]),
  rekeningInfo: z.string().optional(),
  isPettyCash: z.boolean(),
});

export const KategoriSchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter"),
  type: z.enum(["PEMASUKAN", "PENGELUARAN"]),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const PettyCashTopupSchema = z.object({
  nominal: z.number().positive("Nominal harus lebih dari 0"),
  deskripsi: z.string().optional(),
});

export const UserAssignSchema = z.object({
  email: z.string().email("Email tidak valid"),
  role: z.enum(["ADMIN_KANTOR", "FINANCE"]),
});

export const ProfileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Password minimal 6 karakter"),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type KantorInput = z.infer<typeof KantorSchema>;
export type TransaksiInput = z.infer<typeof TransaksiSchema>;
export type KategoriInput = z.infer<typeof KategoriSchema>;
export type PettyCashTopupInput = z.infer<typeof PettyCashTopupSchema>;
export type UserAssignInput = z.infer<typeof UserAssignSchema>;
export type ProfileInput = z.infer<typeof ProfileSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
