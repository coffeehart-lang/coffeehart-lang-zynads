import React, { useState, useRef, useEffect } from 'react';
import { 
  Edit3, 
  Wand2, 
  Paintbrush, 
  Eraser, 
  Sparkles, 
  Download, 
  Upload, 
  Sliders, 
  RotateCcw, 
  Eye, 
  Layers, 
  Type, 
  Scissors 
} from 'lucide-react';

export default function EditStudioView() {
  const [activeTab, setActiveTab] = useState<'inpaint' | 'bg_remove' | 'face_restore' | 'color'>('inpaint');
  const [prompt, setPrompt] = useState<string>('Replace pasture background with glowing blue futuristic server rack matrix');
  const [brushSize, setBrushSize] = useState<number>(24);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const [imageUrl, setImageUrl] = useState<string>('/images/scene2.jpg');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [imageUrl]);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = 'rgba(168, 85, 247, 0.45)';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleApplyEdit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setNotice('✨ AI Inpainting Mask applied! Background & objects replaced successfully.');
    }, 1400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageUrl(ev.target?.result as string);
        setNotice('New asset loaded into AI Edit Studio!');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 rounded-xl text-white shadow-lg shadow-purple-500/20">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-white">
              AI Inpainting & Video Edit Studio
              <span className="text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded uppercase">
                MASK BRUSH & BACKGROUND ERASER
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Draw masks to replace objects, swap backgrounds, and restore commercial faces
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleApplyEdit}
          disabled={isProcessing}
          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin text-purple-300" /> Applying Edit...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 text-purple-300" /> Apply AI Edit
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4 shadow-xl">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {[
              { id: 'inpaint', label: '🎨 Inpaint' },
              { id: 'bg_remove', label: '✂️ Cut BG' },
              { id: 'face_restore', label: '👤 Face' },
              { id: 'color', label: '🌈 Color' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-1.5 rounded-lg text-center font-bold cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300">Replacement Prompt:</label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500 leading-relaxed resize-none font-medium"
            />
          </div>

          {/* Mask Brush size */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Mask Brush Radius:</span>
              <span className="text-purple-300 font-bold">{brushSize}px</span>
            </div>
            <input
              type="range"
              min={5}
              max={80}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <label className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 cursor-pointer flex items-center justify-center gap-2 transition-colors">
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Upload New Asset to Edit</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        {/* Interactive Inpainting Canvas */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold font-mono text-purple-300 flex items-center gap-2 uppercase">
              <Paintbrush className="w-4 h-4 text-purple-400" /> Interactive Mask Drawing Canvas
            </span>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950 border border-purple-800 px-2 py-0.5 rounded font-bold">
              Click & Drag mouse over object to mask
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video relative">
            <canvas
              ref={canvasRef}
              width={832}
              height={480}
              onMouseDown={startDraw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onMouseMove={draw}
              className="w-full h-full object-contain cursor-crosshair"
            />
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
