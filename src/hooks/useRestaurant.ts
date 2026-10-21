import { useCallback, useEffect, useMemo, useState } from "react";
import { defaultRestaurant, type Category, type MenuItem, type Restaurant } from "@/mocks/restaurant";

const STORAGE_KEY = "scandish.restaurant.v1";

const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const readStore = (): Restaurant => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultRestaurant;
    const parsed = JSON.parse(raw) as Partial<Restaurant>;
    return {
      ...defaultRestaurant,
      ...parsed,
      categories: Array.isArray(parsed.categories) && parsed.categories.length ? (parsed.categories as Category[]) : defaultRestaurant.categories,
    };
  } catch {
    return defaultRestaurant;
  }
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40) || "my-restaurant";

export const toPrice = (value: string) => {
  const digits = value.replace(/[^\d.]/g, "");
  const num = Number.parseFloat(digits);
  return Number.isFinite(num) ? Math.round(num * 100) / 100 : 0;
};

export const formatPrice = (value: number) => `₹${new Intl.NumberFormat("en-IN").format(value)}`;

export function useRestaurant() {
  const [restaurant, setRestaurant] = useState<Restaurant>(() => readStore());
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurant));
      setSavedAt(Date.now());
    } catch {
      setSavedAt(null);
    }
  }, [restaurant]);

  const updateProfile = useCallback((patch: Partial<Restaurant>) => {
    setRestaurant((prev) => ({ ...prev, ...patch }));
  }, []);

  const addCategory = useCallback((name: string) => {
    const clean = name.trim();
    if (!clean) return;
    setRestaurant((prev) => ({
      ...prev,
      categories: [...prev.categories, { id: newId("cat"), name: clean, items: [] }],
    }));
  }, []);

  const renameCategory = useCallback((id: string, name: string) => {
    const clean = name.trim();
    if (!clean) return;
    setRestaurant((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, name: clean } : c)),
    }));
  }, []);

  const removeCategory = useCallback((id: string) => {
    setRestaurant((prev) => ({ ...prev, categories: prev.categories.filter((c) => c.id !== id) }));
  }, []);

  const moveCategory = useCallback((id: string, direction: -1 | 1) => {
    setRestaurant((prev) => {
      const index = prev.categories.findIndex((c) => c.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= prev.categories.length) return prev;
      const next = [...prev.categories];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, categories: next };
    });
  }, []);

  const addItem = useCallback((categoryId: string, item: Omit<MenuItem, "id">) => {
    setRestaurant((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === categoryId ? { ...c, items: [...c.items, { ...item, id: newId("item") }] } : c,
      ),
    }));
  }, []);

  const updateItem = useCallback((categoryId: string, itemId: string, patch: Partial<MenuItem>) => {
    setRestaurant((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === categoryId
          ? { ...c, items: c.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)) }
          : c,
      ),
    }));
  }, []);

  const removeItem = useCallback((categoryId: string, itemId: string) => {
    setRestaurant((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === categoryId ? { ...c, items: c.items.filter((it) => it.id !== itemId) } : c,
      ),
    }));
  }, []);

  const resetAll = useCallback(() => setRestaurant(defaultRestaurant), []);

  const stats = useMemo(() => {
    const items = restaurant.categories.flatMap((c) => c.items);
    return {
      categories: restaurant.categories.length,
      items: items.length,
      hidden: items.filter((i) => !i.available).length,
      photos: items.filter((i) => Boolean(i.photo)).length,
    };
  }, [restaurant]);

  return {
    restaurant,
    stats,
    savedAt,
    updateProfile,
    addCategory,
    renameCategory,
    removeCategory,
    moveCategory,
    addItem,
    updateItem,
    removeItem,
    resetAll,
  };
}