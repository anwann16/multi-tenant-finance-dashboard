export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Kantor App
        </h1>
        <p className="text-sm text-muted-foreground">
          Pengeluaran & Pemasukan Kantor
        </p>
      </div>
      {children}
      <p className="mt-8 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Kantor App. All rights reserved.
      </p>
    </div>
  );
}
