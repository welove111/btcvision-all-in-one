## Description: <br>
All-in-one Bitcoin intelligence plugin from BTCvision.org. Combines live BTC price, AI predictions, halving countdown, Fear & Greed index, and market signals (Oracle) with automatic price-move alerts (Alert), a formatted daily market briefing for Telegram/Discord/Slack (Daily Brief), and an optional, opt-in donation reminder (Donation Nudge) — in a single plugin instead of four separate skills. <br>

This plugin is ready for commercial/non-commercial use. <br>

## Publisher: <br>
[welove111](https://clawhub.ai/user/welove111) <br>

### License/Terms of Use: <br>
MIT-0 <br>

## Use Case: <br>
Developers and agents use this plugin to answer Bitcoin market questions, retrieve BTC price/halving/Fear & Greed/prediction/dominance data, run scheduled price-alert checks, and post automated daily market briefs to chat channels. The donation-reminder feature is opt-in and is never appended to a reply without the user or operator explicitly enabling it. <br>

### Deployment Geography for Use: <br>
Global <br>

## Known Risks and Mitigations: <br>
Risk: Bitcoin predictions and market signals may be inaccurate or unsuitable for financial decisions. <br>
Mitigation: Treat all price, prediction, and signal output as informational only and require independent review before any trading or investment decision. <br>

Risk: Queries are sent to btcvision.org and may reveal interest in Bitcoin market data to a third-party service. <br>
Mitigation: Use the plugin only when sending those requests to BTCvision is acceptable for the user or organization. <br>

Risk: The alert and daily-brief features run on a schedule (cron) and can post to external channels (Telegram/Discord/Slack) without a human reviewing each message before it sends. <br>
Mitigation: Operators should configure the destination channel deliberately, test the message format before enabling the schedule, and treat all posted figures as informational, not financial advice. <br>

Risk: The donation-nudge feature could be misused to insert unsolicited payment requests into unrelated replies. <br>
Mitigation: The nudge is disabled by default and only activates when explicitly opted in via configuration; it is scoped to append only after a Bitcoin-related lookup or brief, never to unrelated conversation. <br>

## Reference(s): <br>
- [ClawHub plugin page](https://clawhub.ai/welove111/btcvision-all-in-one) <br>
- [BTCvision homepage](https://btcvision.org) <br>

## Plugin Output: <br>
**Output Type(s):** [Text, API calls, Guidance, Scheduled notifications] <br>
**Output Format:** [Plain text or Markdown responses based on JSON API results] <br>
**Output Parameters:** [1D] <br>
**Other Properties Related to Output:** [Calls the public BTCvision MCP endpoint without an API key; data updates roughly every 5 minutes; alert and brief features are designed to run on a cron schedule.] <br>

## Plugin Version(s): <br>
1.0.0 <br>

## Ethical Considerations: <br>
Users should evaluate whether this plugin is appropriate for their environment, review any generated or scheduled messages before relying on them, keep the donation nudge disabled unless they intend to use it, and apply their organization's safety, security, and compliance requirements before deployment. <br>
