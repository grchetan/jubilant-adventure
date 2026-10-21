import { Link } from "react-router-dom";
import type { Restaurant } from "@/mocks/restaurant";

type Row = {
  key: string;
  label: string;
  done: number;
  total: number;
  hint: string;
  icon: string;
  bar: string;
  chip: string;
};

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export default function MenuCompleteness({ restaurant }: { restaurant: Restaurant }) {
  const items = restaurant.categories.flatMap((category) => category.items);
  const total = items.length;

  const named = items.filter((item) => item.name.trim().length > 0);
  const priced = items.filter((item) => item.price > 0);
  const photographed = items.filter((item) => Boolean(item.photo));
  const described = items.filter((item) => item.description.trim().length > 0);

  const ratio = (count: number) => (total === 0 ? 0 : count / total);

  // Name matters least, photo and price matter most for a guest deciding what to order.
  const score =
    total === 0
      ? 0
      : Math.round((ratio(named.length) * 0.2 + ratio(priced.length) * 0.35 + ratio(photographed.length) * 0.3 + ratio(described.length) * 0.15) * 100);

  const missingPhotos = total - photographed.length;
  const missingPrices = total - priced.length;

  const nextTip =
    total === 0
      ? "Add your first dish to get started."
      : missingPrices > 0
        ? `Add a price to ${missingPrices} ${missingPrices === 1 ? "dish" : "dishes"} so guests know what to expect.`
        : missingPhotos > 0
          ? `Photos are missing on ${missingPhotos} ${missingPhotos === 1 ? "dish" : "dishes"} — they get the most orders.`
          : "Your menu looks complete. Nothing left to do!";

  const rows: Row[] = [
    {
      key: "names",
      label: "Dish names",
      done: named.length,
      total,
      hint: "What guests read first",
      icon: "ri-text",
      bar: "bg-foreground/40",
      chip: "bg-muted text-foreground/70",
    },
    {
      key: "prices",
      label: "Prices filled",
      done: priced.length,
      total,
      hint: "No price means no order",
      icon: "ri-money-rupee-circle-line",
      bar: "bg-brand-deep",
      chip: "bg-brand-deep/10 text-brand-deep",
    },
    {
      key: "photos",
      label: "Photos added",
      done: photographed.length,
      total,
      hint: "The biggest order booster",
      icon: "ri-image-line",
      bar: "bg-primary",
      chip: "bg-primary/10 text-primary",
    },
  ];

  const offset = CIRCUMFERENCE - clamp(score / 100) * CIRCUMFERENCE;

  return (
    <section className="app-fade-up rounded-card border border-border bg-card p-5 shadow-card md:p-6" aria-labelledby="menu-completeness-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="menu-completeness-title" className="text-xl">
            Menu completeness
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">A complete menu sells more — here is what is still missing.</p>
        </div>
        <span
          className={`inline-flex flex-none items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
            score >= 100 ? "bg-primary/10 text-primary" : "bg-muted text-foreground/70"
          }`}
        >
          <i className={score >= 100 ? "ri-checkbox-circle-fill" : "ri-pulse-line"} aria-hidden />
          {score >= 100 ? "All set" : `${score}% there`}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative mx-auto grid size-[136px] flex-none place-items-center sm:mx-0">
          <svg viewBox="0 0 128 128" className="size-[136px] -rotate-90" aria-hidden>
            <circle cx="64" cy="64" r={RADIUS} fill="none" strokeWidth="11" className="stroke-muted" />
            <circle
              cx="64"
              cy="64"
              r={RADIUS}
              fill="none"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className="stroke-primary transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="font-display text-[2rem] font-bold leading-none tabular-nums">
                {score}
                <span className="text-base font-semibold text-muted-foreground">%</span>
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">complete</p>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11.5px] font-semibold text-foreground/80">
              <i className="ri-restaurant-2-line text-primary" aria-hidden />
              {total} {total === 1 ? "dish" : "dishes"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11.5px] font-semibold text-foreground/80">
              <i className="ri-list-check-2 text-primary" aria-hidden />
              {restaurant.categories.length} categories
            </span>
          </div>

          <ul className="mt-4 flex flex-col gap-3">
            {rows.map((row) => {
              const percent = total === 0 ? 0 : Math.round((row.done / total) * 100);
              return (
                <li key={row.key}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2 text-[13px] font-semibold">
                      <span className={`grid size-6 flex-none place-items-center rounded-md ${row.chip}`} aria-hidden>
                        <i className={`${row.icon} text-[13px]`} />
                      </span>
                      <span className="truncate">{row.label}</span>
                    </span>
                    <span className="flex-none text-[12px] font-bold tabular-nums text-muted-foreground">
                      {row.done}/{row.total}
                      <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-[.06em]">{percent}%</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${row.bar} transition-[width] duration-700 ease-out`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-btn border border-dashed border-border bg-muted/30 px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-[13px] leading-snug text-muted-foreground">
          <i className="ri-lightbulb-line mt-0.5 flex-none text-primary" aria-hidden />
          {nextTip}
        </p>
        <Link
          to="/dashboard/menu"
          className="inline-flex flex-none items-center justify-center gap-1.5 whitespace-nowrap rounded-btn bg-foreground px-3.5 py-2 text-[12.5px] font-semibold text-background transition-transform hover:-translate-y-0.5"
        >
          Fix in My Menu
          <i className="ri-arrow-right-line" aria-hidden />
        </Link>
      </div>
    </section>
  );
}