import { useEffect, useRef } from "react";
import { cn } from "./ui";

/* 导航区的小特效：
   1. NavCanvas —— 一张贴着导航条跑的 canvas 点阵，绿色光带从左往右循环扫过，像在「扫」一行二维码；
   2. MiniQr    —— logo 里那颗迷你二维码，模块按顺序亮灭，形成 QR loop。
   两个都尊重系统的「减少动态效果」：开了就直接画一帧静态的。 */

type RGB = number[];

function readPrimary(el: HTMLElement): RGB {
  const raw = getComputedStyle(el).getPropertyValue("--f-primary").trim();
  const parts = raw.split(/[\s,]+/).map(Number).filter((n) => Number.isFinite(n));
  return parts.length >= 3 ? parts.slice(0, 3) : [31, 91, 65];
}

export function NavCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let rgb: RGB = readPrimary(canvas);
    let frame = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rgb = readPrimary(canvas);
    };

    const dot = 14;
    const draw = (time: number) => {
      const [r, g, b] = rgb;
      ctx.clearRect(0, 0, width, height);

      // 从左到右循环的扫描光带（-0.25 → 1.25，头尾各留一点空白让循环不突兀）
      const cycle = (time % 5200) / 5200;
      const beamX = -0.25 + cycle * 1.5;
      const beam = beamX * width;

      for (let x = dot / 2; x < width; x += dot) {
        for (let y = dot / 2; y < height; y += dot) {
          const dist = Math.abs(x - beam);
          const near = Math.max(0, 1 - dist / 90);
          const wave = 0.5 + 0.5 * Math.sin(time / 900 + (x + y) / 46);
          const alpha = 0.05 + near * 0.5 + wave * 0.045;
          const size = 1 + near * 1.3;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 光带本身：一条很淡的竖向渐变
      const grad = ctx.createLinearGradient(beam - 40, 0, beam + 40, 0);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
      grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.16)`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(beam - 40, 0, 80, height);

      if (!reduce) frame = requestAnimationFrame(draw);
    };

    resize();
    if (reduce) {
      draw(0);
    } else {
      frame = requestAnimationFrame(draw);
    }

    const onResize = () => {
      resize();
      if (reduce) draw(0);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 size-full", className)} />;
}

// 5×5 的迷你二维码图案（三个角是定位块，中间留空）
const MINI = [
  "11101",
  "10111",
  "11100",
  "01011",
  "11011",
];

export function MiniQr({ className }: { className?: string }) {
  return (
    <span className={cn("relative grid size-full grid-cols-5 grid-rows-5 gap-[1px] p-[1px]", className)} aria-hidden>
      {MINI.flatMap((row, y) =>
        row.split("").map((cell, x) => {
          if (cell !== "1") return null;
          const corner = (x < 2 && y < 2) || (x > 2 && y < 2) || (x < 2 && y > 2);
          return (
            <span
              key={`${x}-${y}`}
              className="mini-qr-cell rounded-[1px] bg-current"
              style={{
                gridColumn: x + 1,
                gridRow: y + 1,
                animationDelay: `${((x * 5 + y) % 9) * 0.32}s`,
                opacity: corner ? 1 : undefined,
              }}
            />
          );
        }),
      )}
    </span>
  );
}