#!/usr/bin/env node
import { Command } from "commander";
import { crosspost } from "./index.js";

const program = new Command();

program
  .name("crosspost")
  .description("Post a message to Discord via openclaw CLI")
  .requiredOption("-c, --channel <id>", "Discord channel ID")
  .requiredOption("-m, --message <text>", "Message content")
  .action((opts: { channel: string; message: string }) => {
    try {
      crosspost(opts.channel, opts.message);
    } catch (err) {
      console.error(
        `Error: ${err instanceof Error ? err.message : String(err)}`,
      );
      process.exit(1);
    }
  });

program.parse();
