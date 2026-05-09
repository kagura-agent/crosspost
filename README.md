# @kagura-agent/crosspost

CLI tool that crosspost messages to a Discord channel and appends them to an OpenClaw session transcript.

## Installation

```bash
npm install
npm run build
```

## Usage

```bash
npx crosspost --channel <discord_channel_id> --message 'Hello world'
# or short flags:
npx crosspost -c <discord_channel_id> -m 'Hello world'
```

## Environment

- **DISCORD_BOT_TOKEN** — Discord bot token. If not set, falls back to `pass show openclaw/discord/botToken`.
- **OPENCLAW_AGENT_DIR** — Agent directory (default: `~/.openclaw/agents/kagura`).

## What it does

1. Sends the message to the specified Discord channel via the Discord API.
2. Finds the OpenClaw session transcript for that channel and appends an assistant message record.

If no session transcript exists for the channel, the Discord message is still sent and a warning is printed.

## License

MIT
