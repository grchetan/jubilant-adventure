import { MiniQr } from "@/flash/navfx";

/* How to use 页的示意小图：全部用 DOM + 主题色画出来，不用图片，加载快、换主题也跟着变。
   每个 mock 对应一个步骤，让不熟悉手机的人「先看到样子，再去做」。 */

export function MockNameForm() {
  return (
    <div className="w-full max-w-[290px] rounded-card border border-border bg-card p-4 shadow-card">
      <p className="text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">Restaurant name</p>
      <div className="mt-2 flex h-10 items-center rounded-btn border border-primary bg-background px-3 text-[13px] font-semibold">
        Chai &amp; Masala
        <span className="ms-0.5 inline-block h-4 w-[2px] bg-primary" aria-hidden />
      </div>
      <p className="mt-3 text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">Your menu link</p>
      <div className="mt-2 flex items-center gap-1 rounded-btn border border-border bg-muted/50 px-2.5 py-2">
        <i className="ri-link-m text-xs text-primary" aria-hidden />
        <span className="text-[11px] font-medium text-muted-foreground">/menu/</span>
        <span className="truncate text-[11px] font-bold">chai-and-masala</span>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-primary">
        <i className="ri-checkbox-circle-fill" aria-hidden />
        Link made automatically
      </div>
    </div>
  );
}

const MENU_ROWS: [string, string, boolean][] = [
  ["Paneer Tikka", "₹220", true],
  ["Peri Peri Wings", "₹280", false],
  ["Cheesy Garlic Bread", "₹160", true],
];

