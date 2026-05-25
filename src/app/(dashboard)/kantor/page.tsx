"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKantors } from "@/hooks/useKantor";
import KantorCard from "@/components/kantor/KantorCard";
import KantorTable from "@/components/kantor/KantorTable";
import { Skeleton } from "@/components/ui/skeleton";

export default function KantorListPage() {
  const { data: kantors, isLoading } = useKantors();
  const [view, setView] = useState<"grid" | "table">("grid");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kantor</h1>
          <p className="text-sm text-muted-foreground">Kelola semua kantor dan user assignment.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border">
            <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" className="h-9 w-9" onClick={() => setView("grid")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={view === "table" ? "secondary" : "ghost"} size="icon" className="h-9 w-9" onClick={() => setView("table")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Link href="/kantor/new">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kantor
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kantors?.map((kantor) => (
            <KantorCard key={kantor.id} kantor={kantor} />
          ))}
        </div>
      ) : (
        <KantorTable kantors={kantors || []} />
      )}
    </div>
  );
}
