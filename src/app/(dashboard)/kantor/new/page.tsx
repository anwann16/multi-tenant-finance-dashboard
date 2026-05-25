"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateKantor } from "@/hooks/useKantor";
import KantorForm from "@/components/kantor/KantorForm";
import { toast } from "sonner";

export default function KantorNewPage() {
  const router = useRouter();
  const createKantor = useCreateKantor();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/kantor">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Buat Kantor Baru</h1>
          <p className="text-sm text-muted-foreground">Isi data kantor untuk membuat kantor baru.</p>
        </div>
      </div>
      <KantorForm
        onSubmit={(data) => {
          createKantor.mutate(data, {
            onSuccess: () => {
              toast.success("Kantor berhasil dibuat");
              router.push("/kantor");
            },
          });
        }}
        isLoading={createKantor.isPending}
      />
    </div>
  );
}
