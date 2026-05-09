import { readFile, appendFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes, createHash } from "node:crypto";
import { execSync } from "node:child_process";

interface SessionRecord {
  type: string;
  id: string;
  parentId: string;
  timestamp: string;
  message: {
    role: string;
    content: Array<{ type: string; text: string }>;
  };
}

/**
 * Find the most recent session .jsonl file for a given Discord channel.
 * Uses grep for efficiency (3000+ trajectory files).
 */
async function findSessionFile(
  agentDir: string,
  channelId: string,
): Promise<string | null> {
  const sessionsDir = join(agentDir, "sessions");
  const searchKey = `agent:kagura:discord:channel:${channelId}`;

  try {
    // Use grep to find trajectory files containing the session key (much faster than Node readFile loop)
    const matches = execSync(
      `grep -l ${JSON.stringify(searchKey)} ${JSON.stringify(sessionsDir)}/*.trajectory.jsonl 2>/dev/null`,
      { encoding: "utf-8", maxBuffer: 1024 * 1024 },
    ).trim();

    if (!matches) return null;

    const trajectoryFiles = matches.split("\n").filter(Boolean);

    // Find the most recent one by checking file modification time
    let newest: { path: string; mtime: number } | null = null;
    for (const tf of trajectoryFiles) {
      const s = await stat(tf);
      if (!newest || s.mtimeMs > newest.mtime) {
        newest = { path: tf, mtime: s.mtimeMs };
      }
    }

    if (!newest) return null;

    // Extract sessionId from the trajectory first line
    const content = await readFile(newest.path, "utf-8");
    const firstLine = content.split("\n")[0];
    if (!firstLine) return null;

    const record = JSON.parse(firstLine);
    const sessionId = record.sessionId ?? record.traceId;
    if (!sessionId) return null;

    const jsonlPath = join(sessionsDir, `${sessionId}.jsonl`);
    // Verify the jsonl file exists
    try {
      await stat(jsonlPath);
      return jsonlPath;
    } catch {
      return null;
    }
  } catch {
    // grep returns non-zero if no matches
    return null;
  }
}

/**
 * Read the last message ID from a session file to use as parentId.
 * Reads only the tail for efficiency.
 */
async function getLastMessageId(filePath: string): Promise<string | null> {
  try {
    // Use tail for efficiency on large files
    const tail = execSync(`tail -50 ${JSON.stringify(filePath)}`, {
      encoding: "utf-8",
    });
    const lines = tail.trim().split("\n");

    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const record = JSON.parse(lines[i]);
        if (record.type === "message" && record.id) {
          return record.id as string;
        }
      } catch {
        // skip malformed lines
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export async function appendToSession(
  agentDir: string,
  channelId: string,
  message: string,
): Promise<void> {
  const sessionFile = await findSessionFile(agentDir, channelId);
  if (!sessionFile) {
    console.warn(
      `Warning: No session file found for channel ${channelId}. Skipping transcript append.`,
    );
    return;
  }

  const parentId = (await getLastMessageId(sessionFile)) ?? "root";
  const id = randomBytes(4).toString("hex");

  const record: SessionRecord = {
    type: "message",
    id,
    parentId,
    timestamp: new Date().toISOString(),
    message: {
      role: "assistant",
      content: [{ type: "text", text: message }],
    },
  };

  await appendFile(sessionFile, "\n" + JSON.stringify(record));
  console.log(`Appended to session transcript: ${sessionFile}`);
}
