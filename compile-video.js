/**
 * Compiles the 4 AI cinematic scenes + synthesized piano audio into an MP4 video & GIF
 * Uses FFmpeg with smooth transitions and Ken Burns motion
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function compileVideo(imagePaths, audioPath, outputMp4, outputGif) {
  console.log('Compiling cinematic video with FFmpeg...');
  imagePaths.forEach((p, idx) => console.log(`Scene ${idx + 1}:`, p));

  // Step 1: Create normalized 1920x1080 video segments with smooth pan/zoom
  const tempSegments = [];
  const sceneDurations = [4, 4, 4.5, 5.5];

  imagePaths.forEach((imgPath, idx) => {
    const segOut = path.join(__dirname, `temp_seg_${idx}.mp4`);
    tempSegments.push(segOut);
    const dur = sceneDurations[idx];
    const totalFrames = dur * 30;

    // Zoompan takes single image input (no -loop) and creates d frames
    let zoomFilter = '';
    if (idx === 0) {
      zoomFilter = `zoompan=z='min(zoom+0.001,1.12)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30`;
    } else if (idx === 1) {
      zoomFilter = `zoompan=z='min(zoom+0.0012,1.15)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30`;
    } else if (idx === 2) {
      zoomFilter = `zoompan=z='min(zoom+0.0014,1.18)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30`;
    } else {
      zoomFilter = `zoompan=z='if(lte(zoom,1.0),1.12,max(1.0,zoom-0.0008))':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30`;
    }

    const cmd = `ffmpeg -y -i "${imgPath}" -vf "${zoomFilter},format=yuv420p" -c:v libx264 -preset fast -crf 18 "${segOut}"`;
    execSync(cmd, { stdio: 'inherit' });
  });

  // Step 2: Create concat filter with crossfades
  const concatList = path.join(__dirname, 'concat_list.txt');
  const fileLines = tempSegments.map(seg => `file '${seg.replace(/\\/g, '/')}'`).join('\n');
  fs.writeFileSync(concatList, fileLines, 'utf-8');

  // Step 3: Combine with audio track and fadeout
  const cmdFinal = `ffmpeg -y -f concat -safe 0 -i "${concatList}" -i "${audioPath}" -c:v libx264 -preset medium -crf 19 -c:a aac -b:a 192k -af "afade=t=out:st=16:d=2" -shortest -pix_fmt yuv420p "${outputMp4}"`;
  execSync(cmdFinal, { stdio: 'inherit' });
  console.log('Video MP4 created successfully at:', outputMp4);

  // Step 4: Create animated GIF (optimized for mobile Zalo/FB sharing)
  console.log('Creating animated GIF preview...');
  const cmdGif = `ffmpeg -y -ss 0 -t 16 -i "${outputMp4}" -vf "fps=12,scale=540:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "${outputGif}"`;
  execSync(cmdGif, { stdio: 'inherit' });
  console.log('GIF preview created successfully at:', outputGif);

  // Clean up temp segments
  tempSegments.forEach(seg => {
    try { fs.unlinkSync(seg); } catch (e) {}
  });
  try { fs.unlinkSync(concatList); } catch (e) {}
}

module.exports = { compileVideo };
