import { useEffect, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import AppShell from "@/components/app/AppShell";
import { PageHead, Panel, Toast, Toggle, VegMark } from "@/components/app/Bits";
import MenuPreview from "@/components/app/MenuPreview";
import { menuPath } from "@/components/app/menuLink";
import { formatPrice, toPrice, useRestaurant } from "@/hooks/useRestaurant";
import type { MenuItem } from "@/mocks/restaurant";

const inputCls =
  "h-11 w-full rounded-btn border border-border bg-background px-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
const labelCls = "mb-1.5 block text-[12px] font-bold uppercase tracking-[.08em] text-muted-foreground";

type Draft = {
  name: string;
  price: string;
  description: string;
  photo: string;
  veg: boolean;
  available: boolean;
};

const emptyDraft: Draft = { name: "", price: "", description: "", photo: "", veg: true, available: true };

export default function MenuEditorPage() {
  const {
    restaurant,
    addCategory,
    renameCategory,
    removeCategory,
    moveCategory,
    addItem,
    updateItem,
    removeItem,
  } = useRestaurant();

  const [activeId, setActiveId] = useState(restaurant.categories[0]?.id ?? "");
  const [newCategory, setNewCategory] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const activeCategory = restaurant.categories.find((c) => c.id === activeId) ?? restaurant.categories[0];

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!draft) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDraft(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [draft]);

  const openAdd = () => {
    setEditingId(null);
    setError("");
    setDraft({ ...emptyDraft });
  };

  const openEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setError("");
    setDraft({
      name: item.name,
      price: String(item.price),
      description: item.description,
      photo: item.photo,
      veg: item.veg,
      available: item.available,
    });
  };

  const onPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !draft) return;
    if (file.size > 500 * 1024) {
      setError("Photo is too large — please use an image under 500 KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setDraft({ ...draft, photo: String(reader.result || "") });
    reader.readAsDataURL(file);
  };

  const saveDraft = () => {
    if (!draft || !activeCategory) return;
    if (!draft.name.trim()) {
      setError("Add a dish name first.");
      return;
    }
    const payload = {
      name: draft.name.trim(),
      price: toPrice(draft.price),
      description: draft.description.trim(),
      photo: draft.photo,
      veg: draft.veg,
      available: draft.available,
    };
    if (editingId) {
      updateItem(activeCategory.id, editingId, payload);
      setToast("Item updated");
    } else {
      addItem(activeCategory.id, payload);
      setToast("Item added");
    }
    setDraft(null);
    setEditingId(null);
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1240px] px-4 py-8 md:px-6 md:py-12">
        <PageHead
          eyebrow="My menu"
          title="Build your menu, item by item"
          description="Everything saves instantly. The preview on the right is exactly what guests see after scanning your QR code."
          actions={
            <>
              <Link
                to={menuPath(restaurant.slug)}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-btn border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                <i className="ri-eye-line" aria-hidden />
                Live menu
              </Link>
              <button
                type="button"
                onClick={openAdd}
                disabled={!activeCategory}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-btn bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                <i className="ri-add-line" aria-hidden />
                Add item
              </button>
            </>
          }
        />

        <div className="mt-7 grid gap-6 lg:grid-cols-[218px_minmax(0,1fr)] xl:grid-cols-[218px_minmax(0,1fr)_300px]">
          <aside>
            <Panel className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-[.1em] text-muted-foreground">Categories</h2>
                <span className="text-xs font-bold text-muted-foreground">{restaurant.categories.length}</span>
              </div>
              <ul className="mt-3 flex flex-col gap-1">
                {restaurant.categories.map((category, index) => {
                  const active = category.id === activeCategory?.id;
                  return (
                    <li key={category.id}>
                      <div
                        className={`flex items-center gap-1 rounded-btn px-2 py-1 ${
                          active ? "bg-primary/10" : "hover:bg-muted"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveId(category.id)}
                          className={`min-w-0 flex-1 truncate py-1.5 text-start text-sm font-semibold ${
                            active ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {category.name}
                        </button>
                        <span className="text-[10px] font-bold text-muted-foreground">{category.items.length}</span>
                        <div className="flex flex-none">
                          <button
                            type="button"
                            aria-label={`Move ${category.name} up`}
                            disabled={index === 0}
                            onClick={() => moveCategory(category.id, -1)}
                            className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-background disabled:opacity-25"
                          >
                            <i className="ri-arrow-up-s-line text-xs" aria-hidden />
                          </button>
                          <button
                            type="button"
                            aria-label={`Move ${category.name} down`}
                            disabled={index === restaurant.categories.length - 1}
                            onClick={() => moveCategory(category.id, 1)}
                            className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-background disabled:opacity-25"
                          >
                            <i className="ri-arrow-down-s-line text-xs" aria-hidden />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <form
                className="mt-3 border-t border-border pt-3"
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
                  placeholder="New category"
                  aria-label="New category name"
                  className="h-9 w-full rounded-btn border border-border bg-background px-2.5 text-[13px] font-medium focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-btn bg-foreground px-3 py-2 text-[13px] font-semibold text-background"
                >
                  <i className="ri-add-line" aria-hidden />
                  Add category
                </button>
              </form>
            </Panel>
          </aside>

          <section className="min-w-0">
            <Panel className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <input
                      aria-label="Selected category name"
                      value={activeCategory?.name ?? ""}
                      onChange={(e) => activeCategory && renameCategory(activeCategory.id, e.target.value)}
                      className="min-w-0 max-w-[240px] rounded-btn border border-transparent bg-transparent px-1 py-0.5 font-display text-lg font-bold hover:border-border focus:border-primary focus:outline-none"
                    />
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                      {activeCategory?.items.length ?? 0} items
                    </span>
                  </div>
                  <p className="mt-0.5 px-1 text-xs text-muted-foreground">Rename it right here, or move it with the arrows on the left.</p>
                </div>
                <div className="flex flex-none items-center gap-2">
                  <button
                    type="button"
                    onClick={openAdd}
                    disabled={!activeCategory}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-btn border border-border px-3 py-2 text-xs font-semibold hover:bg-muted disabled:opacity-50"
                  >
                    <i className="ri-add-line" aria-hidden />
                    Item
                  </button>
                  <button
                    type="button"
                    disabled={!activeCategory || restaurant.categories.length <= 1}
                    onClick={() => {
                      if (!activeCategory) return;
                      setActiveId(restaurant.categories.find((c) => c.id !== activeCategory.id)?.id ?? "");
                      removeCategory(activeCategory.id);
                      setToast("Category deleted");
                    }}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-btn border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                  >
                    <i className="ri-delete-bin-line" aria-hidden />
                    Category
                  </button>
                </div>
              </div>

              {activeCategory?.items.length ? (
                <ul className="divide-y divide-border">
                  {activeCategory.items.map((item) => (
                    <li key={item.id} className="flex flex-wrap items-center gap-3 px-4 py-3.5 md:px-5">
                      {item.photo ? (
                        <img src={item.photo} alt={item.name} className="size-14 flex-none rounded-xl border border-border object-cover" />
                      ) : (
                        <span className="grid size-14 flex-none place-items-center rounded-xl border border-dashed border-border bg-muted/50 text-muted-foreground" aria-hidden>
                          <i className="ri-image-line text-lg" />
                        </span>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <VegMark veg={item.veg} />
                          <h3 className="truncate text-[15px] font-bold">{item.name}</h3>
                          {!item.available ? (
                            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600">
                              Sold out
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{item.description || "No description yet"}</p>
                      </div>

                      <p className="w-16 flex-none text-end text-sm font-bold tabular-nums text-primary">{formatPrice(item.price)}</p>

                      <div className="flex flex-none items-center gap-2">
                        <div className="flex items-center gap-2 rounded-full border border-border px-2.5 py-1.5">
                          <span className="hidden text-[11px] font-semibold text-muted-foreground sm:inline">
                            {item.available ? "Available" : "Sold out"}
                          </span>
                          <Toggle
                            checked={item.available}
                            onChange={(next) => updateItem(activeCategory.id, item.id, { available: next })}
                            label={`Toggle availability for ${item.name}`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          aria-label={`Edit ${item.name}`}
                          className="grid size-9 place-items-center rounded-btn border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <i className="ri-edit-line" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            removeItem(activeCategory.id, item.id);
                            setToast("Item deleted");
                          }}
                          aria-label={`Delete ${item.name}`}
                          className="grid size-9 place-items-center rounded-btn border border-border text-muted-foreground hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <i className="ri-delete-bin-line" aria-hidden />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="grid place-items-center gap-3 px-6 py-16 text-center">
                  <span className="grid size-14 place-items-center rounded-full bg-muted text-muted-foreground" aria-hidden>
                    <i className="ri-restaurant-2-line text-2xl" />
                  </span>
                  <div>
                    <p className="font-semibold">{activeCategory ? "No dishes here yet" : "Create a category first"}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {activeCategory ? "Add your first dish and it appears on the menu instantly." : "Categories keep your menu tidy, like Starters or Drinks."}
                    </p>
                  </div>
                  {activeCategory ? (
                    <button type="button" onClick={openAdd} className="inline-flex items-center gap-2 rounded-btn bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                      <i className="ri-add-line" aria-hidden />
                      Add first item
                    </button>
                  ) : null}
                </div>
              )}
            </Panel>

            <div className="mt-4 flex items-start gap-2.5 rounded-card border border-border bg-muted/40 px-4 py-3 text-[13px] text-muted-foreground">
              <i className="ri-flashlight-line mt-0.5 text-primary" aria-hidden />
              <p>
                Mark a dish sold out instead of deleting it — the price, photo and description stay saved for tomorrow.
              </p>
            </div>
          </section>

          <aside className="hidden xl:block">
            <div className="sticky top-[86px]">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-[.1em] text-muted-foreground">Live preview</h2>
                <i className="ri-smartphone-line text-muted-foreground" aria-hidden />
              </div>
              <MenuPreview restaurant={restaurant} />
            </div>
          </aside>
        </div>
      </div>

      {draft ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-6">
          <button type="button" aria-label="Close" className="absolute inset-0 cursor-default" onClick={() => setDraft(null)} />
          <div className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-card border border-border bg-background p-5 shadow-lift sm:rounded-card md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl">{editingId ? "Edit item" : "Add item"}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">in {activeCategory?.name}</p>
              </div>
              <button type="button" onClick={() => setDraft(null)} aria-label="Close dialog" className="grid size-9 place-items-center rounded-btn hover:bg-muted">
                <i className="ri-close-line text-lg" aria-hidden />
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <div>
                <label htmlFor="item-name" className={labelCls}>
                  Dish name
                </label>
                <input
                  id="item-name"
                  autoFocus
                  className={inputCls}
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="e.g. Paneer Tikka"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <label htmlFor="item-price" className={labelCls}>
                    Price (₹)
                  </label>
                  <input
                    id="item-price"
                    inputMode="decimal"
                    className={inputCls}
                    value={draft.price}
                    onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                    placeholder="220"
                  />
                </div>
                <div>
                  <span className={labelCls}>Type</span>
                  <div className="flex h-11 items-center gap-1 rounded-btn border border-border bg-background p-1">
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, veg: true })}
                      className={`flex h-full items-center gap-1.5 whitespace-nowrap rounded-[8px] px-3 text-xs font-bold ${
                        draft.veg ? "bg-emerald-600 text-white" : "text-muted-foreground"
                      }`}
                    >
                      <span className="size-1.5 rounded-full bg-current" aria-hidden />
                      Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, veg: false })}
                      className={`flex h-full items-center gap-1.5 whitespace-nowrap rounded-[8px] px-3 text-xs font-bold ${
                        !draft.veg ? "bg-red-600 text-white" : "text-muted-foreground"
                      }`}
                    >
                      <span className="size-1.5 rounded-full bg-current" aria-hidden />
                      Non-veg
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="item-desc" className={labelCls}>
                  Short description
                </label>
                <textarea
                  id="item-desc"
                  rows={3}
                  maxLength={500}
                  className={`${inputCls} h-auto py-2.5`}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  placeholder="Char-grilled cottage cheese, mint chutney, pickled onion"
                />
              </div>

              <div>
                <span className={labelCls}>Photo (optional)</span>
                <div className="flex items-center gap-3">
                  {draft.photo ? (
                    <img src={draft.photo} alt="Dish preview" className="size-16 rounded-xl border border-border object-cover" />
                  ) : (
                    <span className="grid size-16 place-items-center rounded-xl border border-dashed border-border bg-muted/40 text-muted-foreground" aria-hidden>
                      <i className="ri-image-add-line text-xl" />
                    </span>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-btn border border-border bg-card px-3.5 py-2 text-sm font-semibold hover:bg-muted">
                      <i className="ri-upload-2-line" aria-hidden />
                      Upload
                      <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onPhoto} />
                    </label>
                    {draft.photo ? (
                      <button
                        type="button"
                        onClick={() => setDraft({ ...draft, photo: "" })}
                        className="whitespace-nowrap rounded-btn px-2 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-btn border border-border bg-muted/40 px-3.5 py-2.5">
                <div>
                  <p className="text-sm font-semibold">Available today</p>
                  <p className="text-xs text-muted-foreground">Turn off to show “Sold out” on the menu.</p>
                </div>
                <Toggle checked={draft.available} onChange={(next) => setDraft({ ...draft, available: next })} label="Available today" />
              </div>

              {error ? (
                <p className="flex items-center gap-2 rounded-btn bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                  <i className="ri-error-warning-line" aria-hidden />
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setDraft(null)} className="h-11 whitespace-nowrap rounded-btn border border-border px-4 text-sm font-semibold hover:bg-muted">
                  Cancel
                </button>
                <button type="button" onClick={saveDraft} className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-btn bg-primary px-5 text-sm font-semibold text-primary-foreground">
                  <i className="ri-check-line" aria-hidden />
                  {editingId ? "Save changes" : "Add to menu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <Toast message={toast} />
    </AppShell>
  );
}