export type CreateStep = { id: number; label: string; hint: string };

export const CREATE_STEPS: CreateStep[] = [
  { id: 1, label: "Your name", hint: "Restaurant name & link" },
  { id: 2, label: "Your design", hint: "Colour, shape, logo" },
  { id: 3, label: "Your QR code", hint: "Download & print" },
];

export default function CreateStepper({
  current,
  onJump,
}: {
  current: number;
  onJump: (step: number) => void;
}) {
  return (
    <ol className="mt-6 grid gap-2 sm:grid-cols-3 sm:gap-3">
      {CREATE_STEPS.map((step) => {
        const done = step.id < current;
        const active = step.id === current;
        const locked = step.id > current;
        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => onJump(step.id)}
              disabled={locked}
              aria-current={active ? "step" : undefined}
              className={`flex w-full items-center gap-3 rounded-card border px-3.5 py-3 text-left transition-colors ${
                active
                  ? "border-primary bg-primary/10"
                  : done
                    ? "border-border bg-card hover:border-primary/40"
                    : "border-dashed border-border bg-muted/30"
              } ${locked ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
            >
              <span
                className={`grid size-8 flex-none place-items-center rounded-full text-[12px] font-bold ${
                  done || active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
                aria-hidden
              >
                {done ? <i className="ri-check-line text-base" /> : `0${step.id}`}
              </span>
              <span className="min-w-0">
                <span className={`block truncate text-[13.5px] font-bold ${active ? "text-primary" : ""}`}>{step.label}</span>
                <span className="block truncate text-[11.5px] text-muted-foreground">{step.hint}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}