export default function Header() {
  return (
    <header className="sticky top-0 z-10 w-full bg-white border-b border-border shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and organize your team members</p>
        </div>
      </div>
    </header>
  );
}
