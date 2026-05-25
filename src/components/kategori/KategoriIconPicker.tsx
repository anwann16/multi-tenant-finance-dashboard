"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const KATEGORI_ICONS = [
  { emoji: "💰", label: "Gaji" },
  { emoji: "🏠", label: "Sewa" },
  { emoji: "📎", label: "ATK" },
  { emoji: "🚗", label: "Transport" },
  { emoji: "🍔", label: "Makan" },
  { emoji: "📢", label: "Marketing" },
  { emoji: "🔧", label: "Maintenance" },
  { emoji: "📦", label: "Lainnya" },
  { emoji: "🛒", label: "Penjualan" },
  { emoji: "💼", label: "Servis" },
  { emoji: "🏦", label: "Bank" },
  { emoji: "📈", label: "Investasi" },
  { emoji: "🎁", label: "Donasi" },
  { emoji: "🖥️", label: "Komputer" },
  { emoji: "📱", label: "Telekomunikasi" },
  { emoji: "✈️", label: "Perjalanan" },
  { emoji: "🎓", label: "Pendidikan" },
  { emoji: "🏥", label: "Kesehatan" },
  { emoji: "⚡", label: "Utilitas" },
  { emoji: "🧹", label: "Kebersihan" },
];

const KATEGORI_COLORS = [
  "#22C55E", "#3B82F6", "#A855F7", "#F97316",
  "#EC4899", "#EAB308", "#6B7280", "#64748B",
  "#0EA5E9", "#8B5CF6", "#EF4444", "#14B8A6",
];

interface KategoriIconPickerProps {
  value?: string;
  color?: string;
  onChange: (icon: string, color: string) => void;
}

export default function KategoriIconPicker({ value, color, onChange }: KategoriIconPickerProps) {
  const [selectedIcon, setSelectedIcon] = useState(value || "📦");
  const [selectedColor, setSelectedColor] = useState(color || "#64748B");

  function handleIconPick(emoji: string) {
    setSelectedIcon(emoji);
    onChange(emoji, selectedColor);
  }

  function handleColorPick(c: string) {
    setSelectedColor(c);
    onChange(selectedIcon, c);
  }

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-lg text-xl"
          style={{ backgroundColor: selectedColor + "20", color: selectedColor }}
        >
          {selectedIcon}
        </div>
        <div>
          <p className="text-sm font-medium">Preview</p>
          <p className="text-xs text-muted-foreground">Icon kategori</p>
        </div>
      </div>

      {/* Icons */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Pilih Icon</p>
        <div className="grid grid-cols-5 gap-2">
          {KATEGORI_ICONS.map((icon) => (
            <button
              key={icon.emoji}
              type="button"
              onClick={() => handleIconPick(icon.emoji)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg border-2 text-lg transition-all hover:scale-110",
                selectedIcon === icon.emoji
                  ? "border-primary bg-primary/10"
                  : "border-transparent bg-muted hover:border-muted-foreground/30"
              )}
              title={icon.label}
            >
              {icon.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Pilih Warna</p>
        <div className="grid grid-cols-6 gap-2">
          {KATEGORI_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleColorPick(c)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all hover:scale-110",
                selectedColor === c ? "border-foreground" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
            >
              {selectedColor === c && <Check className="h-4 w-4 text-white" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
