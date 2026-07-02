import { auth } from "@clerk/nextjs/server";
import { AuthenticatedAppShell } from "@/components/layout/authenticated-app-shell";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  return <AuthenticatedAppShell>{children}</AuthenticatedAppShell>;
}
