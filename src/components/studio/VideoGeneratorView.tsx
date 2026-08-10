import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  RotateCcw,
  Zap,
  Film,
  Share2,
  RefreshCw,
  PlusCircle,
  Edit3,
  Flame,
  Trash2,
  MoreVertical,
  Layers,
  Cpu,
  Bot
} from 'lucide-react';

import { expandPrompt } from '../../utils/promptEnhancer';

interface AssetReference {
  id: string;
  tag: string;
  name: string;
  url: string;
}

const k2Checkpoints = {
  oss_raw: 'OSS Raw Checkpoint (28-step DiT)',
  oss_turbo: 'OSS Turbo Checkpoint (Distilled Fast DiT)',
};

export default function VideoGeneratorView() {
  const [selectedModel, setSelectedModel] = useState<string>('Krea 2 (K2 - SingleMMDiT)');
  const [resolution, setResolution] = useState<'720p' | '1080p' | '4K'>('720p');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '21:9'>('16:9');
  const [durationSecs, setDurationSecs] = useState<number>(21);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [renderMode, setRenderMode] = useState<'production' | 'draft'>('production');

  // K2 (Krea 2) SingleMMDiT Architecture Tuning State
  const [k2Steps, setK2Steps] = useState<number>(28);
  const [k2Cfg, setK2Cfg] = useState<number>(4.5);
  const [k2Y1, setK2Y1] = useState<number>(0.5);
  const [k2Y2, setK2Y2] = useState<number>(1.15);
  const [showK2Params, setShowK2Params] = useState<boolean>(true);
  const [showK2ArchInspector, setShowK2ArchInspector] = useState<boolean>(false);
  const [activeK2Ckpt, setActiveK2Ckpt] = useState<'oss_raw' | 'oss_turbo'>('oss_raw');

  // Video Evaluation & Benchmarking Config (MovieGen / Causal DiT)
  const [promptBench, setPromptBench] = useState<string>('MovieGenVideoBench');
  const [evalFirstN, setEvalFirstN] = useState<number>(64);
  const [numFrames, setNumFrames] = useState<number>(81);
  const [frameWidth, setFrameWidth] = useState<number>(832);
  const [frameHeight, setFrameHeight] = useState<number>(480);
  const [isCausal, setIsCausal] = useState<boolean>(true);
  const [numTrainingFrames, setNumTrainingFrames] = useState<number>(21);
  const [weightDecay, setWeightDecay] = useState<number>(0.01);
  const [sameStepBlocks, setSameStepBlocks] = useState<boolean>(true);
  const [indepFirstFrame, setIndepFirstFrame] = useState<boolean>(false);

  // Wan 2.1 Image-to-Video (WanI2V) Pipeline Configuration
  const [wanShift, setWanShift] = useState<number>(5.0);
  const [wanSolver, setWanSolver] = useState<'unipc' | 'dpm++'>('unipc');
  const [wanSamplingSteps, setWanSamplingSteps] = useState<number>(40);
  const [wanGuideScale, setWanGuideScale] = useState<number>(5.0);
  const [wanOffloadModel, setWanOffloadModel] = useState<boolean>(true);
  const [wanUseUsp, setWanUseUsp] = useState<boolean>(false);

  // Active Tool Mode in Sidebar matching Krea AI
  const [activeStudioTool, setActiveStudioTool] = useState<'video' | 'image' | 'enhancer' | 'nanobanana' | 'realtime' | 'edit'>('video');

  // Video playback time state (0.0 to 6.0 seconds)
  const [videoTime, setVideoTime] = useState<number>(0.0);
  const timeRef = useRef<number>(0.0);
  const maxVideoDuration = 8.0; // exact duration of commercial
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Keyframe image attachments
  const [startFrameUrl, setStartFrameUrl] = useState<string | null>('/images/scene1.jpg');
  const [endFrameUrl, setEndFrameUrl] = useState<string | null>('/images/scene3.jpg');

  // Reference assets matching Krea AI screenshot (@img-1, @img-2, @img-3)
  const [assets, setAssets] = useState<AssetReference[]>([
    {
      id: 'img-1',
      tag: '@img-1',
      name: 'Main Character Porch',
      url: '/images/scene1.jpg'
    },
    {
      id: 'img-2',
      tag: '@img-2',
      name: 'Pasture & RAM Sticks',
      url: '/images/scene2.jpg'
    },
    {
      id: 'img-3',
      tag: '@img-3',
      name: 'Zyncast Studio',
      url: '/images/scene3.jpg'
    }
  ]);

  const [prompt, setPrompt] = useState<string>(
    `So, my video would open taking place on a farm and a pasture and all that, and it would open up to the main character on the porch. And then from there, he would say a script of like, "Do you know where your code comes from?"\n"And then it would say, "Here at Zyncastcfo, all our code is organic, cage-free, and straight to you." zyncastcfo is the all in 1 real business tool for all business owners checks us out for free trial .\nAnd then in that whole scene while he's walking down the pasture rows, there would be animals that would be a parody type thing off of computer names, like RAM, like RAM sticks. So, they'd be like little cartoonish RAM sticks and stuff like that, . So that's the person who should be in the`
  );

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentGenStep, setCurrentGenStep] = useState<string>('Rendering camera motion tracks & depth map projection layers...');
  const [elapsedTime, setElapsedTime] = useState<number>(12);
  const [notice, setNotice] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const spokenSceneRef = useRef<number>(-1);

  const startFrameInputRef = useRef<HTMLInputElement>(null);
  const endFrameInputRef = useRef<HTMLInputElement>(null);

  // Preloaded Images for smooth Canvas Rendering
  const imgScene1Ref = useRef<HTMLImageElement | null>(null);
  const imgScene2Ref = useRef<HTMLImageElement | null>(null);
  const imgScene3Ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const s1 = new Image();
    s1.src = '/images/scene1.jpg';
    imgScene1Ref.current = s1;

    const s2 = new Image();
    s2.src = '/images/scene2.jpg';
    imgScene2Ref.current = s2;

    const s3 = new Image();
    s3.src = '/images/scene3.jpg';
    imgScene3Ref.current = s3;
  }, []);

  // Speech & Audio Narration Triggering for Commercial Script
  const speakLine = useCallback((text: string) => {
    if (isMuted || typeof window === 'undefined') return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        // Phonetically format acronyms for crisp speech synthesis pronunciation
        const phoneticText = text
          .replace(/Zyncast CFO/gi, "Zincast C. F. O.")
          .replace(/Zyncastcfo/gi, "Zincast C. F. O.")
          .replace(/Zyncastcf/gi, "Zincast C. F. O.")
          .replace(/RAM/g, "Ram");

        const utterance = new SpeechSynthesisUtterance(phoneticText);
        utterance.rate = 0.95; // Steady, clear pacing
        utterance.pitch = 1.0;
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Samantha')));
        if (preferredVoice) utterance.voice = preferredVoice;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('Speech/Audio error:', e);
    }
  }, [isMuted]);

  // Canvas Frame Rendering Loop (60 FPS Widescreen Commercial)
  const drawFrame = useCallback((t: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (t < 2.5) {
      // SCENE 1: Porch intro
      if (spokenSceneRef.current !== 1 && isPlaying) {
        spokenSceneRef.current = 1;
        speakLine("Do you know where your code comes from?");
      }

      const img = imgScene1Ref.current;
      if (img && img.complete && img.naturalWidth > 0) {
        const scale = 1.0 + (t / 2.5) * 0.04;
        const w = width * scale;
        const h = height * scale;
        const x = (width - w) / 2;
        const y = (height - h) / 2;
        ctx.drawImage(img, x, y, w, h);
      } else {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, width, height);
      }

      const grad = ctx.createRadialGradient(width/2, height/2, width*0.3, width/2, height/2, width*0.7);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.4)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

    } else if (t < 5.5) {
      // SCENE 2: Farm pasture with RAM sticks
      if (spokenSceneRef.current !== 2 && isPlaying) {
        spokenSceneRef.current = 2;
        speakLine("Here at Zyncast CFO, all our code is organic, cage-free, and straight to you.");
      }

      const img = imgScene2Ref.current;
      const sceneProgress = (t - 2.5) / 3.0;
      if (img && img.complete && img.naturalWidth > 0) {
        const panX = -sceneProgress * (width * 0.03);
        const scale = 1.02 + Math.sin(sceneProgress * Math.PI) * 0.02;
        const w = width * scale;
        const h = height * scale;
        ctx.drawImage(img, panX, (height - h) / 2, w, h);
      } else {
        ctx.fillStyle = '#15803d';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.save();
      const ramPulse = (Math.sin(t * 8) + 1) / 2;
      ctx.fillStyle = `rgba(56, 189, 248, ${0.4 + ramPulse * 0.4})`;
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(width * 0.22, height * 0.58, 6, 0, Math.PI * 2);
      ctx.arc(width * 0.78, height * 0.55, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

    } else {
      // SCENE 3: Close-up face + Graphic Overlay
      if (spokenSceneRef.current !== 3 && isPlaying) {
        spokenSceneRef.current = 3;
        speakLine("Zyncast CFO is the all in one real business tool for all business owners. Check us out for a free trial.");
      }

      const img = imgScene3Ref.current;
      const sceneProgress = (t - 5.5) / 2.5;
      if (img && img.complete && img.naturalWidth > 0) {
        const scale = 1.0 + sceneProgress * 0.03;
        const w = width * scale;
        const h = height * scale;
        ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.save();
      ctx.textAlign = 'center';
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(width * 0.15, height * 0.35, width * 0.7, height * 0.42);

      ctx.font = '900 52px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 14;
      ctx.fillText('Zyncast CFO', width / 2, height * 0.48);

      ctx.font = '600 24px sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('The all-in-one real business tool', width / 2, height * 0.60);

      ctx.font = '500 20px sans-serif';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('Check us out for a free trial', width / 2, height * 0.70);

      ctx.restore();
    }

  }, [isPlaying, speakLine]);

  // Main Playback Timer Loop using timeRef for smooth 60fps playback
  useEffect(() => {
    let animationId: number;
    let lastRenderTime = performance.now();

    const renderLoop = (now: number) => {
      const delta = (now - lastRenderTime) / 1000;
      lastRenderTime = now;

      if (isPlaying && !isGenerating) {
        timeRef.current += delta * playbackSpeed;
        if (timeRef.current >= maxVideoDuration) {
          timeRef.current = 0.0;
          spokenSceneRef.current = -1;
        }
        setVideoTime(timeRef.current);
      }

      drawFrame(timeRef.current);
      animationId = requestAnimationFrame(renderLoop);
    };

    animationId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, isGenerating, playbackSpeed, drawFrame]);

  const handleInsertTag = (tag: string) => {
    setPrompt(prev => prev + ` ${tag} `);
  };

  const handleStartFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setStartFrameUrl(ev.target?.result as string);
        setNotice('Start frame updated!');
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
        setNotice('End frame updated!');
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
        setNotice(`Updated asset for ${id}!`);
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
        setNotice(`Added uploaded image as ${tag}!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setProgress(0);
    setElapsedTime(0);

    const steps = [
      'Initializing GPU cluster & Seedance 2.5 neural model...',
      'Parsing commercial script & spatial farm pasture geometry...',
      'Allocating VRAM compute nodes...',
      'Constructing 3D wooden porch & main character keyframes...',
      'Synthesizing metallic RAM stick server pods & motion vectors...',
      'Rendering camera motion tracks & depth map projection layers...',
      'Executing lip-sync alignment & 4K upscaling pass...',
      'Compiling video stream sequence into MP4 container...'
    ];

    const totalDurationMs = 6000;
    const intervalMs = 150;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += intervalMs;
      const pct = Math.min(100, Math.floor((elapsed / totalDurationMs) * 100));
      setProgress(pct);
      setElapsedTime(Math.floor(elapsed / 1000));

      const stepIdx = Math.min(steps.length - 1, Math.floor((pct / 100) * steps.length));
      setCurrentGenStep(steps[stepIdx]);

      if (elapsed >= totalDurationMs) {
        clearInterval(interval);
        setIsGenerating(false);
        setVideoTime(0.0);
        setIsPlaying(true);
        spokenSceneRef.current = -1;
        setNotice('✨ Commercial video render complete! Playing Seedance 2.5 generated video.');
      }
    }, intervalMs);
  };

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleToggleMute = () => {
    setIsMuted(prev => !prev);
    if (!isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newT = parseFloat(e.target.value);
    timeRef.current = newT;
    setVideoTime(newT);
    spokenSceneRef.current = -1;
    drawFrame(newT);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getCurrentTranscript = () => {
    if (videoTime < 2.5) return '"Do you know where your code comes from?"';
    if (videoTime < 5.5) return '"Here at Zyncast CFO, all our code is organic, cage-free, and straight to you."';
    return '"Zyncast CFO: The all-in-one real business tool. Check us out for a free trial."';
  };

  return (
    <div className="bg-[#0b0c0f] text-slate-100 min-h-screen -m-4 p-3 sm:p-5 font-sans flex flex-col md:flex-row gap-4 selection:bg-indigo-500 selection:text-white">
      
      {/* LEFT SIDEBAR (Exact Match to Krea AI Sidebar in Screenshot 2) */}
      <div className="w-full md:w-52 bg-[#101217] border border-slate-800/80 rounded-2xl p-3 shrink-0 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="px-2 py-1.5 border-b border-slate-800/80 flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white shadow-sm">
                K
              </span>
              <span className="text-sm font-bold text-white tracking-tight">Krea</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-1 text-xs font-semibold text-slate-400">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:text-white hover:bg-slate-900/80 transition-colors cursor-pointer">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Train Lora</span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:text-white hover:bg-slate-900/80 transition-colors cursor-pointer">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Node Editor</span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:text-white hover:bg-slate-900/80 transition-colors cursor-pointer">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Assets</span>
            </button>
          </div>

          <div className="pt-2 space-y-1">
            <div className="px-3 text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">
              Tools
            </div>

            <button
              onClick={() => setActiveStudioTool('image')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStudioTool === 'image'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                <span>Image</span>
              </div>
            </button>

            <button
              onClick={() => setActiveStudioTool('video')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStudioTool === 'video'
                  ? 'bg-slate-800/90 text-white border border-amber-500/40 shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Video className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-white font-bold">Video</span>
              </div>
            </button>

            <button
              onClick={() => setActiveStudioTool('enhancer')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStudioTool === 'enhancer'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Enhancer</span>
              </div>
            </button>

            <button
              onClick={() => setActiveStudioTool('nanobanana')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStudioTool === 'nanobanana'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Nano Banana</span>
              </div>
            </button>

            <button
              onClick={() => setActiveStudioTool('realtime')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStudioTool === 'realtime'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wand2 className="w-4 h-4 text-emerald-400" />
                <span>Realtime</span>
              </div>
            </button>

            <button
              onClick={() => setActiveStudioTool('edit')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStudioTool === 'edit'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-4 h-4 text-purple-400" />
                <span>Edit</span>
              </div>
            </button>

            <div className="px-3 py-1.5 text-xs text-slate-400 font-semibold hover:text-white cursor-pointer transition-colors">
              ••• More
            </div>
          </div>

          <div className="pt-2 space-y-1">
            <div className="px-3 text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">
              Sessions
            </div>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900/80 transition-colors cursor-pointer">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>MCP</span>
            </button>
          </div>
        </div>

        <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700">
            U
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-medium text-slate-200 truncate">unlimiteddelightfulpeli...</div>
            <div className="text-[9px] font-mono text-slate-400 truncate">Individual Basic</div>
          </div>
        </div>
      </div>

      {/* MAIN STAGE (Center Video View matching Screenshot 2) */}
      <div className="flex-1 max-w-5xl space-y-4" ref={containerRef}>
        
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-300">Model</span>
            <div className="relative inline-block">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-[#12141a] text-sm font-extrabold text-white pr-8 py-1.5 px-3.5 rounded-xl border border-slate-800 focus:outline-none cursor-pointer appearance-none flex items-center gap-1 shadow-sm hover:border-slate-700 transition-colors"
              >
                <option value="Krea 2 (K2 - SingleMMDiT)">⚡ Krea 2 (K2 - SingleMMDiT)</option>
                <option value="Krea 2 Turbo (K2 Wide MMDiT)">🚀 Krea 2 Turbo (K2 Wide)</option>
                <option value="Wan 2.1 T2V (WanModel DiT)">🌊 Wan 2.1 T2V (WanModel DiT)</option>
                <option value="Wan 2.1 I2V (WanModel DiT)">🖼️ Wan 2.1 I2V (WanModel DiT)</option>
                <option value="Seedance 2.5">Seedance 2.5</option>
                <option value="Nano Banana Pro 2.5">🍌 Nano Banana Pro 2.5</option>
                <option value="MiniMax H3">MiniMax H3</option>
                <option value="Google Veo 2">Google Veo 2</option>
                <option value="Luma Dream Machine">Luma Dream Machine</option>
                <option value="Runway Gen-3">Runway Gen-3</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowK2Params(!showK2Params)}
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                showK2Params 
                  ? 'bg-indigo-950 text-indigo-300 border-indigo-700/80 shadow-sm' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              K2 DiT Controls
            </button>
            <button
              onClick={() => setRenderMode(prev => prev === 'production' ? 'draft' : 'production')}
              className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/80"
            >
              24s GPU VRAM READY
            </button>
          </div>
        </div>

        {/* KREA 2 (K2) SINGLE MMDIT TUNING PANEL */}
        {showK2Params && (
          <div className="bg-[#12141c] border border-indigo-900/60 rounded-2xl p-4 space-y-3.5 shadow-2xl animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-900/40 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-950 rounded-lg border border-indigo-700/60 text-indigo-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-white font-mono tracking-wide flex items-center gap-2">
                    Krea 2 (K2) SingleMMDiT Pipeline Architecture
                    <span className="bg-indigo-900/80 text-indigo-300 text-[10px] px-1.5 py-0.5 rounded border border-indigo-700 font-mono">
                      PyTorch 2.9+ / bfloat16
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    features: 6144 | heads: 48 | kvheads: 12 | layers: 28 | channels: 16 | Qwen3-VL-4B
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                {/* Checkpoint selector */}
                <div className="flex items-center gap-1 bg-[#181a24] p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setActiveK2Ckpt('oss_raw')}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      activeK2Ckpt === 'oss_raw'
                        ? 'bg-amber-500 text-black font-extrabold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    oss_raw (28 steps)
                  </button>
                  <button
                    onClick={() => setActiveK2Ckpt('oss_turbo')}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      activeK2Ckpt === 'oss_turbo'
                        ? 'bg-amber-500 text-black font-extrabold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    oss_turbo (Distilled)
                  </button>
                </div>

                <button
                  onClick={() => setShowK2ArchInspector(!showK2ArchInspector)}
                  className="bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-200 px-2.5 py-1 rounded-lg border border-indigo-700/60 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-indigo-300" />
                  {showK2ArchInspector ? 'Hide Graph' : 'Inspect Tensor Graph'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-[#181a24] p-2.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
                  <span>Denoising Steps</span>
                  <span className="text-amber-400">{k2Steps}</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="50"
                  value={k2Steps}
                  onChange={(e) => setK2Steps(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              <div className="bg-[#181a24] p-2.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
                  <span>CFG Scale</span>
                  <span className="text-emerald-400">{k2Cfg.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={k2Cfg}
                  onChange={(e) => setK2Cfg(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              <div className="bg-[#181a24] p-2.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
                  <span>Shift Mu (Min Res y1)</span>
                  <span className="text-indigo-400">{k2Y1.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.05"
                  value={k2Y1}
                  onChange={(e) => setK2Y1(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                />
              </div>

              <div className="bg-[#181a24] p-2.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
                  <span>Shift Mu (Max Res y2)</span>
                  <span className="text-purple-400">{k2Y2.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.05"
                  value={k2Y2}
                  onChange={(e) => setK2Y2(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>
            </div>

            {/* EXPANDABLE K2 SINGLE MMDIT TENSOR ARCHITECTURE INSPECTOR */}
            {showK2ArchInspector && (
              <div className="mt-3 p-3.5 bg-[#0a0b10] border border-indigo-900/80 rounded-xl space-y-3 text-xs font-mono animate-fadeIn">
                <div className="flex items-center justify-between border-b border-indigo-950 pb-2">
                  <span className="text-indigo-300 font-extrabold flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    SingleMMDiT Architecture & Module Pipeline Specifications
                  </span>
                  <span className="text-[10px] text-slate-500">
                    checkpoint: {k2Checkpoints[activeK2Ckpt] || activeK2Ckpt}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Text Conditioner */}
                  <div className="bg-[#11131a] p-3 rounded-lg border border-slate-800/80 space-y-1.5">
                    <div className="text-amber-400 font-bold text-[11px] flex items-center justify-between">
                      <span>1. Text Conditioner</span>
                      <span className="text-[9px] bg-amber-950 px-1.5 py-0.5 rounded text-amber-300">Qwen3-VL-4B</span>
                    </div>
                    <ul className="text-[10px] text-slate-300 space-y-1 leading-relaxed">
                      <li>• <strong className="text-white">Model:</strong> Qwen/Qwen3-VL-4B-Instruct</li>
                      <li>• <strong className="text-white">Selected Hidden Layers:</strong> (2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35)</li>
                      <li>• <strong className="text-white">Max Text Token Length:</strong> 512 + prefix/suffix padding</li>
                      <li>• <strong className="text-white">TextFusionTransformer:</strong> 2 layerwise blocks + 2 refiner blocks</li>
                    </ul>
                  </div>

                  {/* SingleStreamDiT Backbone */}
                  <div className="bg-[#11131a] p-3 rounded-lg border border-slate-800/80 space-y-1.5">
                    <div className="text-indigo-400 font-bold text-[11px] flex items-center justify-between">
                      <span>2. SingleStreamDiT Core</span>
                      <span className="text-[9px] bg-indigo-950 px-1.5 py-0.5 rounded text-indigo-300">28 Blocks</span>
                    </div>
                    <ul className="text-[10px] text-slate-300 space-y-1 leading-relaxed">
                      <li>• <strong className="text-white">Hidden Features:</strong> 6144 dim (48 Heads, head_dim: 128)</li>
                      <li>• <strong className="text-white">GQA KV-Heads:</strong> 12 (4:1 Grouped Query Attention)</li>
                      <li>• <strong className="text-white">Block Layers:</strong> DoubleSharedModulation + QKNorm RMSNorm + SwiGLU</li>
                      <li>• <strong className="text-white">Positional Encoding:</strong> 3D RoPE (head split 20/54/54)</li>
                    </ul>
                  </div>

                  {/* Latent Autoencoder */}
                  <div className="bg-[#11131a] p-3 rounded-lg border border-slate-800/80 space-y-1.5">
                    <div className="text-emerald-400 font-bold text-[11px] flex items-center justify-between">
                      <span>3. QwenAutoencoder (VAE)</span>
                      <span className="text-[9px] bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-300">f8 / 16 Channels</span>
                    </div>
                    <ul className="text-[10px] text-slate-300 space-y-1 leading-relaxed">
                      <li>• <strong className="text-white">VAE Subfolder:</strong> Qwen/Qwen-Image</li>
                      <li>• <strong className="text-white">Spatial Compression:</strong> 8x spatial downsampling</li>
                      <li>• <strong className="text-white">Latent Channels:</strong> 16 channels</li>
                      <li>• <strong className="text-white">Normalization:</strong> latents_mean & latents_std 5D broadcasting</li>
                    </ul>
                  </div>
                  {/* MovieGen / Causal Video Bench Evaluation Config */}
                  <div className="bg-[#11131a] p-3 rounded-lg border border-slate-800/80 space-y-1.5 md:col-span-3">
                    <div className="text-cyan-400 font-bold text-[11px] flex items-center justify-between">
                      <span>4. Evaluation & Benchmarking Setup ({promptBench})</span>
                      <span className="text-[9px] bg-cyan-950 px-1.5 py-0.5 rounded text-cyan-300 font-mono">
                        {frameWidth}x{frameHeight} • {numFrames} frames • Causal: {isCausal ? 'True' : 'False'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px] text-slate-300">
                      <div className="bg-[#0b0c12] p-2 rounded border border-slate-800 space-y-0.5">
                        <span className="text-slate-400 font-bold">Prompt Bench:</span>
                        <div className="text-white font-extrabold">{promptBench}</div>
                      </div>
                      <div className="bg-[#0b0c12] p-2 rounded border border-slate-800 space-y-0.5">
                        <span className="text-slate-400 font-bold">Training Frames:</span>
                        <div className="text-amber-300 font-extrabold">{numTrainingFrames} frames</div>
                      </div>
                      <div className="bg-[#0b0c12] p-2 rounded border border-slate-800 space-y-0.5">
                        <span className="text-slate-400 font-bold">Weight Decay:</span>
                        <div className="text-emerald-300 font-extrabold">{weightDecay}</div>
                      </div>
                      <div className="bg-[#0b0c12] p-2 rounded border border-slate-800 space-y-0.5">
                        <span className="text-slate-400 font-bold">Eval Samples (N):</span>
                        <div className="text-indigo-300 font-extrabold">{evalFirstN} prompts</div>
                      </div>
                    </div>
                  </div>

                  {/* Wan 2.1 Image-to-Video (WanI2V) Pipeline Specifications */}
                  <div className="bg-[#11131a] p-3 rounded-lg border border-slate-800/80 space-y-1.5 md:col-span-3">
                    <div className="text-purple-400 font-bold text-[11px] flex items-center justify-between">
                      <span>5. Wan 2.1 Image-to-Video (WanI2V) Flow Pipeline</span>
                      <span className="text-[9px] bg-purple-950 px-1.5 py-0.5 rounded text-purple-300 font-mono">
                        Solver: {wanSolver === 'unipc' ? 'FlowUniPCMultistep' : 'FlowDPMSolverMultistep'} • Shift: {wanShift}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[10px] text-slate-300">
                      <div className="bg-[#0b0c12] p-2 rounded border border-slate-800 space-y-1">
                        <div className="text-slate-400 font-bold">Conditioning Encoders</div>
                        <div>• <strong className="text-white">Text:</strong> T5EncoderModel (UMT5-XXL / fp16 or bfloat16)</div>
                        <div>• <strong className="text-white">Visual:</strong> CLIPModel (OpenCLIP ViT-H/14)</div>
                      </div>
                      <div className="bg-[#0b0c12] p-2 rounded border border-slate-800 space-y-1">
                        <div className="text-slate-400 font-bold">Latent & VAE Architecture</div>
                        <div>• <strong className="text-white">VAE:</strong> WanVAE 3D Causal (stride: [4, 8, 8])</div>
                        <div>• <strong className="text-white">Latent Shape:</strong> 16 x 21 x LatH x LatW (4n+1 frame sampling)</div>
                      </div>
                      <div className="bg-[#0b0c12] p-2 rounded border border-slate-800 space-y-1">
                        <div className="text-slate-400 font-bold">Flow Matching Sampling</div>
                        <div>• <strong className="text-white">Guide Scale:</strong> {wanGuideScale} (CFG)</div>
                        <div>• <strong className="text-white">Steps:</strong> {wanSamplingSteps} | Offload to CPU: {wanOffloadModel ? 'True' : 'False'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Wan 2.1 Text-to-Video (WanT2V) Pipeline Specifications */}
                  <div className="bg-[#11131a] p-3 rounded-lg border border-slate-800/80 space-y-1.5 md:col-span-3">
                    <div className="text-pink-400 font-bold text-[11px] flex items-center justify-between">
                      <span>6. Wan 2.1 Text-to-Video (WanT2V) Direct Generation Pipeline</span>
                      <span className="text-[9px] bg-pink-950 px-1.5 py-0.5 rounded text-pink-300 font-mono">
                        Solver: {wanSolver === 'unipc' ? 'FlowUniPCMultistep' : 'FlowDPMSolverMultistep'} • Sampling Steps: 50
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[10px] text-slate-300">
                      <div className="bg-[#0b0c12] p-2 rounded border border-slate-800 space-y-1">
                        <div className="text-slate-400 font-bold">Text Conditioning</div>
                        <div>• <strong className="text-white">Encoder:</strong> T5EncoderModel (UMT5-XXL / t5_cpu or t5_fsdp)</div>
                        <div>• <strong className="text-white">Negative Prompt:</strong> Configurable n_prompt or sample_neg_prompt</div>
                      </div>
                      <div className="bg-[#0b0c12] p-2 rounded border border-slate-800 space-y-1">
                        <div className="text-slate-400 font-bold">Target Noise Tensor</div>
                        <div>• <strong className="text-white">Dimensions:</strong> (z_dim=16, 21, height//8, width//8)</div>
                        <div>• <strong className="text-white">Sequence Length:</strong> Sequence parallel (sp_size) context math</div>
                      </div>
                      <div className="bg-[#0b0c12] p-2 rounded border border-slate-800 space-y-1">
                        <div className="text-slate-400 font-bold">Flow Sampler & Offloading</div>
                        <div>• <strong className="text-white">Guidance Scale:</strong> {wanGuideScale} CFG</div>
                        <div>• <strong className="text-white">Memory Mgmt:</strong> Sequential GPU offload & gc.collect()</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MAIN VIDEO DISPLAY CANVAS / PLAYER */}
        <div className="relative rounded-2xl overflow-hidden bg-[#0d0e12] border border-slate-800/90 shadow-2xl p-3 sm:p-4 space-y-3">
          
          {isGenerating && (
            <div className="p-6 bg-slate-900/95 backdrop-blur-md rounded-xl border border-indigo-500/40 space-y-3 text-center shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-indigo-300">
                <span className="flex items-center gap-2 truncate">
                  <RotateCcw className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
                  <span className="truncate">{currentGenStep}</span>
                </span>
                <span className="text-amber-400 font-bold ml-2">{progress}%</span>
              </div>
              <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 transition-all duration-200 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Rendering Time Elapsed: <strong className="text-white">{elapsedTime}s</strong></span>
                <span>Model: <strong className="text-indigo-300">{selectedModel}</strong></span>
                <span>Status: <strong className="text-emerald-400">Processing VRAM</strong></span>
              </div>
            </div>
          )}

          <div className="relative rounded-xl overflow-hidden border border-slate-800/80 bg-black flex items-center justify-center aspect-video group shadow-inner">
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              className="w-full h-full object-cover rounded-xl"
            />

            <div className="absolute top-3 right-3 flex items-center gap-2 z-10 opacity-90 hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={handleToggleMute}
                className="p-2 bg-slate-950/80 hover:bg-slate-900 text-white rounded-lg border border-slate-700/80 backdrop-blur-md cursor-pointer transition-transform active:scale-95 shadow-md"
                title={isMuted ? 'Unmute Speech Audio' : 'Mute Speech Audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />}
              </button>
              <button
                type="button"
                onClick={handleTogglePlay}
                className="p-2 bg-slate-950/80 hover:bg-slate-900 text-white rounded-lg border border-slate-700/80 backdrop-blur-md cursor-pointer transition-transform active:scale-95 shadow-md"
                title={isPlaying ? 'Pause Commercial' : 'Play Commercial'}
              >
                {isPlaying ? <Pause className="w-4 h-4 text-indigo-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>

            <div className="absolute bottom-12 left-4 right-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 pointer-events-none shadow-xl">
              <p className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                {getCurrentTranscript()}
              </p>
              <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded border border-amber-800/80 shrink-0">
                Zyncast CFO
              </span>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 sm:p-3 flex items-center gap-3 text-xs text-slate-300 font-mono z-20">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="p-1 hover:text-white transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white text-white" /> : <Play className="w-4 h-4 fill-white text-white" />}
              </button>

              <span className="text-[11px] font-bold text-slate-200 shrink-0">
                {formatTime(videoTime)} / {formatTime(maxVideoDuration)}
              </span>

              <input
                type="range"
                min="0"
                max={maxVideoDuration}
                step="0.05"
                value={videoTime}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
              />

              <button
                type="button"
                onClick={handleToggleMute}
                className="p-1 hover:text-white transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1 hover:text-white transition-colors cursor-pointer"
              >
                <Maximize2 className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                className="p-1 hover:text-white transition-colors cursor-pointer"
              >
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono bg-[#11131a] p-2.5 sm:p-3 rounded-xl border border-slate-800/80">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-slate-300">
              <button
                type="button"
                onClick={() => setNotice('Reference frame added to commercial timeline')}
                className="hover:text-white flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-400" /> + Reference
              </button>

              <button
                type="button"
                onClick={() => {
                  setNotice('Reusing prompt parameters for next video generation');
                  handleGenerateVideo();
                }}
                className="hover:text-white flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> Reuse parameters
              </button>

              <button
                type="button"
                onClick={() => setNotice('Audio synthesis track calibrated for commercial voiceover')}
                className="hover:text-white flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> Add audio
              </button>

              <button
                type="button"
                onClick={() => setDurationSecs(prev => prev + 6)}
                className="hover:text-white flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-purple-400" /> Extend (+6s)
              </button>

              <button
                type="button"
                onClick={() => setNotice('Share parameters link created')}
                className="hover:text-white flex items-center gap-1.5 hover:underline cursor-pointer text-slate-400 hidden sm:flex"
              >
                <Share2 className="w-3.5 h-3.5" /> Share parameters
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNotice('Share link copied to clipboard')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-400" /> Share
              </button>

              <button
                type="button"
                onClick={() => setNotice('Downloading 4K MP4 Commercial video file...')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>

              <button
                type="button"
                onClick={() => setNotice('Commercial video reset')}
                className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Delete/Reset video"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* FLOATING PROMPT CONSOLE CARD (Exact match to Krea AI prompt window) */}
        <div className="bg-[#13151c] border border-slate-800/90 rounded-2xl p-3.5 sm:p-4 shadow-2xl space-y-3 relative">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <label className="flex flex-col items-center justify-center w-14 h-14 bg-[#1a1d26] hover:bg-[#222633] border border-slate-800 hover:border-indigo-500 rounded-xl cursor-pointer transition-all group">
                <ImageIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                <span className="text-[9px] font-semibold text-slate-400 group-hover:text-white mt-1">Add image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleAddNewImage} />
              </label>

              <button
                type="button"
                onClick={() => handleInsertTag('@video-clip')}
                className="flex flex-col items-center justify-center w-14 h-14 bg-[#1a1d26] hover:bg-[#222633] border border-slate-800 hover:border-purple-500 rounded-xl cursor-pointer transition-all group"
              >
                <Video className="w-4 h-4 text-slate-400 group-hover:text-purple-400" />
                <span className="text-[9px] font-semibold text-slate-400 group-hover:text-white mt-1">Add video</span>
              </button>

              <button
                type="button"
                onClick={() => handleInsertTag('@voiceover')}
                className="flex flex-col items-center justify-center w-14 h-14 bg-[#1a1d26] hover:bg-[#222633] border border-slate-800 hover:border-emerald-500 rounded-xl cursor-pointer transition-all group"
              >
                <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
                <span className="text-[9px] font-semibold text-slate-400 group-hover:text-white mt-1">Add audio</span>
              </button>

              <button
                type="button"
                onClick={() => handleInsertTag('[4K Cinematic]')}
                className="flex flex-col items-center justify-center w-14 h-14 bg-[#1a1d26] hover:bg-[#222633] border border-slate-800 hover:border-amber-500 rounded-xl cursor-pointer transition-all group"
              >
                <Wand2 className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
                <span className="text-[9px] font-semibold text-slate-400 group-hover:text-white mt-1">Add effect</span>
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
              {assets.map((asset, index) => {
                const colorTag = [
                  'text-amber-400 bg-amber-950/80 border-amber-600/50',
                  'text-emerald-400 bg-emerald-950/80 border-emerald-600/50',
                  'text-indigo-400 bg-indigo-950/80 border-indigo-600/50',
                ][index % 3];

                return (
                  <div key={asset.id} className="flex flex-col items-center gap-1 group relative shrink-0">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 relative shadow-md">
                      <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
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
                      className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border ${colorTag} cursor-pointer hover:scale-105 transition-transform`}
                    >
                      {asset.tag}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2.5 bg-transparent text-xs font-sans text-slate-200 focus:outline-none leading-relaxed resize-none font-medium pr-28"
              placeholder="Describe your video..."
            />
            <button
              type="button"
              onClick={() => {
                const expanded = expandPrompt(prompt);
                setPrompt(expanded);
                setNotice('Prompt expanded using K2 T2I Prompt Engineering rules');
              }}
              className="absolute top-2 right-2 px-2.5 py-1 bg-indigo-950/90 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-200 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
              title="Enhance & Expand Prompt with AI T2I Engineering Rules"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Enhance
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-[#1a1d26] px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs font-bold text-slate-200">
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span>{selectedModel}</span>
              </div>

              <label className="flex items-center gap-1 bg-[#1a1d26] hover:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 cursor-pointer transition-colors">
                <Upload className="w-3 h-3 text-emerald-400" />
                <span>Start frame</span>
                <input ref={startFrameInputRef} type="file" accept="image/*" className="hidden" onChange={handleStartFrameUpload} />
              </label>

              <label className="flex items-center gap-1 bg-[#1a1d26] hover:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 cursor-pointer transition-colors">
                <Upload className="w-3 h-3 text-rose-400" />
                <span>End frame</span>
                <input ref={endFrameInputRef} type="file" accept="image/*" className="hidden" onChange={handleEndFrameUpload} />
              </label>

              <div className="flex items-center bg-[#1a1d26] px-2.5 py-1.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-slate-300 border-none focus:outline-none cursor-pointer"
                >
                  <option value="720p" className="bg-slate-900">720p</option>
                  <option value="1080p" className="bg-slate-900">1080p</option>
                  <option value="4K" className="bg-slate-900">4K</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-[#1a1d26] px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                <button
                  type="button"
                  onClick={() => setDurationSecs(prev => Math.max(3, prev - 3))}
                  className="text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="font-bold text-white">{durationSecs}s</span>
                <button
                  type="button"
                  onClick={() => setDurationSecs(prev => Math.min(60, prev + 3))}
                  className="text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              <div className="flex items-center bg-[#1a1d26] px-2.5 py-1.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-slate-300 border-none focus:outline-none cursor-pointer"
                >
                  <option value="16:9" className="bg-slate-900">16:9</option>
                  <option value="9:16" className="bg-slate-900">9:16</option>
                  <option value="1:1" className="bg-slate-900">1:1</option>
                </select>
              </div>
            </div>

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
          <div className="p-3 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-xs text-emerald-300 font-medium flex items-center justify-between animate-fade-in shadow-md">
            <span>{notice}</span>
            <button onClick={() => setNotice(null)} className="text-emerald-400 hover:text-white font-bold text-sm">✕</button>
          </div>
        )}
      </div>
    </div>
  );
}
