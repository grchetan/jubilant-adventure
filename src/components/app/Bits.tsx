import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-card border border-border bg-card shadow-card ${className}`}>{children}</div>;
}

export function PageHead({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.2em] text-primary">
            <span className="h-px w-6 bg-primary" aria-hidden />
            {eyebrow}
          </span>
        ) : null}
        <h1 className="mt-3 text-3xl leading-[1.1] md:text-[2.6rem]">{title}</h1>
        {description ? <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-none flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 flex-none rounded-full border transition-colors ${
        checked ? "border-primary bg-primary" : "border-border bg-muted"
      }`}
    >
      <span
        className={`absolute top-0.5 size-[18px] rounded-full bg-white shadow-sm transition-all ${
          checked ? "left-[calc(100%-20px)]" : "left-0.5"
        }`}
      />
    </button>
  );
}

export function VegMark({ veg }: { veg: boolean }) {
  return (
    <span
      title={veg ? "Vegetarian" : "Non-vegetarian"}
      className={`grid size-[15px] flex-none place-items-center rounded-[3px] border ${
        veg ? "border-emerald-600" : "border-red-600"
      }`}
    >
      <span className={`size-1.5 rounded-full ${veg ? "bg-emerald-600" : "bg-red-600"}`} />
    </span>
  );
}

export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full border border-foreground/10 bg-foreground px-4 py-2.5 text-sm font-semibold text-background shadow-lift">
      <i className="ri-checkbox-circle-fill text-base text-primary" aria-hidden />
      {message}
    </div>
  );
}

export function AppFooter() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-[11px] bg-primary text-primary-foreground" aria-hidden>
            <i className="ri-qr-scan-2-line" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-base font-bold">ScanDish</p>
            <p className="text-xs text-muted-foreground">Free digital menus, forever.</p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-muted-foreground">
          <Link to="/how-to-use" className="hover:text-foreground">
            How to use
          </Link>
          <Link to="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          <Link to="/dashboard/menu" className="hover:text-foreground">
            My Menu
          </Link>
          <Link to="/dashboard/qr" className="hover:text-foreground">
            QR Code
          </Link>
          <Link to="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <Link to="/support" className="hover:text-foreground">
            Support
          </Link>
        </nav>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ScanDish · No charges, ever.
      </div>
    </footer>
  );
}