import React, { useState, useRef, useEffect } from 'react';
import { 
  Palette, 
  Sparkles, 
  Eraser, 
  Paintbrush, 
  RotateCcw, 
  Download, 
  Sliders, 
  Layers, 
  Square, 
  Circle, 
  Image as ImageIcon,
  Zap
} from 'lucide-react';

export default function RealtimeCanvasView() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [brushColor, setBrushColor] = useState<string>('#3b82f6');
  const [brushSize, setBrushSize] = useState<number>(12);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'rect' | 'circle'>('brush');
  const [prompt, setPrompt] = useState<string>('Photorealistic broadcast studio stage, glowing neon RAM sticks on grass field');
  const [aiStrength, setAiStrength] = useState<number>(0.75); // 0 to 1
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean>(true);
  const [renderCount, setRenderCount] = useState<number>(0);
  const [aiOutputUrl, setAiOutputUrl] = useState<string>(
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
  );

  // Initialize canvas grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw initial sample strokes
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(200, 150, 60, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(100, 250);
        ctx.lineTo(300, 250);
        ctx.stroke();
      }
    }
  }, []);

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const handleStopDraw = () => {
    setIsDrawing(false);
    triggerRealtimeRender();
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

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';

    if (tool === 'eraser') {
      ctx.strokeStyle = '#090d16';
    } else {
      ctx.strokeStyle = brushColor;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (isRealtimeActive && Math.random() > 0.7) {
      triggerRealtimeRender();
    }
  };

  const triggerRealtimeRender = () => {
    setRenderCount(prev => prev + 1);
    // Simulate real-time diffusion update based on prompt & drawing
    const lower = prompt.toLowerCase();
    if (lower.includes('farm') || lower.includes('pasture') || lower.includes('ram')) {
      setAiOutputUrl('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80');
    } else if (lower.includes('cyber') || lower.includes('neon')) {
      setAiOutputUrl('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80');
    } else {
      setAiOutputUrl('https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=800&q=80');
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        triggerRealtimeRender();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl text-white shadow-lg shadow-cyan-500/20">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-white">
              Realtime AI Canvas Studio
              <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded uppercase">
                REALTIME DIFFUSION ENGINE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Paint or sketch on the canvas to generate live AI commercial artwork in real time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsRealtimeActive(!isRealtimeActive)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer ${
              isRealtimeActive
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isRealtimeActive ? 'bg-amber-300 animate-ping' : 'bg-slate-500'}`} />
            {isRealtimeActive ? 'REALTIME LIVE' : 'REALTIME PAUSED'}
          </button>
        </div>
      </div>

      {/* Main Dual Canvas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Drawing Canvas */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold font-mono text-cyan-300 flex items-center gap-1.5 uppercase">
              <Paintbrush className="w-4 h-4 text-cyan-400" /> Interactive Input Canvas
            </span>

            {/* Canvas Tools Toolbar */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setTool('brush')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  tool === 'brush' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Brush Tool"
              >
                <Paintbrush className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setTool('eraser')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  tool === 'eraser' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Eraser Tool"
              >
                <Eraser className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Clear Canvas"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Color & Size Controls */}
          <div className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono text-[11px]">Color:</span>
              <div className="flex items-center gap-1">
                {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ffffff'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setBrushColor(c)}
                    className={`w-5 h-5 rounded-full border border-slate-700 cursor-pointer ${
                      brushColor === c ? 'ring-2 ring-white scale-110' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono text-[11px]">Size ({brushSize}px):</span>
              <input
                type="range"
                min={2}
                max={40}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24 accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Drawing Canvas Area */}
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video flex items-center justify-center relative cursor-crosshair">
            <canvas
              ref={canvasRef}
              width={512}
              height={288}
              onMouseDown={handleStartDraw}
              onMouseUp={handleStopDraw}
              onMouseMove={draw}
              onMouseLeave={handleStopDraw}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Right Realtime AI Render Output */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold font-mono text-emerald-300 flex items-center gap-1.5 uppercase">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" /> Live AI Render Preview
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Renders: {renderCount}
            </span>
          </div>

          {/* Prompt Bar */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 uppercase">AI Prompt Conditioning:</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                triggerRealtimeRender();
              }}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-sans text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Describe the target image scene..."
            />
          </div>

          {/* AI Output Image Display */}
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video relative group">
            <img src={aiOutputUrl} alt="AI Realtime Render" className="w-full h-full object-cover transition-all duration-300" />
            <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-mono text-emerald-300 font-bold">
              REALTIME AI 60 FPS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
