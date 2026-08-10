import React, { useState, useRef, useEffect } from 'react';
import { 
  Flame, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Sliders, 
  Zap, 
  Film, 
  Video,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react';

export default function NanoBananaStudioView() {
  const [prompt, setPrompt] = useState<string>(
    'Fast cinematic camera zoom into cartoon RAM sticks on farm pasture, neon tech glowing particles'
  );
  const [speedMode, setSpeedMode] = useState<'ultra_fast' | 'turbo_hd'>('ultra_fast');
  const [durationSecs, setDurationSecs] = useState<number>(3);
  const [motionIntensity, setMotionIntensity] = useState<number>(85);
  const [cameraEffect, setCameraEffect] = useState<'zoom_in' | 'orbit' | 'pan_right' | 'shake'>('zoom_in');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [notice, setNotice] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [loopTime, setLoopTime] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animation Loop for Nano Banana motion preview
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = '/images/scene2.jpg';

    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      setLoopTime(elapsed % durationSecs);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (img.complete && img.naturalWidth > 0) {
        ctx.save();
        
        // Motion calculation based on cameraEffect
        const progress = (elapsed % durationSecs) / durationSecs;
        let scale = 1.0;
        let dx = 0;
        let dy = 0;

        if (cameraEffect === 'zoom_in') {
          scale = 1.0 + progress * (motionIntensity / 200);
        } else if (cameraEffect === 'orbit') {
          dx = Math.sin(progress * Math.PI * 2) * 15;
          dy = Math.cos(progress * Math.PI * 2) * 10;
        } else if (cameraEffect === 'pan_right') {
          dx = -progress * 40;
        } else if (cameraEffect === 'shake') {
          dx = (Math.random() - 0.5) * 8;
          dy = (Math.random() - 0.5) * 8;
        }

        ctx.translate(canvas.width / 2 + dx, canvas.height / 2 + dy);
        ctx.scale(scale, scale);
        ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.restore();

        // Draw particle overlay for Nano Banana Tech effect
        ctx.fillStyle = 'rgba(245, 158, 11, 0.6)';
        for (let i = 0; i < 20; i++) {
          const px = ((i * 47 + elapsed * 80) % canvas.width);
          const py = ((i * 31 + Math.sin(elapsed + i) * 30) % canvas.height);
          ctx.beginPath();
          ctx.arc(px, py, 2 + (i % 3), 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [durationSecs, motionIntensity, cameraEffect]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgress(15);

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 25;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsGenerating(false);
      setNotice('🍌 Nano Banana Pro 2.5 fast motion video generated in 1.2s!');
    }, 1100);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 rounded-xl text-white shadow-lg shadow-amber-500/20">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-white">
              Nano Banana Pro 2.5 Motion Engine
              <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded uppercase">
                ULTRA FAST DIT • 1.2s LATENCY
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              High-speed motion video clips, camera turns, and dynamic commercial loops
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin text-slate-950" /> Generating ({progress}%)...
            </>
          ) : (
            <>
              <Flame className="w-4 h-4 text-slate-950 fill-slate-950" /> Generate Nano Motion
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Nano Motion Controls
            </h3>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300">Prompt Description:</label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed resize-none font-medium"
            />
          </div>

          {/* Camera Motion Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Camera Dynamic Effect:</label>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              {[
                { id: 'zoom_in', label: '🔍 Zoom In' },
                { id: 'orbit', label: '🔄 Orbit Turn' },
                { id: 'pan_right', label: '➡️ Pan Right' },
                { id: 'shake', label: '⚡ Tech Shake' },
              ].map(cam => (
                <button
                  key={cam.id}
                  type="button"
                  onClick={() => setCameraEffect(cam.id as any)}
                  className={`p-2 rounded-xl border text-left font-bold cursor-pointer transition-all ${
                    cameraEffect === cam.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cam.label}
                </button>
              ))}
            </div>
          </div>

          {/* Motion Intensity slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Motion Velocity:</span>
              <span className="text-amber-400 font-bold">{motionIntensity}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={150}
              value={motionIntensity}
              onChange={(e) => setMotionIntensity(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Speed Mode */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <label className="text-xs font-mono text-slate-300">Rendering Mode:</label>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setSpeedMode('ultra_fast')}
                className={`p-2 rounded-xl border text-center font-bold cursor-pointer ${
                  speedMode === 'ultra_fast'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                ⚡ Ultra Fast (1.2s)
              </button>
              <button
                type="button"
                onClick={() => setSpeedMode('turbo_hd')}
                className={`p-2 rounded-xl border text-center font-bold cursor-pointer ${
                  speedMode === 'turbo_hd'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                🚀 Turbo HD (2.5s)
              </button>
            </div>
          </div>
        </div>

        {/* Video Player Display */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold font-mono text-amber-300 flex items-center gap-2 uppercase">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" /> Nano Banana Live Motion Canvas
            </span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950 border border-amber-800 px-2 py-0.5 rounded font-bold">
              {loopTime.toFixed(1)}s / {durationSecs}s • Loop Mode
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video relative group">
            <canvas ref={canvasRef} width={832} height={480} className="w-full h-full object-contain" />

            <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 text-amber-400 hover:text-white cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <span className="font-mono text-[11px] text-slate-300 font-bold truncate max-w-md">
                  {prompt}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {notice && (
            <div className="p-3 bg-emerald-950 border border-emerald-700/60 rounded-xl text-xs text-emerald-300 font-medium flex items-center justify-between">
              <span>{notice}</span>
              <button onClick={() => setNotice(null)} className="text-emerald-400 hover:text-white font-bold">✕</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
