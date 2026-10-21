import { useState } from "react";
import type { Restaurant } from "@/mocks/restaurant";
import { formatPrice } from "@/hooks/useRestaurant";
import { VegMark } from "./Bits";

/** 手机上看到的菜单小样：白底、可点的分类、可滚动列表。dashboard / 编辑器 / 预览共用。 */
export default function MenuPreview({ restaurant, className = "" }: { restaurant: Restaurant; className?: string }) {
  const [active, setActive] = useState(restaurant.categories[0]?.id ?? "");
  const current = restaurant.categories.find((c) => c.id === active) ?? restaurant.categories[0];
  const initials =
    restaurant.name
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SD";

  return (
    <div className={`rounded-[34px] border border-border bg-muted/60 p-2 shadow-card ${className}`}>
      <div className="overflow-hidden rounded-[27px] bg-background">
        <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3.5">
          {restaurant.logo ? (
            <img src={restaurant.logo} alt={`${restaurant.name} logo`} className="size-10 flex-none rounded-full object-cover" />
          ) : (
            <span className="grid size-10 flex-none place-items-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground">
              {initials}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-display truncate text-[15px] font-bold leading-tight">{restaurant.name || "Your restaurant"}</p>
            <p className="truncate text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground">
              {restaurant.hours || "Digital menu"}
            </p>
          </div>
          <span className="grid size-7 flex-none place-items-center rounded-full bg-muted text-muted-foreground" aria-hidden>
            <i className="ri-search-line text-xs" />
          </span>
        </div>

        <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-3 py-2.5">
          {restaurant.categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActive(category.id)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${
                category.id === current?.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="max-h-[268px] overflow-y-auto px-3 pb-4">
          {current?.items.length ? (
            current.items.slice(0, 6).map((item) => (
              <div key={item.id} className={`mb-2 flex items-center gap-2.5 rounded-xl bg-muted/50 px-2.5 py-2 ${item.available ? "" : "opacity-55"}`}>
                {item.photo ? (
                  <img src={item.photo} alt={item.name} className="size-9 flex-none rounded-lg object-cover" />
                ) : (
                  <span className="grid size-9 flex-none place-items-center rounded-lg bg-background text-muted-foreground" aria-hidden>
                    <i className="ri-restaurant-2-line text-sm" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <VegMark veg={item.veg} />
                    <span className="truncate text-[12px] font-bold">{item.name}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
                    {item.available ? item.description || current.name : "Sold out today"}
                  </span>
                </span>
                <span className="whitespace-nowrap text-[12px] font-bold tabular-nums text-primary">{formatPrice(item.price)}</span>
              </div>
            ))
          ) : (
            <div className="grid place-items-center gap-2 rounded-xl border border-dashed border-border py-10 text-center">
              <i className="ri-add-circle-line text-2xl text-muted-foreground" aria-hidden />
              <p className="text-[11px] font-semibold text-muted-foreground">No items in this category yet</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 border-t border-border/70 bg-muted/30 py-2 text-[10px] font-semibold text-muted-foreground">
          <i className="ri-whatsapp-line text-primary" aria-hidden />
          Contact us
        </div>
      </div>
    </div>
  );
}