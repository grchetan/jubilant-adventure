import type { QrShape } from "@/components/app/qrEngine";

export const QR_COLORS = [
  { name: "Forest", value: "#1F5B41" },
  { name: "Ink", value: "#1C1917" },
  { name: "Coffee", value: "#7C2D12" },
  { name: "Crimson", value: "#9F1239" },
  { name: "Olive", value: "#4D7C0F" },
  { name: "Burnt orange", value: "#C2410C" },
];

export const QR_BACKGROUNDS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Cream", value: "#FFFBF3" },
  { name: "Stone", value: "#F5F5F4" },
];

export const QR_SHAPES: { id: QrShape; label: string; preview: string }[] = [
  { id: "square", label: "Square", preview: "rounded-none" },
  { id: "rounded", label: "Rounded", preview: "rounded-[5px]" },
  { id: "dots", label: "Dots", preview: "rounded-full" },
];

type Props = {
  color: string;
  background: string;
  shape: QrShape;
  showLogo: boolean;
  hasLogo: boolean;
  onColor: (value: string) => void;
  onBackground: (value: string) => void;
  onShape: (value: QrShape) => void;
  onShowLogo: (value: boolean) => void;
};

const LABEL = "text-[12px] font-bold uppercase tracking-[.08em] text-muted-foreground";

export default function QrDesign({
  color,
  background,
  shape,
  showLogo,
  hasLogo,
  onColor,
  onBackground,
  onShape,
  onShowLogo,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className={LABEL}>QR colour</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {QR_COLORS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onColor(option.value)}
              aria-label={option.name}
              aria-pressed={color === option.value}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                color === option.value ? "border-foreground bg-foreground/5" : "border-border hover:bg-muted"
              }`}
            >
              <span className="size-4 rounded-full border border-black/10" style={{ backgroundColor: option.value }} aria-hidden />
              {option.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={LABEL}>Background</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {QR_BACKGROUNDS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onBackground(option.value)}
              aria-label={option.name}
              aria-pressed={background === option.value}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                background === option.value ? "border-foreground bg-foreground/5" : "border-border hover:bg-muted"
              }`}
            >
              <span className="size-4 rounded-full border border-black/10" style={{ backgroundColor: option.value }} aria-hidden />
              {option.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={LABEL}>Corner style</p>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {QR_SHAPES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onShape(option.id)}
              aria-pressed={shape === option.id}
              className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-card border px-2 py-3 text-xs font-bold transition-colors ${
                shape === option.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              <span className={`size-4 border-2 border-current ${option.preview}`} aria-hidden />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-btn border border-border bg-muted/40 px-3.5 py-3">
        <div>
          <p className="text-sm font-semibold">Logo in the centre</p>
          <p className="text-xs text-muted-foreground">
            {hasLogo ? "Using your uploaded logo." : "No logo uploaded — your initials are used."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={showLogo}
          aria-label="Show logo in the centre"
          onClick={() => onShowLogo(!showLogo)}
          className={`relative h-6 w-11 flex-none cursor-pointer rounded-full border transition-colors ${
            showLogo ? "border-primary bg-primary" : "border-border bg-background"
          }`}
        >
          <span
            className={`absolute top-0.5 size-[18px] rounded-full bg-white shadow-sm transition-all ${
              showLogo ? "left-[calc(100%-20px)]" : "left-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}