/**
 * Synthesizes a gentle, emotional 16-second piano/chime soundtrack for Teachers' Day
 * Generates pure 44.1kHz 16-bit Stereo PCM WAV without external dependencies
 */

const fs = require('fs');
const path = require('path');

const sampleRate = 44100;
const durationSec = 18;
const totalSamples = sampleRate * durationSec;
const numChannels = 2;

// Pentatonic warm piano frequencies (Hz)
const notes = {
  C3: 130.81, G3: 196.00, C4: 261.63, D4: 293.66, E4: 329.63,
  G4: 392.00, A4: 440.00, C5: 523.25, D5: 587.33, E5: 659.25,
  G5: 783.99, A5: 880.00, C6: 1046.50
};

// Poetic melodic sequence: [noteName, startTimeSec, durationSec, volume]
const melody = [
  // Intro chime / chords
  ['C4', 0.0, 3.5, 0.4], ['E4', 0.2, 3.0, 0.35], ['G4', 0.4, 3.0, 0.35], ['C5', 0.6, 4.0, 0.5],
  ['C3', 0.0, 4.0, 0.45], ['G3', 0.5, 3.5, 0.35],
  
  // Melody phrase 1: Scanning & light
  ['E4', 1.5, 1.2, 0.4], ['G4', 2.3, 1.2, 0.45], ['A4', 3.0, 1.5, 0.5], ['C5', 4.0, 2.5, 0.55],
  ['A4', 5.2, 1.2, 0.4], ['G4', 6.0, 1.8, 0.45], ['E4', 7.0, 2.5, 0.5],
  ['A3', 3.5, 4.0, 0.4], ['C4', 3.8, 3.5, 0.35],

  // Melody phrase 2: Envelope reveals & bloom
  ['G4', 8.0, 1.2, 0.45], ['A4', 8.8, 1.2, 0.5], ['C5', 9.5, 1.5, 0.55], ['D5', 10.5, 2.0, 0.6],
  ['E5', 11.5, 3.0, 0.65], ['G5', 12.0, 3.0, 0.5], ['C6', 12.5, 4.0, 0.45],
  ['F3', 8.5, 4.5, 0.45], ['C4', 8.8, 4.0, 0.4], ['E4', 9.0, 3.5, 0.35],

  // Outro peaceful resolution
  ['D5', 13.5, 1.5, 0.45], ['C5', 14.5, 3.5, 0.55], ['G4', 15.0, 3.0, 0.4], ['E4', 15.5, 2.5, 0.35],
  ['C3', 14.0, 4.0, 0.4], ['G3', 14.3, 3.8, 0.35], ['C4', 14.6, 3.5, 0.3]
];

// Left and right sample buffers (Float32)
const left = new Float32Array(totalSamples);
const right = new Float32Array(totalSamples);

// Synthesize each piano note with harmonics and natural decay
melody.forEach(([noteName, startSec, durSec, vol]) => {
  const freq = notes[noteName] || 440;
  const startSample = Math.floor(startSec * sampleRate);
  const noteSamples = Math.floor(durSec * sampleRate);

  for (let i = 0; i < noteSamples; i++) {
    const idx = startSample + i;
    if (idx >= totalSamples) break;

    const t = i / sampleRate;
    // Exponential decay with slight soft attack
    const attack = Math.min(1.0, t / 0.025);
    const decay = Math.exp(-t * 1.8);
    const env = attack * decay * vol;

    // Rich harmonic spectrum for warm acoustic piano timbre
    const fundamental = Math.sin(2 * Math.PI * freq * t);
    const h2 = 0.5 * Math.sin(2 * Math.PI * freq * 2 * t) * Math.exp(-t * 2.2);
    const h3 = 0.25 * Math.sin(2 * Math.PI * freq * 3 * t) * Math.exp(-t * 2.8);
    const h4 = 0.12 * Math.sin(2 * Math.PI * freq * 4 * t) * Math.exp(-t * 3.5);
    const chime = 0.08 * Math.sin(2 * Math.PI * freq * 5.02 * t) * Math.exp(-t * 4.0);

    const val = (fundamental + h2 + h3 + h4 + chime) * env;

    // Stereo panning (slightly alternating for spatial feel)
    const pan = 0.5 + 0.15 * Math.sin(freq * 0.05);
    left[idx] += val * (1 - pan);
    right[idx] += val * pan;
  }
});

// Normalize and master
let maxAmp = 0;
for (let i = 0; i < totalSamples; i++) {
  if (Math.abs(left[i]) > maxAmp) maxAmp = Math.abs(left[i]);
  if (Math.abs(right[i]) > maxAmp) maxAmp = Math.abs(right[i]);
}
const normFactor = maxAmp > 0 ? (0.85 / maxAmp) : 1;

// Build WAV Buffer
const subChunk2Size = totalSamples * numChannels * 2;
const buffer = Buffer.alloc(44 + subChunk2Size);

// RIFF header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + subChunk2Size, 4);
buffer.write('WAVE', 8);

// fmt chunk
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // SubChunk1Size (PCM)
buffer.writeUInt16LE(1, 20);  // AudioFormat (PCM)
buffer.writeUInt16LE(numChannels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * numChannels * 2, 28); // ByteRate
buffer.writeUInt16LE(numChannels * 2, 32); // BlockAlign
buffer.writeUInt16LE(16, 34); // BitsPerSample

// data chunk
buffer.write('data', 36);
buffer.writeUInt32LE(subChunk2Size, 40);

let offset = 44;
for (let i = 0; i < totalSamples; i++) {
  const lSample = Math.max(-1, Math.min(1, left[i] * normFactor));
  const rSample = Math.max(-1, Math.min(1, right[i] * normFactor));

  const lInt = lSample < 0 ? lSample * 0x8000 : lSample * 0x7FFF;
  const rInt = rSample < 0 ? rSample * 0x8000 : rSample * 0x7FFF;

  buffer.writeInt16LE(Math.floor(lInt), offset);
  buffer.writeInt16LE(Math.floor(rInt), offset + 2);
  offset += 4;
}

const outputPath = path.join(__dirname, 'bg-music.wav');
fs.writeFileSync(outputPath, buffer);
console.log('Audio track created successfully at:', outputPath, `(${durationSec}s, ${buffer.length} bytes)`);
