import { execSync } from "node:child_process";

export function postToDiscord(channelId: string, content: string): void {
  const args = [
    "openclaw",
    "message",
    "send",
    "--channel",
    "discord",
    "--account",
    "kagura",
    "--target",
    `channel:${channelId}`,
    "--message",
    content,
  ];

  try {
    execSync(args.join(" "), {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    console.log("Message sent to Discord via openclaw CLI.");
  } catch (err) {
    const stderr =
      err instanceof Error && "stderr" in err
        ? (err as any).stderr
        : String(err);
    throw new Error(`openclaw message send failed: ${stderr}`);
  }
}
