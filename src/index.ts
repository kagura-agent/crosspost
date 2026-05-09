import { postToDiscord } from "./discord.js";

/**
 * Post a message to Discord via openclaw CLI.
 *
 * Session context injection is handled separately by the agent runtime
 * using the sessions_send tool (not available as CLI).
 * When calling crosspost from within an agent session, pair it with
 * a sessions_send call to inject context into the target session.
 */
export function crosspost(channelId: string, message: string): void {
  postToDiscord(channelId, message);
}
