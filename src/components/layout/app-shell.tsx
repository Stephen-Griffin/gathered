import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

type AppShellProps = Readonly<{
  children: React.ReactNode;
  mainClassName?: string;
}>;

const signedOutNavigation = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/meal-plan", label: "Meal Plan" },
  { href: "/grocery-list", label: "Grocery List" },
];

const signedInNavigation = [
  { href: "/recipes", label: "Recipes" },
  { href: "/meal-plan", label: "Meal Plan" },
  { href: "/grocery-list", label: "Grocery List" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({
  children,
  mainClassName = "flex flex-1",
}: AppShellProps) {
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
          <Show when="signed-out">
            {signedOutNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </Show>
          <Show when="signed-in">
            {signedInNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </Show>
        </nav>
        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:-translate-y-0.5">
                Sign in
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/recipes"
              className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:-translate-y-0.5"
            >
              Open app
            </Link>
            <UserButton />
          </Show>
        </div>
      </header>
      <main className={mainClassName}>{children}</main>
    </div>
  );
}
