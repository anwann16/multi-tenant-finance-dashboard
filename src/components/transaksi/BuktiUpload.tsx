"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileImage, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_FILES = 5;
const MAX_SIZE_MB = 5;

interface BuktiUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

export default function BuktiUpload({ files, onChange, disabled }: BuktiUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const valid = arr
      .filter((f) => f.size <= MAX_SIZE_MB * 1024 * 1024)
      .slice(0, MAX_FILES - files.length);
    if (valid.length > 0) onChange([...files, ...valid]);
  }, [files, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Seret file ke sini atau</p>
          <p className="text-xs text-muted-foreground">Maks {MAX_FILES} file, {MAX_SIZE_MB}MB per file</p>
        </div>
        <label>
          <Button variant="outline" size="sm" type="button">
            Pilih File
          </Button>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            className="hidden"
            disabled={disabled || files.length >= MAX_FILES}
            onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-1">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm">
              {file.type.startsWith("image/") ? (
                <FileImage className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : (
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <span className="min-w-0 flex-1 truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)}KB</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => removeFile(i)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
