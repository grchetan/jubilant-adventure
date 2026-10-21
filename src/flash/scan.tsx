import { ArrowDown, ArrowRight, Check } from "lucide-react";
import { usePage, type SectionProps } from "./context";
import { A, Container, cn, rv, safeHref, str, strs } from "./ui";
import { heroDemoShop } from "@/mocks/heroDemo";

/* 首页首屏：左边一句衬线大标题 + 主按钮，右边一张餐厅照片，
   照片上压着「真实菜单手机屏」和「带 logo 的二维码卡」。
   所有浮层都放在 overflow-hidden 的卡片内部，按百分比缩放：320px 到 1440px 都不会溢出。 */

const N = 23;

const inBox = (x: number, y: number, ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;

const finderHit = (x: number, y: number) => inBox(x, y, 0, 0) || inBox(x, y, N - 7, 0) || inBox(x, y, 0, N - 7);

function finderFilled(x: number, y: number) {
  const local = (ox: number, oy: number) => {
    const lx = x - ox;
    const ly = y - oy;
    const edge = lx === 0 || lx === 6 || ly === 0 || ly === 6;
    const core = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
    return edge || core;
  };
  if (x < 7 && y < 7) return local(0, 0);
  if (x >= N - 7 && y < 7) return local(N - 7, 0);
  if (x < 7 && y >= N - 7) return local(0, N - 7);
  return false;
}

const QR_CELLS: { x: number; y: number }[] = (() => {
  const cells: { x: number; y: number }[] = [];
  const c = (N - 1) / 2;
  for (let y = 0; y < N; y += 1) {
    for (let x = 0; x < N; x += 1) {
      if (finderHit(x, y)) {
        if (finderFilled(x, y)) cells.push({ x, y });
        continue;
      }
      // 正中留一块白给 logo
      if (Math.abs(x - c) <= 3.5 && Math.abs(y - c) <= 3.5) continue;
      const v = (x * 7 + y * 11 + x * y * 3 + (x + y) * 5) % 13;
      if (v < 6) cells.push({ x, y });
    }
  }
  return cells;
})();

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SD";

/** 二维码：静态码型 + 一条循环扫过的光带（qr loop），四角有取景框 */
function QrArt({ shopName, className }: { shopName: string; className?: string }) {
  return (
    <div className={cn("relative aspect-square w-full overflow-hidden rounded-[8px] bg-white ring-1 ring-black/[0.06]", className)}>
      <div
        className="grid size-full p-[7%]"
        style={{ gridTemplateColumns: `repeat(${N}, 1fr)`, gridTemplateRows: `repeat(${N}, 1fr)` }}
        aria-hidden
      >
        {QR_CELLS.map(({ x, y }) => (
          <span key={`${x}-${y}`} className="bg-foreground" style={{ gridColumn: x + 1, gridRow: y + 1 }} />
        ))}
      </div>
      <span className="absolute left-1/2 top-1/2 grid size-[27%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[5px] border-2 border-white bg-primary text-primary-foreground">
        <span className="font-display text-[8px] font-bold leading-none tracking-tight">{initialsOf(shopName)}</span>
      </span>
      <span className="qr-sweep" aria-hidden />
      <span className="pointer-events-none absolute inset-[5%] rounded-[5px] border border-primary/15" aria-hidden />
    </div>
  );
}

/** 照片上压着的手机菜单：真实菜单的样子，小屏也不溢出 */
function PhoneMenu({ shop }: { shop: string }) {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-[18px] border-[4px] border-foreground bg-foreground shadow-[0_20px_40px_-18px_rgba(0,0,0,.6)] sm:rounded-[22px] sm:border-[5px]">
        <div className="bg-background px-2 pb-2 pt-1.5 sm:px-2.5 sm:pb-2.5 sm:pt-2">
          <div className="mx-auto mb-1.5 h-[3px] w-6 rounded-full bg-foreground/15" aria-hidden />
          <div className="flex items-center gap-1.5">
            <span className="grid size-5 flex-none place-items-center rounded-full bg-primary text-[7px] font-bold text-primary-foreground">
              {initialsOf(shop)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-display block truncate text-[8px] font-bold leading-tight sm:text-[9px]">{shop}</span>
              <span className="block text-[5.5px] font-bold uppercase tracking-[.14em] text-muted-foreground sm:text-[6px]">Our menu</span>
            </span>
            <i className="ri-menu-3-line text-[8px] text-muted-foreground" aria-hidden />
          </div>

          <div className="mt-1.5 flex gap-1 overflow-hidden">
            {heroDemoShop.categories.slice(0, 3).map((c, i) => (
              <span
                key={c}
                className={cn(
                  "whitespace-nowrap rounded-full px-1.5 py-0.5 text-[5.5px] font-bold",
                  i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {c}
              </span>
            ))}
          </div>

          <ul className="mt-1.5 flex flex-col gap-1">
            {heroDemoShop.items.slice(0, 3).map((it) => (
              <li key={it.name} className="flex items-center gap-1.5 rounded-md bg-muted/70 px-1.5 py-1">
                <span
                  className={cn("size-1.5 flex-none rounded-[1px] border", it.veg ? "border-emerald-600 bg-emerald-600/90" : "border-red-600 bg-red-600/90")}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate text-[7px] font-semibold sm:text-[7.5px]">{it.name}</span>
                <span className="text-[7px] font-bold tabular-nums text-primary sm:text-[7.5px]">{it.price}</span>
              </li>
            ))}
          </ul>

          <div className="mt-1.5 flex items-center justify-center gap-1 rounded-md bg-primary py-[3px] text-[5.5px] font-bold uppercase tracking-[.1em] text-primary-foreground sm:py-1 sm:text-[6px]">
            <i className="ri-whatsapp-line text-[7px]" aria-hidden />
            Contact us
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScanHero(props: SectionProps) {
  const { ctaHref } = usePage();
  const { eyebrow, title, subtitle, primaryCta, secondaryCta } = props;
  const primaryTo = safeHref(props.primaryHref) !== "#" ? safeHref(props.primaryHref) : ctaHref;
  const secondaryTo = safeHref(props.secondaryHref) !== "#" ? safeHref(props.secondaryHref) : "#how-it-works";
  const shop = str(props.demoShop) || heroDemoShop.name;
  const highlights = strs(props.highlights).slice(0, 3);

  // 标题最后两个词用主色强调：Your menu, one [scan away.]
  const words = str(title).split(" ").filter(Boolean);
  const accentCount = words.length > 3 ? 2 : 0;
  const head = words.slice(0, words.length - accentCount).join(" ");
  const tail = words.slice(words.length - accentCount).join(" ");

  return (
    <section className="relative isolate overflow-hidden bg-background">
      <div className="absolute -left-40 -top-24 -z-10 size-[520px] rounded-full bg-primary/[0.07] blur-3xl" aria-hidden />
      <div className="absolute -bottom-40 right-0 -z-10 size-[420px] rounded-full bg-primary/[0.05] blur-3xl" aria-hidden />

      <Container className="grid items-center gap-10 pb-14 pt-8 md:gap-14 md:pb-20 md:pt-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-14 lg:pb-24 lg:pt-16">
        <div className="flex flex-col items-start gap-5 sm:gap-6" {...rv(0)}>
          <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[.14em] text-foreground/70 sm:px-3.5 sm:text-[10.5px]">
            <span className="relative flex size-1.5 flex-none" aria-hidden>
              <span className="scan-ping absolute inset-0 rounded-full bg-primary" />
              <span className="relative size-1.5 rounded-full bg-primary" />
            </span>
            <span className="truncate">{str(eyebrow)}</span>
          </span>

          <h1 className="max-w-[16ch] text-[2.05rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[2.7rem] md:text-[3.1rem] lg:text-[3.5rem] xl:text-[3.9rem]">
            {head} {tail ? <span className="text-primary">{tail}</span> : null}
          </h1>

          <p className="max-w-lg text-[15px] leading-relaxed text-muted-foreground sm:text-base md:text-[17px]">{str(subtitle)}</p>

          <div className="mt-1 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
            {primaryCta ? (
              <A
                to={primaryTo}
                className="flash-btn inline-flex h-12 w-full items-center justify-center gap-2 rounded-btn bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition hover:brightness-110 sm:w-auto"
              >
                {str(primaryCta)}
                <i className="ri-arrow-right-line text-lg" aria-hidden />
              </A>
            ) : null}
            {secondaryCta ? (
              <A
                to={secondaryTo}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-[14px] font-semibold text-foreground/70 transition-colors hover:text-primary sm:justify-start sm:text-[14.5px]"
              >
                <span className="grid size-7 flex-none place-items-center rounded-full border border-border bg-card" aria-hidden>
                  {secondaryTo.startsWith("#") ? <ArrowDown className="size-3.5" /> : <ArrowRight className="size-3.5" />}
                </span>
                {str(secondaryCta)}
              </A>
            ) : null}
          </div>

          {highlights.length > 0 ? (
            <ul className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-5">
              {highlights.map((h) => (
                <li key={h} className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground sm:text-[13px]">
                  <Check className="size-3.5 flex-none text-primary" strokeWidth={3} aria-hidden />
                  {h}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* 右：餐厅照片 + 手机菜单 + 二维码卡（全部在卡片内部，按比例缩放） */}
        <div className="relative mx-auto w-full max-w-[540px] lg:max-w-none" {...rv(2)}>
          <div className="relative aspect-[4/4.7] overflow-hidden rounded-[22px] border border-border/70 bg-muted sm:aspect-[4/3.6] md:aspect-[4/3.9] lg:aspect-[4/4.15]">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80"
              alt="Warm cafe table where guests scan a digital menu on their phone"
              className="absolute inset-0 size-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d241b]/75 via-[#0d241b]/10 to-[#0d241b]/20" aria-hidden />
            <span className="photo-beam" aria-hidden />

            <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2 py-1 text-[8px] font-bold uppercase tracking-[.1em] text-foreground backdrop-blur sm:left-4 sm:top-4 sm:px-2.5 sm:text-[9px]">
              <span className="size-1.5 flex-none rounded-full bg-primary" aria-hidden />
              <span className="truncate">{heroDemoShop.updated}</span>
            </span>

            <div className="absolute right-2.5 top-2.5 w-[74px] rounded-[12px] bg-background p-1.5 shadow-[0_14px_28px_-14px_rgba(0,0,0,.6)] sm:right-4 sm:top-4 sm:w-[104px] sm:p-2">
              <QrArt shopName={shop} />
              <p className="mt-1 text-center text-[5.5px] font-bold uppercase leading-tight tracking-[.08em] text-muted-foreground sm:text-[7px]">
                {heroDemoShop.scanHint}
              </p>
            </div>

            <div className="absolute bottom-3 left-2.5 w-[41%] max-w-[124px] sm:bottom-4 sm:left-4 sm:max-w-[168px] lg:max-w-[182px]">
              <PhoneMenu shop={shop} />
            </div>

            <div className="absolute bottom-3 right-2.5 flex max-w-[50%] flex-col items-end gap-1 text-right sm:bottom-6 sm:right-5">
              <p className="font-display text-[13px] font-semibold leading-tight text-white sm:text-lg">{shop}</p>
              <p className="max-w-full truncate text-[8px] font-medium text-white/70 sm:text-[10px]">{heroDemoShop.url}</p>
              <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[7px] font-bold uppercase tracking-[.1em] text-white backdrop-blur sm:text-[9px]">
                <span className="size-1 rounded-full bg-emerald-300" aria-hidden />
                {heroDemoShop.liveLabel}
              </span>
            </div>
          </div>

          <div className="scan-float absolute -right-2 -top-4 hidden rounded-xl border border-border bg-card px-3 py-2 sm:block">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.1em] text-muted-foreground">
              <i className="ri-flashlight-fill text-primary" aria-hidden />
              Instant update
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}