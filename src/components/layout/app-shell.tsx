import Link from "next/link";
import Image from "next/image";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

type AppShellProps = Readonly<{
  children: React.ReactNode;
  mainClassName?: string;
}>;

const signedOutNavigation = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/grocery-list", label: "Grocery List" },
  { href: "/meal-plan", label: "Meal Plan" },
  { href: "/settings", label: "Settings" },
];

const signedInNavigation = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/grocery-list", label: "Grocery List" },
  { href: "/meal-plan", label: "Meal Plan" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({
  children,
  mainClassName = "flex-1",
}: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <header className="sticky top-0 z-20 border-b border-line bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] w-full max-w-6xl items-center justify-between px-5 sm:px-7">
          <Link
            href="/"
            className="flex items-center rounded-sm"
            aria-label="Gathered home"
          >
            <Image
              src="/gathered.png"
              alt="Gathered"
              width={124}
              height={30}
              priority
              className="h-auto w-[112px] sm:w-[124px]"
            />
          </Link>
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-2 rounded-full border border-line bg-card p-1 text-[12px] font-semibold text-black shadow-[0_14px_45px_rgba(0,0,0,0.08)] sm:flex"
          >
            <Show when="signed-out">
              {signedOutNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-2 transition hover:bg-white hover:text-black"
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
                  className="rounded-full px-3 py-2 transition hover:bg-white hover:text-black"
                >
                  {item.label}
                </Link>
              ))}
            </Show>
          </nav>
          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-5 text-[12px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_14px_28px_rgba(53,34,8,0.22)] transition hover:-translate-y-0.5 hover:bg-secondary"
                  aria-label="Sign in"
                >
                  Sign in
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </header>
      <main className={mainClassName}>{children}</main>
    </div>
  );
}
