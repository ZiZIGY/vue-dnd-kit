import fs from 'fs';
import path from 'path';

export function createSpinner(text: string) {
  console.log(`⏳ ${text}`);
  return {
    succeed: (successText: string) => console.log(`✅ ${successText}`),
    fail: (errorText: string) => console.log(`❌ ${errorText}`),
    stop: () => {},
  };
}

// Get package version from package.json
export function getPackageVersion(dirPath: string): string {
  try {
    // Start with provided directory
    let currentDir = dirPath;

    // Look up for package.json (up to 10 levels)
    for (let i = 0; i < 10; i++) {
      const packageJsonPath = path.join(currentDir, 'package.json');

      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, 'utf8')
        );
        return packageJson.version || '0.0.0';
      }

      // Go up one level
      currentDir = path.join(currentDir, '..');
    }

    // If package.json not found, return fallback version
    return '0.0.0';
  } catch (error) {
    console.error('Error reading package version:', error);
    return '0.0.0';
  }
}

// Find templates directory
export function findTemplatesDir(startDir: string): string {
  // Start with current directory
  let currentDir = startDir;

  // In development mode
  const devTemplatesPath = path.join(currentDir, '..', 'templates');
  if (fs.existsSync(devTemplatesPath)) {
    return devTemplatesPath;
  }

  // In published package
  // Get base package path (node_modules/@vue-dnd-kit/components)
  let pkgPath = currentDir;
  // Move up to package root
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(pkgPath, 'package.json'))) {
      break;
    }
    pkgPath = path.join(pkgPath, '..');
  }

  // Check different paths relative to package root
  const paths = [
    path.join(pkgPath, 'src', 'templates'),
    path.join(pkgPath, 'templates'),
  ];

  for (const p of paths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // If not found, return first path (for error output)
  return paths[0];
}
