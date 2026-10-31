/**
 * Compiles the 4 AI direct card content scenes + orchestral piano audio into a Full HD 1080p video
 * 100% focused on the actual card content inside the QR code (no hands, no phones)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function compileCardContentVideo(imagePaths, audioPath, outputMp4, outputGif) {
  console.log('Compiling Direct Card Content Video with FFmpeg...');
  imagePaths.forEach((p, idx) => console.log(`Card Scene ${idx + 1}:`, p));

  const tempSegments = [];
  // Scene durations in seconds: [Intro envelope, Burst open, Letter & Poem, Grand Celebration]
  const sceneDurations = [4.5, 5.0, 5.0, 5.5];

  imagePaths.forEach((imgPath, idx) => {
    const segOut = path.join(__dirname, `temp_card_seg_${idx}.mp4`);
    tempSegments.push(segOut);
    const dur = sceneDurations[idx];
    const totalFrames = Math.floor(dur * 30);

    let zoomFilter = '';
    if (idx === 0) {
      // Gentle cinematic zoom in to royal seal
      zoomFilter = `zoompan=z='min(zoom+0.0008,1.12)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30`;
    } else if (idx === 1) {
      // Dynamic zoom into the bursting golden light & petals
      zoomFilter = `zoompan=z='min(zoom+0.0012,1.16)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30`;
    } else if (idx === 2) {
      // Gentle diagonal drift across the calligraphy letter and chalkboard
      zoomFilter = `zoompan=z='1.05':d=${totalFrames}:x='iw/2-(iw/zoom/2)+sin(on/30)*15':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30`;
    } else {
      // Majestic zoom out revealing the grand floral celebration
      zoomFilter = `zoompan=z='if(lte(zoom,1.0),1.14,max(1.0,zoom-0.0008))':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30`;
    }

    const cmd = `ffmpeg -y -i "${imgPath}" -vf "${zoomFilter},format=yuv420p" -c:v libx264 -preset fast -crf 17 "${segOut}"`;
    execSync(cmd, { stdio: 'inherit' });
  });

  // Concat list
  const concatList = path.join(__dirname, 'concat_card_list.txt');
  const fileLines = tempSegments.map(seg => `file '${seg.replace(/\\/g, '/')}'`).join('\n');
  fs.writeFileSync(concatList, fileLines, 'utf-8');

  // Combine with orchestral audio and fade out
  const cmdFinal = `ffmpeg -y -f concat -safe 0 -i "${concatList}" -i "${audioPath}" -c:v libx264 -preset medium -crf 18 -c:a aac -b:a 256k -af "afade=t=out:st=18:d=2" -shortest -pix_fmt yuv420p "${outputMp4}"`;
  execSync(cmdFinal, { stdio: 'inherit' });
  console.log('Direct Card Video MP4 created at:', outputMp4);

  // Animated GIF version
  console.log('Generating high quality GIF preview...');
  const cmdGif = `ffmpeg -y -ss 0 -t 18 -i "${outputMp4}" -vf "fps=12,scale=540:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "${outputGif}"`;
  execSync(cmdGif, { stdio: 'inherit' });
  console.log('Direct Card Video GIF created at:', outputGif);

  // Clean up
  tempSegments.forEach(seg => {
    try { fs.unlinkSync(seg); } catch (e) {}
  });
  try { fs.unlinkSync(concatList); } catch (e) {}
}

module.exports = { compileCardContentVideo };
