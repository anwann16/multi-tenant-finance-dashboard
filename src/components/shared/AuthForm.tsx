"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  LoginSchema,
  RegisterSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/validators";

type AuthMode = "login" | "register";

interface AuthFormProps {
  mode: AuthMode;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLogin = mode === "login";

  const form = useForm<LoginInput | RegisterInput>({
    resolver: zodResolver(isLogin ? LoginSchema : RegisterSchema),
    defaultValues: isLogin
      ? { email: "", password: "" }
      : { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(data: LoginInput | RegisterInput) {
    setIsLoading(true);
    setError(null);

    // Mock validation
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (isLogin) {
      const { email, password } = data as LoginInput;
      if (password.length < 6) {
        setError("Password minimal 6 karakter");
        setIsLoading(false);
        return;
      }
      console.log("Mock login:", { email, password });
      window.location.href = "/dashboard";
    } else {
      const { name, email, password, confirmPassword } = data as RegisterInput;
      if (password !== confirmPassword) {
        setError("Password tidak cocok");
        setIsLoading(false);
        return;
      }
      console.log("Mock register:", { name, email, password });
      window.location.href = "/login";
    }

    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          {isLogin ? "Masuk" : "Buat Akun"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {isLogin
            ? "Masukkan email dan password untuk masuk"
            : "Daftar untuk mulai mengelola keuangan kantor"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                placeholder="Nama lengkap"
                {...form.register("name")}
              />
              {form.formState.errors && "name" in form.formState.errors && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name?.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@kantor.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email?.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimal 6 karakter"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password?.message}
              </p>
            )}
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Ulangi password"
                {...form.register("confirmPassword")}
              />
              {"confirmPassword" in form.formState.errors &&
                form.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.confirmPassword?.message}
                  </p>
                )}
            </div>
          )}

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Memproses..."
              : isLogin
                ? "Masuk"
                : "Daftar"}
          </Button>
        </form>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-center py-4">
        <p className="text-sm text-muted-foreground">
          {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
          <Link
            href={isLogin ? "/register" : "/login"}
            className="font-medium text-primary hover:underline"
          >
            {isLogin ? "Daftar" : "Masuk"}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
