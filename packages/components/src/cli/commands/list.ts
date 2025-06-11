import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createSpinner, findTemplatesDir } from '../utils';

// Get __dirname in ESM module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Console colors
const colors = {
  blue: (text: string) => `\x1b[34m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
};

export const list = {
  command: 'list',
  description: 'Show available components',
  action: () => {
    const spinner = createSpinner('Getting component list...');

    try {
      const templateDir = findTemplatesDir(__dirname);

      if (!fs.existsSync(templateDir)) {
        spinner.fail('Templates directory not found');
        process.exit(1);
      }

      const components = fs
        .readdirSync(templateDir)
        .filter((file) =>
          fs.statSync(path.join(templateDir, file)).isDirectory()
        );

      if (components.length === 0) {
        console.log(colors.yellow('No available components'));
        process.exit(0);
      }

      console.log(colors.green('\nAvailable components:'));
      components.forEach((comp) => {
        console.log(`  - ${colors.blue(comp)}`);
      });
    } catch (error) {
      spinner.fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  },
};
