import Link from "next/link";

type AppShellProps = Readonly<{
  children: React.ReactNode;
}>;

const navigation = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/grocery-list", label: "Grocery List" },
];

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Gathered
        </Link>
        <nav
          aria-label="Primary navigation"
          className="hidden gap-6 text-sm font-medium text-muted sm:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex flex-1">{children}</main>
    </div>
  );
}
