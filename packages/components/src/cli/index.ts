#!/usr/bin/env node

import { Command } from 'commander';
import { fileURLToPath } from 'url';
import path from 'path';
import { getPackageVersion } from './utils';
import { commands } from './commands';

// Get __dirname in ESM module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get version from package.json
const version = getPackageVersion(__dirname);

// Create program
const program = new Command();

program
  .name('@vue-dnd-kit/components')
  .description('CLI for installing Vue DnD Kit components')
  .version(version);

// Register all commands
commands.forEach((command) => {
  const cmd = program.command(command.command).description(command.description);

  // Add options if exists
  if (
    'options' in command &&
    command.options &&
    Array.isArray(command.options)
  ) {
    command.options.forEach((opt) => {
      cmd.option(opt.flags, opt.description, opt.defaultValue);
    });
  }

  // Add action
  cmd.action(command.action);
});

// Show help if no arguments
if (process.argv.length <= 2) {
  program.outputHelp();
}

// Parse arguments
program.parse(process.argv);
