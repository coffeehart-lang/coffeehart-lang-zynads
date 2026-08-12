/**
 * Web Audio API Audio Processing, AudioWorklet & Normalization Pipeline
 * 
 * Provides real-time AudioWorkletProcessor and DSP filters for microphone recordings and TTS audio:
 * - AudioWorkletProcessor: Real-time gain normalization & high-frequency robotic artifact suppression
 * - Peak Normalization (auto-gain adjustment to -1dBFS)
 * - Anti-Robotic Artifact Smoothing (filters harsh clocking jitter and 8kHz-12kHz metallic buzz)
 * - Vocal Clarity Equalization (sub-rumble cutoff + 2.5kHz vocal presence boost)
 * - Dynamic Range Compression (smooths quiet whispers and tames loud transients)
 * - Processed MediaStream Wrapper for clear MediaRecorder recordings
 */

const WORKLET_PROCESSOR_CODE = `
class ArtifactSuppressorWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.smoothGain = 1.0;
    this.targetGain = 1.0;
    this.maxPeak = 0.01;
    this.prevSamples = [0, 0];
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];

    if (!input || input.length === 0) return true;

    for (let channel = 0; channel < input.length; ++channel) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];
      if (!inputChannel || !outputChannel) continue;

      let frameMax = 0;
      for (let i = 0; i < inputChannel.length; ++i) {
        const absVal = Math.abs(inputChannel[i]);
        if (absVal > frameMax) frameMax = absVal;
      }

      // Smooth peak envelope follower
      this.maxPeak = this.maxPeak * 0.96 + frameMax * 0.04;
      if (this.maxPeak > 0.001) {
        this.targetGain = Math.min(2.0, 0.92 / Math.max(0.05, this.maxPeak));
      }

      // Smooth gain transitions to eliminate click/pop artifacts
      this.smoothGain = this.smoothGain * 0.92 + this.targetGain * 0.08;

      // 1-Pole Low-Pass & De-Resonance Filter to suppress high-frequency metallic artifacts
      let lastSample = this.prevSamples[channel] || 0;
      const alpha = 0.38; // Cutoff filter smoothing factor for ~8kHz-10kHz high-freq jitter

      for (let i = 0; i < inputChannel.length; ++i) {
        const rawSample = inputChannel[i] * this.smoothGain;
        // Suppress high-frequency robotic resonances
        const filteredSample = lastSample + alpha * (rawSample - lastSample);
        lastSample = filteredSample;
        outputChannel[i] = filteredSample;
      }
      this.prevSamples[channel] = lastSample;
    }

    return true;
  }
}

registerProcessor('artifact-suppressor-worklet', ArtifactSuppressorWorkletProcessor);
`;

let sharedAudioCtx: AudioContext | null = null;
let workletLoadedCtxs = new Set<AudioContext>();

export function getSharedAudioContext(): AudioContext {
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    sharedAudioCtx = new AudioCtxClass();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

/**
 * Registers the ArtifactSuppressorWorkletProcessor on the given AudioContext.
 */
export async function registerArtifactSuppressorWorklet(audioCtx: AudioContext): Promise<boolean> {
  if (workletLoadedCtxs.has(audioCtx)) return true;
  try {
    if (!audioCtx.audioWorklet) return false;
    const blob = new Blob([WORKLET_PROCESSOR_CODE], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    await audioCtx.audioWorklet.addModule(url);
    URL.revokeObjectURL(url);
    workletLoadedCtxs.add(audioCtx);
    return true;
  } catch (err) {
    console.warn('AudioWorklet registration fallback to BiquadFilter:', err);
    return false;
  }
}

/**
 * Normalizes PCM audio buffer samples to target peak level (default 0.95 / -0.45 dBFS)
 */
export function normalizeAudioBuffer(buffer: AudioBuffer, targetPeak: number = 0.95): AudioBuffer {
  let maxPeak = 0;

  // Find overall peak magnitude across all channels
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const channelData = buffer.getChannelData(c);
    for (let i = 0; i < channelData.length; i++) {
      const absVal = Math.abs(channelData[i]);
      if (absVal > maxPeak) {
        maxPeak = absVal;
      }
    }
  }

  // Avoid division by zero or amplifying extreme silence
  if (maxPeak < 0.001 || Math.abs(maxPeak - targetPeak) < 0.01) {
    return buffer;
  }

  const gainFactor = targetPeak / maxPeak;

  // Apply scaling factor
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const channelData = buffer.getChannelData(c);
    for (let i = 0; i < channelData.length; i++) {
      channelData[i] *= gainFactor;
    }
  }

  return buffer;
}

/**
 * Builds a Web Audio DSP chain that processes a raw microphone MediaStream.
 * Returns a cleaned MediaStream suitable for MediaRecorder & speech recognition.
 */
