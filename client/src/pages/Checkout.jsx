import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SashikoCustomizerCanvas from "../components/shop/SashikoCustomizerCanvas";
import {
  getPendingCheckoutPlan,
  getSavedCheckoutPlans,
  saveCheckoutPlan,
} from "../utils/customization";

function formatPrice(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return `$${value ?? 0}`;
  const s = value.toFixed(2);
  return s.endsWith(".00") ? `$${value.toFixed(0)}` : `$${s}`;
}

export default function Checkout() {
  const [plan] = useState(() => getPendingCheckoutPlan());
  const [savedPlans, setSavedPlans] = useState(() => getSavedCheckoutPlans());
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank-transfer");
  const [status, setStatus] = useState("");

  const pricing = useMemo(() => {
    if (!plan) {
      return { customizationFee: 0, total: 0 };
    }

    return {
      customizationFee: plan.customizationFee ?? 0,
      total: (plan.product?.price ?? 0) + (plan.customizationFee ?? 0),
    };
  }, [plan]);

  if (!plan) {
    return (
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Checkout</p>
        <h1 className="text-4xl text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
          No custom plan ready yet.
        </h1>
        <p className="max-w-xl text-sm leading-7 text-[var(--muted)]">
          Build a sashiko layout on a product page first, then use the payment page to save or place that
          repair order.
        </p>
        <Link
          to="/products"
          className="inline-flex border border-[var(--ink)] px-5 py-3 text-xs uppercase tracking-[0.18em]"
        >
          Go to shop
        </Link>
      </div>
    );
  }

  const handleSavePlan = () => {
    const payload = {
      ...plan,
      customerName: customerName.trim() || null,
      email: email.trim() || null,
      paymentMethod,
      total: pricing.total,
    };

    saveCheckoutPlan(payload);
    setSavedPlans(getSavedCheckoutPlans());
    setStatus("Saved for later. Your sashiko payment plan is now stored in this browser.");
  };

  return (
    <div className="space-y-10">
      <section className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--line)] pb-6">
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">Checkout</p>
          <h1 className="text-4xl text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
            Sashiko Payment Page
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Review the exact repair layout on the garment, choose a payment method, and save the plan if you
            want to return later before paying.
          </p>
        </div>

        <Link
          to={`/products/${plan.product.id}`}
          className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)] transition hover:text-[var(--ink)]"
        >
          Back to product
        </Link>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <SashikoCustomizerCanvas
            imageUrl={plan.product.imageUrl}
            placements={plan.placements ?? []}
            selectedPlacementId={null}
            hardware={plan.hardware}
            interactive={false}
          />

          <div className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Repair summary</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Placement count</p>
                <p className="mt-2 text-sm text-[var(--ink)]">{plan.placements?.length ?? 0} patch areas</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Style direction</p>
                <p className="mt-2 text-sm text-[var(--ink)]">{plan.patchStyleLabel}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Patch cloth</p>
                <p className="mt-2 text-sm text-[var(--ink)]">{plan.patchFabric}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Closure</p>
                <p className="mt-2 text-sm text-[var(--ink)] capitalize">
                  {plan.hardware?.closureType === "zipper"
                    ? `${plan.hardware.hardwareTone} zip front`
                    : plan.hardware?.closureType === "none"
                    ? "open front rebuild"
                    : `${plan.hardware?.buttonCount ?? 5} ${plan.hardware?.buttonStyle ?? "corozo"} buttons`}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Repair note</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[var(--ink)]">
                  {plan.designNote || "No extra design note added."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Payment details</p>
            <div className="mt-4 space-y-3">
              <input
                type="text"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Your name"
                className="w-full border border-[var(--line)] bg-white p-3 outline-none"
              />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                className="w-full border border-[var(--line)] bg-white p-3 outline-none"
              />

              <div className="space-y-2 text-sm text-[var(--muted)]">
                <label className="flex items-center gap-3 border border-[var(--line)] bg-white p-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "bank-transfer"}
                    onChange={() => setPaymentMethod("bank-transfer")}
                  />
                  <span>Bank transfer</span>
                </label>
                <label className="flex items-center gap-3 border border-[var(--line)] bg-white p-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "cash-on-delivery"}
                    onChange={() => setPaymentMethod("cash-on-delivery")}
                  />
                  <span>Cash on delivery</span>
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Price</p>
            <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <div className="flex items-center justify-between">
                <span>{plan.product.name}</span>
                <span>{formatPrice(plan.product.price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Custom sashiko work</span>
                <span>{formatPrice(pricing.customizationFee)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Closure setup</span>
                <span className="capitalize">
                  {plan.hardware?.closureType === "zipper"
                    ? "zip front"
                    : plan.hardware?.closureType === "none"
                    ? "open front"
                    : `${plan.hardware?.buttonCount ?? 5} buttons`}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--line)] pt-3 text-[var(--ink)]">
                <span>Total</span>
                <span>{formatPrice(pricing.total)}</span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSavePlan}
                className="border border-[var(--ink)] px-5 py-3 text-xs uppercase tracking-[0.18em]"
              >
                Save payment plan
              </button>
              <button
                type="button"
                onClick={() => setStatus("Order request staged. Connect a real payment gateway next if you want live checkout.")}
                className="border border-[var(--line)] px-5 py-3 text-xs uppercase tracking-[0.18em]"
              >
                Place custom order
              </button>
            </div>

            {status ? <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{status}</p> : null}
          </div>

          <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Saved plans</p>
            <div className="mt-4 space-y-4">
              {savedPlans.length === 0 ? (
                <p className="text-sm leading-7 text-[var(--muted)]">
                  No saved payment plans yet. Use the button above to keep one for later.
                </p>
              ) : (
                savedPlans.map((savedPlan, index) => (
                  <div key={`${savedPlan.product.id}-${savedPlan.savedAt}-${index}`} className="border-t border-[var(--line)] pt-4 first:border-t-0 first:pt-0">
                    <p className="text-sm text-[var(--ink)]">{savedPlan.product.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                      {savedPlan.patchStyleLabel} • {savedPlan.placements?.length ?? 0} placements
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                      {savedPlan.hardware?.closureType === "zipper"
                        ? "zip front"
                        : savedPlan.hardware?.closureType === "none"
                        ? "open front"
                        : `${savedPlan.hardware?.buttonCount ?? 5} buttons`}
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      Total: {formatPrice(savedPlan.total ?? 0)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
