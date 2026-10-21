import { Link } from "react-router-dom";
import AppShell from "@/components/app/AppShell";
import { PageHead } from "@/components/app/Bits";
import { menuPath } from "@/components/app/menuLink";
import { useRestaurant } from "@/hooks/useRestaurant";
import { supportContact } from "@/mocks/restaurant";

const faqs = [
  {
    q: "Is ScanDish really free?",
    a: "Yes. The menu, the QR code, PNG and SVG downloads and every future menu edit are free. There is no card, no trial and no hidden charge.",
  },
  {
    q: "The QR code will not scan on an old phone",
    a: "Print it at least 4 cm wide and keep the white border around the code. If a guest still has trouble, turn the centre logo off in the QR page and download again.",
  },
  {
    q: "How do I mark a dish sold out?",
    a: "Open My Menu, find the dish and switch the availability toggle off. It instantly shows as sold out on the public menu and you can switch it back on tomorrow.",
  },
  {
    q: "Can I change my menu link?",
    a: "Yes, from the dashboard. Your QR code points at the new link automatically, but any card you already printed will need a fresh print.",
  },
  {
    q: "Do you take orders or payments?",
    a: "Not yet. ScanDish is a digital menu and QR tool today. Printed QR products and online ordering are planned for the next releases.",
  },
];

const waLink = `https://wa.me/${supportContact.whatsapp}?text=${encodeURIComponent("Hi ScanDish, I need help with my restaurant menu.")}`;

export default function SupportPage() {
  const { restaurant } = useRestaurant();
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1240px] px-4 py-8 md:px-6 md:py-12">
        <PageHead
          eyebrow="Support"
          title="A real person replies"
          description="Stuck on a menu, a QR code or printing? Message us on WhatsApp or email — we answer within one working day."
        />

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-4 rounded-card border border-border bg-card p-6 shadow-card transition-colors hover:border-primary/50 md:p-7"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-12 place-items-center rounded-[14px] bg-emerald-600 text-white" aria-hidden>
                <i className="ri-whatsapp-line text-2xl" />
              </span>
              <i className="ri-arrow-right-up-line text-xl text-muted-foreground transition-transform group-hover:-translate-y-0.5" aria-hidden />
            </div>
            <div>
              <h2 className="text-xl">WhatsApp</h2>
              <p className="mt-1 text-sm text-muted-foreground">Fastest way to reach us — send a photo of the problem if you have one.</p>
            </div>
            <p className="text-lg font-bold tabular-nums">{supportContact.whatsappLabel}</p>
            <span className="inline-flex w-fit items-center gap-2 rounded-btn bg-foreground px-4 py-2.5 text-sm font-semibold text-background">
              <i className="ri-chat-3-line" aria-hidden />
              Start chat
            </span>
          </a>

          <a
            href={`mailto:${supportContact.email}?subject=${encodeURIComponent("ScanDish support")}`}
            className="group flex flex-col gap-4 rounded-card border border-border bg-card p-6 shadow-card transition-colors hover:border-primary/50 md:p-7"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-12 place-items-center rounded-[14px] bg-primary/10 text-primary" aria-hidden>
                <i className="ri-mail-line text-2xl" />
              </span>
              <i className="ri-arrow-right-up-line text-xl text-muted-foreground transition-transform group-hover:-translate-y-0.5" aria-hidden />
            </div>
            <div>
              <h2 className="text-xl">Email</h2>
              <p className="mt-1 text-sm text-muted-foreground">Good for longer questions, account issues or printed orders.</p>
            </div>
            <p className="break-all text-lg font-bold">{supportContact.email}</p>
            <span className="inline-flex w-fit items-center gap-2 rounded-btn border border-border px-4 py-2.5 text-sm font-semibold">
              <i className="ri-send-plane-line" aria-hidden />
              Write to us
            </span>
          </a>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-card border border-border bg-muted/40 px-4 py-3.5">
          <i className="ri-time-line text-primary" aria-hidden />
          <p className="text-sm font-semibold">{supportContact.hours}</p>
          <span className="h-4 w-px bg-border" aria-hidden />
          <p className="text-sm text-muted-foreground">Messages outside these hours are answered on the next working day.</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="rounded-card border border-border bg-muted/40 p-5 md:p-7">
            <h2 className="text-xl">Support inside your menu</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Guests also get a support button on your public menu page, next to your own call and WhatsApp buttons. So nobody is stuck at the table with a question.
            </p>
            <div className="mt-4 rounded-card border border-border bg-background p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-[.1em] text-muted-foreground">On the public menu</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-btn bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
                  <i className="ri-whatsapp-line" aria-hidden />
                  Contact us
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-btn border border-border px-3 py-2 text-xs font-semibold">
                  <i className="ri-customer-service-2-line" aria-hidden />
                  Menu support
                </span>
              </div>
            </div>
            <Link to={menuPath(restaurant.slug)} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
              See the public menu
              <i className="ri-arrow-right-line" aria-hidden />
            </Link>
          </div>

          <div>
            <h2 className="text-xl">Common questions</h2>
            <div className="mt-4 divide-y divide-border border-y border-border">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold">
                    {faq.q}
                    <i className="ri-add-line flex-none text-lg text-muted-foreground transition-transform group-open:rotate-45" aria-hidden />
                  </summary>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}