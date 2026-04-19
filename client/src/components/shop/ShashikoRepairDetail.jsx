import { useMemo, useState } from "react";

function formatDamageType(damageType) {
  switch (damageType) {
    case "threadbare":
      return "Threadbare surface";
    case "smallHole":
      return "Small hole";
    case "tear":
      return "Tear (edge opening)";
    case "stain":
      return "Stain + thinning";
    default:
      return "Wear";
  }
}

function buildPatternLines({ crossSize }) {
  // Simple crosshatch (two diagonal sets) for an editorial “repair plan” feel.
  // Returns SVG paths in a normalized 0..220 viewBox space.
  const pad = 18;
  const size = 184; // 220 - pad*2
  const n = Math.max(6, Math.floor(crossSize));

  const lines = [];

  // \ direction
  for (let k = -n; k <= n; k++) {
    const x1 = pad + (k * size) / (2 * n);
    const y1 = pad;
    const x2 = pad + (k * size) / (2 * n) + size;
    const y2 = pad + size;
    lines.push(
      <path
        key={`d1-${k}`}
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        stroke="rgba(17,24,39,0.25)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    );
  }

  // / direction
  for (let k = -n; k <= n; k++) {
    const x1 = pad + (k * size) / (2 * n) + size;
    const y1 = pad;
    const x2 = pad + (k * size) / (2 * n);
    const y2 = pad + size;
    lines.push(
      <path
        key={`d2-${k}`}
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        stroke="rgba(17,24,39,0.25)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    );
  }

  return lines;
}

export default function ShashikoRepairDetail({ product }) {
  const [damageType, setDamageType] = useState("threadbare");
  const [damageSize, setDamageSize] = useState("small");

  const prefilled = useMemo(() => {
    const text = `${product?.conditionText ?? ""} ${product?.sashikoNotes ?? ""}`.toLowerCase();

    if (text.includes("tear")) return "tear";
    if (text.includes("hole")) return "smallHole";
    if (text.includes("stain")) return "stain";
    return null;
  }, [product]);

  const [damageTypeTouched, setDamageTypeTouched] = useState(false);
  const selectedDamageType = !damageTypeTouched && prefilled ? prefilled : damageType;

  const plan = useMemo(() => {
    const sizePreset = (() => {
      switch (damageSize) {
        case "large":
          return { crossSize: 10, gridMm: 12, rows: 10, stitches: 140 };
        case "medium":
          return { crossSize: 8, gridMm: 10, rows: 8, stitches: 100 };
        case "small":
        default:
          return { crossSize: 6, gridMm: 9, rows: 6, stitches: 70 };
      }
    })();

    const stitchNotes = (() => {
      switch (selectedDamageType) {
        case "tear":
          return [
            "Stitch through both sides of the tear to “bridge” the opening.",
            "Start 1–2 cm before the stress point, and finish past the edge.",
            "Keep tension even: the wool should relax, not pucker.",
          ];
        case "smallHole":
          return [
            "Create a stable base with perimeter stitches before crosshatching.",
            "Work in concentric zones: tighten the center last.",
            "Reinforce the thinned backing so the hole doesn’t widen.",
          ];
        case "stain":
          return [
            "Treat the stain as thinning: reinforce before aesthetics.",
            "Keep the grid slightly larger than the affected area.",
            "Use a dense crosshatch so wear stops spreading.",
          ];
        case "threadbare":
        default:
          return [
            "Reinforce the high-wear zone with a gentle crosshatch.",
            "Blend stitches so the fabric lies flat.",
            "Aim for coverage first; tighten only if the area still flexes.",
          ];
      }
    })();

    const colorNote = (() => {
      // Freestyle, but tailored for denim/wool vibes.
      switch (selectedDamageType) {
        case "stain":
          return "Thread suggestion: near-wool neutral (off-white/ivory) to visually settle the stain.";
        case "tear":
          return "Thread suggestion: slightly darker than the face for structure (or match for invisibility).";
        case "smallHole":
          return "Thread suggestion: match the body color to let the repair read as “part of the story”.";
        case "threadbare":
        default:
          return "Thread suggestion: off-white/cream for classic sashiko contrast (or match if you prefer subtlety).";
      }
    })();

    return {
      ...sizePreset,
      label: `${formatDamageType(selectedDamageType)} · ${damageSize}`,
      stitchLengthMm: damageSize === "large" ? 3 : 2,
      spacingMm: damageSize === "large" ? 4 : 3,
      stitchesEstimate: sizePreset.stitches,
      stitchNotes,
      colorNote,
    };
  }, [damageSize, selectedDamageType]);

  return (
    <section className="space-y-6 border-t border-[var(--line)] pt-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">Shop Feature</p>
          <h2
            className="mt-2 text-3xl text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Sashiko Detail Planner
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            A guided repair plan for wool wear—use it as an editorial blueprint, then adapt to your fabric.
          </p>
        </div>
        <div className="hidden max-w-[22rem] rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 lg:block">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Notes from this piece</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--ink)]">
            {product?.sashikoNotes
              ? product.sashikoNotes
              : "No repair notes yet. The planner below still helps you choose spacing and coverage."}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 border border-[var(--line)] bg-[var(--paper)] p-4">
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                Damage type
              </span>
              <select
                value={selectedDamageType}
                onChange={(e) => {
                  setDamageTypeTouched(true);
                  setDamageType(e.target.value);
                }}
                className="border border-[var(--line)] bg-white p-2 outline-none"
              >
                <option value="threadbare">Threadbare surface</option>
                <option value="smallHole">Small hole</option>
                <option value="tear">Tear (edge opening)</option>
                <option value="stain">Stain + thinning</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                Size preset
              </span>
              <select
                value={damageSize}
                onChange={(e) => setDamageSize(e.target.value)}
                className="border border-[var(--line)] bg-white p-2 outline-none"
              >
                <option value="small">Small (up to ~1 cm)</option>
                <option value="medium">Medium (~1-3 cm)</option>
                <option value="large">Large (3+ cm)</option>
              </select>
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Repair plan</p>
              <div className="mt-3 space-y-3 text-sm">
                <p>
                  <span className="text-[var(--muted)]">Preset:</span> {plan.label}
                </p>
                <p>
                  <span className="text-[var(--muted)]">Crosshatch grid:</span> {plan.gridMm} mm spacing
                </p>
                <p>
                  <span className="text-[var(--muted)]">Stitch length:</span> ~{plan.stitchLengthMm} mm
                </p>
                <p>
                  <span className="text-[var(--muted)]">Stitch spacing:</span> ~{plan.spacingMm} mm
                </p>
                <p>
                  <span className="text-[var(--muted)]">Coverage:</span> ~{plan.stitchesEstimate} stitches
                </p>
              </div>
              <p className="mt-4 text-sm text-[var(--muted)]">{plan.colorNote}</p>
            </div>

            <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Pattern preview</p>
              <div className="mt-3 overflow-hidden rounded border border-[var(--line)] bg-white">
                <svg viewBox="0 0 220 220" className="h-[220px] w-full">
                  <rect x="0" y="0" width="220" height="220" fill="white" />
                  <g>{buildPatternLines({ crossSize: plan.crossSize })}</g>
                  {/* Dot overlay to “feel” like chalk-grid sashiko */}
                  {Array.from({ length: 17 }).map((_, row) =>
                    Array.from({ length: 17 }).map((__, col) => {
                      const step = 11;
                      const x = 22 + col * step;
                      const y = 22 + row * step;
                      return (
                        <circle
                          key={`dot-${row}-${col}`}
                          cx={x}
                          cy={y}
                          r="1.3"
                          fill="rgba(17,24,39,0.18)"
                        />
                      );
                    })
                  )}
                </svg>
              </div>
              <p className="mt-3 text-xs leading-6 text-[var(--muted)]">
                The pattern above is a visual guide. Measure your wear area and extend the grid by 1–2 cm.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Stitching notes</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[var(--muted)]">
              {plan.stitchNotes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Quick reminder</p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Sashiko works best when you stop the spread early. If the fabric feels soft or thin around the
              damage, reinforce past the edges rather than only covering the spot.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">For wool jac shirts</p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Wool fibers can “relax” after stitching. Use gentle tension and let the fabric lie flat before the
              final crosshatch pass.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

