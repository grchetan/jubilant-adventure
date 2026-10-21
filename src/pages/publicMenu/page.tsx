import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatPrice, useRestaurant } from "@/hooks/useRestaurant";
import { VegMark } from "@/components/app/Bits";
import { supportContact } from "@/mocks/restaurant";

export default function PublicMenuPage() {
  const { slug } = useParams();
  const { restaurant } = useRestaurant();
  const [vegOnly, setVegOnly] = useState(false);
  const [activeId, setActiveId] = useState(restaurant.categories[0]?.id ?? "");
  const scroller = useRef<HTMLDivElement>(null);

  const initials =
    restaurant.name
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SD";

  const categories = useMemo(
    () =>
      restaurant.categories.map((category) => ({
        ...category,
        items: category.items.filter((item) => (vegOnly ? item.veg : true)),
      })),
    [restaurant, vegOnly],
  );

  const callHref = `tel:${restaurant.phone.replace(/[^\d+]/g, "")}`;
  const waHref = `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(`Hi ${restaurant.name}, I have a question about the menu.`)}`;
  const itemCount = restaurant.categories.reduce((total, category) => total + category.items.length, 0);

  const goTo = (id: string) => {
    setActiveId(id);
    const target = document.getElementById(`cat-${id}`);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-muted/60 pb-24">
      <div className="mx-auto w-full max-w-[720px] bg-background shadow-card md:my-6 md:overflow-hidden md:rounded-card">
        <header className="relative isolate overflow-hidden border-b border-border px-5 pb-5 pt-7 md:px-8">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" aria-hidden />
          <div className="flex items-start gap-4">
            {restaurant.logo ? (
              <img src={restaurant.logo} alt={`${restaurant.name} logo`} className="size-16 flex-none rounded-2xl border border-border object-cover" />
            ) : (
              <span className="grid size-16 flex-none place-items-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
                {initials}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-2xl font-bold leading-tight md:text-3xl">{restaurant.name}</h1>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{restaurant.address}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                  <span className="size-1.5 rounded-full bg-emerald-600" aria-hidden />
                  {restaurant.hours || "Open today"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                  <i className="ri-restaurant-2-line" aria-hidden />
                  {itemCount} dishes
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setVegOnly((v) => !v)}
              aria-pressed={vegOnly}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition-colors ${
                vegOnly ? "border-emerald-600 bg-emerald-600 text-white" : "border-border bg-background text-muted-foreground"
              }`}
            >
              <VegMark veg />
              Veg only
            </button>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-xs font-bold text-foreground"
            >
              <i className="ri-whatsapp-line text-emerald-600" aria-hidden />
              WhatsApp
            </a>
            <a href={callHref} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-xs font-bold text-foreground">
              <i className="ri-phone-line text-primary" aria-hidden />
              Call
            </a>
          </div>
        </header>

        <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
          <div ref={scroller} className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 py-2.5 md:px-6">
            {restaurant.categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => goTo(category.id)}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-bold transition-colors ${
                  activeId === category.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <main className="px-4 py-5 md:px-6 md:py-6">
          {categories.map((category) => (
            <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-[60px] pb-2">
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-lg font-bold">{category.name}</h2>
                <span className="h-px flex-1 bg-border" aria-hidden />
                <span className="text-[11px] font-bold uppercase tracking-[.1em] text-muted-foreground">
                  {category.items.length} {category.items.length === 1 ? "item" : "items"}
                </span>
              </div>

              {category.items.length ? (
                <ul className="flex flex-col gap-2.5">
                  {category.items.map((item) => (
                    <li
                      key={item.id}
                      className={`flex items-start gap-3 rounded-card border border-border bg-card p-3 ${
                        item.available ? "" : "opacity-60"
                      }`}
                    >
                      {item.photo ? (
                        <img src={item.photo} alt={item.name} className="size-[68px] flex-none rounded-xl object-cover" />
                      ) : (
                        <span className="grid size-[68px] flex-none place-items-center rounded-xl bg-muted text-muted-foreground" aria-hidden>
                          <i className="ri-restaurant-2-line text-xl" />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                          <VegMark veg={item.veg} />
                          <h3 className="min-w-0 flex-1 text-[15px] font-bold leading-snug">{item.name}</h3>
                          <span className="whitespace-nowrap text-[15px] font-bold tabular-nums text-primary">{formatPrice(item.price)}</span>
                        </div>
                        {item.description ? (
                          <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-muted-foreground">{item.description}</p>
                        ) : null}
                        {!item.available ? (
                          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600">
                            <i className="ri-close-circle-line" aria-hidden />
                            Sold out
                          </span>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-card border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                  Nothing in this category right now.
                </p>
              )}
            </section>
          ))}

          <div className="mt-6 rounded-card border border-border bg-muted/40 p-4">
            <p className="text-sm font-bold">Any questions?</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Message {restaurant.name} on WhatsApp or call {restaurant.phone} — we are happy to help.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-btn bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white"
              >
                <i className="ri-whatsapp-line" aria-hidden />
                Contact us on WhatsApp
              </a>
              <a href={callHref} className="inline-flex items-center gap-2 rounded-btn border border-border bg-background px-3.5 py-2 text-xs font-bold">
                <i className="ri-phone-line" aria-hidden />
                Call restaurant
              </a>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 border-t border-border pt-5 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-muted-foreground">Menu powered by ScanDish</p>
            <Link to="/dashboard" className="text-xs font-bold text-primary hover:underline">
              Create your own free QR menu
            </Link>
            <Link to="/support" className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground">
              <i className="ri-customer-service-2-line" aria-hidden />
              Menu support · {supportContact.email}
            </Link>
            {slug ? <span className="sr-only">Menu for {slug}</span> : null}
          </div>
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex w-full max-w-[720px] items-center gap-2">
          <a href={callHref} aria-label="Call restaurant" className="grid size-12 flex-none place-items-center rounded-btn border border-border">
            <i className="ri-phone-line text-lg" aria-hidden />
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-btn bg-primary text-sm font-bold text-primary-foreground"
          >
            <i className="ri-whatsapp-line text-lg" aria-hidden />
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
}