export function createProcessedAudioStream(inputStream: MediaStream): {
  processedStream: MediaStream;
  audioCtx: AudioContext;
  cleanup: () => void;
} {
  const audioCtx = getSharedAudioContext();

  try {
    const sourceNode = audioCtx.createMediaStreamSource(inputStream);

    // 1. High-Pass Filter: Cut sub-bass microphone rumble and thumps below 85Hz
    const highpass = audioCtx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 85;
    highpass.Q.value = 0.7;

    // 2. Vocal Presence EQ: Subtle boost around 2.8kHz to enhance voice clarity
    const vocalEq = audioCtx.createBiquadFilter();
    vocalEq.type = 'peaking';
    vocalEq.frequency.value = 2800;
    vocalEq.gain.value = 3.5; // +3.5dB clarity
    vocalEq.Q.value = 1.2;

    // 3. Anti-Artifact Low-Pass Filter: Attenuate harsh metallic buzz/whine above 11.5kHz
    const antiArtifactFilter = audioCtx.createBiquadFilter();
    antiArtifactFilter.type = 'lowpass';
    antiArtifactFilter.frequency.value = 11500;
    antiArtifactFilter.Q.value = 0.7;

    // 4. Dynamics Compressor: Smooth out quiet speech & prevent distortion/clipping
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -22; // dB
    compressor.knee.value = 18;       // dB
    compressor.ratio.value = 6;       // 6:1 compression
    compressor.attack.value = 0.004;  // 4ms
    compressor.release.value = 0.20;  // 200ms

    // 5. Output Gain Node
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 1.25; // 25% gain boost post-compression

    // 6. Connect DSP pipeline
    const destinationNode = audioCtx.createMediaStreamDestination();

    sourceNode
      .connect(highpass)
      .connect(vocalEq)
      .connect(antiArtifactFilter)
      .connect(compressor)
      .connect(gainNode)
      .connect(destinationNode);

    // Attempt to insert AudioWorklet processor if available
    registerArtifactSuppressorWorklet(audioCtx).then((registered) => {
      if (registered) {
        try {
          const workletNode = new AudioWorkletNode(audioCtx, 'artifact-suppressor-worklet');
          gainNode.disconnect(destinationNode);
          gainNode.connect(workletNode);
          workletNode.connect(destinationNode);
        } catch (e) {
          // Keep gainNode -> destinationNode fallback
        }
      }
    });

    const cleanup = () => {
      try {
        sourceNode.disconnect();
        highpass.disconnect();
        vocalEq.disconnect();
        antiArtifactFilter.disconnect();
        compressor.disconnect();
        gainNode.disconnect();
      } catch (e) {
        // ignore already disconnected nodes
      }
    };

    return {
      processedStream: destinationNode.stream,
      audioCtx,
      cleanup,
    };
  } catch (err) {
    console.warn('Web Audio DSP pipeline fallback:', err);
    return {
      processedStream: inputStream,
      audioCtx,
      cleanup: () => {},
    };
  }
}

/**
 * Decodes, normalizes, filters, and plays base64 audio (e.g. from TTS or backend)
 * with studio post-processing to eliminate robotic harshness.
 */
export async function processAndPlayAudioBase64(
  base64Audio: string,
  mimeType: string = 'audio/mp3',
  onEnded?: () => void
): Promise<AudioBufferSourceNode | null> {
  const audioCtx = getSharedAudioContext();

  try {
    // 1. Convert base64 to ArrayBuffer
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // 2. Decode raw audio data
    let decodedBuffer = await audioCtx.decodeAudioData(bytes.buffer);

    // 3. Peak Normalization
    decodedBuffer = normalizeAudioBuffer(decodedBuffer, 0.95);

    // 4. Create Source Node
    const source = audioCtx.createBufferSource();
    source.buffer = decodedBuffer;

    // 5. Master Output Processing Chain
    // A. Highpass sub-bass cutoff (80Hz)
    const highpass = audioCtx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 80;

    // B. Vocal warmth & clarity EQ (2.5kHz)
    const vocalEq = audioCtx.createBiquadFilter();
    vocalEq.type = 'peaking';
    vocalEq.frequency.value = 2500;
    vocalEq.gain.value = 2.5;
    vocalEq.Q.value = 1.0;

    // C. De-harshness filter: tame metallic robotic high-frequency artifacts (8kHz-10kHz)
    const deHarsh = audioCtx.createBiquadFilter();
    deHarsh.type = 'peaking';
    deHarsh.frequency.value = 8500;
    deHarsh.gain.value = -3.0; // -3dB cut on robotic resonant frequency
    deHarsh.Q.value = 1.5;

    // D. Soft Compressor
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 12;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.005;
    compressor.release.value = 0.15;

    // E. Master Volume Gain
    const masterGain = audioCtx.createGain();
    masterGain.gain.value = 1.0;

    // Connect Chain
    source
      .connect(highpass)
      .connect(vocalEq)
      .connect(deHarsh)
      .connect(compressor)
      .connect(masterGain);

    const isWorkletRegistered = await registerArtifactSuppressorWorklet(audioCtx);
    if (isWorkletRegistered) {
      try {
        const workletNode = new AudioWorkletNode(audioCtx, 'artifact-suppressor-worklet');
        masterGain.connect(workletNode);
        workletNode.connect(audioCtx.destination);
      } catch (workletErr) {
        masterGain.connect(audioCtx.destination);
      }
    } else {
      masterGain.connect(audioCtx.destination);
    }

    if (onEnded) {
      source.onended = onEnded;
    }

    source.start(0);
    return source;
  } catch (err) {
    console.error('Audio processing/playback error:', err);
    
    // Fallback: HTML Audio playback
    try {
      const audio = new Audio(`data:${mimeType};base64,${base64Audio}`);
      if (onEnded) audio.onended = onEnded;
      await audio.play();
    } catch (fallbackErr) {
      console.error('Fallback audio play error:', fallbackErr);
    }
    return null;
  }
}

