# BTCvision All-in-One

OpenClaw plugin bundling every BTCvision.org capability — live market data, price alerts, a daily brief, and an opt-in donation nudge — into one plugin instead of four separate skills.

No API key required. All data comes from the public BTCvision.org MCP endpoint.

## Tools registered

| Tool | Purpose |
|---|---|
| `btc_get_price` | Live BTC price and 24h change |
| `btc_get_halving_info` | Countdown to the next halving |
| `btc_get_fear_greed_index` | Current Fear & Greed index |
| `btc_get_predictions` | AI price predictions (informational only) |
| `btc_get_market_signals` | Market signal summary |
| `btc_get_dominance` | BTC market dominance % |
| `btc_get_satoshi_quote` | A Satoshi Nakamoto quote |
| `btc_check_alert` | Evaluate whether current conditions should trigger a price alert |
| `btc_daily_brief` | Build the formatted daily market brief |
| `btc_donation_nudge` | Contextual donation reminder (no-ops unless opted in) |

Also registers a `/btc-daily-brief` command.

## Config

```jsonc
{
  "plugins": {
    "entries": {
      "btcvision-all-in-one": {
        "config": {
          "donationNudge": false,        // opt-in, default false
          "alertThresholdPercent": 3,    // % move that triggers an alert
          "alertPriceTarget": null       // optional price target
        }
      }
    }
  }
}
```

The donation nudge is **disabled by default**. It only activates — and only ever appends to a Bitcoin-related reply, never an unrelated one — when `donationNudge: true` is set explicitly.

## Install

```bash
openclaw plugins install clawhub:@welove111/openclaw-btcvision-all-in-one
```

## License

MIT
