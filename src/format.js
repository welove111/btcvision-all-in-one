/**
 * Pure formatting helpers — no network calls here.
 * Kept separate from index.js so the message templates are easy to review/audit.
 */

export function formatDailyBrief({ price, fg, halving }) {
  const date = new Date().toISOString().slice(0, 10);
  return [
    `📊 BTCvision Daily Brief — ${date}`,
    "",
    `💰 BTC Price: $${price.price} (${price.change_24h}%)`,
    `😱 Fear & Greed: ${fg.value} — ${fg.label}`,
    `⛏️ Next Halving: ${halving.days_remaining} days away`,
    "",
    "📈 Full analysis: https://btcvision.org",
  ].join("\n");
}

export function formatDonationNudge(goal) {
  const pct = goal.percentage ?? 0;

  if (pct >= 100) {
    return `✅ BTCvision is fully funded this month — thanks to ${goal.donors ?? "our"} supporters! 🙏`;
  }
  if (pct > 70) {
    return `🎯 Almost there! BTCvision is ${pct}% funded. Top up the last $${goal.remaining ?? "—"} to keep the oracle running: welove@blink.sv`;
  }
  if (pct >= 30) {
    return `💚 BTCvision runs on community support (${pct}% of monthly goal). Even 1000 sats helps: welove@blink.sv`;
  }
  return `⚡ BTCvision is ${pct}% funded this month — help keep it free: welove@blink.sv`;
}

/**
 * Evaluate whether current conditions should trigger a price alert.
 * Pure function — takes already-fetched data, returns a decision object.
 * No message is sent here; the caller (tool/cron) decides what to do with it.
 */
export function evaluateAlertConditions({ price, fg, threshold = 3, target }) {
  const reasons = [];

  if (Math.abs(price.change_24h) >= threshold) {
    reasons.push(`24h move of ${price.change_24h}% meets the ±${threshold}% threshold`);
  }
  if (fg.value < 25) {
    reasons.push(`Fear & Greed at ${fg.value} (extreme fear)`);
  } else if (fg.value > 75) {
    reasons.push(`Fear & Greed at ${fg.value} (extreme greed)`);
  }
  if (typeof target === "number" && price.price >= target) {
    reasons.push(`Price $${price.price} crossed target $${target}`);
  }

  return {
    shouldAlert: reasons.length > 0,
    reasons,
    price: price.price,
    change24h: price.change_24h,
    fearGreed: fg.value,
    fearGreedLabel: fg.label,
  };
}
