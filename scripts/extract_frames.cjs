const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = process.cwd();
const outDir = path.join(projectRoot, 'public', 'cabinet_frames_600fps');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const videoFile = path.join(projectRoot, 'Drone_flying_toward_mountain_summit_202609011645.mp4');
console.log(`Processing video: ${videoFile}`);

// Clean out existing frames
const existing = fs.readdirSync(outDir);
for (const file of existing) {
  fs.unlinkSync(path.join(outDir, file));
}

// 10s video -> minterpolate at 60fps = 600 frames
const cmd = `ffmpeg -y -i "${videoFile}" -vf "minterpolate=fps=60:mi_mode=blend,scale=1920:1080:flags=lanczos" -q:v 2 -threads 0 "${path.join(outDir, 'frame_%03d.jpg')}"`;

console.log('Running FFmpeg frame interpolation...');
execSync(cmd, { stdio: 'inherit' });

const files = fs.readdirSync(outDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png')).sort();
console.log(`Generated ${files.length} frames.`);

const manifestDir = path.join(projectRoot, 'src', 'components');
if (!fs.existsSync(manifestDir)) {
  fs.mkdirSync(manifestDir, { recursive: true });
}

fs.writeFileSync(path.join(manifestDir, 'frames.json'), JSON.stringify(files, null, 2), 'utf8');
console.log(`Manifest created at ${path.join(manifestDir, 'frames.json')}`);
