import { postToDiscord } from "./discord.js";

// TODO: Session injection is not yet supported.
// openclaw sessions CLI has no inject/append command.
// Once openclaw adds a way to inject messages into a session
// without triggering an agent run, add it here.

export function crosspost(channelId: string, message: string): void {
  postToDiscord(channelId, message);
}
