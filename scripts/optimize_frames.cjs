const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = process.cwd();
const framesDir = path.join(projectRoot, 'public', 'cabinet_frames_600fps');
const tempDir = path.join(projectRoot, 'public', 'cabinet_frames_webp_temp');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

console.log('--- Starting Frame Optimization to WebP ---');

// Read all existing jpg frames
const jpgFiles = fs.readdirSync(framesDir).filter(f => f.endsWith('.jpg')).sort();
console.log(`Found ${jpgFiles.length} source JPEG frames.`);

// Pick 300 evenly spaced frames (every other frame) for high smoothness & optimal size
const targetCount = 300;
const step = jpgFiles.length / targetCount;
const selectedFrames = [];

for (let i = 0; i < targetCount; i++) {
  const index = Math.min(Math.floor(i * step), jpgFiles.length - 1);
  selectedFrames.push(jpgFiles[index]);
}

console.log(`Selected ${selectedFrames.length} frames for conversion at 1600x900 WebP (q=55)...`);

// Convert in batches
const concurrency = 6;
let completed = 0;

async function runConversion() {
  const chunks = [];
  for (let i = 0; i < selectedFrames.length; i += concurrency) {
    chunks.push(selectedFrames.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    await Promise.all(chunk.map((file, idx) => {
      return new Promise((resolve, reject) => {
        const globalIndex = completed + idx + 1;
        const outName = `frame_${String(globalIndex).padStart(3, '0')}.webp`;
        const inPath = path.join(framesDir, file);
        const outPath = path.join(tempDir, outName);

        const cmd = `ffmpeg -y -i "${inPath}" -vf "scale=1600:900" -c:v libwebp -quality 55 -compression_level 4 "${outPath}"`;
        try {
          execSync(cmd, { stdio: 'ignore' });
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    }));
    completed += chunk.length;
    if (completed % 50 === 0 || completed === selectedFrames.length) {
      process.stdout.write(`Converted ${completed}/${selectedFrames.length} frames...\r`);
    }
  }

  console.log(`\nAll ${selectedFrames.length} frames successfully converted to WebP.`);

  // Clean out old frames in framesDir
  console.log('Replacing old JPEG frames with new WebP frames...');
  const oldFiles = fs.readdirSync(framesDir);
  for (const f of oldFiles) {
    fs.unlinkSync(path.join(framesDir, f));
  }

  // Move temp webp files to framesDir
  const webpFiles = fs.readdirSync(tempDir).filter(f => f.endsWith('.webp')).sort();
  for (const f of webpFiles) {
    fs.renameSync(path.join(tempDir, f), path.join(framesDir, f));
  }
  fs.rmdirSync(tempDir);

  // Measure total new size
  let totalBytes = 0;
  for (const f of webpFiles) {
    totalBytes += fs.statSync(path.join(framesDir, f)).size;
  }
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
  console.log(`\nNew public/cabinet_frames_600fps directory size: ${totalMB} MB (was 181 MB)`);

  // Update frames.json manifest
  const manifestPath = path.join(projectRoot, 'src', 'components', 'frames.json');
  fs.writeFileSync(manifestPath, JSON.stringify(webpFiles, null, 2), 'utf8');
  console.log(`Updated frames.json with ${webpFiles.length} WebP frames.`);
}

runConversion().catch(err => {
  console.error('Conversion failed:', err);
  process.exit(1);
});
