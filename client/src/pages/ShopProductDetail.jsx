import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/axios";
import ShashikoRepairDetail from "../components/shop/ShashikoRepairDetail";
import ConditionCareDetail from "../components/shop/ConditionCareDetail";
import PatchWorkshopDetail from "../components/shop/PatchWorkshopDetail";
import SashikoCustomizerCanvas from "../components/shop/SashikoCustomizerCanvas";
import {
  getCustomizationDraft,
  saveCustomizationDraft,
  setPendingCheckoutPlan,
} from "../utils/customization";

function formatPrice(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return `$${value ?? 0}`;
  const s = value.toFixed(2);
  return s.endsWith(".00") ? `$${value.toFixed(0)}` : `$${s}`;
}

function normalizeLines(value) {
  if (!value) {
    return [];
  }

  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildZoneOptions(product) {
  const explicit = normalizeLines(product?.patchZones);

  if (explicit.length) {
    return explicit;
  }

  return ["Left elbow", "Right cuff edge", "Back hem split"];
}

function zonePosition(zone, index) {
  const label = zone.toLowerCase();

  if (label.includes("left elbow")) return { x: 255, y: 360 };
  if (label.includes("right elbow")) return { x: 545, y: 360 };
  if (label.includes("cuff")) return { x: label.includes("right") ? 560 : 240, y: 635 };
  if (label.includes("hem")) return { x: 400, y: 810 };
  if (label.includes("back")) return { x: 400, y: 740 };

  return { x: 250 + index * 110, y: 340 + index * 90 };
}

function buildPlacement(zone, index, defaults = {}) {
  const position = zonePosition(zone, index);
  const patternType =
    defaults.patternType ??
    (zone.toLowerCase().includes("cuff")
      ? "ladder"
      : zone.toLowerCase().includes("hem")
      ? "wave"
      : "grid");

  return {
    id: `${Date.now()}-${index}-${Math.round(Math.random() * 1000)}`,
    zone,
    x: position.x,
    y: position.y,
    patchShape: defaults.patchShape ?? "oval",
    patchTone: defaults.patchTone ?? "indigo",
    stitchDensity: defaults.stitchDensity ?? "dense",
    patternType,
  };
}

function getStyleLabel(style) {
  switch (style) {
    case "blended":
      return "Blended repair";
    case "boro-stack":
      return "Boro stack";
    case "visible":
    default:
      return "Visible repair";
  }
}

function customizationFee(product, draft) {
  const difficultyFee =
    product?.repairDifficulty === "high" ? 42 : product?.repairDifficulty === "low" ? 16 : 28;
  const styleFee =
    draft?.patchStyle === "boro-stack" ? 22 : draft?.patchStyle === "blended" ? 12 : 16;
  const placementFee = (draft?.placements?.length ?? 0) * 18;
  const hardwareFee =
    draft?.hardware?.closureType === "zipper"
      ? 26
      : draft?.hardware?.closureType === "buttons"
      ? 14 + Math.max(0, (draft?.hardware?.buttonCount ?? 5) - 5) * 2
      : 0;

  return difficultyFee + styleFee + placementFee + hardwareFee;
}

export default function ShopProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState(null);
  const [selectedPlacementId, setSelectedPlacementId] = useState(null);
  const [activeZone, setActiveZone] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const zoneOptions = useMemo(() => buildZoneOptions(product), [product]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const storedDraft = getCustomizationDraft(id);

    if (storedDraft) {
      const normalizedDraft = {
        patchStyle: "visible",
        patchFabric: product.patchFabric || "Indigo sashiko-weight cotton patch cloth",
        designNote: product.patchNotes || "",
        activeZone: zoneOptions[0] || "",
        hardware: {
          closureType: "buttons",
          hardwareTone: "antique-brass",
          buttonStyle: "corozo",
          buttonCount: 5,
          ...(storedDraft.hardware ?? {}),
        },
        ...storedDraft,
      };

      setDraft(normalizedDraft);
      setSelectedPlacementId(normalizedDraft.placements?.[0]?.id ?? null);
      setActiveZone(normalizedDraft.activeZone || zoneOptions[0] || "");
      return;
    }

    const nextDraft = {
      activeZone: zoneOptions[0] || "",
      patchStyle: product.patchStyle || "visible",
      patchFabric: product.patchFabric || "Indigo sashiko-weight cotton patch cloth",
      designNote: product.patchNotes || "",
      hardware: {
        closureType: "buttons",
        hardwareTone: "antique-brass",
        buttonStyle: "corozo",
        buttonCount: 5,
      },
      placements: zoneOptions.slice(0, 3).map((zone, index) =>
        buildPlacement(zone, index, {
          patchShape: index === 2 ? "strip" : "oval",
          patchTone: product.patchStyle === "blended" ? "charcoal" : "indigo",
          stitchDensity: product.repairDifficulty === "high" ? "dense" : "open",
        })
      ),
    };

    setDraft(nextDraft);
    setSelectedPlacementId(nextDraft.placements[0]?.id ?? null);
    setActiveZone(nextDraft.activeZone);
  }, [product, id, zoneOptions]);

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (!product) {
    return <p>{error || "No product found."}</p>;
  }

  const inStock = Number(product.stock ?? 0) > 0;
  const selectedPlacement =
    draft?.placements?.find((placement) => placement.id === selectedPlacementId) ?? null;
  const patchStyleLabel = getStyleLabel(draft?.patchStyle);
  const customFee = customizationFee(product, draft);
  const totalPrice = (product?.price ?? 0) + customFee;

  const updateSelectedPlacement = (updates) => {
    setDraft((currentDraft) => {
      if (!currentDraft || !selectedPlacementId) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        placements: currentDraft.placements.map((placement) =>
          placement.id === selectedPlacementId ? { ...placement, ...updates } : placement
        ),
      };
    });
  };

  const updateHardware = (updates) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      hardware: {
        closureType: "buttons",
        hardwareTone: "antique-brass",
        buttonStyle: "corozo",
        buttonCount: 5,
        ...currentDraft.hardware,
        ...updates,
      },
    }));
  };

  const handleMovePlacement = (placementId, point) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      placements: currentDraft.placements.map((placement) =>
        placement.id === placementId ? { ...placement, x: point.x, y: point.y } : placement
      ),
    }));
  };

  const handleCanvasClick = (event) => {
    if (!draft) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 800;
    const y = ((event.clientY - rect.top) / rect.height) * 1000;
    const shape = activeZone.toLowerCase().includes("hem")
      ? "strip"
      : activeZone.toLowerCase().includes("back")
      ? "panel"
      : "oval";

    const placement = {
      id: `${Date.now()}-${Math.round(Math.random() * 1000)}`,
      zone: activeZone || zoneOptions[0] || "Repair zone",
      x,
      y,
      patchShape: shape,
      patchTone: draft.patchStyle === "blended" ? "charcoal" : "indigo",
      stitchDensity: product.repairDifficulty === "high" ? "dense" : "open",
      patternType: activeZone.toLowerCase().includes("cuff")
        ? "ladder"
        : activeZone.toLowerCase().includes("hem")
        ? "wave"
        : "grid",
    };

    setDraft((currentDraft) => ({
      ...currentDraft,
      activeZone,
      placements: [...currentDraft.placements, placement],
    }));
    setSelectedPlacementId(placement.id);
  };

  const persistDraft = (message) => {
    if (!draft) {
      return;
    }

    const payload = {
      ...draft,
      activeZone,
    };

    saveCustomizationDraft(id, payload);
    setSaveMessage(message);
  };

  const handleProceedToCheckout = () => {
    if (!draft) {
      return;
    }

    const payload = {
      product,
      placements: draft.placements,
      patchStyle: draft.patchStyle,
      patchStyleLabel,
      patchFabric: draft.patchFabric,
      designNote: draft.designNote,
      hardware: draft.hardware,
      customizationFee: customFee,
    };

    saveCustomizationDraft(id, { ...draft, activeZone });
    setPendingCheckoutPlan(payload);
    navigate("/checkout");
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-[var(--line)] pb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/products"
            className="text-xs uppercase tracking-[0.22em] text-[var(--muted)] transition hover:text-[var(--ink)]"
          >
            Back to shop
          </Link>
          <span className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Product detail</span>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
            {inStock ? `In stock (${product.stock})` : "Sold out"}
          </p>
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-4">
          <SashikoCustomizerCanvas
            imageUrl={product.imageUrl}
            placements={draft?.placements ?? []}
            selectedPlacementId={selectedPlacementId}
            onSelectPlacement={setSelectedPlacementId}
            onCanvasClick={handleCanvasClick}
            onMovePlacement={handleMovePlacement}
            hardware={draft?.hardware}
            interactive
          />
          <div className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">On-garment sashiko planner</p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Click directly on the shirt image to place sashiko stitching zones. Each zone can use a different
              stitch planner, and the live thread mockup carries through to the payment page. You can also drag
              any sashiko zone after placing it.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h1
              className="text-4xl leading-tight text-[var(--ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {product.name}
            </h1>
            <p className="text-2xl text-[var(--ink)]">{formatPrice(product.price)}</p>
          </div>

          {(product.materials || product.conditionText || product.measurementsText) && (
            <div className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-5">
              {product.materials ? (
                <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">{product.materials}</p>
              ) : null}

              {product.conditionText && product.conditionText.trim() ? (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">{product.conditionText}</p>
              ) : null}

              {product.measurementsText && product.measurementsText.trim() ? (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Measurements</p>
                  <pre className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">
                    {product.measurementsText}
                  </pre>
                </div>
              ) : null}
            </div>
          )}

          <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Shop note</p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              This is vintage merchandise: measurements and condition notes help you choose confidently.
            </p>
          </div>

          {(product.patchZones || product.patchFabric || product.patchNotes) && (
            <div className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Patch-ready details</p>
              <div className="mt-3 space-y-2 text-sm leading-7 text-[var(--muted)]">
                {product.patchZones ? <p><span className="text-[var(--ink)]">Zones:</span> {product.patchZones}</p> : null}
                {product.patchFabric ? <p><span className="text-[var(--ink)]">Suggested fabric:</span> {product.patchFabric}</p> : null}
                {product.patchNotes ? <p className="whitespace-pre-wrap">{product.patchNotes}</p> : null}
              </div>
            </div>
          )}
        </div>
      </section>

      {draft ? (
        <section className="grid gap-8 border-t border-[var(--line)] pt-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="grid gap-4 rounded-lg border border-[var(--line)] bg-[var(--paper)] p-5 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">Zone to place next</span>
                <select
                  value={activeZone}
                  onChange={(event) => setActiveZone(event.target.value)}
                  className="border border-[var(--line)] bg-white p-3 outline-none"
                >
                  {zoneOptions.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm">
                <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">Overall patch style</span>
                <select
                  value={draft.patchStyle}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({ ...currentDraft, patchStyle: event.target.value }))
                  }
                  className="border border-[var(--line)] bg-white p-3 outline-none"
                >
                  <option value="visible">Visible repair</option>
                  <option value="blended">Blended repair</option>
                  <option value="boro-stack">Boro stack</option>
                </select>
              </label>
            </div>

            <div className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Hardware atelier</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Front closure</span>
                  <select
                    value={draft.hardware?.closureType ?? "buttons"}
                    onChange={(event) => updateHardware({ closureType: event.target.value })}
                    className="border border-[var(--line)] bg-white p-3 outline-none"
                  >
                    <option value="buttons">Buttons</option>
                    <option value="zipper">Zip front</option>
                    <option value="none">Open front</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Hardware tone</span>
                  <select
                    value={draft.hardware?.hardwareTone ?? "antique-brass"}
                    onChange={(event) => updateHardware({ hardwareTone: event.target.value })}
                    className="border border-[var(--line)] bg-white p-3 outline-none"
                  >
                    <option value="antique-brass">Antique brass</option>
                    <option value="nickel">Nickel</option>
                    <option value="matte-black">Matte black</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Button style</span>
                  <select
                    value={draft.hardware?.buttonStyle ?? "corozo"}
                    onChange={(event) => updateHardware({ buttonStyle: event.target.value })}
                    className="border border-[var(--line)] bg-white p-3 outline-none"
                    disabled={draft.hardware?.closureType !== "buttons"}
                  >
                    <option value="corozo">Corozo</option>
                    <option value="cat-eye">Military cat-eye</option>
                    <option value="mother-of-pearl">Mother of pearl</option>
                    <option value="burnt-horn">Burnt horn</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Button count</span>
                  <select
                    value={draft.hardware?.buttonCount ?? 5}
                    onChange={(event) => updateHardware({ buttonCount: Number(event.target.value) })}
                    className="border border-[var(--line)] bg-white p-3 outline-none"
                    disabled={draft.hardware?.closureType !== "buttons"}
                  >
                    <option value="4">4 buttons</option>
                    <option value="5">5 buttons</option>
                    <option value="6">6 buttons</option>
                    <option value="7">7 buttons</option>
                  </select>
                </label>
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                The front placket overlay on the garment updates with your closure choice, so you can imagine a
                zip conversion, a button swap, or a cleaner open-front rebuild.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Customization controls</p>
              {selectedPlacement ? (
                <div className="mt-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-4">
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Repair frame</span>
                      <select
                        value={selectedPlacement.patchShape}
                        onChange={(event) => updateSelectedPlacement({ patchShape: event.target.value })}
                        className="border border-[var(--line)] bg-white p-3 outline-none"
                      >
                        <option value="oval">Oval elbow patch</option>
                        <option value="strip">Guard strip</option>
                        <option value="panel">Panel patch</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Patch tone</span>
                      <select
                        value={selectedPlacement.patchTone}
                        onChange={(event) => updateSelectedPlacement({ patchTone: event.target.value })}
                        className="border border-[var(--line)] bg-white p-3 outline-none"
                      >
                        <option value="indigo">Indigo</option>
                        <option value="cream">Cream</option>
                        <option value="charcoal">Charcoal</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Stitch density</span>
                      <select
                        value={selectedPlacement.stitchDensity}
                        onChange={(event) => updateSelectedPlacement({ stitchDensity: event.target.value })}
                        className="border border-[var(--line)] bg-white p-3 outline-none"
                      >
                        <option value="open">Open</option>
                        <option value="dense">Dense</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Sashiko planner</span>
                      <select
                        value={selectedPlacement.patternType ?? "grid"}
                        onChange={(event) => updateSelectedPlacement({ patternType: event.target.value })}
                        className="border border-[var(--line)] bg-white p-3 outline-none"
                      >
                        <option value="grid">Hitomezashi grid</option>
                        <option value="diagonal">Diagonal reinforcement</option>
                        <option value="ladder">Ladder rows</option>
                        <option value="wave">Wave sashiko</option>
                      </select>
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      value={draft.patchFabric}
                      onChange={(event) =>
                        setDraft((currentDraft) => ({ ...currentDraft, patchFabric: event.target.value }))
                      }
                      placeholder="Patch fabric"
                      className="border border-[var(--line)] bg-white p-3 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          placements: currentDraft.placements.filter(
                            (placement) => placement.id !== selectedPlacementId
                          ),
                        }));
                        setSelectedPlacementId(
                          draft.placements.find((placement) => placement.id !== selectedPlacementId)?.id ?? null
                        );
                      }}
                      className="border border-[var(--line)] px-5 py-3 text-xs uppercase tracking-[0.18em]"
                    >
                      Remove selected sashiko zone
                    </button>
                  </div>

                  <textarea
                    value={draft.designNote}
                    onChange={(event) =>
                      setDraft((currentDraft) => ({ ...currentDraft, designNote: event.target.value }))
                    }
                    rows={4}
                    placeholder="Design memo for payment page: tell the repair story, overlap order, or what should stay visible."
                    className="w-full resize-none border border-[var(--line)] bg-white p-3 outline-none"
                  />
                  <p className="text-sm leading-7 text-[var(--muted)]">
                    These are stitch plans, not solid patch fills. Use different planners on different wear
                    points so the shirt reads like a real sashiko repair map.
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                  Pick a patch on the image or click the garment to add a new one.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Repair pricing</p>
              <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                <div className="flex items-center justify-between">
                  <span>Garment price</span>
                  <span>{formatPrice(product.price)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sashiko customization</span>
                  <span>{formatPrice(customFee)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Closure setup</span>
                  <span className="capitalize">
                    {draft.hardware?.closureType === "zipper"
                      ? "Zip front"
                      : draft.hardware?.closureType === "none"
                      ? "Open front"
                      : `${draft.hardware?.buttonCount ?? 5} buttons`}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--line)] pt-3 text-[var(--ink)]">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Next step</p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Save the draft if you want to come back later, or move straight to payment with this exact
                sashiko layout on the garment photo.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => persistDraft("Saved in this browser. You can reopen the product and keep editing.")}
                  className="border border-[var(--ink)] px-5 py-3 text-xs uppercase tracking-[0.18em]"
                >
                  Save draft
                </button>
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="border border-[var(--line)] px-5 py-3 text-xs uppercase tracking-[0.18em]"
                >
                  Go to payment page
                </button>
              </div>
              {saveMessage ? <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{saveMessage}</p> : null}
            </div>
          </div>
        </section>
      ) : null}

      <ShashikoRepairDetail product={product} />
      <PatchWorkshopDetail product={product} />
      <ConditionCareDetail product={product} />

      {error ? <p className="text-red-600">{error}</p> : null}
    </div>
  );
}
