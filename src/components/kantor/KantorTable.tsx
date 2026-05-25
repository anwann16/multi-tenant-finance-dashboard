import Link from "next/link";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { KantorWithUserCount } from "@/types/kantor";

interface KantorTableProps {
  kantors: KantorWithUserCount[];
}

export default function KantorTable({ kantors }: KantorTableProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead className="text-center">User</TableHead>
              <TableHead className="text-center">Transaksi</TableHead>
              <TableHead className="text-right">Petty Cash Limit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kantors.map((kantor) => (
              <TableRow key={kantor.id}>
                <TableCell className="font-medium">{kantor.name}</TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">
                  {kantor.address || "-"}
                </TableCell>
                <TableCell className="text-center tabular-nums">{kantor._count.userRoles}</TableCell>
                <TableCell className="text-center tabular-nums">{kantor._count.transaksi}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCurrency(kantor.pettyCashLimit)}</TableCell>
                <TableCell>
                  <Badge variant={kantor.isActive ? "default" : "secondary"}>
                    {kantor.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/kantor/${kantor.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card list */}
      <div className="space-y-2 md:hidden">
        {kantors.map((kantor) => (
          <Link
            key={kantor.id}
            href={`/kantor/${kantor.id}`}
            className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-muted/50"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium">{kantor.name}</p>
                <Badge variant={kantor.isActive ? "default" : "secondary"} className="shrink-0 text-[10px]">
                  {kantor.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              {kantor.address && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{kantor.address}</p>
              )}
              <div className="mt-1.5 flex gap-3 text-xs text-muted-foreground">
                <span>{kantor._count.userRoles} user</span>
                <span>{kantor._count.transaksi} transaksi</span>
                <span>{formatCurrency(kantor.pettyCashLimit)}</span>
              </div>
            </div>
            <Eye className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </>
  );
}
