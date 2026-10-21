import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import AppShell from "@/components/app/AppShell";
import { PageHead, Panel, Toast } from "@/components/app/Bits";
import MenuPreview from "@/components/app/MenuPreview";
import MenuCompleteness from "@/pages/dashboard/components/MenuCompleteness";
import { menuPath, menuUrl } from "@/components/app/menuLink";
import { slugify, useRestaurant } from "@/hooks/useRestaurant";

const inputCls =
  "h-11 w-full rounded-btn border border-border bg-background px-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
const labelCls = "mb-1.5 block text-[12px] font-bold uppercase tracking-[.08em] text-muted-foreground";

const quickActions = [
  {
    href: "/dashboard/menu",
    icon: "ri-file-list-3-line",
    title: "Edit menu",
    text: "Add dishes, prices and sold-out toggles",
  },
  {
    href: "/dashboard/qr",
    icon: "ri-qr-code-line",
    title: "Get QR code",
    text: "Colours, logo in the centre, PNG & SVG",
  },
  {
    href: "/shop",
    icon: "ri-store-3-line",
    title: "Order print",
    text: "Table stands, posters and stickers",
  },
];

export default function DashboardPage() {
  const {
    restaurant,
    stats,
    savedAt,
    updateProfile,
    addCategory,
    renameCategory,
    removeCategory,
    moveCategory,
  } = useRestaurant();
  const [toast, setToast] = useState("");
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const copyLink = useCallback(async () => {
    const link = menuUrl(restaurant.slug);
    try {
      await navigator.clipboard.writeText(link);
      setToast("Menu link copied");
    } catch {
      setToast(link);
    }
  }, [restaurant.slug]);

  const onLogo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 600 * 1024) {
      setToast("Logo is too large — please use an image under 600 KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ logo: String(reader.result || "") });
      setToast("Logo updated");
    };
    reader.readAsDataURL(file);
  };

  const statsList = [
    { label: "Menu items", value: stats.items, icon: "ri-restaurant-2-line", hint: "live" },
    { label: "Categories", value: stats.categories, icon: "ri-list-check-2", hint: "live" },
    { label: "Marked sold out", value: stats.hidden, icon: "ri-eye-off-line", hint: "today" },
    { label: "QR scans", value: 2480, icon: "ri-qr-scan-line", hint: "this week" },
  ];

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1240px] px-4 py-8 md:px-6 md:py-12">
        <PageHead
          eyebrow="Dashboard"
          title={`Namaste, ${restaurant.name || "your restaurant"}`}
          description="Your menu, your QR code and your print products — all in one place. Nothing to pay, ever."
          actions={
            <>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-btn border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
              >
                <i className="ri-link" aria-hidden />
                Copy menu link
              </button>
              <Link
                to={menuPath(restaurant.slug)}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-btn bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                <i className="ri-eye-line" aria-hidden />
                View live menu
              </Link>
            </>
          }
        />

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-card border border-border bg-muted/40 px-4 py-3">
          <span className="relative flex size-2.5 items-center justify-center">
            <span className="app-ping absolute inset-0 rounded-full" aria-hidden />
            <span className="relative size-2.5 rounded-full bg-primary" aria-hidden />
          </span>
          <p className="text-sm font-semibold">Instant updates are on</p>
          <span className="h-4 w-px bg-border" aria-hidden />
          <p className="text-sm text-muted-foreground">
            {savedAt ? "Saved a second ago · " : ""}
            changes appear on every table the next time a guest scans.
          </p>
          <code className="ms-auto hidden max-w-full truncate rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground md:block">
            {menuUrl(restaurant.slug)}
          </code>
        </div>

        <section
          aria-labelledby="quick-start-title"
          className="app-fade-up relative mt-6 overflow-hidden rounded-card border border-primary/25 bg-primary/[0.06] p-5 md:p-6"
        >
          <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-primary/15 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 size-48 rounded-full bg-primary/10 blur-3xl" aria-hidden />

          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="relative grid size-12 flex-none place-items-center rounded-[14px] bg-primary text-primary-foreground md:size-14" aria-hidden>
                <i className="ri-qr-code-line text-xl md:text-2xl" />
                <span className="app-ping absolute -right-1 -top-1 size-3 rounded-full bg-primary" />
              </span>

              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[.18em] text-primary">
                  <span className="relative flex size-1.5" aria-hidden>
                    <span className="app-ping absolute inset-0 rounded-full bg-primary" />
                    <span className="relative size-1.5 rounded-full bg-primary" />
                  </span>
                  Quick start
                </span>
                <h2 id="quick-start-title" className="font-display mt-2 text-xl font-bold leading-tight md:text-2xl">
                  Make your menu QR in 2 minutes
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  No card, no sign-up, nothing to install. Type the name, pick a look, download the code.
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {["Add your name", "Pick a design", "Download & print"].map((label, index) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-2.5 py-1 text-[11.5px] font-semibold text-foreground/80"
                    >
                      <span className="grid size-4 place-items-center rounded-full bg-primary/12 text-[9px] font-bold text-primary" aria-hidden>
                        {index + 1}
                      </span>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-none flex-col gap-2 sm:flex-row md:flex-col">
              <Link
                to="/create"
                className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Create now
                <i className="ri-arrow-right-line transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <Link
                to="/how-to-use"
                className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-btn border border-border bg-background px-4 py-2.5 text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                <i className="ri-question-line" aria-hidden />
                How to use
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statsList.map((stat, index) => (
            <div
              key={stat.label}
              className="app-fade-up rounded-card border border-border bg-card p-4 shadow-card md:p-5"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="grid size-9 place-items-center rounded-[10px] bg-primary/10 text-primary" aria-hidden>
                  <i className={`${stat.icon} text-base`} />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[.1em] text-muted-foreground">{stat.hint}</span>
              </div>
              <p className="font-display mt-3 text-2xl font-bold tabular-nums md:text-3xl">
                {new Intl.NumberFormat("en-IN").format(stat.value)}
              </p>
              <p className="mt-0.5 text-[13px] font-semibold text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <MenuCompleteness restaurant={restaurant} />

            <Panel className="p-5 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl">Restaurant setup</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Saved as you type — no save button needed.</p>
                </div>
                <span className="inline-flex flex-none items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                  <i className="ri-checkbox-circle-fill" aria-hidden />
                  Live
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-4 rounded-card border border-dashed border-border bg-muted/30 p-4 sm:flex-row sm:items-center">
                {restaurant.logo ? (
                  <img
                    src={restaurant.logo}
                    alt={`${restaurant.name} logo`}
                    className="size-16 flex-none rounded-full border border-border object-cover"
                  />
                ) : (
                  <span className="grid size-16 flex-none place-items-center rounded-full bg-primary/10 text-lg font-bold text-primary" aria-hidden>
                    {(restaurant.name || "SD").slice(0, 2).toUpperCase()}
                  </span>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-btn border border-border bg-card px-3.5 py-2 text-sm font-semibold hover:bg-muted">
                    <i className="ri-upload-2-line" aria-hidden />
                    Upload logo
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onLogo} />
                  </label>
                  {restaurant.logo ? (
                    <button
                      type="button"
                      onClick={() => updateProfile({ logo: "" })}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-btn px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                    >
                      <i className="ri-delete-bin-line" aria-hidden />
                      Remove
                    </button>
                  ) : null}
                  <p className="w-full text-xs text-muted-foreground sm:w-auto">Square PNG works best. This logo also sits in the centre of your QR code.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="rest-name" className={labelCls}>
                    Restaurant name
                  </label>
                  <input
                    id="rest-name"
                    className={inputCls}
                    value={restaurant.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    placeholder="e.g. Cafe Mocha"
                  />
                </div>
                <div>
                  <label htmlFor="rest-slug" className={labelCls}>
                    Menu link
                  </label>
                  <div className="flex items-center rounded-btn border border-border bg-background pl-3 focus-within:border-primary">
                    <span className="whitespace-nowrap text-[12px] font-medium text-muted-foreground">/menu/</span>
                    <input
                      id="rest-slug"
                      className="h-11 w-full bg-transparent px-1 text-sm font-medium focus:outline-none"
                      value={restaurant.slug}
                      onChange={(e) => updateProfile({ slug: slugify(e.target.value) })}
                      placeholder="cafe-mocha"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="rest-phone" className={labelCls}>
                    Phone (shown on menu)
                  </label>
                  <input
                    id="rest-phone"
                    className={inputCls}
                    value={restaurant.phone}
                    onChange={(e) => updateProfile({ phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label htmlFor="rest-wa" className={labelCls}>
                    WhatsApp number
                  </label>
                  <input
                    id="rest-wa"
                    className={inputCls}
                    value={restaurant.whatsapp}
                    onChange={(e) => updateProfile({ whatsapp: e.target.value.replace(/[^\d]/g, "") })}
                    placeholder="919876543210"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="rest-address" className={labelCls}>
                    Address
                  </label>
                  <input
                    id="rest-address"
                    className={inputCls}
                    value={restaurant.address}
                    onChange={(e) => updateProfile({ address: e.target.value })}
                    placeholder="Street, area, city"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="rest-hours" className={labelCls}>
                    Opening hours <span className="font-medium normal-case tracking-normal text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    id="rest-hours"
                    className={inputCls}
                    value={restaurant.hours}
                    onChange={(e) => updateProfile({ hours: e.target.value })}
                    placeholder="Open daily · 9:00 AM – 11:00 PM"
                  />
                </div>
              </div>
            </Panel>

            <Panel className="p-5 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl">Menu categories</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Add, rename, reorder or delete categories.</p>
                </div>
                <Link to="/dashboard/menu" className="whitespace-nowrap text-sm font-bold text-primary hover:underline">
                  Open editor
                </Link>
              </div>

              <ul className="mt-4 divide-y divide-border">
                {restaurant.categories.map((category, index) => (
                  <li key={category.id} className="flex items-center gap-2 py-2.5">
                    <span className="grid size-7 flex-none place-items-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <input
                      aria-label={`Category ${index + 1} name`}
                      value={category.name}
                      onChange={(e) => renameCategory(category.id, e.target.value)}
                      className="min-w-0 flex-1 rounded-btn border border-transparent bg-transparent px-2 py-1.5 text-sm font-semibold hover:border-border focus:border-primary focus:outline-none"
                    />
                    <span className="hidden whitespace-nowrap text-xs text-muted-foreground sm:block">{category.items.length} items</span>
                    <button
                      type="button"
                      aria-label="Move up"
                      disabled={index === 0}
                      onClick={() => moveCategory(category.id, -1)}
                      className="grid size-8 place-items-center rounded-btn text-muted-foreground hover:bg-muted disabled:opacity-30"
                    >
                      <i className="ri-arrow-up-line" aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label="Move down"
                      disabled={index === restaurant.categories.length - 1}
                      onClick={() => moveCategory(category.id, 1)}
                      className="grid size-8 place-items-center rounded-btn text-muted-foreground hover:bg-muted disabled:opacity-30"
                    >
                      <i className="ri-arrow-down-line" aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${category.name}`}
                      onClick={() => {
                        removeCategory(category.id);
                        setToast(`${category.name} deleted`);
                      }}
                      className="grid size-8 place-items-center rounded-btn text-muted-foreground hover:bg-red-50 hover:text-red-600"
                    >
                      <i className="ri-delete-bin-line" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>

              <form
                className="mt-4 flex flex-col gap-2 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCategory.trim()) return;
                  addCategory(newCategory);
                  setNewCategory("");
                  setToast("Category added");
                }}
              >
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category, e.g. Desserts"
                  className={inputCls}
                  aria-label="New category name"
                />
                <button type="submit" className="inline-flex h-11 flex-none items-center justify-center gap-2 whitespace-nowrap rounded-btn bg-foreground px-4 text-sm font-semibold text-background">
                  <i className="ri-add-line" aria-hidden />
                  Add category
                </button>
              </form>
            </Panel>
          </div>

          <div className="flex flex-col gap-6">
            <div className="lg:sticky lg:top-[86px]">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg">Live preview</h2>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <i className="ri-smartphone-line text-sm" aria-hidden />
                  what guests see
                </span>
              </div>
              <MenuPreview restaurant={restaurant} />

              <div className="mt-4 grid gap-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    to={action.href}
                    className="group flex items-center gap-3 rounded-card border border-border bg-card p-3.5 shadow-card transition-colors hover:border-primary/40"
                  >
                    <span className="grid size-10 flex-none place-items-center rounded-[11px] bg-primary/10 text-primary" aria-hidden>
                      <i className={`${action.icon} text-lg`} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold">{action.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{action.text}</span>
                    </span>
                    <i className="ri-arrow-right-up-line text-muted-foreground transition-transform group-hover:-translate-y-0.5" aria-hidden />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toast message={toast} />
    </AppShell>
  );
}