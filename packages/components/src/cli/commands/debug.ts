import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { findTemplatesDir } from '../utils';

// Get __dirname in ESM module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const debug = {
  command: 'debug',
  description: 'Show debug information',
  action: () => {
    console.log('Current directory:', process.cwd());
    console.log('__dirname:', __dirname);
    console.log('CLI file path:', __filename);

    const templateDir = findTemplatesDir(__dirname);
    console.log('Templates directory:', templateDir);
    console.log('Exists:', fs.existsSync(templateDir));

    if (fs.existsSync(templateDir)) {
      const files = fs.readdirSync(templateDir);
      console.log('Templates directory contents:', files);
    }
  },
};
