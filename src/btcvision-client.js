/**
 * Thin client for the public BTCvision.org MCP endpoint.
 * No API key required. All requests go to a single POST endpoint
 * with a {"tool": "<name>"} body, matching the original btcvision-oracle skill.
 */

const ENDPOINT = "https://btcvision.org/.netlify/functions/mcp";
const TIMEOUT_MS = 10_000;

async function callTool(tool) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tool }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`BTCvision request failed: HTTP ${res.status}`);
    }

    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

export const getBtcPrice = () => callTool("get_btc_price");
export const getHalvingInfo = () => callTool("get_halving_info");
export const getFearGreedIndex = () => callTool("get_fear_greed_index");
export const getBtcPredictions = () => callTool("get_btc_predictions");
export const getMarketSignals = () => callTool("get_market_signals");
export const getBtcDominance = () => callTool("get_btc_dominance");
export const getSatoshiQuote = () => callTool("get_satoshi_quote");
export const getDonationGoal = () => callTool("get_donation_goal");
