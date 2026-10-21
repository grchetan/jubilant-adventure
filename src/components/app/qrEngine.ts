import { create } from "qrcode";

/* 真二维码生成：用 qrcode 算出模块矩阵，再自己拼 SVG —— 这样颜色、圆角风格、中心 logo 全部可控，
   下载的 PNG / SVG 和屏幕上的预览是同一份图形。中心留白控制在 24% 以内，配合最高级纠错，扫码依然稳定。 */

export type QrShape = "square" | "rounded" | "dots";

export type QrConfig = {
  value: string;
  color: string;
  background: string;
  shape: QrShape;
  logo: string;
  initials: string;
  showLogo: boolean;
};

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** 生成 SVG 源码。value 为空或编码失败时返回空串，调用方显示占位。 */
export function buildQrSvg(cfg: QrConfig): string {
  let count = 0;
  let modules: any = new Uint8Array(0);
  try {
    const qr = create(cfg.value || "https://scandish.app", { errorCorrectionLevel: "H" });
    count = qr.modules.size;
    modules = qr.modules.data;
  } catch {
    return "";
  }
  if (!count) return "";

  const color = cfg.color;
  const background = cfg.background;
  const margin = 4;
  const total = count + margin * 2;
  const logoModules = cfg.showLogo ? Math.max(5, Math.round(count * 0.24)) : 0;
  const logoStart = Math.floor((count - logoModules) / 2);
  const logoEnd = logoStart + logoModules;

  const inFinder = (row: number, col: number) =>
    (row < 7 && col < 7) || (row < 7 && col >= count - 7) || (row >= count - 7 && col < 7);
  const inLogo = (row: number, col: number) =>
    logoModules > 0 && row >= logoStart && row < logoEnd && col >= logoStart && col < logoEnd;

  const shapes: string[] = [];
  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (!modules[row * count + col] || inFinder(row, col) || inLogo(row, col)) continue;
      const x = col + margin;
      const y = row + margin;
      if (cfg.shape === "dots") {
        shapes.push(`<circle cx="${x + 0.5}" cy="${y + 0.5}" r="0.46" fill="${color}"/>`);
      } else if (cfg.shape === "rounded") {
        shapes.push(`<rect x="${x + 0.07}" y="${y + 0.07}" width="0.86" height="0.86" rx="0.3" fill="${color}"/>`);
      } else {
        shapes.push(`<rect x="${x}" y="${y}" width="1.01" height="1.01" fill="${color}"/>`);
      }
    }
  }

  const eye = (originCol: number, originRow: number) => {
    const ox = originCol + margin;
    const oy = originRow + margin;
    const cx = ox + 3.5;
    const cy = oy + 3.5;
    const outer =
      cfg.shape === "dots"
        ? `<circle cx="${cx}" cy="${cy}" r="3" fill="none" stroke="${color}" stroke-width="1"/>`
        : `<rect x="${ox + 0.5}" y="${oy + 0.5}" width="6" height="6" rx="${cfg.shape === "rounded" ? 1.8 : 0}" fill="none" stroke="${color}" stroke-width="1"/>`;
    const radius = cfg.shape === "dots" ? 1.5 : cfg.shape === "rounded" ? 1.1 : 0;
    const core = `<rect x="${ox + 2}" y="${oy + 2}" width="3" height="3" rx="${radius}" fill="${color}"/>`;
    return outer + core;
  };

  const center = margin + count / 2;
  let logoBox = "";
  const defs: string[] = [];
  if (cfg.showLogo) {
    const box = logoModules;
    const bx = center - box / 2;
    const by = center - box / 2;
    logoBox += `<rect x="${bx - 0.45}" y="${by - 0.45}" width="${box + 0.9}" height="${box + 0.9}" rx="${box * 0.24}" fill="${background}"/>`;
    if (cfg.logo) {
      const inner = Math.max(box - 1.2, 1);
      const ix = bx + (box - inner) / 2;
      const iy = by + (box - inner) / 2;
      defs.push(
        `<clipPath id="qr-logo-clip"><rect x="${ix}" y="${iy}" width="${inner}" height="${inner}" rx="${inner * 0.2}"/></clipPath>`,
      );
      logoBox += `<image href="${esc(cfg.logo)}" x="${ix}" y="${iy}" width="${inner}" height="${inner}" preserveAspectRatio="xMidYMid slice" clip-path="url(#qr-logo-clip)"/>`;
    } else {
      logoBox += `<rect x="${bx}" y="${by}" width="${box}" height="${box}" rx="${box * 0.24}" fill="${color}"/>`;
      logoBox += `<text x="${center}" y="${center + box * 0.02}" text-anchor="middle" dominant-baseline="middle" font-family="Nunito, system-ui, sans-serif" font-size="${box * 0.4}" font-weight="800" fill="${background}">${esc(cfg.initials || "SD")}</text>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${total} ${total}" width="1024" height="1024" role="img" aria-label="Menu QR code"><rect width="${total}" height="${total}" fill="${background}"/>${defs.length ? `<defs>${defs.join("")}</defs>` : ""}${shapes.join("")}${eye(0, 0)}${eye(count - 7, 0)}${eye(0, count - 7)}${logoBox}</svg>`;
}

/** 预览用：直接把 SVG 源码塞进 img 的 data URI，不往 DOM 里注入 HTML。 */
export const svgToDataUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
};

export function downloadQrSvg(svg: string, filename: string) {
  triggerDownload(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), filename);
}

/** SVG → PNG（1024px），失败返回 false，由页面提示「换个格式试试」。 */
export async function downloadQrPng(svg: string, filename: string, size = 1024): Promise<boolean> {
  if (!svg) return false;
  try {
    const blobUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    const image = new Image();
    image.decoding = "sync";
    const loaded = await new Promise<boolean>((resolve) => {
      image.onload = () => resolve(true);
      image.onerror = () => resolve(false);
      image.src = blobUrl;
    });
    URL.revokeObjectURL(blobUrl);
    if (!loaded) return false;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;
    ctx.drawImage(image, 0, 0, size, size);
    const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!png) return false;
    triggerDownload(png, filename);
    return true;
  } catch {
    return false;
  }
}