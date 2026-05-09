#!/usr/bin/env node
import { Command } from "commander";
import { crosspost } from "./index.js";

const program = new Command();

program
  .name("crosspost")
  .description("Post a message to Discord and append to OpenClaw session transcript")
  .requiredOption("-c, --channel <id>", "Discord channel ID")
  .requiredOption("-m, --message <text>", "Message content")
  .action(async (opts: { channel: string; message: string }) => {
    try {
      await crosspost(opts.channel, opts.message);
    } catch (err) {
      console.error(
        `Error: ${err instanceof Error ? err.message : String(err)}`,
      );
      process.exit(1);
    }
  });

program.parse();
