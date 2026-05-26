"use client";

import { useRef, useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssignUser, useUnassignUser } from "@/hooks/useKantor";
import type { UserKantorRole } from "@/types/kantor";

interface UserAssignDialogProps {
  kantorId: string;
  users: UserKantorRole[];
}

export default function UserAssignDialog({ kantorId, users }: UserAssignDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN_KANTOR" | "FINANCE">("FINANCE");
  const assignMutation = useAssignUser();
  const unassignMutation = useUnassignUser();
  const [removeTarget, setRemoveTarget] = useState<UserKantorRole | null>(null);
  const isRemovingRef = useRef(false);

  function handleAssign() {
    if (!email) return;
    assignMutation.mutate(
      { kantorId, email, role },
      {
        onSuccess: () => {
          setEmail("");
          setRole("FINANCE");
        },
      }
    );
  }

  return (
    <>
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v && !isRemovingRef.current) setRemoveTarget(null); isRemovingRef.current = false; }}>
      <DialogTrigger render={
        <Button size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Kelola User
        </Button>
      } />
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Kelola User Kantor</DialogTitle>
          <DialogDescription>Assign atau unassign user dari kantor ini.</DialogDescription>
        </DialogHeader>

        {/* Assign form */}
        <div className="space-y-3 rounded-lg border p-4">
          <p className="text-sm font-medium">Tambah User</p>
          <div className="flex gap-2">
            <Input
              placeholder="email@kantor.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FINANCE">Finance</SelectItem>
                <SelectItem value="ADMIN_KANTOR">Admin Kantor</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAssign} disabled={!email || assignMutation.isPending}>
              {assignMutation.isPending ? "..." : "Assign"}
            </Button>
          </div>
        </div>

        {/* User list */}
        <div className="space-y-2">
          <p className="text-sm font-medium">User Terdaftar ({users.length})</p>
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada user terdaftar.</p>
          ) : (
            <div className="space-y-2">
              {users.map((ur) => (
                <div key={ur.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{ur.user.name}</p>
                    <p className="text-xs text-muted-foreground">{ur.user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={ur.role === "ADMIN_KANTOR" ? "default" : "secondary"}>
                      {ur.role === "ADMIN_KANTOR" ? "Admin" : "Finance"}
                    </Badge>
                    {!ur.isActive && (
                      <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => { isRemovingRef.current = true; setOpen(false); setRemoveTarget(ur); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>

      <AlertDialog open={!!removeTarget} onOpenChange={(visible) => {
        if (!visible) {
          setRemoveTarget(null);
          setOpen(true);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus User</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus <strong>{removeTarget?.user.name}</strong> dari kantor ini? User tidak akan bisa mengakses kantor ini lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                if (removeTarget) {
                  unassignMutation.mutate(
                    { kantorId, userId: removeTarget.userId },
                    {
                      onSuccess: () => setRemoveTarget(null),
                    }
                  );
                }
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
