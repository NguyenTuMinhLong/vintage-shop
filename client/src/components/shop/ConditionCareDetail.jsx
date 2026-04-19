import { useMemo, useState } from "react";

export default function ConditionCareDetail({ product }) {
  const [checks, setChecks] = useState(() => ({
    airOut: false,
    brush: false,
    spotClean: false,
    avoidHighHeat: false,
    storeFolded: false,
    mendEarly: false,
  }));

  const total = useMemo(() => Object.keys(checks).length, [checks]);
  const done = useMemo(() => Object.values(checks).filter(Boolean).length, [checks]);
  const score = total ? Math.round((done / total) * 100) : 0;

  const description = product?.description ?? "";
  const measurementsText = product?.measurementsText ?? "";
  const conditionText = product?.conditionText ?? "";
  const careInstructions = product?.careInstructions ?? "";
  const overallScore = product?.overallScore ?? null;

  return (
    <section className="space-y-6 border-t border-[var(--line)] pt-10">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">Shop Feature</p>
          <h2
            className="text-3xl text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Condition & Care
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">
            A denimister-style checklist: what you’re seeing, what to do next, and how to slow future wear.
          </p>
        </div>
        <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Care progress</p>
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm text-[var(--muted)]">
              <span>
                {done}/{total} steps
              </span>
              <span>{score}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded bg-[rgba(0,0,0,0.06)]">
              <div
                className="h-full bg-[var(--ink)]"
                style={{ width: `${score}%`, transition: "width 300ms ease" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_1fr]">
        <div className="space-y-6">
          {description ? (
            <div className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Product notes</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">{description}</p>
            </div>
          ) : null}

          {measurementsText ? (
            <div className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Measurements</p>
              <pre className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">
                {measurementsText}
              </pre>
            </div>
          ) : null}

          {(conditionText || overallScore !== null) && (
            <div className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Condition</p>
              <div className="mt-3 space-y-2">
                {overallScore !== null ? (
                  <p className="text-sm leading-7 text-[var(--muted)]">
                    Overall score: <span className="text-[var(--ink)]">{overallScore}/10</span>
                  </p>
                ) : null}
                {conditionText ? (
                  <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">{conditionText}</p>
                ) : null}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Wear & care checklist</p>
            <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={checks.airOut}
                  onChange={(e) => setChecks((p) => ({ ...p, airOut: e.target.checked }))}
                />
                <span>Air out after wear (especially wool and denim mixes).</span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={checks.brush}
                  onChange={(e) => setChecks((p) => ({ ...p, brush: e.target.checked }))}
                />
                <span>Brush surface dust before any deeper cleaning.</span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={checks.spotClean}
                  onChange={(e) => setChecks((p) => ({ ...p, spotClean: e.target.checked }))}
                />
                <span>Spot clean only; avoid soaking unless necessary.</span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={checks.avoidHighHeat}
                  onChange={(e) => setChecks((p) => ({ ...p, avoidHighHeat: e.target.checked }))}
                />
                <span>Avoid high heat (hot dryer, harsh steam, aggressive pressing).</span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={checks.storeFolded}
                  onChange={(e) => setChecks((p) => ({ ...p, storeFolded: e.target.checked }))}
                />
                <span>Store folded to keep shoulder shape (or hang if you have space).</span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={checks.mendEarly}
                  onChange={(e) => setChecks((p) => ({ ...p, mendEarly: e.target.checked }))}
                />
                <span>Mend early with sashiko before wear widens.</span>
              </label>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Wool underlayer note</p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Wool jac can feel prickly at first. Denimister’s preference: wear a thin inner layer
              (tee or soft undershirt) and let the fibers settle over time.
            </p>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Care instructions</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">
                {careInstructions
                  ? careInstructions
                  : "Dry brush first. Spot treat stains. Gentle air-dry only. Mend small damage early so it stays characterful, not structural."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

