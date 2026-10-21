import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "@/components/app/AppShell";
import { PageHead, Panel, Toast } from "@/components/app/Bits";
import { buildQrSvg, downloadQrPng, downloadQrSvg, svgToDataUrl, type QrShape } from "@/components/app/qrEngine";
import { menuPath, menuUrl } from "@/components/app/menuLink";
import { useRestaurant } from "@/hooks/useRestaurant";

const COLORS = [
  { name: "Ink", value: "#1C1917" },
  { name: "Burnt orange", value: "#C2410C" },
  { name: "Forest", value: "#15803D" },
  { name: "Crimson", value: "#9F1239" },
  { name: "Coffee", value: "#7C2D12" },
  { name: "Olive", value: "#4D7C0F" },
];

const BACKGROUNDS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Cream", value: "#FFFBF3" },
  { name: "Stone", value: "#F5F5F4" },
];

const SHAPES: { id: QrShape; label: string; preview: string }[] = [
  { id: "square", label: "Square", preview: "rounded-none" },
  { id: "rounded", label: "Rounded", preview: "rounded-[5px]" },
  { id: "dots", label: "Dots", preview: "rounded-full" },
];

const PNG_SIZES = [
  { px: 512, label: "Small", hint: "WhatsApp & chat" },
  { px: 1024, label: "Medium", hint: "Table cards" },
  { px: 2048, label: "Print", hint: "A4 posters" },
] as const;

const tips = [
  {
    icon: "ri-table-line",
    title: "Table stand",
    text: "Print the card at A5 and place it beside the cutlery or the bill tray.",
  },
  {
    icon: "ri-door-open-line",
    title: "Entrance & counter",
    text: "A poster at the door lets guests read the menu before they sit down.",
  },
  {
    icon: "ri-qr-scan-line",
    title: "Always scans",
    text: "Colour and corner style change the look, not the link — the same code keeps working after you edit dishes.",
  },
];

