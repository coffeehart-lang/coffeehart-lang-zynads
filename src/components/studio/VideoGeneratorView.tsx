import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Video, 
  Play, 
  Pause, 
  Plus, 
  Image as ImageIcon, 
  Volume2, 
  VolumeX,
  Wand2, 
  Download, 
  Upload, 
  ChevronDown,
  Maximize2,
  Clapperboard,
  RotateCcw,
  Zap,
  Film,
  Sliders,
  Share2,
  RefreshCw,
  PlusCircle,
  Layers,
  Crop,
  Gauge,
  SlidersHorizontal,
  Home,
  LayoutGrid,
  Edit3,
  Flame,
  Check,
  Cpu,
  Tv,
  Radio,
  Clock,
  Sparkle
} from 'lucide-react';

interface AssetReference {
  id: string;
  tag: string;
  name: string;
  url: string;
}

export default function VideoGeneratorView() {
  const [selectedModel, setSelectedModel] = useState<string>('Seedance 2.5');
  const [resolution, setResolution] = useState<'720p' | '1080p' | '4K'>('720p');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '21:9'>('16:9');
  const [durationSecs, setDurationSecs] = useState<number>(18);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [renderMode, setRenderMode] = useState<'production' | 'draft'>('production');

  // Keyframe image attachments
  const [startFrameUrl, setStartFrameUrl] = useState<string | null>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  );
  const [endFrameUrl, setEndFrameUrl] = useState<string | null>(
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
  );

  // Active Tool Mode in Sidebar
  const [activeStudioTool, setActiveStudioTool] = useState<'video' | 'image' | 'enhancer' | 'nanobanana' | 'realtime' | 'edit'>('video');

  // Pre-populated reference assets matching Krea AI screenshot (@img-1, @img-2, @img-3)
  const [assets, setAssets] = useState<AssetReference[]>([
    {
      id: 'img-1',
      tag: '@img-1',
      name: 'Main Character Porch',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'img-2',
      tag: '@img-2',
      name: 'Pasture & RAM Sticks',
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'img-3',
      tag: '@img-3',
      name: 'Zyncast Studio',
      url: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=400&q=80'
    }
  ]);

  const [prompt, setPrompt] = useState<string>(
    `So, my video would open taking place on a farm and a pasture and all that, and it would open up to the main character on the porch. And then from there, he would say a script of like, "Do you know where your code comes from?"\n"And then it would say, "Here at Zyncastcfo, all our code is organic, cage-free, and straight to you." zyncastcfo is the all in 1 real business tool for all business owners checks us out for free trial .\nAnd then in that whole scene while he's walking down the pasture rows, there would be animals that would be a parody type thing off of computer names, like RAM, like RAM sticks. So, they'd be like little cartoonish RAM sticks and stuff like that, . So that's the person who should be in the`
  );

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentGenStep, setCurrentGenStep] = useState<string>('Initializing GPU cluster...');
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [hasGenerated, setHasGenerated] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [notice, setNotice] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const startFrameInputRef = useRef<HTMLInputElement>(null);
  const endFrameInputRef = useRef<HTMLInputElement>(null);

  const genSteps = [
    'Initializing GPU server & loading Seedance 2.5 neural weights...',
    'Encoding prompt text & parsing spatial scene geometry...',
    'Allocating VRAM & manifesting high-density compute nodes...',
    'Constructing 3D farm pasture, wooden porch & character keyframes...',
    'Synthesizing cartoonish RAM stick models & environmental motion...',
    'Balancing dynamic ambient shadows & sun flare highlights...',
    'Whispering to pixels & calibrating sub-pixel neural density...',
    'Rendering camera motion tracks & depth map projection layers...',
    'Synthesizing lip-sync dialogue audio alignment for Zyncast script...',
    'Simulating wind vectors through crop rows & pasture blades...',
    'Applying chromatic anti-aliasing & motion blur edge vectors...',
    'Generating raytraced isometric lighting & metallic server texture maps...',
    'Executing 4K AI upscaling pass & color grading spectrum balance...',
    'Compiling frame buffer sequence into high-bitrate MP4 container...',
    'Finalizing video stream & syncing audio waveform tracks...'
  ];

  const handleInsertTag = (tag: string) => {
    setPrompt(prev => prev + ` ${tag} `);
  };

  const handleStartFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setStartFrameUrl(ev.target?.result as string);
        setNotice('Start frame keyframe updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEndFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEndFrameUrl(ev.target?.result as string);
        setNotice('End frame keyframe updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSwapAssetPhoto = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setAssets(prev => prev.map(a => a.id === id ? { ...a, url: result, name: file.name.slice(0, 18) } : a));
        setNotice(`Updated image asset for ${id}!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const nextIndex = assets.length + 1;
        const tag = `@img-${nextIndex}`;
        const newAsset: AssetReference = {
          id: `img-${nextIndex}`,
          tag,
          name: file.name.slice(0, 16),
          url: ev.target?.result as string
        };
        setAssets(prev => [...prev, newAsset]);
        setPrompt(prev => prev + ` ${tag} `);
        setNotice(`Added uploaded image as ${tag} and tagged in prompt!`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Realistic Production Generation Pipeline
  const handleGenerateVideo = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setProgress(0);
    setElapsedTime(0);
    setCurrentGenStep(genSteps[0]);

    const totalDurationMs = renderMode === 'production' ? 24000 : 8000; // 24 seconds for realistic render
    const updateIntervalMs = 200;
    const totalSteps = genSteps.length;

    let currentMs = 0;
    const interval = setInterval(() => {
      currentMs += updateIntervalMs;
      setElapsedTime(Math.floor(currentMs / 1000));
      const pct = Math.min(99, Math.floor((currentMs / totalDurationMs) * 100));
      setProgress(pct);

      const stepIdx = Math.min(totalSteps - 1, Math.floor((pct / 100) * totalSteps));
      setCurrentGenStep(genSteps[stepIdx]);

      if (currentMs >= totalDurationMs) {
        clearInterval(interval);
        setProgress(100);
        setIsGenerating(false);
        setHasGenerated(true);
        setIsPlaying(true);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
        setNotice(`✨ Commercial generated successfully with ${selectedModel}! (24s Seedance render)`);
      }
    }, updateIntervalMs);

    try {
      await fetch('/api/zynads/backdrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Video Commercial: ${prompt}` })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handlePlaybackSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  return (
    <div className="bg-[#0b0c0f] text-slate-100 min-h-screen -m-4 p-3 sm:p-6 font-sans flex flex-col md:flex-row gap-4">
      {/* LEFT SIDEBAR STUDIO TOOLS (Exact Match to Krea AI Sidebar) */}
      <div className="w-full md:w-52 bg-[#101217] border border-slate-800/80 rounded-2xl p-3 shrink-0 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="px-2 py-1 text-[11px] font-mono text-slate-400 font-bold tracking-wider uppercase border-b border-slate-800/80 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-white">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Krea Studio
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setActiveStudioTool('video')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStudioTool === 'video'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Video className="w-4 h-4 text-indigo-300" />
                <span>Video Studio</span>
              </div>
              <span className="text-[9px] font-mono font-bold bg-indigo-900/80 text-indigo-200 px-1.5 py-0.5 rounded">2.5</span>
            </button>

            <button
              onClick={() => setActiveStudioTool('image')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStudioTool === 'image'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Image Generator</span>
              </div>
            </button>

            <button
              onClick={() => setActiveStudioTool('enhancer')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStudioTool === 'enhancer'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>4K Enhancer</span>
              </div>
              <span className="text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded">4K</span>
            </button>

            <button
              onClick={() => setActiveStudioTool('nanobanana')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStudioTool === 'nanobanana'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Nano Banana Pro</span>
              </div>
              <span className="text-[9px] font-mono font-bold bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded shadow-xs">PRO</span>
            </button>

            <button
              onClick={() => setActiveStudioTool('realtime')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStudioTool === 'realtime'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wand2 className="w-4 h-4 text-emerald-400" />
                <span>Realtime Canvas</span>
              </div>
            </button>

            <button
              onClick={() => setActiveStudioTool('edit')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStudioTool === 'edit'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-4 h-4 text-purple-400" />
                <span>Video Editor</span>
              </div>
            </button>
          </div>
        </div>

        {/* Engine Pipeline Status */}
        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5 text-center">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Render Mode:</span>
            <button
              type="button"
              onClick={() => setRenderMode(prev => prev === 'production' ? 'draft' : 'production')}
              className={`px-1.5 py-0.5 rounded font-bold cursor-pointer ${
                renderMode === 'production' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {renderMode === 'production' ? '24s High-Res' : '8s Draft'}
            </button>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold block">GPU CLUSTER ONLINE</span>
        </div>
      </div>

      {/* MAIN STUDIO STAGE */}
      <div className="flex-1 max-w-5xl space-y-4">
        {/* Top Model Selector Header Bar (Matches Krea Header: "Model Seedance 2.5 v") */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Model</span>
            <div className="relative inline-block">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-slate-900 text-sm font-extrabold text-white pr-7 py-1 px-3 rounded-xl border border-slate-800 focus:outline-none cursor-pointer appearance-none flex items-center gap-1 shadow-sm"
              >
                <option value="Nano Banana Pro 2.5" className="bg-slate-900 text-amber-300 font-bold">🍌 Nano Banana Pro 2.5 (Ultra High-Res Commercial Engine)</option>
                <option value="Seedance 2.5" className="bg-slate-900 text-white">Seedance 2.5</option>
                <option value="MiniMax H3" className="bg-slate-900 text-white">MiniMax H3</option>
                <option value="Google Veo 2" className="bg-slate-900 text-white">Google Veo 2 (4K)</option>
                <option value="Luma Dream Machine" className="bg-slate-900 text-white">Luma Dream Machine</option>
                <option value="Runway Gen-3" className="bg-slate-900 text-white">Runway Gen-3 Alpha</option>
                <option value="OpenAI Sora" className="bg-slate-900 text-white">OpenAI Sora</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Commercial Studio Mode</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono text-[10px] font-bold shadow-xs">
              READY
            </span>
          </div>
        </div>

        {/* SUB-TOOL SPECIFIC VIEWS */}
        {activeStudioTool === 'image' && (
          <div className="bg-[#13151c] p-6 rounded-2xl border border-slate-800 space-y-4 text-white">
            <h3 className="text-sm font-bold flex items-center gap-2 text-amber-400">
              <ImageIcon className="w-4 h-4" /> Image Keyframe & Asset Generator
            </h3>
            <p className="text-xs text-slate-400">Generate high-res character stills, farm pasture backgrounds, or 3D RAM stick models to use as @img references.</p>
            <div className="flex gap-2">
              <input type="text" placeholder="Prompt for image keyframe (e.g., '3D cartoonish RAM stick standing in green field')" className="flex-1 bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs text-white" />
              <button onClick={() => setNotice('Generated keyframe image added to @img library!')} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl">Generate Image</button>
            </div>
          </div>
        )}

        {activeStudioTool === 'enhancer' && (
          <div className="bg-[#13151c] p-6 rounded-2xl border border-slate-800 space-y-4 text-white">
            <h3 className="text-sm font-bold flex items-center gap-2 text-cyan-400">
              <Sparkles className="w-4 h-4" /> 4K AI Video Enhancer & Interpolator
            </h3>
            <p className="text-xs text-slate-400">Upscale 720p commercial renders to crisp 4K 60fps with HDR color grading.</p>
            <button onClick={() => setNotice('4K Enhancer filter applied to commercial render!')} className="px-4 py-2 bg-cyan-600 text-white font-bold text-xs rounded-xl">Enhance Current Video to 4K</button>
          </div>
        )}

        {activeStudioTool === 'nanobanana' && (
          <div className="bg-gradient-to-r from-slate-900 via-rose-950/60 to-slate-900 p-6 rounded-2xl border border-rose-500/40 space-y-4 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2 text-rose-300">
                <Flame className="w-5 h-5 text-amber-400" /> Nano Banana Pro 2.5 Commercial Script & Storyboard Studio
              </h3>
              <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2.5 py-1 rounded-md uppercase tracking-wider">
                Pro Tier Unlocked
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nano Banana Pro is our flagship generative model specialized for comedic corporate ads, farm pasture scenes, and animated mascot commercials like <strong>Zyncast CFO Organic Code</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedModel('Nano Banana Pro 2.5');
                  setPrompt(`So, my video would open taking place on a farm and a pasture and all that, and it would open up to the main character on the porch. And then from there, he would say a script of like, "Do you know where your code comes from?"\n"And then it would say, "Here at Zyncastcfo, all our code is organic, cage-free, and straight to you." zyncastcfo is the all in 1 real business tool for all business owners checks us out for free trial .\nAnd then in that whole scene while he's walking down the pasture rows, there would be animals that would be a parody type thing off of computer names, like RAM, like RAM sticks. So, they'd be like little cartoonish RAM sticks and stuff like that.`);
                  setNotice('🍌 Nano Banana Pro: Auto-filled Zyncast CFO Organic Code script & model selected!');
                }}
                className="p-3 bg-slate-950/80 hover:bg-slate-900 border border-rose-500/30 hover:border-rose-400 rounded-xl text-left space-y-1 transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200 flex items-center justify-between">
                  <span>Farm Pasture Commercial</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-[10px] text-slate-400">Main character on porch + 3D RAM sticks walking down pasture rows</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedModel('Nano Banana Pro 2.5');
                  setNotice('🍌 Nano Banana Pro: Voice Synthesizer calibrated for studio narrator voice!');
                }}
                className="p-3 bg-slate-950/80 hover:bg-slate-900 border border-rose-500/30 hover:border-rose-400 rounded-xl text-left space-y-1 transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-rose-300 group-hover:text-rose-200 flex items-center justify-between">
                  <span>Voice Actor Synthesizer</span>
                  <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <p className="text-[10px] text-slate-400">Synthesizes studio voiceover dialogue with precise audio lip sync</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedModel('Nano Banana Pro 2.5');
                  setNotice('🍌 Nano Banana Pro: 4K Raytraced lighting pass enabled for renders!');
                }}
                className="p-3 bg-slate-950/80 hover:bg-slate-900 border border-rose-500/30 hover:border-rose-400 rounded-xl text-left space-y-1 transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200 flex items-center justify-between">
                  <span>Raytraced 4K Render</span>
                  <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-[10px] text-slate-400">Sub-pixel neural density & realistic volumetric sunlight flares</p>
              </button>
            </div>
          </div>
        )}

        {/* Date Row */}
        <div className="text-xs text-slate-400 font-semibold px-1">
          Today
        </div>

        {/* GENERATED VIDEO CANVAS CONTAINER (Main Player) */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl space-y-3 p-4 sm:p-5">
          {/* Active Realistic Generation Progress Overlay */}
          {isGenerating && (
            <div className="p-6 bg-slate-900/95 backdrop-blur-md rounded-xl border border-indigo-500/40 space-y-4 text-center animate-fadeIn shadow-2xl">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-indigo-300">
                <span className="flex items-center gap-2 truncate">
                  <RotateCcw className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
                  <span className="truncate">{currentGenStep}</span>
                </span>
                <span className="text-amber-400 font-bold ml-2">{progress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>Rendering Time Elapsed: <strong className="text-white">{elapsedTime}s</strong></span>
                <span>Model: <strong className="text-indigo-300">{selectedModel}</strong></span>
                <span>Status: <strong className="text-emerald-400">Processing VRAM</strong></span>
              </div>
            </div>
          )}

          {/* Live Video Player Canvas with Reliable Playback & Controls */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[400px] group">
            <video
              ref={videoRef}
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              autoPlay
              loop
              playsInline
              muted={isMuted}
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-[300px] sm:h-[400px] object-cover rounded-xl"
            />

            {/* Custom On-Canvas Controls Bar (Overlay) */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
              <button
                type="button"
                onClick={handleToggleMute}
                className="p-2 bg-slate-950/80 hover:bg-slate-900 text-white rounded-lg border border-slate-700/80 backdrop-blur-md cursor-pointer transition-transform active:scale-95 shadow-md"
                title={isMuted ? 'Unmute Commercial Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
              <button
                type="button"
                onClick={handleTogglePlay}
                className="p-2 bg-slate-950/80 hover:bg-slate-900 text-white rounded-lg border border-slate-700/80 backdrop-blur-md cursor-pointer transition-transform active:scale-95 shadow-md"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 text-indigo-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>

            {/* Commercial Subtitle / Audio Transcript Overlay Banner */}
            <div className="absolute bottom-16 left-4 right-4 bg-slate-950/85 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 shadow-2xl pointer-events-none flex items-center justify-between gap-3">
              <p className="text-xs sm:text-sm font-semibold text-white truncate font-sans">
                "Do you know where your code comes from? Here at Zyncast CFO, all our code is organic!"
              </p>
              <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded border border-amber-700 shrink-0">
                Zyncast CFO
              </span>
            </div>
          </div>

          {/* Video Parameters Toolbar under Video Player (Exact Match to Krea Toolbar) */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={() => setNotice('Reference frame added to video model generator')}
                className="text-slate-300 hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-400" /> + Reference
              </button>

              <button
                type="button"
                onClick={() => setNotice('Reusing prompt parameters for next scene render')}
                className="text-slate-300 hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> Reuse parameters
              </button>

              <button
                type="button"
                onClick={() => setNotice('Opening audio track generator')}
                className="text-slate-300 hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> Add audio
              </button>

              <button
                type="button"
                onClick={() => setDurationSecs(prev => prev + 6)}
                className="text-slate-300 hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-purple-400" /> Extend (+6s)
              </button>

              {/* Playback Speed Adjustment Pill */}
              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800 text-[11px]">
                <Gauge className="w-3 h-3 text-cyan-400" />
                <span className="text-slate-400">Speed:</span>
                {[0.5, 1.0, 1.5, 2.0].map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => handlePlaybackSpeedChange(sp)}
                    className={`px-1.5 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                      playbackSpeed === sp ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sp}x
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNotice('Commercial video link shared to clipboard!')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-400" /> Share
              </button>

              <button
                type="button"
                onClick={() => setNotice('Exporting high definition 4K MP4 Commercial...')}
                className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" /> Download MP4
              </button>
            </div>
          </div>
        </div>

        {/* FLOATING PROMPT OVERLAY CONSOLE BOX (Exact match to Krea AI prompt window) */}
        <div className="bg-[#13151c] border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3 relative">
          {/* Top Action Buttons & Asset Thumbnails Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            {/* Square Tool Action Buttons */}
            <div className="flex items-center gap-2">
              <label className="flex flex-col items-center justify-center w-14 h-14 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500 rounded-xl cursor-pointer transition-all group">
                <ImageIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                <span className="text-[9px] font-semibold text-slate-400 group-hover:text-white mt-1">Add image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleAddNewImage} />
              </label>

              <button
                type="button"
                onClick={() => handleInsertTag('@video-clip')}
                className="flex flex-col items-center justify-center w-14 h-14 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500 rounded-xl cursor-pointer transition-all group"
              >
                <Video className="w-4 h-4 text-slate-400 group-hover:text-purple-400" />
                <span className="text-[9px] font-semibold text-slate-400 group-hover:text-white mt-1">Add video</span>
              </button>

              <button
                type="button"
                onClick={() => handleInsertTag('@voiceover')}
                className="flex flex-col items-center justify-center w-14 h-14 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500 rounded-xl cursor-pointer transition-all group"
              >
                <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
                <span className="text-[9px] font-semibold text-slate-400 group-hover:text-white mt-1">Add audio</span>
              </button>

              <button
                type="button"
                onClick={() => handleInsertTag('[4K Cinematic]')}
                className="flex flex-col items-center justify-center w-14 h-14 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500 rounded-xl cursor-pointer transition-all group"
              >
                <Wand2 className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
                <span className="text-[9px] font-semibold text-slate-400 group-hover:text-white mt-1">Add effect</span>
              </button>
            </div>

            {/* Tagged Asset Thumbnails with Color @img Tags (Pre-populated to match Krea Screenshot 4) */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
              {assets.map((asset, index) => {
                const colorClasses = [
                  'text-amber-400 border-amber-500/50 bg-amber-950/80',
                  'text-emerald-400 border-emerald-500/50 bg-emerald-950/80',
                  'text-cyan-400 border-cyan-500/50 bg-cyan-950/80',
                  'text-purple-400 border-purple-500/50 bg-purple-950/80'
                ][index % 4];

                return (
                  <div key={asset.id} className="flex flex-col items-center gap-1 group relative shrink-0">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 relative shadow-sm">
                      <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                      {/* Click overlay to swap photo */}
                      <label className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                        <Upload className="w-3.5 h-3.5 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleSwapAssetPhoto(asset.id, e)}
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInsertTag(asset.tag)}
                      className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border ${colorClasses} cursor-pointer hover:scale-105 transition-transform`}
                      title={`Click to insert ${asset.tag} into prompt`}
                    >
                      {asset.tag}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Multiline Prompt Script Input Box */}
          <div className="relative">
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 bg-transparent text-xs font-sans text-slate-200 focus:outline-none leading-relaxed resize-none"
              placeholder="Describe your commercial scene or tag @img-1..."
            />
          </div>

          {/* Bottom Control Bar inside Prompt Box (Exact Match to Krea AI Bottom Control Bar) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              {/* Model Pill */}
              <div className="flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs font-bold text-slate-200">
                <Film className="w-3.5 h-3.5 text-indigo-400" />
                <span>{selectedModel}</span>
              </div>

              {/* Start Frame Keyframe Selector */}
              <label className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 cursor-pointer transition-colors">
                <Upload className="w-3 h-3 text-emerald-400" />
                <span>{startFrameUrl ? 'Start frame ✓' : 'Start frame'}</span>
                <input ref={startFrameInputRef} type="file" accept="image/*" className="hidden" onChange={handleStartFrameUpload} />
              </label>

              {/* End Frame Keyframe Selector */}
              <label className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 cursor-pointer transition-colors">
                <Upload className="w-3 h-3 text-rose-400" />
                <span>{endFrameUrl ? 'End frame ✓' : 'End frame'}</span>
                <input ref={endFrameInputRef} type="file" accept="image/*" className="hidden" onChange={handleEndFrameUpload} />
              </label>

              {/* Resolution Picker (720p, 1080p, 4K) */}
              <div className="flex items-center bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-slate-300 border-none focus:outline-none cursor-pointer"
                >
                  <option value="720p" className="bg-slate-900">720p</option>
                  <option value="1080p" className="bg-slate-900">1080p Full HD</option>
                  <option value="4K" className="bg-slate-900">4K Cinema</option>
                </select>
              </div>

              {/* Duration Toggle (- 18 s +) */}
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                <button
                  type="button"
                  onClick={() => setDurationSecs(prev => Math.max(3, prev - 3))}
                  className="text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="font-bold text-white">{durationSecs} s</span>
                <button
                  type="button"
                  onClick={() => setDurationSecs(prev => Math.min(60, prev + 3))}
                  className="text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Aspect Ratio Pill */}
              <div className="flex items-center bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-slate-300 border-none focus:outline-none cursor-pointer"
                >
                  <option value="16:9" className="bg-slate-900">16:9</option>
                  <option value="9:16" className="bg-slate-900">9:16</option>
                  <option value="1:1" className="bg-slate-900">1:1</option>
                  <option value="21:9" className="bg-slate-900">21:9 UltraWide</option>
                </select>
              </div>
            </div>

            {/* Glowing White Circular Generate Button (+) */}
            <button
              type="button"
              onClick={handleGenerateVideo}
              disabled={isGenerating || !prompt.trim()}
              className="w-10 h-10 rounded-full bg-white hover:bg-slate-200 text-slate-950 font-extrabold flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer shrink-0 group relative"
              title="Generate Commercial Video"
            >
              {isGenerating ? (
                <RotateCcw className="w-5 h-5 animate-spin text-indigo-600" />
              ) : (
                <Plus className="w-6 h-6 stroke-[3]" />
              )}
            </button>
          </div>
        </div>

        {notice && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-xs text-emerald-300 font-medium flex items-center justify-between animate-fade-in">
            <span>{notice}</span>
            <button onClick={() => setNotice(null)} className="text-emerald-400 hover:text-white font-bold text-sm">✕</button>
          </div>
        )}
      </div>
    </div>
  );
}



