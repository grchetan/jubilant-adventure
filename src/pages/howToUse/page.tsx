import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "@/components/app/AppShell";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  GuidePhone,
  MockDownload,
  MockMenuEditor,
  MockNameForm,
  MockQrDesign,
  MockTableScan,
} from "@/pages/howToUse/components/Mocks";

const STEPS = [
  {
    label: "Step 1",
    title: "Open Create and type your name",
    body: "Tap the green Create now button at the top of any page. On the first screen, type your restaurant's name in the box. That is the only thing this step needs.",
    tip: "Your menu link is made for you. “Chai & Masala” becomes /menu/chai-and-masala automatically — you do not type the link.",
    mock: <MockNameForm />,
  },
  {
    label: "Step 2",
    title: "Add your dishes, whenever you are ready",
    body: "Open My Menu. Add a category like Starters, Mains or Drinks, then add each dish with its name and price. A photo is optional — plain text works fine.",
    tip: "You can skip this for now. Your QR code already works before you add a single dish.",
    mock: <MockMenuEditor />,
  },
  {
    label: "Step 3",
    title: "Pick a look you like",
    body: "On the second step of Create, tap a colour, a background and a corner style. Turn on the logo switch to put your initials — or your own logo — in the middle of the code.",
    tip: "The design never changes the link. So you can try another colour later and the cards you already printed keep working.",
    mock: <MockQrDesign />,
  },
  {
    label: "Step 4",
    title: "Download the file",
    body: "Tap Download PNG. That is a normal picture you can print at home or at any print shop. Choose SVG only if the shop asks for a “vector” or “sharp” file.",
    tip: "You can also tap Print card and print our ready table card straight away — no design work needed.",
    mock: <MockDownload />,
  },
  {
    label: "Step 5",
    title: "Put it on the table",
    body: "Place the printed card on each table, near the door or at the counter. A guest points their phone camera at the code, taps the link that appears, and your menu opens in the browser.",
    tip: "No app is needed on the guest's phone. Change a price later and the next scan shows the new price — nothing to reprint.",
    mock: <MockTableScan />,
  },
];

const GUEST_STEPS = [
  { icon: "ri-camera-lens-line", title: "They open the camera", text: "The normal camera app on any phone can read the code. No extra app to download." },
  { icon: "ri-link", title: "A link appears", text: "A small link pops up on the screen. They tap it once." },
  { icon: "ri-restaurant-2-line", title: "Your menu opens", text: "Your dishes, prices and sold-out marks show on their phone — always the newest version." },
];

const WORRIES = [
  {
    q: "Do I need a computer or laptop?",
    a: "No. Everything works from a normal phone. You can also use a laptop if you prefer a bigger screen, but it is not needed.",
  },
  {
    q: "I am not good with phones. Is this too hard?",
    a: "Each step asks for one small thing: a name, a colour, a download. There is no code and no settings to remember. If you can send a WhatsApp message, you can do this. You can always come back to this page.",
  },
  {
    q: "The QR code does not scan on an old phone. What now?",
    a: "Print it bigger — at least 4 cm wide — and keep the white space around the code. If an old phone still struggles, open QR Code, turn off “Logo in the centre”, download again and print that version.",
  },
  {
    q: "Will my printed code stop working if I change the menu?",
    a: "Never. The code only points at your menu link. Change dishes, prices or sold-out items as often as you like — the same code keeps working.",
  },
  {
    q: "How much does it cost?",
    a: "Nothing. The menu, the QR code, PNG and SVG downloads and every future change are free. There is no card and no trial.",
  },
  {
    q: "What if I make a mistake?",
    a: "Nothing is permanent. Change the name, the colours or any dish whenever you want from the dashboard. You can also download a fresh QR code after changing the link.",
  },
];

