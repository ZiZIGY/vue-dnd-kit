import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createSpinner, findTemplatesDir } from '../utils';
import { copyDir, ensureDir } from '../filesystem';
import { askYesNo } from '../prompts';

// Get __dirname in ESM module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Console colors
const colors = {
  blue: (text: string) => `\x1b[34m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
};

export const add = {
  command: 'add <component>',
  description: 'Add a component to your project',
  options: [
    {
      flags: '-d, --dir <directory>',
      description: 'Directory to install the component',
      defaultValue: 'src/components',
    },
  ],
  action: async (component: string, options: { dir: string }) => {
    const spinner = createSpinner(
      `Installing component ${colors.blue(component)}...`
    );

    // Use IIFE for async/await
    (async function () {
      try {
        // User project path
        const projectDir = process.cwd();

        // Find templates directory
        const templateDir = findTemplatesDir(__dirname);

        // Check if component exists
        const componentPath = path.join(templateDir, component);
        if (!fs.existsSync(componentPath)) {
          spinner.fail(`Component ${colors.red(component)} not found`);

          // Show available components
          const availableComponents = fs
            .readdirSync(templateDir)
            .filter((file) =>
              fs.statSync(path.join(templateDir, file)).isDirectory()
            );

          if (availableComponents.length > 0) {
            console.log(colors.yellow('\nAvailable components:'));
            availableComponents.forEach((comp) => {
              console.log(`  - ${comp}`);
            });
          } else {
            console.log(
              colors.yellow('\nNo available components in templates.')
            );
          }

          process.exit(1);
        }

        // Destination path
        const destDir = path.join(projectDir, options.dir);

        // Create directory if it doesn't exist
        ensureDir(destDir);

        // Copy component
        copyDir(componentPath, path.join(destDir, component));

        // Check dependencies
        const packageJsonPath = path.join(projectDir, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          let packageJson;
          try {
            packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          } catch (err) {
            console.log(
              colors.yellow(
                `Warning: unable to read package.json: ${
                  (err as Error).message
                }`
              )
            );
            packageJson = { dependencies: {} };
          }

          const missingDeps: string[] = [];

          // Check for required dependencies
          if (
            !packageJson.dependencies ||
            !packageJson.dependencies['@vue-dnd-kit/core']
          ) {
            missingDeps.push('@vue-dnd-kit/core');
          }

          if (missingDeps.length > 0) {
            spinner.stop();

            try {
              const installDeps = await askYesNo(
                `Missing dependencies detected: ${missingDeps.join(
                  ', '
                )}. Install?`
              );

              if (installDeps) {
                const installSpinner = createSpinner(
                  'Installing dependencies...'
                );
                console.log(
                  `\n${colors.cyan('Run the following command manually:')}`
                );
                console.log(`yarn add ${missingDeps.join(' ')}\n`);
                installSpinner.succeed(
                  'Dependency installation instructions provided'
                );
              }
            } catch (err) {
              console.log(
                colors.yellow(
                  `\nMissing dependencies detected: ${missingDeps.join(', ')}`
                )
              );
              console.log(colors.cyan('Run the following command manually:'));
              console.log(`yarn add ${missingDeps.join(' ')}\n`);
            }
          }
        }

        spinner.succeed(
          `Component ${colors.green(
            component
          )} successfully installed in ${colors.blue(
            options.dir + '/' + component
          )}`
        );
      } catch (error) {
        spinner.fail(`Installation error: ${(error as Error).message}`);
        console.error(error);
        process.exit(1);
      }
    })();
  },
};
