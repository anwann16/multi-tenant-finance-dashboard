import type { TransaksiWithRelations } from "@/types/transaksi";
import type { LaporanRingkasan } from "@/components/laporan/mock-data";

// TODO: Implement with real Prisma queries
// - getRingkasanBulanan(): Summary per kantor
// - getDetailLaporan(): Filtered transaction list
// - generateExcel(): Export to .xlsx
// - generatePDF(): Export to .pdf

export function getRingkasan(data: TransaksiWithRelations[]): LaporanRingkasan {
  const pemasukan = data.filter((t) => t.type === "PEMASUKAN");
  const pengeluaran = data.filter((t) => t.type === "PENGELUARAN");
  return {
    totalPemasukan: pemasukan.reduce((s, t) => s + t.nominal, 0),
    totalPengeluaran: pengeluaran.reduce((s, t) => s + t.nominal, 0),
    saldoBersih: pemasukan.reduce((s, t) => s + t.nominal, 0) - pengeluaran.reduce((s, t) => s + t.nominal, 0),
    jumlahTransaksi: data.length,
    transaksiPemasukan: pemasukan.length,
    transaksiPengeluaran: pengeluaran.length,
  };
}
