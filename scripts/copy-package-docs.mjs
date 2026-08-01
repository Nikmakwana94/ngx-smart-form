import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const libraryDir = join(rootDir, 'projects', 'ngx-smart-form');

const files = ['README.md', 'LICENSE'];

for (const file of files) {
  const source = join(rootDir, file);
  const target = join(libraryDir, file);

  if (!existsSync(source)) {
    throw new Error(`Missing package doc source file: ${source}`);
  }

  copyFileSync(source, target);
  console.log(`Copied ${file} -> projects/ngx-smart-form/${file}`);
}
