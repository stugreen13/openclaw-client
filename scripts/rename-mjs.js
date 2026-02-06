#!/usr/bin/env node
/**
 * Renames .js files to .mjs for ESM output
 * This is a simple post-build script for dual ESM/CJS distribution
 */
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');

function renameJsToMjs(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      renameJsToMjs(filePath);
    } else if (file.endsWith('.js') && !file.endsWith('.d.ts')) {
      const mjsPath = filePath.replace(/\.js$/, '.mjs');
      fs.renameSync(filePath, mjsPath);
      console.log(`Renamed: ${file} -> ${path.basename(mjsPath)}`);
    }
  }
}

if (fs.existsSync(distDir)) {
  renameJsToMjs(distDir);
  console.log('ESM build complete');
} else {
  console.error('dist directory not found');
  process.exit(1);
}
