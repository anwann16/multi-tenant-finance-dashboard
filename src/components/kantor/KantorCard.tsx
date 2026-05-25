import Link from "next/link";
import { Building2, MapPin, Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { KantorWithUserCount } from "@/types/kantor";

interface KantorCardProps {
  kantor: KantorWithUserCount;
}

export default function KantorCard({ kantor }: KantorCardProps) {
  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">{kantor.name}</CardTitle>
            {kantor.address && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {kantor.address}
              </p>
            )}
          </div>
        </div>
        <Badge variant={kantor.isActive ? "default" : "secondary"}>
          {kantor.isActive ? "Aktif" : "Nonaktif"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {kantor.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{kantor.description}</p>
        )}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {kantor._count.userRoles} user
            </span>
            <span className="text-muted-foreground">
              {kantor._count.transaksi} transaksi
            </span>
          </div>
          <span className="font-medium tabular-nums">{formatCurrency(kantor.pettyCashLimit)}</span>
        </div>
        <Link href={`/kantor/${kantor.id}`}>
          <Button variant="ghost" size="sm" className="w-full justify-between group-hover:text-primary">
            Lihat Detail
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
