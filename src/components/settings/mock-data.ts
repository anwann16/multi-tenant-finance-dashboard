export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "FINANCE";
  avatar: string | null;
  createdAt: string;
  lastLoginAt: string;
}

export const MOCK_PROFILE: UserProfile = {
  id: "u1",
  name: "Andi Kurniawan",
  email: "andi@kantor.com",
  role: "ADMIN",
  avatar: null,
  createdAt: "2026-01-15T00:00:00Z",
  lastLoginAt: "2026-05-25T09:00:00Z",
};

export const MOCK_USERS: UserProfile[] = [
  { id: "u1", name: "Andi Kurniawan", email: "andi@kantor.com", role: "ADMIN", avatar: null, createdAt: "2026-01-15T00:00:00Z", lastLoginAt: "2026-05-25T09:00:00Z" },
  { id: "u2", name: "Sari Dewi", email: "sari@kantor.com", role: "FINANCE", avatar: null, createdAt: "2026-02-01T00:00:00Z", lastLoginAt: "2026-05-24T14:00:00Z" },
  { id: "u3", name: "Rina Sari", email: "rina@kantor.com", role: "FINANCE", avatar: null, createdAt: "2026-03-10T00:00:00Z", lastLoginAt: "2026-05-23T11:00:00Z" },
  { id: "u4", name: "Budi Santoso", email: "budi@kantor.com", role: "FINANCE", avatar: null, createdAt: "2026-04-05T00:00:00Z", lastLoginAt: "2026-05-20T08:00:00Z" },
  { id: "u5", name: "Maya Putri", email: "maya@kantor.com", role: "FINANCE", avatar: null, createdAt: "2026-05-01T00:00:00Z", lastLoginAt: "2026-05-18T16:00:00Z" },
];
