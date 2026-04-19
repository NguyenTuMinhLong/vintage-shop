const DRAFTS_KEY = "customization-drafts";
const CHECKOUT_KEY = "pending-checkout-plan";
const SAVED_CHECKOUTS_KEY = "saved-checkout-plans";

function readJson(key, fallback) {
  const raw = localStorage.getItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function getCustomizationDraft(productId) {
  const drafts = readJson(DRAFTS_KEY, {});
  return drafts[String(productId)] ?? null;
}

export function saveCustomizationDraft(productId, draft) {
  const drafts = readJson(DRAFTS_KEY, {});
  drafts[String(productId)] = draft;
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

export function setPendingCheckoutPlan(plan) {
  localStorage.setItem(CHECKOUT_KEY, JSON.stringify(plan));
}

export function getPendingCheckoutPlan() {
  return readJson(CHECKOUT_KEY, null);
}

export function saveCheckoutPlan(plan) {
  const saved = readJson(SAVED_CHECKOUTS_KEY, []);
  const next = [
    {
      ...plan,
      savedAt: new Date().toISOString(),
    },
    ...saved,
  ].slice(0, 8);

  localStorage.setItem(SAVED_CHECKOUTS_KEY, JSON.stringify(next));
}

export function getSavedCheckoutPlans() {
  return readJson(SAVED_CHECKOUTS_KEY, []);
}
