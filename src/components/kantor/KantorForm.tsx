"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KantorSchema, type KantorInput } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface KantorFormProps {
  defaultValues?: Partial<KantorInput>;
  title?: string;
  description?: string;
  onSubmit: (data: KantorInput) => void;
  isLoading?: boolean;
}

export default function KantorForm({ defaultValues, title, description, onSubmit, isLoading }: KantorFormProps) {
  const form = useForm<KantorInput>({
    resolver: zodResolver(KantorSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      pettyCashLimit: 0,
      ...defaultValues,
    },
  });

  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Kantor *</Label>
            <Input id="name" placeholder="Contoh: Kantor Pusat Jakarta" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Input id="address" placeholder="Jl. Sudirman No. 123" {...form.register("address")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" placeholder="Deskripsi singkat kantor..." {...form.register("description")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pettyCashLimit">Limit Petty Cash (Rp)</Label>
            <Input id="pettyCashLimit" type="number" placeholder="5000000" {...form.register("pettyCashLimit", { valueAsNumber: true })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => form.reset()}>Reset</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Menyimpan..." : "Simpan"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
