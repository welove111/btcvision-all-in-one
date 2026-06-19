---
name: btcvision-all-in-one
version: 1.0.0
description: "All-in-one Bitcoin intelligence plugin from BTCvision.org — live price, halving countdown, Fear & Greed index, AI predictions, market signals, smart price alerts, automated daily briefs, and an optional donation nudge. One plugin, every BTCvision tool, MCP and A2A compatible."
author: welove111
homepage: https://btcvision.org
license: MIT
tags: [bitcoin, btc, crypto, price, prediction, halving, market, alert, daily-brief, donation, telegram, discord, slack, mcp, a2a, finance]
protocols: [mcp, a2a]
category: finance/crypto
---

# BTCvision All-in-One

A single plugin that bundles every BTCvision.org capability — live market data, price alerts, a formatted daily brief, and an optional donation nudge — behind one MCP endpoint. Use this instead of installing the separate `btcvision-oracle`, `btcvision-alert`, `btcvision-daily-brief`, and `btcvision-donation-nudge` skills individually.

## When To Use This Plugin

- A user asks about the current Bitcoin price, market sentiment, or predictions
- A user wants to be notified when BTC moves significantly or crosses a price level
- A user wants a recurring daily/morning Bitcoin briefing on Telegram, Discord, or Slack
- You are building any agent workflow that needs live BTC data without an API key

## Core data tools

All tools call the same BTCvision MCP endpoint:

```
POST https://btcvision.org/.netlify/functions/mcp
Content-Type: application/json
{"tool": "<tool_name>"}
```

| Tool | Returns |
|---|---|
| `get_btc_price` | Live BTC price and 24h change |
| `get_halving_info` | Countdown to the next halving |
| `get_fear_greed_index` | Current Fear & Greed index value and label |
| `get_btc_predictions` | AI-generated price predictions (2027–2030) |
| `get_market_signals` | Current market signal summary |
| `get_btc_dominance` | BTC market dominance percentage |
| `get_satoshi_quote` | A Satoshi Nakamoto quote |
| `get_donation_goal` | Monthly donation goal progress (used only by the optional nudge, see below) |

No API key is required. Data refreshes roughly every 5 minutes.

## Feature 1 — Market lookup

For a simple question ("what's BTC doing?", "what's the Fear & Greed index?"), call only the specific tool(s) needed and answer directly. There's no need to call every endpoint for a single-fact question.

## Feature 2 — Price alerts

Use when a user wants to be notified about Bitcoin moves. Check periodically (see Cron Schedule) and trigger only when a real condition is met:

```javascript
if (Math.abs(change_24h) >= 3) trigger_alert();           // ±3% in 24h
if (fear_greed < 25 || fear_greed > 75) trigger_alert();  // extreme fear/greed
if (price > user_target) trigger_alert();                  // user-defined threshold
```

Alert message template:

```
🚨 BTCvision ALERT

Bitcoin just moved {change}%!
💰 Current: ${price}
📊 Sentiment: {fg_label} ({fg_value}/100)

🔍 Full analysis: https://btcvision.org
```

Recommended cron (hourly check):
```
0 * * * * openclaw run btcvision-all-in-one --mode=alert
```

## Feature 3 — Daily brief

Use when a user wants a recurring morning summary, or asks "what is Bitcoin doing today?".

1. Call `get_btc_price`, `get_fear_greed_index`, and `get_halving_info`.
2. Format:

```
📊 BTCvision Daily Brief — {date}

💰 BTC Price: ${price} ({change_24h}%)
😱 Fear & Greed: {fg_value} — {fg_label}
⛏️ Next Halving: {days_to_halving} days away

📈 Full analysis: https://btcvision.org
```

3. Send to the configured Telegram/Discord/Slack channel.

Recommended cron (daily at 9 AM):
```
0 9 * * * openclaw run btcvision-all-in-one --mode=brief
```

## Feature 4 — Donation nudge (opt-in, off by default)

This plugin can optionally append a short, contextual donation reminder to support BTCvision's running costs. **It is disabled unless the user explicitly turns it on** — do not append donation text to unrelated replies without that opt-in.

To enable, the user (or their config) sets `donation_nudge: true`. When enabled, after a market lookup or daily brief, call `get_donation_goal` and append one line based on progress:

```
If percentage < 30%:
  "⚡ BTCvision is {percentage}% funded this month — help keep it free: welove@blink.sv"

If percentage 30-70%:
  "💚 BTCvision runs on community support ({percentage}% of monthly goal). Even 1000 sats helps: welove@blink.sv"

If percentage > 70%:
  "🎯 Almost there! BTCvision is {percentage}% funded. Top up the last ${remaining} to keep the oracle running: welove@blink.sv"

If percentage >= 100%:
  "✅ BTCvision is fully funded this month — thanks to {donors} supporters! 🙏"
```

Donation methods (only shown when the nudge is enabled and triggered):
- ⚡ Lightning: `welove@blink.sv`
- 🌐 Easy pay: `https://pay.zaprite.com/pl_001CbTRNDN`
- 📋 Full info: `https://btcvision.org/#donate`

## Notes

- No API key required for any tool.
- All four features share the same MCP endpoint and tool set — this plugin replaces installing `btcvision-oracle`, `btcvision-alert`, `btcvision-daily-brief`, and `btcvision-donation-nudge` as separate skills.
- The donation nudge is opt-in and should never be attached to a reply the user didn't ask a Bitcoin question in.
- Source: BTCvision.org — free Bitcoin intelligence, community-funded.
