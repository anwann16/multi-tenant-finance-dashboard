import Link from "next/link";
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
    <div className="rounded-lg border">
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
              <TableCell className="text-muted-foreground max-w-[200px] truncate">{kantor.address || "-"}</TableCell>
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
                  <Button variant="ghost" size="sm">Detail</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