export default function HowToUsePage() {
  const [armed, setArmed] = useState(false);
  const [big, setBig] = useState(false);

  useEffect(() => {
    document.title = "How to use ScanDish — step by step";
    setArmed(true);
  }, []);
  useScrollReveal("[data-guide-reveal]", [armed]);

  return (
    <AppShell>
      <div className={`${armed ? "guide-armed" : ""} ${big ? "guide-large" : ""}`}>
        {/* 首屏：一句话说明 + 手机示意，右边先让人「看到」结果 */}
        <section className="relative overflow-hidden border-b border-border bg-muted/40">
          <div className="absolute -left-32 -top-24 size-[420px] rounded-full bg-primary/[0.07] blur-3xl" aria-hidden />
          <div className="mx-auto grid w-full max-w-[1180px] items-center gap-10 px-4 py-10 md:px-6 md:py-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.2em] text-primary">
                <span className="h-px w-6 bg-primary" aria-hidden />
                How to use
              </span>
              <h1 className="mt-3 text-3xl leading-[1.08] md:text-[2.9rem]">
                From your name to a printed QR code — in five easy steps
              </h1>
              <p className="guide-body mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                No computer needed. No app to install. If you can send a WhatsApp message, you can do this. Read one step,
                do one step, and take as long as you like.
              </p>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
                <Link
                  to="/create"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  Create my QR code now
                  <i className="ri-arrow-right-line" aria-hidden />
                </Link>
                <a
                  href="#steps"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
                >
                  <i className="ri-list-ordered" aria-hidden />
                  Show me the steps
                </a>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={big}
                  onClick={() => setBig((v) => !v)}
                  className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-bold transition-colors ${
                    big ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <i className="ri-font-size-2 text-base" aria-hidden />
                  Bigger text {big ? "on" : "off"}
                </button>
                <span className="text-xs text-muted-foreground">About 2 minutes · Free forever · No card</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-x-6 bottom-4 h-24 rounded-full bg-primary/15 blur-2xl" aria-hidden />
              <GuidePhone />
            </div>
          </div>
        </section>

        {/* 需要准备什么 */}
        <section className="mx-auto w-full max-w-[1180px] px-4 py-10 md:px-6 md:py-12">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: "ri-smartphone-line", title: "A phone or laptop", text: "The one you already use for WhatsApp is perfect." },
              { icon: "ri-store-2-line", title: "Your restaurant name", text: "And, if you have one, your logo picture." },
              { icon: "ri-time-line", title: "Two spare minutes", text: "Start with an empty menu — add dishes later." },
            ].map((item) => (
              <div
                key={item.title}
                data-guide-reveal
                className="flex items-start gap-3 rounded-card border border-border bg-card p-4 shadow-card"
              >
                <span className="grid size-10 flex-none place-items-center rounded-[11px] bg-primary/10 text-primary" aria-hidden>
                  <i className={`${item.icon} text-lg`} />
                </span>
                <div>
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 五个步骤 */}
        <section id="steps" className="border-y border-border bg-background">
          <div className="mx-auto w-full max-w-[1180px] px-4 py-12 md:px-6 md:py-16">
            <div className="max-w-2xl" data-guide-reveal>
              <h2 className="text-2xl md:text-4xl">Five steps, start to finish</h2>
              <p className="guide-body mt-3 text-muted-foreground">
                Each step has one small job. You cannot break anything — every choice can be changed later.
              </p>
            </div>

            <ol className="mt-8 flex flex-col gap-6 md:gap-8">
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  data-guide-reveal
                  className="grid gap-6 rounded-card border border-border bg-card p-5 shadow-card md:grid-cols-[1fr_.85fr] md:items-center md:gap-10 md:p-8"
                  style={{ transitionDelay: `${Math.min(index, 4) * 50}ms` }}
                >
                  <div className={index % 2 === 1 ? "md:order-2" : ""}>
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-primary">
                      <span className="grid size-4 place-items-center rounded-full bg-primary text-[8px] text-primary-foreground" aria-hidden>
                        {index + 1}
                      </span>
                      {step.label}
                    </span>
                    <h3 className="guide-step-title mt-3 text-xl leading-tight md:text-2xl">{step.title}</h3>
                    <p className="guide-body mt-2.5 leading-relaxed text-muted-foreground">{step.body}</p>
                    <div className="mt-4 flex items-start gap-2.5 rounded-btn bg-primary/5 px-3.5 py-3">
                      <i className="ri-lightbulb-line mt-0.5 flex-none text-primary" aria-hidden />
                      <p className="text-[13px] leading-relaxed text-foreground/80">{step.tip}</p>
                    </div>
                  </div>
                  <div className="grid place-items-center rounded-card bg-muted/60 p-5">
                    {step.mock}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 客人那边看到什么 */}
        <section className="mx-auto w-full max-w-[1180px] px-4 py-12 md:px-6 md:py-16">
          <div className="max-w-2xl" data-guide-reveal>
            <h2 className="text-2xl md:text-4xl">What your guest sees</h2>
            <p className="guide-body mt-3 text-muted-foreground">
              The guest does not need to understand any of this. Their side is only three taps.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {GUEST_STEPS.map((item, index) => (
              <div
                key={item.title}
                data-guide-reveal
                className="relative rounded-card border border-border bg-card p-5 shadow-card"
              >
                <span className="font-display absolute end-4 top-3 text-4xl leading-none text-primary/15 tabular-nums" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="grid size-11 place-items-center rounded-[12px] bg-primary/10 text-primary" aria-hidden>
                  <i className={`${item.icon} text-xl`} />
                </span>
                <h3 className="mt-3 text-lg">{item.title}</h3>
                <p className="guide-body mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 常见担心 */}
        <section className="border-y border-border bg-muted/40">
          <div className="mx-auto grid w-full max-w-[1180px] gap-8 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-[.8fr_1.2fr] lg:gap-14">
            <div data-guide-reveal>
              <h2 className="text-2xl md:text-4xl">Common worries, answered plainly</h2>
              <p className="guide-body mt-3 text-muted-foreground">
                These are the questions we hear most from first-time phone users. If yours is not here, message us — a real
                person replies.
              </p>
              <Link
                to="/support"
                className="mt-5 inline-flex items-center gap-2 whitespace-nowrap rounded-btn border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
              >
                <i className="ri-customer-service-2-line text-primary" aria-hidden />
                Ask us directly
              </Link>
            </div>

            <div className="divide-y divide-border border-y border-border" data-guide-reveal>
              {WORRIES.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold">
                    {item.q}
                    <i className="ri-add-line flex-none text-lg text-muted-foreground transition-transform duration-300 group-open:rotate-45" aria-hidden />
                  </summary>
                  <p className="guide-body mt-2.5 text-[14px] leading-relaxed text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 收尾 CTA */}
        <section className="mx-auto w-full max-w-[1180px] px-4 py-12 md:px-6 md:py-16">
          <div className="relative overflow-hidden rounded-card bg-primary px-6 py-10 text-center text-primary-foreground md:px-10 md:py-14">
            <div className="pointer-events-none absolute -end-16 -top-16 size-56 rounded-full bg-white/10" aria-hidden />
            <div className="pointer-events-none absolute -bottom-20 -start-10 size-52 rounded-full bg-white/10" aria-hidden />
            <h2 className="relative mx-auto max-w-2xl text-2xl leading-tight text-primary-foreground md:text-4xl">
              Ready to try it yourself?
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-primary-foreground/85 md:text-base">
              Keep this page open on one side if you like. Tap below, type your name and see your QR code appear.
            </p>
            <div className="relative mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
              <Link
                to="/create"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn bg-white px-5 py-3 text-sm font-bold text-primary transition-transform hover:-translate-y-0.5"
              >
                Create my QR code
                <i className="ri-arrow-right-line" aria-hidden />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn border border-white/40 px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-white/10"
              >
                Go to my dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}