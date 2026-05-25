"use client";

import { useRouter } from "next/navigation";
import { useCreateKantor } from "@/hooks/useKantor";
import KantorForm from "@/components/kantor/KantorForm";
import { toast } from "sonner";

export default function KantorNewPage() {
  const router = useRouter();
  const createKantor = useCreateKantor();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <KantorForm
        title="Buat Kantor Baru"
        description="Isi data kantor untuk membuat kantor baru."
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
