import type { KantorRole } from "@/generated/prisma/enums";

export interface KantorWithUserCount {
  id: string;
  name: string;
  address: string | null;
  description: string | null;
  pettyCashLimit: number;
  isActive: boolean;
  createdAt: string;
  _count: {
    userRoles: number;
    transaksi: number;
  };
}

export interface KantorDetail extends KantorWithUserCount {
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  userRoles: UserKantorRole[];
}

export interface UserKantorRole {
  id: string;
  userId: string;
  kantorId: string;
  role: KantorRole;
  isActive: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
