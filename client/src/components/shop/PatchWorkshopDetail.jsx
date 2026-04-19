import { useMemo, useState } from "react";

function normalizeList(value) {
  if (!value) {
    return [];
  }

  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildZoneOptions(product) {
  const explicitZones = normalizeList(product?.patchZones);

  if (explicitZones.length) {
    return explicitZones;
  }

  const text = `${product?.conditionText ?? ""} ${product?.sashikoNotes ?? ""}`.toLowerCase();

  if (text.includes("elbow")) return ["Left elbow", "Right elbow", "Forearm seam"];
  if (text.includes("cuff")) return ["Left cuff edge", "Right cuff edge", "Sleeve opening"];
  if (text.includes("hem")) return ["Front hem", "Back hem split", "Side seam hem"];
  if (text.includes("knee")) return ["Left knee", "Right knee", "Seat edge"];

  return ["Left elbow", "Right cuff edge", "Back hem split"];
}

function getZoneRecipe(zone) {
  const label = zone.toLowerCase();

  if (label.includes("elbow")) {
    return {
      cutSize: "9 x 11 cm oval patch",
      anchor: "Float the patch slightly past the bend so it flexes with the sleeve.",
      reinforcement: "Add a soft backing swatch under the outer patch for double-duty wear.",
    };
  }

  if (label.includes("cuff") || label.includes("sleeve")) {
    return {
      cutSize: "3 x 8 cm guard strip",
      anchor: "Turn the top edge under so the patch does not catch while pulling the garment on.",
      reinforcement: "Run two parallel anchor rows along the edge that rubs hardest.",
    };
  }

  if (label.includes("hem")) {
    return {
      cutSize: "4 x 12 cm inside-facing strip",
      anchor: "Catch the damaged edge from the inside first, then let the visible stitches finish the face.",
      reinforcement: "Extend at least 2 cm beyond the split so the hem regains structure.",
    };
  }

  if (label.includes("knee") || label.includes("seat")) {
    return {
      cutSize: "10 x 14 cm shaped panel",
      anchor: "Curve the corners so the patch blends with movement instead of lifting.",
      reinforcement: "Use a denser inner grid through the highest-friction center.",
    };
  }

  return {
    cutSize: "7 x 10 cm balancing patch",
    anchor: "Anchor the patch beyond the visible damage so the stress spreads gradually.",
    reinforcement: "Back the weak area before adding visible top stitches.",
  };
}

function getStyleRecipe(style) {
  switch (style) {
    case "blended":
      return {
        label: "Blended repair",
        threadTone: "Match the garment body or go half a shade darker.",
        stitching: "Use longer running stitches with quieter spacing so the patch disappears at distance.",
        mood: "Subtle, workshop-finished, quietly professional.",
      };
    case "boro-stack":
      return {
        label: "Boro stack",
        threadTone: "Mix two close neutrals and let one contrast thread surface on the final pass.",
        stitching: "Layer a smaller backing patch under a larger face patch for depth.",
        mood: "Expressive, layered, visibly collected over time.",
      };
    case "visible":
    default:
      return {
        label: "Visible repair",
        threadTone: "Use off-white, natural, or faded indigo to let the stitch map show.",
        stitching: "Keep the first anchor grid open, then tighten the center where the wear is worst.",
        mood: "Intentional, graphic, character-first.",
      };
  }
}

function getDifficultyRecipe(level) {
  switch (level) {
    case "high":
      return { labor: "2.5-3.5 hours", passes: "3 passes", thread: "5-6 m sashiko thread" };
    case "low":
      return { labor: "45-75 minutes", passes: "1-2 passes", thread: "1.5-2 m sashiko thread" };
    case "medium":
    default:
      return { labor: "90-150 minutes", passes: "2 passes", thread: "3-4 m sashiko thread" };
  }
}

function buildForecast(style, rotation) {
  const base = {
    "30 days": "The repair still reads crisp. Stitch spacing looks deliberate and the patch edge stays clean.",
    "90 days": "The face cloth starts settling into the garment. Contrast softens and the patch begins to feel original.",
    "180 days": "High points flatten, thread bloom appears, and the repair turns into part of the garment's identity.",
  };

  if (rotation === "hard-wear") {
    base["30 days"] = "The patch breaks in quickly. Expect soft edge rolling and a little shine where the body bends most.";
    base["90 days"] = "The stitch lanes start carving a visible wear map. Great if you want the repair to show history.";
    base["180 days"] = "The patch will fully integrate and pick up stress marks. Plan a light re-anchor on the outer corners.";
  }

  if (style === "blended") {
    base["90 days"] = "The repair becomes quiet from a few steps away. Texture stays, but contrast drops back into the fabric.";
  }

  if (style === "boro-stack") {
    base["180 days"] = "Layer edges start talking to each other. This is where the repair gets its real depth and story.";
  }

  return base;
}

export default function PatchWorkshopDetail({ product }) {
  const zoneOptions = useMemo(() => buildZoneOptions(product), [product]);
  const [selectedZone, setSelectedZone] = useState(zoneOptions[0] ?? "Left elbow");
  const [selectedStyle, setSelectedStyle] = useState(product?.patchStyle || "visible");
  const [rotation, setRotation] = useState("weekly");

  const selectedDifficulty = product?.repairDifficulty || "medium";
  const baseFabric =
    product?.patchFabric?.trim() || "Use a mid-weight natural-fiber swatch with similar hand feel to the body.";

  const zoneRecipe = useMemo(() => getZoneRecipe(selectedZone), [selectedZone]);
  const styleRecipe = useMemo(() => getStyleRecipe(selectedStyle), [selectedStyle]);
  const difficultyRecipe = useMemo(() => getDifficultyRecipe(selectedDifficulty), [selectedDifficulty]);
  const forecast = useMemo(() => buildForecast(selectedStyle, rotation), [selectedStyle, rotation]);

  return (
    <section className="space-y-6 border-t border-[var(--line)] pt-10">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">Custom Feature</p>
          <h2 className="text-3xl text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
            Patch Atelier
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Plan exactly how a patch gets added to this garment: where it lands, what cloth it uses, and how
            visible the repair should feel on-body.
          </p>
        </div>

        <div className="max-w-[24rem] rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Patch note from inventory</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">
            {product?.patchNotes
              ? product.patchNotes
              : "No specific patch note stored yet. Use the atelier planner below to shape the repair direction."}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="grid gap-4 border border-[var(--line)] bg-[var(--paper)] p-4 md:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">Patch zone</span>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="border border-[var(--line)] bg-white p-2 outline-none"
              >
                {zoneOptions.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">Repair style</span>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="border border-[var(--line)] bg-white p-2 outline-none"
              >
                <option value="visible">Visible repair</option>
                <option value="blended">Blended repair</option>
                <option value="boro-stack">Boro stack</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">Wear forecast</span>
              <select
                value={rotation}
                onChange={(e) => setRotation(e.target.value)}
                className="border border-[var(--line)] bg-white p-2 outline-none"
              >
                <option value="gallery">Occasional wear</option>
                <option value="weekly">Weekly rotation</option>
                <option value="hard-wear">Hard wear</option>
              </select>
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Atelier brief</p>
              <div className="mt-3 space-y-3 text-sm leading-7 text-[var(--muted)]">
                <p>
                  <span className="text-[var(--ink)]">Zone:</span> {selectedZone}
                </p>
                <p>
                  <span className="text-[var(--ink)]">Patch cut:</span> {zoneRecipe.cutSize}
                </p>
                <p>
                  <span className="text-[var(--ink)]">Fabric:</span> {baseFabric}
                </p>
                <p>
                  <span className="text-[var(--ink)]">Style mood:</span> {styleRecipe.label}
                </p>
                <p>
                  <span className="text-[var(--ink)]">Labor:</span> {difficultyRecipe.labor}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Build recipe</p>
              <div className="mt-3 space-y-3 text-sm leading-7 text-[var(--muted)]">
                <p>{zoneRecipe.anchor}</p>
                <p>{zoneRecipe.reinforcement}</p>
                <p>{styleRecipe.stitching}</p>
                <p>{styleRecipe.threadTone}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Bill of materials</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Patch cloth</p>
                <p className="mt-2 text-sm leading-7 text-[var(--ink)]">{baseFabric}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Thread + passes</p>
                <p className="mt-2 text-sm leading-7 text-[var(--ink)]">
                  {difficultyRecipe.thread}
                  <br />
                  {difficultyRecipe.passes}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Visual result</p>
                <p className="mt-2 text-sm leading-7 text-[var(--ink)]">{styleRecipe.mood}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Cool function</p>
            <h3 className="mt-2 text-2xl text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
              Fade Forecast
            </h3>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              A wear-in prediction for the repair, based on how often the piece gets rotated.
            </p>
            <div className="mt-4 space-y-4">
              {Object.entries(forecast).map(([stage, note]) => (
                <div key={stage} className="border-t border-[var(--line)] pt-4 first:border-t-0 first:pt-0">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">{stage}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--ink)]">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
