import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "@/components/app/AppShell";
import { PageHead, Panel, Toast } from "@/components/app/Bits";
import { buildQrSvg, downloadQrPng, downloadQrSvg, svgToDataUrl, type QrShape } from "@/components/app/qrEngine";
import { menuPath, menuUrl } from "@/components/app/menuLink";
import { slugify, useRestaurant } from "@/hooks/useRestaurant";
import CreateStepper from "@/pages/create/components/CreateStepper";
import QrDesign, { QR_BACKGROUNDS, QR_COLORS } from "@/pages/create/components/QrDesign";

const inputCls =
  "h-11 w-full rounded-btn border border-border bg-background px-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
const labelCls = "mb-1.5 block text-[12px] font-bold uppercase tracking-[.08em] text-muted-foreground";
const nextBtn =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0";
const ghostBtn =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn border border-border bg-card px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted";

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SD";

export default function CreatePage() {
  const { restaurant, updateProfile } = useRestaurant();
  const [step, setStep] = useState(1);
  const [slugTouched, setSlugTouched] = useState(false);
  const [color, setColor] = useState(QR_COLORS[0].value);
  const [background, setBackground] = useState(QR_BACKGROUNDS[0].value);
  const [shape, setShape] = useState<QrShape>("rounded");
  const [showLogo, setShowLogo] = useState(true);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");

  const name = restaurant.name.trim();
  const link = menuUrl(restaurant.slug);
  const initials = initialsOf(restaurant.name);

  useEffect(() => {
    document.title = "Create your menu QR code | ScanDish";
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const svgCode = useMemo(
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

  const preview = useMemo(() => (svgCode ? svgToDataUrl(svgCode) : ""), [svgCode]);

  const onName = (value: string) => {
    updateProfile(slugTouched ? { name: value } : { name: value, slug: slugify(value) });
  };

  const onSlug = (value: string) => {
    setSlugTouched(true);
    updateProfile({ slug: slugify(value) });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setToast("Menu link copied");
    } catch {
      setToast(link);
    }
  };

  const savePng = async () => {
    const ok = await downloadQrPng(svgCode, `${restaurant.slug || "menu"}-qr.png`);
    setToast(ok ? "PNG downloaded — ready to print" : "Could not create PNG — try SVG");
  };

  const saveSvg = () => {
    downloadQrSvg(svgCode, `${restaurant.slug || "menu"}-qr.svg`);
    setToast("SVG downloaded — perfect for a print shop");
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1180px] px-4 py-8 md:px-6 md:py-10">
        <PageHead
          eyebrow="Create now"
          title="Your menu QR code, ready in two minutes"
          description="Type your restaurant name, pick a look you like, download the code. No card, no sign-up and nothing to install."
          actions={
            <Link to="/how-to-use" className={ghostBtn}>
              <i className="ri-question-line" aria-hidden />
              How to use
            </Link>
          }
        />

        <CreateStepper current={step} onJump={setStep} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
          <div className="flex flex-col gap-6">
            {step === 1 ? (
              <Panel key="step-1" className="app-fade-up p-5 md:p-7">
                <div className="flex items-start gap-3">
                  <span className="grid size-9 flex-none place-items-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground" aria-hidden>
                    01
                  </span>
                  <div>
                    <h2 className="text-xl">What is your restaurant called?</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Type it exactly the way you want guests to read it on the menu.</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-5">
                  <div>
                    <label htmlFor="create-name" className={labelCls}>
                      Restaurant name
                    </label>
                    <input
                      id="create-name"
                      value={restaurant.name}
                      onChange={(e) => onName(e.target.value)}
                      placeholder="e.g. Chai & Masala"
                      className={`${inputCls} h-12 text-base`}
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground">You can change this later — nothing is locked.</p>
                  </div>

                  <div>
                    <label htmlFor="create-slug" className={labelCls}>
                      Your menu link
                    </label>
                    <div className="flex items-center rounded-btn border border-border bg-background pl-3 focus-within:border-primary">
                      <span className="whitespace-nowrap text-[12px] font-medium text-muted-foreground">/menu/</span>
                      <input
                        id="create-slug"
                        value={restaurant.slug}
                        onChange={(e) => onSlug(e.target.value)}
                        placeholder="chai-and-masala"
                        className="h-11 w-full bg-transparent px-1 text-sm font-medium focus:outline-none"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Short and simple is best. Your QR code points here, so keep it once you have printed the code.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                  <p className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <i className="ri-shield-check-line text-base text-primary" aria-hidden />
                    Free forever. No card needed.
                  </p>
                  <button type="button" disabled={!name} onClick={() => setStep(2)} className={nextBtn}>
                    Continue to design
                    <i className="ri-arrow-right-line" aria-hidden />
                  </button>
                </div>
              </Panel>
            ) : null}

            {step === 2 ? (
              <Panel key="step-2" className="app-fade-up p-5 md:p-7">
                <div className="flex items-start gap-3">
                  <span className="grid size-9 flex-none place-items-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground" aria-hidden>
                    02
                  </span>
                  <div>
                    <h2 className="text-xl">Make it look like your place</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Tap any option — the code on the right changes straight away.</p>
                  </div>
                </div>

                <div className="mt-6">
                  <QrDesign
                    color={color}
                    background={background}
                    shape={shape}
                    showLogo={showLogo}
                    hasLogo={Boolean(restaurant.logo)}
                    onColor={setColor}
                    onBackground={setBackground}
                    onShape={setShape}
                    onShowLogo={setShowLogo}
                  />
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                  <button type="button" onClick={() => setStep(1)} className={ghostBtn}>
                    <i className="ri-arrow-left-line" aria-hidden />
                    Back
                  </button>
                  <button type="button" onClick={() => setStep(3)} className={nextBtn}>
                    Continue to download
                    <i className="ri-arrow-right-line" aria-hidden />
                  </button>
                </div>
              </Panel>
            ) : null}

            {step === 3 ? (
              <div className="flex flex-col gap-6">
                <Panel key="step-3" className="app-fade-up p-5 md:p-7">
                  <div className="flex items-start gap-3">
                    <span className="grid size-9 flex-none place-items-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground" aria-hidden>
                      03
                    </span>
                    <div>
                      <h2 className="text-xl">Download it and put it on your table</h2>
                      <p className="mt-1 text-sm text-muted-foreground">PNG for normal printing. SVG if a print shop asks for a sharp file.</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-card border border-border bg-muted/30 p-4">
                    <div className="print-area mx-auto max-w-[340px] rounded-card border border-border bg-white p-6 text-center">
                      {restaurant.logo ? (
                        <img src={restaurant.logo} alt={`${restaurant.name} logo`} className="mx-auto size-12 rounded-full object-cover" />
                      ) : (
                        <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                          {initials}
                        </span>
                      )}
                      <p className="font-display mt-3 text-xl font-bold leading-tight">{restaurant.name || "Your restaurant"}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[.24em] text-muted-foreground">Scan to view menu</p>
                      {preview ? <img src={preview} alt={`QR code for ${restaurant.name}`} className="mx-auto mt-3 size-40" /> : null}
                      <p className="mt-2 text-[11px] font-semibold text-foreground/70">{restaurant.hours}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{restaurant.address}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={savePng} className="inline-flex items-center gap-2 whitespace-nowrap rounded-btn bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                      <i className="ri-download-2-line" aria-hidden />
                      Download PNG
                    </button>
                    <button type="button" onClick={saveSvg} className={ghostBtn}>
                      <i className="ri-file-download-line" aria-hidden />
                      Download SVG
                    </button>
                    <button type="button" onClick={() => window.print()} className={ghostBtn}>
                      <i className="ri-printer-line" aria-hidden />
                      Print card
                    </button>
                  </div>

                  <div className="mt-4 flex items-start gap-2.5 rounded-btn bg-primary/5 px-3.5 py-3 text-[13px] text-muted-foreground">
                    <i className="ri-lightbulb-line mt-0.5 text-primary" aria-hidden />
                    <p>Print the code at least 4 cm wide and leave the white space around it — that is what makes scanning easy on older phones.</p>
                  </div>
                </Panel>

                <Panel className="p-5 md:p-7">
                  <h2 className="text-lg">What next?</h2>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <Link to="/dashboard/menu" className="group flex items-center gap-3 rounded-card border border-border bg-card p-3.5 transition-colors hover:border-primary/40">
                      <span className="grid size-9 flex-none place-items-center rounded-[10px] bg-primary/10 text-primary" aria-hidden>
                        <i className="ri-file-list-3-line" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold">Add dishes</span>
                        <span className="block truncate text-xs text-muted-foreground">Prices and photos</span>
                      </span>
                    </Link>
                    <button type="button" onClick={copyLink} className="group flex cursor-pointer items-center gap-3 rounded-card border border-border bg-card p-3.5 text-left transition-colors hover:border-primary/40">
                      <span className="grid size-9 flex-none place-items-center rounded-[10px] bg-primary/10 text-primary" aria-hidden>
                        <i className={copied ? "ri-check-line" : "ri-link"} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold">{copied ? "Link copied" : "Copy link"}</span>
                        <span className="block truncate text-xs text-muted-foreground">Send it on WhatsApp</span>
                      </span>
                    </button>
                    <Link to={menuPath(restaurant.slug)} className="group flex items-center gap-3 rounded-card border border-border bg-card p-3.5 transition-colors hover:border-primary/40">
                      <span className="grid size-9 flex-none place-items-center rounded-[10px] bg-primary/10 text-primary" aria-hidden>
                        <i className="ri-eye-line" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold">Open menu</span>
                        <span className="block truncate text-xs text-muted-foreground">See what guests see</span>
                      </span>
                    </Link>
                  </div>
                </Panel>
              </div>
            ) : null}
          </div>

          <aside>
            <div className="lg:sticky lg:top-[86px]">
              <Panel className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                  <h2 className="text-sm font-bold uppercase tracking-[.1em] text-muted-foreground">Live preview</h2>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary">
                    <span className="relative flex size-1.5" aria-hidden>
                      <span className="app-ping absolute inset-0 rounded-full" />
                      <span className="relative size-1.5 rounded-full bg-primary" />
                    </span>
                    updates as you tap
                  </span>
                </div>

                <div className="grid place-items-center px-6 py-8" style={{ backgroundColor: background }}>
                  {preview ? (
                    <img src={preview} alt={`QR code for ${restaurant.name || "your menu"}`} className="w-full max-w-[240px]" />
                  ) : (
                    <div className="grid size-52 place-items-center rounded-card border border-dashed border-border text-sm text-muted-foreground">
                      Type a name to start
                    </div>
                  )}
                </div>

                <div className="border-t border-border px-5 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[.1em] text-muted-foreground">Menu link</p>
                  <div className="mt-2 flex items-center gap-1 rounded-btn border border-border bg-muted/40 p-1.5 ps-3">
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
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button type="button" onClick={savePng} className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-btn bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground">
                      <i className="ri-download-2-line" aria-hidden />
                      PNG
                    </button>
                    <button type="button" onClick={saveSvg} className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-btn border border-border px-3 py-2.5 text-xs font-semibold hover:bg-muted">
                      <i className="ri-file-download-line" aria-hidden />
                      SVG
                    </button>
                  </div>
                </div>
              </Panel>

              <div className="mt-4 rounded-card border border-border bg-card p-4 shadow-card">
                <p className="text-[12px] font-bold uppercase tracking-[.08em] text-muted-foreground">Good to know</p>
                <ul className="mt-3 flex flex-col gap-2.5 text-[12.5px] text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-fill mt-0.5 text-primary" aria-hidden />
                    The code always points at the same link, so old prints keep working.
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-fill mt-0.5 text-primary" aria-hidden />
                    Highest error correction is on, so the centre logo still scans.
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-fill mt-0.5 text-primary" aria-hidden />
                    Change dishes and prices later from My Menu — free.
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Toast message={toast} />
    </AppShell>
  );
}