export function MockMenuEditor() {
  return (
    <div className="w-full max-w-[300px] rounded-card border border-border bg-card p-3.5 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold">Starters</span>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">3 items</span>
      </div>
      <ul className="mt-2 flex flex-col gap-1.5">
        {MENU_ROWS.map(([name, price, veg]) => (
          <li key={name} className="flex items-center gap-2 rounded-btn bg-muted/60 px-2 py-1.5">
            <span
              className={`grid size-[11px] flex-none place-items-center rounded-[2px] border ${veg ? "border-emerald-600" : "border-red-600"}`}
              aria-hidden
            >
              <span className={`size-1 rounded-full ${veg ? "bg-emerald-600" : "bg-red-600"}`} />
            </span>
            <span className="min-w-0 flex-1 truncate text-[11px] font-semibold">{name}</span>
            <span className="text-[11px] font-bold tabular-nums text-primary">{price}</span>
            <span className="relative h-3.5 w-6 flex-none rounded-full bg-primary" aria-hidden>
              <span className="absolute right-0.5 top-0.5 size-2.5 rounded-full bg-white" />
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center justify-center gap-1 rounded-btn border border-dashed border-primary/50 py-1.5 text-[10px] font-bold text-primary">
        <i className="ri-add-line" aria-hidden />
        Add dish
      </div>
    </div>
  );
}

export function MockQrDesign() {
  return (
    <div className="w-full max-w-[290px] rounded-card border border-border bg-card p-4 shadow-card">
      <div className="flex gap-2">
        {["#1F5B41", "#1C1917", "#9F1239", "#C2410C"].map((c, i) => (
          <span
            key={c}
            className={`size-6 rounded-full border-2 ${i === 0 ? "border-primary" : "border-transparent"}`}
            style={{ backgroundColor: c }}
            aria-hidden
          />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3">
        <div className="grid grid-cols-3 gap-1">
          {["Square", "Rounded", "Dots"].map((label, i) => (
            <span
              key={label}
              className={`grid place-items-center gap-1 rounded-btn border py-1.5 text-[8.5px] font-bold ${
                i === 1 ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
              }`}
            >
              <span className={`size-2.5 border-2 border-current ${i === 2 ? "rounded-full" : i === 1 ? "rounded-[3px]" : ""}`} aria-hidden />
              {label}
            </span>
          ))}
        </div>
        <div className="grid size-[76px] place-items-center rounded-[10px] bg-white p-1.5 ring-1 ring-border">
          <MiniQr className="size-full text-primary" />
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
        <i className="ri-refresh-line text-primary" aria-hidden />
        Preview changes as you tap
      </p>
    </div>
  );
}

export function MockDownload() {
  return (
    <div className="w-full max-w-[290px] rounded-card border border-border bg-card p-4 shadow-card">
      <div className="grid grid-cols-2 gap-2">
        <span className="inline-flex items-center justify-center gap-1.5 rounded-btn bg-primary px-2 py-2 text-[11px] font-bold text-primary-foreground">
          <i className="ri-download-2-line" aria-hidden />
          PNG
        </span>
        <span className="inline-flex items-center justify-center gap-1.5 rounded-btn border border-border px-2 py-2 text-[11px] font-bold">
          <i className="ri-file-download-line" aria-hidden />
          SVG
        </span>
      </div>
      <div className="mt-3 rounded-btn border border-border bg-white p-3 text-center">
        <div className="mx-auto grid size-8 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
          CM
        </div>
        <p className="font-display mt-1.5 text-[12px] font-bold leading-tight">Chai &amp; Masala</p>
        <p className="text-[6.5px] font-bold uppercase tracking-[.2em] text-muted-foreground">Scan to view menu</p>
        <div className="mx-auto mt-1.5 size-16">
          <MiniQr className="size-full text-foreground" />
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-center gap-1.5 rounded-btn bg-muted px-2 py-1.5 text-[10px] font-bold">
        <i className="ri-printer-line text-primary" aria-hidden />
        Print card on A4 paper
      </div>
    </div>
  );
}

export function MockTableScan() {
  return (
    <div className="relative w-full max-w-[290px] overflow-hidden rounded-card border border-border bg-background p-5 shadow-card">
      <div className="mx-auto w-[150px] rounded-[10px] border border-border bg-white p-3 text-center shadow-card">
        <p className="font-display text-[11px] font-bold">Chai &amp; Masala</p>
        <div className="relative mx-auto mt-1.5 size-[92px] overflow-hidden">
          <MiniQr className="size-full text-foreground" />
          <span className="guide-beam" aria-hidden />
        </div>
        <p className="mt-1.5 text-[7px] font-bold uppercase tracking-[.16em] text-muted-foreground">Scan to view menu</p>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-semibold text-muted-foreground">
        <i className="ri-smartphone-line text-primary" aria-hidden />
        Camera → menu opens
        <span className="relative flex size-1.5" aria-hidden>
          <span className="app-ping absolute inset-0 rounded-full" />
          <span className="relative size-1.5 rounded-full bg-primary" />
        </span>
      </div>
    </div>
  );
}

/** 首屏那台手机：菜单页 + 一条循环扫过的光带，让人一眼看懂「扫一下会出现什么」 */
export function GuidePhone() {
  return (
    <div className="relative mx-auto w-[230px] sm:w-[262px]">
      <div className="guide-float relative rounded-[34px] border-[7px] border-foreground bg-foreground shadow-lift">
        <div className="relative overflow-hidden rounded-[27px] bg-background">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
            <span className="grid size-6 flex-none place-items-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">CM</span>
            <span className="min-w-0 flex-1">
              <span className="font-display block truncate text-[11px] font-bold leading-tight">Chai &amp; Masala</span>
              <span className="block text-[7px] font-bold uppercase tracking-[.16em] text-muted-foreground">Our menu</span>
            </span>
            <i className="ri-menu-3-line text-[11px] text-muted-foreground" aria-hidden />
          </div>

          <div className="flex gap-1.5 px-3 py-2">
            {["Starters", "Mains", "Drinks"].map((c, i) => (
              <span
                key={c}
                className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[8px] font-bold ${
                  i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {c}
              </span>
            ))}
          </div>

          <ul className="flex flex-col gap-1.5 px-3 pb-3">
            {MENU_ROWS.map(([name, price, veg]) => (
              <li key={name} className="flex items-center gap-2 rounded-btn bg-muted/70 px-2 py-1.5">
                <span
                  className={`grid size-[11px] flex-none place-items-center rounded-[2px] border ${veg ? "border-emerald-600" : "border-red-600"}`}
                  aria-hidden
                >
                  <span className={`size-1 rounded-full ${veg ? "bg-emerald-600" : "bg-red-600"}`} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[9.5px] font-semibold">{name}</span>
                <span className="text-[9.5px] font-bold tabular-nums text-primary">{price}</span>
              </li>
            ))}
          </ul>

          <div className="mx-3 mb-3 flex items-center justify-center gap-1 rounded-btn bg-primary py-1.5 text-[8px] font-bold uppercase tracking-[.12em] text-primary-foreground">
            <i className="ri-whatsapp-line" aria-hidden />
            Contact us
          </div>

          <span className="guide-beam" aria-hidden />
        </div>
      </div>

      <div className="absolute -left-4 top-16 hidden rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-bold shadow-card sm:block">
        <i className="ri-qr-scan-2-line me-1 text-primary" aria-hidden />
        Scan
      </div>
      <div className="absolute -right-3 bottom-16 hidden rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-bold shadow-card sm:block">
        <i className="ri-refresh-line me-1 text-primary" aria-hidden />
        Always current
      </div>
    </div>
  );
}