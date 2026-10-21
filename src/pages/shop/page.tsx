import { Link } from "react-router-dom";
import AppShell from "@/components/app/AppShell";
import { PageHead } from "@/components/app/Bits";
import { shopProducts, shopSteps } from "@/mocks/shop";

export default function ShopPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1240px] px-4 py-8 md:px-6 md:py-12">
        <PageHead
          eyebrow="Shop · coming soon"
          title="Printed QR products, on the way"
          description="Table stands, posters and stickers printed with your QR code and logo. Ordering opens in the next release — nothing to pay today."
          actions={
            <Link
              to="/dashboard/qr"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-btn bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              <i className="ri-qr-code-line" aria-hidden />
              Download free QR
            </Link>
          }
        />

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-card border border-border bg-muted/40 px-4 py-3.5">
          <span className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.1em] text-primary">
            <i className="ri-time-line" aria-hidden />
            coming soon
          </span>
          <p className="text-sm text-muted-foreground">
            Checkout and delivery will be switched on soon. Until then, every QR code is free to download and print yourself.
          </p>
        </div>

        <section className="mt-8" aria-label="Printed menu products">
          <ul data-product-shop className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {shopProducts.map((product, index) => (
              <li
                key={product.id}
                className="app-fade-up group flex flex-col overflow-hidden rounded-card border border-border bg-card shadow-card"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-foreground backdrop-blur">
                    {product.badge}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h2 className="text-base font-bold leading-snug">{product.name}</h2>
                  <p className="flex-1 text-[13px] leading-relaxed text-muted-foreground">{product.description}</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="font-display text-xl font-bold tabular-nums">{product.price}</span>
                    <span className="text-[11px] font-semibold text-muted-foreground">incl. printing</span>
                  </div>
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="mt-1 inline-flex h-10 w-full cursor-not-allowed items-center justify-center gap-2 whitespace-nowrap rounded-btn border border-border bg-muted text-sm font-semibold text-muted-foreground opacity-80"
                  >
                    <i className="ri-lock-2-line" aria-hidden />
                    Coming soon
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-card border border-border bg-card p-5 shadow-card md:p-7">
            <h2 className="text-xl">How ordering will work</h2>
            <ol className="mt-5 flex flex-col gap-5">
              {shopSteps.map((step, index) => (
                <li key={step.title} className="flex gap-3.5">
                  <span className="grid size-9 flex-none place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{step.title}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col justify-between gap-5 rounded-card border border-border bg-muted/40 p-5 md:p-7">
            <div>
              <span className="grid size-11 place-items-center rounded-[12px] bg-primary text-primary-foreground" aria-hidden>
                <i className="ri-truck-line text-xl" />
              </span>
              <h2 className="mt-4 text-xl">Built for the next release</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The page is ready for payments and delivery: product prices, quantities, an order summary and a delivery address block can be switched on without redesigning anything.
              </p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {["Secure checkout", "Courier delivery", "Bulk table packs"].map((tag) => (
                <li key={tag} className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                  {tag}
                </li>
              ))}
            </ul>
            <Link to="/support" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
              Tell us what you want printed
              <i className="ri-arrow-right-line" aria-hidden />
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}