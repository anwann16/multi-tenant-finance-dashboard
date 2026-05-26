/**
 * Prisma Decimal objects serialize as strings via toJSON() in JSON.stringify.
 * This provides a custom Response that converts them to numbers.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decimalReplacer(_key: string, value: any) {
  // toJSON() is called first by JSON.stringify, turning Decimal into a string like "5000000"
  // We detect that and convert it back to a number
  return value;
}

// Prisma Decimal's toJSON returns a string representation
// JSON.stringify calls toJSON() first, so the replacer never sees the raw Decimal
// Instead, we use a pre-processing step

function processValue(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data === "string") {
    // Check if it looks like a numeric string (Prisma Decimal toJSON output)
    const num = Number(data);
    if (!isNaN(num) && String(num) === data) return num;
    return data;
  }
  if (typeof data === "number" || typeof data === "boolean") return data;
  if (Array.isArray(data)) return data.map(processValue);
  if (typeof data === "object") {
    if (data instanceof Date) return data.toISOString();
    // Check for Prisma Decimal internal shape
    const keys = Object.keys(data);
    if (keys.includes("s") && keys.includes("e") && keys.includes("d") && Array.isArray((data as any).d)) {
      const num = Number(String(data));
      return isNaN(num) ? String(data) : num;
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) {
      out[k] = processValue(v);
    }
    return out;
  }
  return data;
}

export function jsonResponse(body: unknown, status = 200) {
  const processed = processValue(body);
  const text = JSON.stringify(processed);
  return new Response(text, {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
