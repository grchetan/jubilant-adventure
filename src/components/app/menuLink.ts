/** 公共菜单的站内路径（router 用） */
export const menuPath = (slug: string) => `/menu/${slug || "my-restaurant"}`;

/** 公共菜单的完整可扫链接（二维码 / 复制链接用），带上了部署的 base path */
export const menuUrl = (slug: string) => {
  const base = typeof __BASE_PATH__ === "string" ? __BASE_PATH__.replace(/\/$/, "") : "";
  const origin = typeof window === "undefined" ? "https://scandish.app" : window.location.origin;
  return `${origin}${base}${menuPath(slug)}`;
};