import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { menuPath } from "./menuLink";
import { useRestaurant } from "@/hooks/useRestaurant";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: "ri-dashboard-3-line" },
  { href: "/dashboard/menu", label: "My Menu", icon: "ri-file-list-3-line" },
  { href: "/dashboard/qr", label: "QR Code", icon: "ri-qr-code-line" },
  { href: "/how-to-use", label: "How to use", icon: "ri-question-line" },
  { href: "/shop", label: "Shop", icon: "ri-store-3-line" },
  { href: "/support", label: "Support", icon: "ri-customer-service-2-line" },
];

const isActive = (pathname: string, href: string) => {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function AppNav() {
  const { pathname } = useLocation();
  const { restaurant } = useRestaurant();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center gap-4 px-4 md:h-[70px] md:px-6">
        <Link to="/" className="group flex flex-none items-center gap-2.5">
          <span className="relative grid size-10 place-items-center rounded-[13px] bg-primary text-primary-foreground transition-transform duration-300 group-hover:-rotate-6">
            <i className="ri-qr-scan-2-line text-[1.2rem]" aria-hidden />
            <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-background bg-foreground" aria-hidden />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[1.3rem] font-bold tracking-tight">ScanDish</span>
            <span className="mt-1 text-[9px] font-bold uppercase tracking-[.22em] text-muted-foreground">menu studio</span>
          </span>
        </Link>

        <nav className="ms-4 hidden h-full items-stretch lg:flex" aria-label="Main">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`relative flex items-center gap-2 px-3 text-[14px] font-semibold transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <i className={`${link.icon} text-[1.05rem] ${active ? "text-primary" : ""}`} aria-hidden />
                {link.label}
                {link.href === "/shop" ? (
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    soon
                  </span>
                ) : null}
                <span
                  aria-hidden
                  className={`absolute inset-x-3 bottom-0 h-[3px] rounded-t-full transition-all duration-300 ${
                    active ? "bg-primary opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="ms-auto flex flex-none items-center gap-2">
          <Link
            to={menuPath(restaurant.slug)}
            className="hidden items-center gap-2 whitespace-nowrap rounded-btn px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted xl:inline-flex"
          >
            <i className="ri-eye-line text-[1.05rem]" aria-hidden />
            Live menu
          </Link>
          <Link
            to="/dashboard/qr"
            className="hidden items-center gap-2 whitespace-nowrap rounded-btn bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            <i className="ri-qr-code-line text-[1.05rem]" aria-hidden />
            Get QR
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle navigation"
            className="grid size-10 place-items-center rounded-btn border border-border text-foreground lg:hidden"
          >
            <i className={open ? "ri-close-line text-xl" : "ri-menu-3-line text-xl"} aria-hidden />
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background px-4 pb-5 pt-3 lg:hidden">
          <nav className="grid gap-1" aria-label="Mobile">
            {LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-3 rounded-btn px-3 py-3 text-base font-semibold ${
                    active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <i className={`${link.icon} text-lg`} aria-hidden />
                  {link.label}
                  <i className="ri-arrow-right-s-line ms-auto text-muted-foreground" aria-hidden />
                </Link>
              );
            })}
          </nav>
          <Link to="/dashboard/qr" className="mt-3 flex items-center justify-center gap-2 rounded-btn bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
            <i className="ri-qr-code-line" aria-hidden />
            Generate my QR code
          </Link>
        </div>
      ) : null}
    </header>
  );
}