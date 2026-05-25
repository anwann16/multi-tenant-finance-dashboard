"use client";

import { useState, useCallback } from "react";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { TransaksiWithRelations } from "@/types/transaksi";
import type { LaporanRingkasan } from "./mock-data";

interface ExportButtonsProps {
  data: TransaksiWithRelations[];
  ringkasan: LaporanRingkasan;
}

export default function ExportButtons({ data, ringkasan }: ExportButtonsProps) {
  const [exporting, setExporting] = useState<"excel" | "pdf" | null>(null);

  const exportExcel = useCallback(async () => {
    setExporting("excel");
    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Kantor App";
      workbook.created = new Date();

      // --- Ringkasan sheet ---
      const summarySheet = workbook.addWorksheet("Ringkasan");
      summarySheet.columns = [
        { header: "", key: "label", width: 30 },
        { header: "", key: "value", width: 25 },
      ];
      summarySheet.addRow({ label: "Laporan Keuangan", value: "" });
      summarySheet.addRow({ label: "Periode", value: `${formatDate(new Date())}` });
      summarySheet.addRow({ label: "", value: "" });
      summarySheet.addRow({ label: "Total Pemasukan", value: ringkasan.totalPemasukan });
      summarySheet.addRow({ label: "Total Pengeluaran", value: ringkasan.totalPengeluaran });
      summarySheet.addRow({ label: "Saldo Bersih", value: ringkasan.saldoBersih });
      summarySheet.addRow({ label: "Jumlah Transaksi", value: ringkasan.jumlahTransaksi });

      summarySheet.getRow(1).font = { bold: true, size: 16 };
      summarySheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E3A5F" } };
      summarySheet.getRow(1).font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
      summarySheet.getColumn(2).numFmt = '#,##0';

      // --- Detail sheet ---
      const detailSheet = workbook.addWorksheet("Detail Transaksi");
      detailSheet.columns = [
        { header: "Tanggal", key: "tanggal", width: 15 },
        { header: "No. Transaksi", key: "nomorTransaksi", width: 22 },
        { header: "Deskripsi", key: "deskripsi", width: 35 },
        { header: "Kategori", key: "kategori", width: 22 },
        { header: "Metode Bayar", key: "metodeBayar", width: 15 },
        { header: "Status", key: "status", width: 12 },
        { header: "Tipe", key: "type", width: 12 },
        { header: "Nominal", key: "nominal", width: 20 },
      ];

      // Style header row
      detailSheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
      detailSheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E3A5F" } };
      detailSheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
      detailSheet.getRow(1).height = 28;

      // Add data rows
      data.forEach((t) => {
        detailSheet.addRow({
          tanggal: formatDate(t.tanggal),
          nomorTransaksi: t.nomorTransaksi,
          deskripsi: t.deskripsi,
          kategori: `${t.kategori.icon} ${t.kategori.name}`,
          metodeBayar: t.metodeBayar,
          status: t.status,
          type: t.type === "PEMASUKAN" ? "Pemasukan" : "Pengeluaran",
          nominal: t.type === "PEMASUKAN" ? t.nominal : -t.nominal,
        });
      });

      // Number format for nominal column
      detailSheet.getColumn("nominal").numFmt = '#,##0';

      // Conditional coloring for nominal
      for (let i = 2; i <= data.length + 1; i++) {
        const cell = detailSheet.getRow(i).getCell("nominal");
        const type = detailSheet.getRow(i).getCell("type").value;
        if (type === "Pemasukan") {
          cell.font = { color: { argb: "FF16A34A" } };
        } else {
          cell.font = { color: { argb: "FFDC2626" } };
        }
      }

      // Alternating row colors
      for (let i = 2; i <= data.length + 1; i++) {
        if (i % 2 === 0) {
          detailSheet.getRow(i).fill = {
            type: "pattern", pattern: "solid", fgColor: { argb: "FFF9FAFB" },
          };
        }
      }

      // Generate and download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan-${new Date().toISOString().split("T")[0]}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Excel berhasil diunduh");
    } catch (err) {
      console.error("Excel export error:", err);
      toast.error("Gagal export Excel");
    } finally {
      setExporting(null);
    }
  }, [data, ringkasan]);

  const exportPDF = useCallback(async () => {
    setExporting("pdf");
    try {
      const { pdf, Document, Page, Text, View, StyleSheet } = await import("@react-pdf/renderer");

      const styles = StyleSheet.create({
        page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" },
        header: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: "#1E3A5F", paddingBottom: 10 },
        title: { fontSize: 18, fontWeight: "bold", color: "#1E3A5F" },
        subtitle: { fontSize: 10, color: "#6B7280", marginTop: 4 },
        summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6, paddingVertical: 4 },
        summaryLabel: { fontSize: 10, color: "#6B7280" },
        summaryValue: { fontSize: 12, fontWeight: "bold" },
        tableHeader: { flexDirection: "row", backgroundColor: "#1E3A5F", paddingVertical: 6, paddingHorizontal: 8 },
        tableHeaderText: { color: "#FFFFFF", fontSize: 8, fontWeight: "bold" },
        tableRow: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 8, borderBottomWidth: 0.5, borderBottomColor: "#E5E7EB" },
        tableRowAlt: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 8, borderBottomWidth: 0.5, borderBottomColor: "#E5E7EB", backgroundColor: "#F9FAFB" },
        tableCell: { fontSize: 8 },
        positive: { color: "#16A34A" },
        negative: { color: "#DC2626" },
        footer: { position: "absolute", bottom: 20, left: 40, right: 40, borderTopWidth: 0.5, borderTopColor: "#E5E7EB", paddingTop: 8 },
        footerText: { fontSize: 8, color: "#9CA3AF", textAlign: "center" },
      });

      const LaporanPDF = () => (
        <Document>
          <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Laporan Keuangan</Text>
              <Text style={styles.subtitle}>Dicetak: {formatDate(new Date())}</Text>
            </View>

            {/* Summary */}
            <View style={{ marginBottom: 20 }}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Pemasukan</Text>
                <Text style={[styles.summaryValue, styles.positive]}>{formatCurrency(ringkasan.totalPemasukan)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Pengeluaran</Text>
                <Text style={[styles.summaryValue, styles.negative]}>{formatCurrency(ringkasan.totalPengeluaran)}</Text>
              </View>
              <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 6 }]}>
                <Text style={[styles.summaryLabel, { fontWeight: "bold" }]}>Saldo Bersih</Text>
                <Text style={[styles.summaryValue, ringkasan.saldoBersih >= 0 ? styles.positive : styles.negative]}>
                  {formatCurrency(ringkasan.saldoBersih)}
                </Text>
              </View>
            </View>

            {/* Table header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { width: 60 }]}>Tanggal</Text>
              <Text style={[styles.tableHeaderText, { width: 90 }]}>No. Transaksi</Text>
              <Text style={[styles.tableHeaderText, { width: 140 }]}>Deskripsi</Text>
              <Text style={[styles.tableHeaderText, { width: 80 }]}>Kategori</Text>
              <Text style={[styles.tableHeaderText, { width: 55, textAlign: "right" }]}>Nominal</Text>
            </View>

            {/* Table rows */}
            {data.map((t, i) => (
              <View key={t.id} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCell, { width: 60 }]}>{formatDate(t.tanggal)}</Text>
                <Text style={[styles.tableCell, { width: 90, fontFamily: "Courier" }]}>{t.nomorTransaksi}</Text>
                <Text style={[styles.tableCell, { width: 140 }]}>{t.deskripsi}</Text>
                <Text style={[styles.tableCell, { width: 80 }]}>{t.kategori.name}</Text>
                <Text style={[styles.tableCell, { width: 55, textAlign: "right" }, t.type === "PEMASUKAN" ? styles.positive : styles.negative]}>
                  {t.type === "PEMASUKAN" ? "+" : "-"}{formatCurrency(t.nominal)}
                </Text>
              </View>
            ))}

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Kantor App — Laporan Keuangan</Text>
            </View>
          </Page>
        </Document>
      );

      const instance = pdf(<LaporanPDF />);
      const blob = await instance.toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan-${new Date().toISOString().split("T")[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("PDF berhasil diunduh");
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error("Gagal export PDF");
    } finally {
      setExporting(null);
    }
  }, [data, ringkasan]);

  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            className="flex-1 h-11 gap-2"
            onClick={exportExcel}
            disabled={exporting !== null}
          >
            {exporting === "excel" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            )}
            Export Excel
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-11 gap-2"
            onClick={exportPDF}
            disabled={exporting !== null}
          >
            {exporting === "pdf" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 text-rose-600" />
            )}
            Export PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
