import type { ReactNode } from "react";
import AppNav from "./AppNav";
import { AppFooter } from "./Bits";

export default function AppShell({ children, footer = true }: { children: ReactNode; footer?: boolean }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <AppNav />
      <main className="flex-1">{children}</main>
      {footer ? <AppFooter /> : null}
    </div>
  );
}