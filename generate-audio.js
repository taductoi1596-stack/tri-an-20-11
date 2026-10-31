/**
 * Synthesizes an emotional, rich orchestral piano & chime track for the Teachers' Day Greeting Card
 * Pure 44.1kHz 16-bit Stereo PCM WAV without any external dependencies
 */

const fs = require('fs');
const path = require('path');

const sampleRate = 44100;
const durationSec = 20; // 20 seconds of cinematic warmth
const totalSamples = sampleRate * durationSec;
const numChannels = 2;

// Musical frequencies (Hz)
const N = {
  C2: 65.41, G2: 98.00, C3: 130.81, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, C6: 1046.50
};

// Rich score: [noteName, startSec, durationSec, volume, isChime, pan]
const score = [
  // Scene 1 (0s - 4.5s): Royal envelope resting in warm light
  ['C3', 0.0, 5.0, 0.45, false, 0.4], ['G3', 0.4, 4.5, 0.35, false, 0.6], ['C4', 0.8, 4.0, 0.4, false, 0.5],
  ['E4', 1.2, 3.0, 0.45, false, 0.3], ['G4', 1.8, 2.5, 0.5, false, 0.7], ['C5', 2.5, 3.0, 0.55, true, 0.5],
  ['B4', 3.4, 2.0, 0.45, false, 0.4], ['A4', 4.0, 2.0, 0.48, false, 0.6],

  // Scene 2 (4.5s - 9.5s): Wax seal breaks & envelope opens, burst of light
  ['F2', 4.5, 5.0, 0.5, false, 0.35], ['C3', 4.8, 4.5, 0.4, false, 0.65], ['A3', 5.1, 4.0, 0.45, false, 0.4],
  // Sparkle chime ascending burst
  ['C5', 4.7, 1.5, 0.4, true, 0.2], ['E5', 4.9, 1.5, 0.45, true, 0.4], ['G5', 5.1, 1.8, 0.5, true, 0.6], ['C6', 5.3, 2.5, 0.6, true, 0.8],
  ['A4', 5.8, 2.0, 0.5, false, 0.4], ['C5', 6.5, 2.5, 0.58, false, 0.6], ['D5', 7.5, 2.0, 0.6, false, 0.5],
  ['E5', 8.2, 3.0, 0.65, true, 0.5], ['D5', 9.0, 1.5, 0.5, false, 0.4],

  // Scene 3 (9.5s - 14.5s): Heartfelt Letter & Poem "Bụi Phấn" theme
  ['A2', 9.5, 5.0, 0.52, false, 0.4], ['E3', 9.8, 4.5, 0.42, false, 0.6], ['C4', 10.1, 4.0, 0.45, false, 0.5],
  ['C5', 10.0, 2.0, 0.55, false, 0.5], ['B4', 10.8, 1.5, 0.5, false, 0.4], ['A4', 11.5, 2.0, 0.55, false, 0.6],
  ['G4', 12.2, 1.8, 0.5, false, 0.4], ['F4', 13.0, 1.8, 0.48, false, 0.5], ['E4', 13.8, 2.5, 0.52, false, 0.5],
  ['G3', 12.5, 4.0, 0.4, false, 0.3],

  // Scene 4 (14.5s - 20s): Grand floral celebration finale
  ['C2', 14.5, 5.5, 0.6, false, 0.5], ['G2', 14.8, 5.0, 0.5, false, 0.4], ['C3', 15.0, 4.5, 0.45, false, 0.6],
  ['G4', 14.6, 2.5, 0.55, false, 0.3], ['C5', 15.2, 2.5, 0.6, false, 0.7], ['E5', 15.8, 3.0, 0.7, true, 0.5],
  ['G5', 16.4, 3.5, 0.65, true, 0.6], ['C6', 17.0, 4.0, 0.75, true, 0.5],
  // Warm resolution decay
  ['E4', 17.5, 3.5, 0.4, false, 0.4], ['G4', 18.0, 3.0, 0.4, false, 0.6], ['C5', 18.5, 3.0, 0.45, false, 0.5]
];

const left = new Float32Array(totalSamples);
const right = new Float32Array(totalSamples);

score.forEach(([noteName, startSec, durSec, vol, isChime, pan]) => {
  const freq = N[noteName] || 440;
  const startSample = Math.floor(startSec * sampleRate);
  const noteSamples = Math.floor(durSec * sampleRate);

  for (let i = 0; i < noteSamples; i++) {
    const idx = startSample + i;
    if (idx >= totalSamples) break;

    const t = i / sampleRate;
    const attack = Math.min(1.0, t / (isChime ? 0.008 : 0.03));
    const decay = Math.exp(-t * (isChime ? 1.4 : 1.6));
    const env = attack * decay * vol;

    let sampleVal = 0;
    if (isChime) {
      // Crystal bell timbre (higher non-harmonic partials)
      sampleVal = Math.sin(2 * Math.PI * freq * t) +
                  0.5 * Math.sin(2 * Math.PI * freq * 2.76 * t) * Math.exp(-t * 2.5) +
                  0.3 * Math.sin(2 * Math.PI * freq * 5.4 * t) * Math.exp(-t * 4.0);
    } else {
      // Warm piano/strings resonance
      sampleVal = Math.sin(2 * Math.PI * freq * t) +
                  0.6 * Math.sin(2 * Math.PI * freq * 2 * t) * Math.exp(-t * 2.0) +
                  0.3 * Math.sin(2 * Math.PI * freq * 3 * t) * Math.exp(-t * 2.6) +
                  0.15 * Math.sin(2 * Math.PI * freq * 4 * t) * Math.exp(-t * 3.2);
    }

    const val = sampleVal * env;
    left[idx] += val * (1 - pan);
    right[idx] += val * pan;
  }
});

// Master normalization
let maxAmp = 0;
for (let i = 0; i < totalSamples; i++) {
  if (Math.abs(left[i]) > maxAmp) maxAmp = Math.abs(left[i]);
  if (Math.abs(right[i]) > maxAmp) maxAmp = Math.abs(right[i]);
}
const norm = maxAmp > 0 ? (0.88 / maxAmp) : 1;

// Build Stereo WAV
const subChunk2Size = totalSamples * numChannels * 2;
const buffer = Buffer.alloc(44 + subChunk2Size);

buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + subChunk2Size, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(numChannels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * numChannels * 2, 28);
buffer.writeUInt16LE(numChannels * 2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(subChunk2Size, 40);

let offset = 44;
for (let i = 0; i < totalSamples; i++) {
  const l = Math.max(-1, Math.min(1, left[i] * norm));
  const r = Math.max(-1, Math.min(1, right[i] * norm));
  buffer.writeInt16LE(Math.floor(l < 0 ? l * 0x8000 : l * 0x7FFF), offset);
  buffer.writeInt16LE(Math.floor(r < 0 ? r * 0x8000 : r * 0x7FFF), offset + 2);
  offset += 4;
}

const outputPath = path.join(__dirname, 'bg-card-music.wav');
fs.writeFileSync(outputPath, buffer);
console.log('Orchestral card music created at:', outputPath, `(${durationSec}s)`);