export default function QrPage() {
  const { restaurant } = useRestaurant();
  const [color, setColor] = useState(COLORS[0].value);
  const [background, setBackground] = useState(BACKGROUNDS[0].value);
  const [shape, setShape] = useState<QrShape>("rounded");
  const [showLogo, setShowLogo] = useState(true);
  const [copied, setCopied] = useState(false);
  const [pngSize, setPngSize] = useState(1024);
  const [printMode, setPrintMode] = useState<"A5" | "A4" | null>(null);
  const [toast, setToast] = useState("");

  const link = menuUrl(restaurant.slug);
  const initials =
    restaurant.name
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SD";

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const svg = useMemo(
    () =>
      buildQrSvg({
        value: link,
        color,
        background,
        shape,
        logo: restaurant.logo,
        initials,
        showLogo,
      }),
    [link, color, background, shape, restaurant.logo, initials, showLogo],
  );

  const preview = useMemo(() => (svg ? svgToDataUrl(svg) : ""), [svg]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setToast("Menu link copied");
    } catch {
      setToast(link);
    }
  };

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const shareLink = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: `${restaurant.name || "Our"} menu`, url: link });
        return;
      } catch {
        return;
      }
    }
    await copyLink();
  };

  const png = async () => {
    const ok = await downloadQrPng(svg, `${restaurant.slug || "menu"}-qr-${pngSize}.png`, pngSize);
    setToast(ok ? `PNG downloaded — ${pngSize} px` : "Could not create PNG — try SVG");
  };

  // 打印：先把纸张尺寸写进临时样式，等浏览器出打印预览后再移除
  useEffect(() => {
    if (!printMode) return;
    const sheet = document.createElement("style");
    sheet.textContent = `@page { size: ${printMode} portrait; margin: 10mm; }`;
    document.head.appendChild(sheet);
    const timer = window.setTimeout(() => window.print(), 180);
    return () => {
      window.clearTimeout(timer);
      sheet.remove();
    };
  }, [printMode]);

  useEffect(() => {
    const done = () => setPrintMode(null);
    window.addEventListener("afterprint", done);
    return () => window.removeEventListener("afterprint", done);
  }, []);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1240px] px-4 py-8 md:px-6 md:py-12">
        <PageHead
          eyebrow="QR code"
          title="One code. Every table."
          description="Your QR code points at your live menu link, so you can change dishes and prices any time without reprinting it."
          actions={
            <>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-btn border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                <i className="ri-link" aria-hidden />
                Copy link
              </button>
              <button
                type="button"
                onClick={shareLink}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-btn border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                <i className="ri-share-forward-line" aria-hidden />
                Share
              </button>
              <Link
                to={menuPath(restaurant.slug)}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-btn border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                <i className="ri-eye-line" aria-hidden />
                Open menu
              </Link>
            </>
          }
        />

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div className="flex flex-col gap-6">
            <Panel className="p-5 md:p-7">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg">Customise</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                  <i className="ri-flashlight-line text-primary" aria-hidden />
                  live preview
                </span>
              </div>

              <div className="mt-5">
                <p className="text-[12px] font-bold uppercase tracking-[.08em] text-muted-foreground">QR colour</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {COLORS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setColor(option.value)}
                      aria-label={option.name}
                      aria-pressed={color === option.value}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        color === option.value ? "border-foreground bg-foreground/5" : "border-border hover:bg-muted"
                      }`}
                    >
                      <span className="size-4 rounded-full border border-black/10" style={{ backgroundColor: option.value }} aria-hidden />
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-[12px] font-bold uppercase tracking-[.08em] text-muted-foreground">Background</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {BACKGROUNDS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setBackground(option.value)}
                      aria-label={option.name}
                      aria-pressed={background === option.value}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        background === option.value ? "border-foreground bg-foreground/5" : "border-border hover:bg-muted"
                      }`}
                    >
                      <span className="size-4 rounded-full border border-black/10" style={{ backgroundColor: option.value }} aria-hidden />
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-[12px] font-bold uppercase tracking-[.08em] text-muted-foreground">Corner style</p>
                <div className="mt-2.5 grid grid-cols-3 gap-2">
                  {SHAPES.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setShape(option.id)}
                      aria-pressed={shape === option.id}
                      className={`flex flex-col items-center gap-1.5 rounded-card border px-2 py-3 text-xs font-bold transition-colors ${
                        shape === option.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <span className={`size-4 border-2 border-current ${option.preview}`} aria-hidden />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 rounded-btn border border-border bg-muted/40 px-3.5 py-3">
                <div>
                  <p className="text-sm font-semibold">Logo in the centre</p>
                  <p className="text-xs text-muted-foreground">
                    {restaurant.logo ? "Using your uploaded logo." : "No logo uploaded — your initials are used."}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showLogo}
                  aria-label="Show logo in the centre"
                  onClick={() => setShowLogo((v) => !v)}
                  className={`relative h-6 w-11 flex-none rounded-full border transition-colors ${
                    showLogo ? "border-primary bg-primary" : "border-border bg-background"
                  }`}
                >
                  <span className={`absolute top-0.5 size-[18px] rounded-full bg-white shadow-sm transition-all ${showLogo ? "left-[calc(100%-20px)]" : "left-0.5"}`} />
                </button>
              </div>

              <div className="mt-4 flex items-start gap-2.5 rounded-btn bg-primary/5 px-3.5 py-3 text-[13px] text-muted-foreground">
                <i className="ri-shield-check-line mt-0.5 text-primary" aria-hidden />
                <p>Highest error correction is always on, so the centre logo never stops a normal phone camera from scanning.</p>
              </div>
            </Panel>

            <Panel className="p-5 md:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg">Download your QR</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Just the code, on a clean background — pick a size and save it.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                  <i className="ri-shield-check-line text-primary" aria-hidden />
                  PNG &amp; SVG
                </span>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,224px)_minmax(0,1fr)] sm:items-start">
                <div className="rounded-card border border-border p-4" style={{ backgroundColor: background }}>
                  {preview ? (
                    <img
                      src={preview}
                      alt={`QR code for ${restaurant.name}`}
                      className="mx-auto w-full max-w-[192px]"
                    />
                  ) : (
                    <div className="mx-auto grid aspect-square w-full max-w-[192px] place-items-center rounded-card border border-dashed border-border text-xs text-muted-foreground">
                      Generating…
                    </div>
                  )}
                  <p className="mt-2.5 text-center text-[11px] font-semibold text-muted-foreground">
                    {pngSize} × {pngSize} px · square
                  </p>
                </div>

                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[.08em] text-muted-foreground">PNG size</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="PNG download size">
                    {PNG_SIZES.map((option) => {
                      const active = pngSize === option.px;
                      return (
                        <button
                          key={option.px}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setPngSize(option.px)}
                          className={`rounded-card border px-3 py-2.5 text-left transition-colors ${
                            active ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
                          }`}
                        >
                          <span className={`block text-[13px] font-bold ${active ? "text-primary" : ""}`}>
                            {option.label}
                          </span>
                          <span className="block text-[11px] font-medium text-muted-foreground">
                            {option.px} px · {option.hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={png}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                    >
                      <i className="ri-download-2-line" aria-hidden />
                      Download PNG
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        downloadQrSvg(svg, `${restaurant.slug || "menu"}-qr.svg`);
                        setToast("SVG downloaded — sharp at any size");
                      }}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted"
                    >
                      <i className="ri-file-download-line" aria-hidden />
                      Download SVG
                    </button>
                  </div>

                  <p className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-muted-foreground">
                    <i className="ri-information-line mt-0.5 flex-none text-primary" aria-hidden />
                    Keep the white space around the code empty. SVG is best for a print shop — it never gets blurry.
                  </p>
                </div>
              </div>
            </Panel>

            <Panel className="p-5 md:p-7">
              <h2 className="text-lg">Print-ready table card</h2>
              <p className="mt-1 text-sm text-muted-foreground">Your name, logo and QR code on one clean card. Print it, fold it, done.</p>

              <div className="mt-4 rounded-card border border-border bg-muted/30 p-4">
                <div className={`${printMode === "A4" ? "" : "print-area"} mx-auto max-w-[360px] rounded-card border border-border bg-white p-6 text-center`}>
                  {restaurant.logo ? (
                    <img src={restaurant.logo} alt={`${restaurant.name} logo`} className="mx-auto size-12 rounded-full object-cover" />
                  ) : (
                    <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {initials}
                    </span>
                  )}
                  <p className="font-display mt-3 text-xl font-bold leading-tight">{restaurant.name || "Your restaurant"}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[.24em] text-muted-foreground">Scan to view menu</p>
                  {preview ? (
                    <img src={preview} alt={`QR code for ${restaurant.name}`} className="mx-auto mt-3 size-40" />
                  ) : (
                    <div className="mx-auto mt-3 grid size-40 place-items-center rounded-card border border-dashed border-border text-xs text-muted-foreground">
                      QR preview
                    </div>
                  )}
                  <p className="mt-2 text-[11px] font-semibold text-foreground/70">{restaurant.hours}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{restaurant.address}</p>
                </div>
              </div>

              {printMode === "A4" ? (
                <div className="print-only print-area print-wide">
                  {restaurant.logo ? (
                    <img src={restaurant.logo} alt={`${restaurant.name} logo`} className="size-20 rounded-full object-cover" />
                  ) : (
                    <span className="grid size-20 place-items-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                      {initials}
                    </span>
                  )}
                  <p className="font-display text-4xl font-bold leading-tight">{restaurant.name || "Your restaurant"}</p>
                  <p className="text-sm font-bold uppercase tracking-[.3em] text-muted-foreground">Scan to view menu</p>
                  {preview ? (
                    <img src={preview} alt={`QR code for ${restaurant.name}`} className="mt-2 w-[115mm] max-w-full" />
                  ) : null}
                  <div className="text-center">
                    <p className="text-base font-semibold">{restaurant.hours}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{restaurant.address}</p>
                  </div>
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPrintMode("A5")}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-btn bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
                >
                  <i className="ri-printer-line" aria-hidden />
                  Print table card · A5
                </button>
                <button
                  type="button"
                  onClick={() => setPrintMode("A4")}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-btn border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted"
                >
                  <i className="ri-file-paper-2-line" aria-hidden />
                  Print poster · A4
                </button>
                <span className="text-xs text-muted-foreground lg:ms-auto">Only the card gets printed — the dashboard stays hidden.</span>
              </div>
            </Panel>
          </div>

          <div>
            <div className="lg:sticky lg:top-[86px]">
              <Panel className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                  <h2 className="text-sm font-bold uppercase tracking-[.1em] text-muted-foreground">Your QR code</h2>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                    <span className="size-1.5 rounded-full bg-emerald-600" aria-hidden />
                    scans fine
                  </span>
                </div>
                <div className="grid place-items-center px-6 py-8" style={{ backgroundColor: background }}>
                  {preview ? (
                    <img src={preview} alt={`QR code for ${restaurant.name}`} className="app-float w-full max-w-[280px]" />
                  ) : (
                    <div className="grid size-56 place-items-center rounded-card border border-dashed border-border text-sm text-muted-foreground">
                      Generating…
                    </div>
                  )}
                </div>
                <div className="border-t border-border px-5 py-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-bold uppercase tracking-[.1em] text-muted-foreground">Menu link</p>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[.08em] text-primary">
                      <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                      live
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center gap-1 rounded-btn border border-border bg-muted/40 p-1.5 ps-3 transition-colors focus-within:border-primary/50">
                    <i className="ri-link-m text-[15px] text-primary" aria-hidden />
                    <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold" title={link}>
                      {link}
                    </span>
                    <button
                      type="button"
                      onClick={copyLink}
                      aria-label="Copy menu link"
                      title="Copy link"
                      className="grid size-8 flex-none cursor-pointer place-items-center rounded-[7px] text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                    >
                      <i className={copied ? "ri-check-line text-[15px] text-emerald-600" : "ri-file-copy-line text-[15px]"} aria-hidden />
                    </button>
                    <Link
                      to={menuPath(restaurant.slug)}
                      aria-label="Open menu in a new tab"
                      title="Open menu"
                      className="grid size-8 flex-none place-items-center rounded-[7px] bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                    >
                      <i className="ri-external-link-line text-[15px]" aria-hidden />
                    </Link>
                  </div>

                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                    This one link never changes — edit dishes or prices any time and the QR keeps working.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={copyLink}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-btn bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground"
                    >
                      <i className={copied ? "ri-check-line" : "ri-file-copy-line"} aria-hidden />
                      {copied ? "Copied" : "Copy link"}
                    </button>
                    <button
                      type="button"
                      onClick={png}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-btn border border-border px-3.5 py-2 text-xs font-semibold hover:bg-muted"
                    >
                      <i className="ri-download-2-line" aria-hidden />
                      Download PNG
                    </button>
                  </div>
                </div>
              </Panel>

              <div className="mt-4 rounded-card border border-border bg-card p-4 shadow-card">
                <p className="text-[12px] font-bold uppercase tracking-[.08em] text-muted-foreground">Where to place it</p>
                <ul className="mt-3 flex flex-col gap-3">
                  {tips.map((tip) => (
                    <li key={tip.title} className="flex gap-2.5">
                      <span className="grid size-8 flex-none place-items-center rounded-[9px] bg-primary/10 text-primary" aria-hidden>
                        <i className={`${tip.icon} text-sm`} />
                      </span>
                      <div>
                        <p className="text-[13px] font-bold">{tip.title}</p>
                        <p className="text-xs leading-relaxed text-muted-foreground">{tip.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toast message={toast} />
    </AppShell>
  );
}