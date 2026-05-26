"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKantor, useUpdateKantor } from "@/hooks/useKantor";
import KantorForm from "@/components/kantor/KantorForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function KantorEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: kantor, isLoading } = useKantor(id);
  const updateKantor = useUpdateKantor();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (!kantor) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Kantor tidak ditemukan.</p>
        <Link href="/kantor"><Button variant="link">Kembali</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/kantor/${id}`}>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit Kantor</h1>
      </div>
      <KantorForm
        title={`Edit ${kantor.name}`}
        description="Ubah data kantor."
        defaultValues={{
          name: kantor.name,
          address: kantor.address || "",
          description: kantor.description || "",
          pettyCashLimit: kantor.pettyCashLimit,
        }}
        onSubmit={(data) => {
          updateKantor.mutate(
            { id, ...data },
            {
              onSuccess: () => router.push(`/kantor/${id}`),
            }
          );
        }}
        isLoading={updateKantor.isPending}
      />
    </div>
  );
}
