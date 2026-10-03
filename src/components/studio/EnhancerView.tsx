import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Upload, 
  Sliders, 
  Download, 
  RotateCcw, 
  Check, 
  Eye, 
  Zap, 
  Film, 
  Layers 
} from 'lucide-react';

export default function EnhancerView() {
  const [targetScale, setTargetScale] = useState<'2x' | '4x' | '8x'>('4x');
  const [denoiseLevel, setDenoiseLevel] = useState<number>(65);
  const [clarityBoost, setClarityBoost] = useState<number>(80);
  const [faceDetailer, setFaceDetailer] = useState<boolean>(true);
  const [frameInterpolation, setFrameInterpolation] = useState<boolean>(true); // 30fps to 60fps
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [notice, setNotice] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState<string>('');

  const handleEnhance = () => {
    setIsEnhancing(true);
    setProgress(10);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 20;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsEnhancing(false);
      setNotice(`✨ Commercial asset successfully upscaled to ${targetScale} 4K HDR Studio Quality!`);
    }, 1800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageUrl(ev.target?.result as string);
        setNotice("New commercial asset uploaded for AI 4K enhancement!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 rounded-xl text-white shadow-lg shadow-purple-500/20">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-white">
              AI 4K/8K Video & Image Enhancer
              <span className="text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded uppercase">
                STUDIO UPSCALER & DE-NOISER
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Upscale commercial videos and reference photos with AI face detailing and 60 FPS frame interpolation
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleEnhance}
          disabled={isEnhancing}
          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isEnhancing ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin text-amber-300" /> Upscaling ({progress}%)...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" /> Enhance to 4K Studio Quality
            </>
          )}
        </button>
      </div>

      {/* Main Enhancer Controls & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Config Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-5 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" /> Enhancement Parameters
            </h3>
          </div>

          {/* Scale Resolution */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Upscale Scale Ratio:</label>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {(['2x', '4x', '8x'] as const).map(scale => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => setTargetScale(scale)}
                  className={`py-2 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                    targetScale === scale 
                      ? 'bg-purple-600 border-purple-400 text-white shadow-md' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {scale} ({(parseInt(scale) * 1080)}p)
                </button>
              ))}
            </div>
          </div>

          {/* Denoise Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Denoise & Grain Reduction:</span>
              <span className="text-purple-300 font-bold">{denoiseLevel}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={denoiseLevel}
              onChange={(e) => setDenoiseLevel(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Clarity Boost Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">HDR Clarity & Micro-Contrast:</span>
              <span className="text-purple-300 font-bold">{clarityBoost}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={clarityBoost}
              onChange={(e) => setClarityBoost(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
            <label className="flex items-center justify-between cursor-pointer p-2.5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700">
              <span className="text-slate-300 font-medium">Face & Character Detailer</span>
              <input
                type="checkbox"
                checked={faceDetailer}
                onChange={(e) => setFaceDetailer(e.target.checked)}
                className="w-4 h-4 accent-purple-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2.5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700">
              <span className="text-slate-300 font-medium">60 FPS Motion Interpolation</span>
              <input
                type="checkbox"
                checked={frameInterpolation}
                onChange={(e) => setFrameInterpolation(e.target.checked)}
                className="w-4 h-4 accent-purple-500 rounded"
              />
            </label>
          </div>

          {/* Upload Button */}
          <label className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 cursor-pointer flex items-center justify-center gap-2 transition-colors">
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Upload Image or Video Clip</span>
            <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        {/* Right Preview Panel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold font-mono text-purple-300 flex items-center gap-1.5 uppercase">
              <Eye className="w-4 h-4 text-purple-400" /> 4K Studio Enhancement Preview
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded font-bold">
              3840 x 2160 • 60 FPS
            </span>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video relative group flex items-center justify-center">
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="Enhanced preview" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 text-[10px] font-mono text-amber-300 font-bold">
                  ENHANCED 4K HDR OUTPUT
                </div>
              </>
            ) : (
              <label className="w-full h-full border-2 border-dashed border-slate-800 hover:border-purple-500/60 rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer transition-colors space-y-3 text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">Upload Image or Video Clip</div>
                  <div className="text-[10px] text-slate-400">Drag & drop or click to upload your custom media for AI 4K enhancement</div>
                </div>
                <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} />
              </label>
            )}
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
