import { AppShell } from "./app-shell";

type AuthenticatedAppShellProps = Readonly<{
  children: React.ReactNode;
}>;

export function AuthenticatedAppShell({ children }: AuthenticatedAppShellProps) {
  return (
    <AppShell mainClassName="mx-auto flex w-full max-w-6xl flex-1 px-6 py-10">
      {children}
    </AppShell>
  );
}
