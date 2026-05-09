import { execSync } from "node:child_process";
import { homedir } from "node:os";
import { postToDiscord } from "./discord.js";
import { appendToSession } from "./session.js";

function getToken(): string {
  if (process.env.DISCORD_BOT_TOKEN) {
    return process.env.DISCORD_BOT_TOKEN;
  }
  try {
    return execSync("pass show openclaw/discord/botToken", {
      encoding: "utf-8",
    }).trim();
  } catch {
    throw new Error(
      "DISCORD_BOT_TOKEN not set and 'pass show openclaw/discord/botToken' failed.",
    );
  }
}

export async function crosspost(
  channelId: string,
  message: string,
): Promise<void> {
  const token = getToken();
  const agentDir =
    process.env.OPENCLAW_AGENT_DIR ??
    `${homedir()}/.openclaw/agents/kagura`;

  await postToDiscord(channelId, message, token);
  await appendToSession(agentDir, channelId, message);
}
