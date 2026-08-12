import React, { useEffect, useRef, useState } from 'react';
import { Mic, Volume2, ShieldCheck, Activity } from 'lucide-react';
import { getSharedAudioContext } from '../utils/audioProcessor';

interface AudioWaveformVisualizerProps {
  stream: MediaStream | null;
  isRecording?: boolean;
  className?: string;
  showDetails?: boolean;
}

export const AudioWaveformVisualizer: React.FC<AudioWaveformVisualizerProps> = ({
  stream,
  isRecording = false,
  className = '',
  showDetails = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [peakDb, setPeakDb] = useState<number>(-60);
  const [isClipWarning, setIsClipWarning] = useState<boolean>(false);

  useEffect(() => {
    if (!stream || stream.getAudioTracks().length === 0) {
      setPeakDb(-60);
      setIsClipWarning(false);
      return;
    }

    let analyserNode: AnalyserNode | null = null;
    let sourceNode: MediaStreamAudioSourceNode | null = null;
    let isActive = true;

    try {
      const audioCtx = getSharedAudioContext();
      analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 128;
      analyserNode.smoothingTimeConstant = 0.75;

      sourceNode = audioCtx.createMediaStreamSource(stream);
      sourceNode.connect(analyserNode);

      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const canvas = canvasRef.current;

      const draw = () => {
        if (!isActive || !analyserNode || !canvas) return;

        analyserNode.getByteFrequencyData(dataArray);

        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;

          ctx.clearRect(0, 0, width, height);

          // Calculate peak magnitude and dB level
          let sum = 0;
          let maxVal = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
            if (dataArray[i] > maxVal) maxVal = dataArray[i];
          }

          // Calculate approximate peak dB
          const normPeak = maxVal / 255;
          const currentDb = normPeak > 0 ? Math.round(20 * Math.log10(normPeak)) : -60;
          setPeakDb(currentDb);
          setIsClipWarning(currentDb > -1);

          // Render Waveform / Frequency Bars
          const barWidth = (width / bufferLength) * 1.5;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * height;

            // Gradient based on audio level & recording status
            const grad = ctx.createLinearGradient(0, height, 0, 0);
            if (isRecording) {
              grad.addColorStop(0, '#3b82f6'); // Blue
              grad.addColorStop(0.7, '#10b981'); // Emerald
              grad.addColorStop(1.0, '#ef4444'); // Crimson on clipping
            } else {
              grad.addColorStop(0, '#6366f1'); // Indigo
              grad.addColorStop(1.0, '#06b6d4'); // Cyan
            }

            ctx.fillStyle = grad;
            // Draw mirrored rounded bars centered vertically
            const centerY = height / 2;
            const halfBar = barHeight / 2;

            ctx.beginPath();
            ctx.roundRect(x, centerY - halfBar, Math.max(2, barWidth - 2), Math.max(2, barHeight), 2);
            ctx.fill();

            x += barWidth + 1;
          }
        }

        animFrameRef.current = requestAnimationFrame(draw);
      };

      draw();
    } catch (err) {
      console.warn('AudioWaveformVisualizer analyzer error:', err);
    }

    return () => {
      isActive = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (sourceNode) {
        try {
          sourceNode.disconnect();
        } catch (e) {}
      }
    };
  }, [stream, isRecording]);

  const hasAudio = stream && stream.getAudioTracks().length > 0;

  return (
    <div
      className={`bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 shadow-lg backdrop-blur-md ${className}`}
    >
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-mono font-semibold">
          <Activity className={`w-3.5 h-3.5 ${isRecording ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`} />
          <span className="text-slate-200">AUDIO MONITOR</span>
          {isRecording && (
            <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-full border border-red-500/30 uppercase tracking-wider">
              REC LIVE
            </span>
          )}
        </div>

        {showDetails && (
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="text-slate-400">DSP: <span className="text-emerald-400 font-bold">NORMALIZED</span></span>
            <span
              className={`px-1.5 py-0.5 rounded font-bold ${
                isClipWarning
                  ? 'bg-red-500 text-white animate-bounce'
                  : peakDb > -12
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {hasAudio ? `${peakDb} dB` : 'OFF'}
            </span>
          </div>
        )}
      </div>

      {/* Canvas Waveform Display */}
      <div className="relative w-full h-10 bg-slate-950/80 rounded-lg overflow-hidden border border-slate-800/80 flex items-center justify-center">
        {hasAudio ? (
          <canvas ref={canvasRef} width={280} height={40} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono">
            <Mic className="w-3.5 h-3.5 text-slate-600" />
            <span>Mic Disconnected</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioWaveformVisualizer;
