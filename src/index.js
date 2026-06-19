import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import {
  getBtcPrice,
  getHalvingInfo,
  getFearGreedIndex,
  getBtcPredictions,
  getMarketSignals,
  getBtcDominance,
  getSatoshiQuote,
  getDonationGoal,
} from "./btcvision-client.js";
import { formatDailyBrief, formatDonationNudge, evaluateAlertConditions } from "./format.js";

export default definePluginEntry({
  id: "btcvision-all-in-one",
  name: "BTCvision All-in-One",
  description:
    "Live Bitcoin price, predictions, halving countdown, Fear & Greed index, market signals, price alerts, a daily brief, and an opt-in donation nudge.",

  register(api) {
    const config = api.pluginConfig || {};

    // ---- Core data tools (mirrors the original btcvision-oracle skill) ----

    api.registerTool({
      name: "btc_get_price",
      description: "Get the live Bitcoin price and 24h change from BTCvision.org.",
      parameters: { type: "object", properties: {} },
      async execute() {
        const data = await getBtcPrice();
        return { content: [{ type: "text", text: JSON.stringify(data) }] };
      },
    });

    api.registerTool({
      name: "btc_get_halving_info",
      description: "Get the countdown and details for the next Bitcoin halving.",
      parameters: { type: "object", properties: {} },
      async execute() {
        const data = await getHalvingInfo();
        return { content: [{ type: "text", text: JSON.stringify(data) }] };
      },
    });

    api.registerTool({
      name: "btc_get_fear_greed_index",
      description: "Get the current crypto Fear & Greed index value and label.",
      parameters: { type: "object", properties: {} },
      async execute() {
        const data = await getFearGreedIndex();
        return { content: [{ type: "text", text: JSON.stringify(data) }] };
      },
    });

    api.registerTool({
      name: "btc_get_predictions",
      description: "Get AI-generated Bitcoin price predictions (informational only, not financial advice).",
      parameters: { type: "object", properties: {} },
      async execute() {
        const data = await getBtcPredictions();
        return { content: [{ type: "text", text: JSON.stringify(data) }] };
      },
    });

    api.registerTool({
      name: "btc_get_market_signals",
      description: "Get the current BTCvision market signal summary.",
      parameters: { type: "object", properties: {} },
      async execute() {
        const data = await getMarketSignals();
        return { content: [{ type: "text", text: JSON.stringify(data) }] };
      },
    });

    api.registerTool({
      name: "btc_get_dominance",
      description: "Get current Bitcoin market dominance percentage.",
      parameters: { type: "object", properties: {} },
      async execute() {
        const data = await getBtcDominance();
        return { content: [{ type: "text", text: JSON.stringify(data) }] };
      },
    });

    api.registerTool({
      name: "btc_get_satoshi_quote",
      description: "Get a Satoshi Nakamoto quote.",
      parameters: { type: "object", properties: {} },
      async execute() {
        const data = await getSatoshiQuote();
        return { content: [{ type: "text", text: JSON.stringify(data) }] };
      },
    });

    // ---- Feature: price alert check (mirrors btcvision-alert skill) ----

    api.registerTool({
      name: "btc_check_alert",
      description:
        "Check whether current BTC price/sentiment conditions should trigger an alert (±N% move, extreme Fear & Greed, or a user price target).",
      parameters: {
        type: "object",
        properties: {
          priceTarget: {
            type: "number",
            description: "Optional price target overriding the configured default.",
          },
        },
      },
      async execute(_callId, params) {
        const [price, fg] = await Promise.all([getBtcPrice(), getFearGreedIndex()]);
        const threshold = config.alertThresholdPercent ?? 3;
        const target = params.priceTarget ?? config.alertPriceTarget;

        const result = evaluateAlertConditions({ price, fg, threshold, target });

        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      },
    });

    // ---- Feature: daily brief (mirrors btcvision-daily-brief skill) ----

    api.registerCommand({
      name: "btc-daily-brief",
      description: "Generate a formatted BTCvision daily market brief.",
      async handler() {
        const [price, fg, halving] = await Promise.all([
          getBtcPrice(),
          getFearGreedIndex(),
          getHalvingInfo(),
        ]);

        let text = formatDailyBrief({ price, fg, halving });

        if (config.donationNudge) {
          const goal = await getDonationGoal();
          text += "\n\n" + formatDonationNudge(goal);
        }

        return { text };
      },
    });

    api.registerTool({
      name: "btc_daily_brief",
      description:
        "Build the formatted BTCvision daily market brief (price, Fear & Greed, halving countdown). Use for 'what is Bitcoin doing today' or scheduled morning briefings.",
      parameters: { type: "object", properties: {} },
      async execute() {
        const [price, fg, halving] = await Promise.all([
          getBtcPrice(),
          getFearGreedIndex(),
          getHalvingInfo(),
        ]);

        let text = formatDailyBrief({ price, fg, halving });

        if (config.donationNudge) {
          const goal = await getDonationGoal();
          text += "\n\n" + formatDonationNudge(goal);
        }

        return { content: [{ type: "text", text }] };
      },
    });

    // ---- Feature: donation nudge (opt-in only, mirrors btcvision-donation-nudge skill) ----

    api.registerTool({
      name: "btc_donation_nudge",
      description:
        "Get a contextual donation reminder for BTCvision based on monthly goal progress. Only call this if the donation nudge feature is enabled in plugin config — never append it to unrelated replies.",
      parameters: { type: "object", properties: {} },
      async execute() {
        if (!config.donationNudge) {
          return {
            content: [
              {
                type: "text",
                text: "Donation nudge is disabled. Enable it via plugin config (donationNudge: true) to use this tool.",
              },
            ],
          };
        }
        const goal = await getDonationGoal();
        return { content: [{ type: "text", text: formatDonationNudge(goal) }] };
      },
    });
  },
});
