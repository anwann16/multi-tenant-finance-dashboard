export default function Sidebar() {
  return (
    <aside className="hidden w-64 border-r bg-card lg:block">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">Kantor App</h2>
      </div>
      <nav className="space-y-1 p-4">
        <p className="text-sm text-muted-foreground">
          Sidebar navigation — to be implemented
        </p>
      </nav>
    </aside>
  );
}
