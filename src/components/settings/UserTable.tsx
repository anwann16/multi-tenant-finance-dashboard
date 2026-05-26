"use client";

import { useQuery } from "@tanstack/react-query";
import { Shield, ShieldCheck, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "FINANCE";
  createdAt: string;
}

export default function UserTable() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/admin");
      if (!res.ok) return [];
      const data = await res.json();
      return (data?.recentUsers ?? []) as UserProfile[];
    },
  });

  if (isLoading) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-16" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border p-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Daftar User</CardTitle>
        <span className="text-xs text-muted-foreground">{users.length} user</span>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Bergabung</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const initials = u.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                return (
                  <tr key={u.id} className="border-b transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Profil</DropdownMenuItem>
                          <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          {u.role !== "ADMIN" && (
                            <DropdownMenuItem className="text-destructive">Nonaktifkan</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="lg:hidden divide-y divide-border/50">
          {users.map((u) => {
            const initials = u.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
            return (
              <div key={u.id} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/30 sm:gap-4 sm:px-6">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{u.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <RoleBadge role={u.role} />
                    <span>·</span>
                    <span>{u.email}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === "ADMIN";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
      isAdmin ? "bg-primary/10 text-primary" : "bg-emerald-500/10 text-emerald-600"
    }`}>
      {isAdmin ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
      {isAdmin ? "Admin" : "Finance"}
    </span>
  );
}
