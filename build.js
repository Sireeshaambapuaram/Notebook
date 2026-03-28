import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Building React app...');

// Build the React app
execSync('cd ../frontend && npm install && npm run build', { stdio: 'inherit' });

// Create client/build directory if it doesn't exist
const buildDir = path.join(__dirname, 'client', 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy build files
execSync('xcopy ../frontend/dist client/build /E /I /Y', { stdio: 'inherit' });

console.log('Build completed successfully!'); 