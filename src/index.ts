import { execSync } from "node:child_process";
import { homedir } from "node:os";
import { postToDiscord } from "./discord.js";
import { appendToSession } from "./session.js";

function getToken(): string {
  if (process.env.REDACTED_ENV_VAR) {
    return process.env.REDACTED_ENV_VAR;
  }
  try {
    return execSync("REDACTED_COMMAND", {
      encoding: "utf-8",
    }).trim();
  } catch {
    throw new Error(
      "REDACTED_ENV_VAR not set and 'REDACTED_COMMAND' failed.",
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
