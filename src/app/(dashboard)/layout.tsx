export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r bg-card lg:block">
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-semibold">Kantor App</h2>
        </div>
        <nav className="space-y-1 p-4">
          <p className="text-sm text-muted-foreground">
            Sidebar navigation will be implemented here.
          </p>
        </nav>
      </aside>
      <div className="flex-1">
        <header className="flex h-16 items-center border-b px-6">
          <p className="text-sm text-muted-foreground">
            Topbar will be implemented here.
          </p>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
