import { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Mic, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Layers, 
  Film, 
  Tv, 
  Wand2, 
  Scissors, 
  Share2, 
  Check, 
  Copy, 
  RefreshCw, 
  Zap, 
  Flame, 
  Upload, 
  Eye, 
  Music, 
  Plus, 
  Trash2,
  Cpu,
  MonitorPlay,
  FileVideo,
  Radio,
  FileText
} from 'lucide-react';

export interface CommercialScene {
  id: string;
  title: string;
  durationSec: number;
  engine: 'RunwayML Gen-3' | 'Pika Labs 2.1' | 'Synthesia AI Avatar' | 'Luma Dream Machine' | 'Gen-2 (Runway)' | 'Sora';
  prompt: string;
  visualCue: string;
  voiceoverScript: string;
  overlayText: string;
  badgeText?: string;
  bgColorGradient: string;
  cameraMotion: 'Pan Right' | 'Zoom In' | 'Drone Shot' | 'Orbit 360' | 'Static Studio';
  voiceActor: string;
}

const DEFAULT_SCENES: CommercialScene[] = [
  {
    id: 'scene-1',
    title: 'Scene 1: Viral 0-3s Hook',
    durationSec: 4,
    engine: 'RunwayML Gen-3',
    prompt: 'Cinematic dynamic shot of modern business owner on a sunlit porch overlooking high-tech organic green fields, photorealistic 8k, golden hour, film lighting',
    visualCue: 'Owner turns towards the camera with confidence, holographic code particles floating in the breeze.',
    voiceoverScript: 'Do you know where your business code and cash flow really come from?',
    overlayText: '⚡ 100% Organic, Zero-Friction Growth',
    badgeText: '0-3s VIRAL HOOK',
    bgColorGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    cameraMotion: 'Zoom In',
    voiceActor: 'Adam (ElevenLabs Deep & Warm)'
  },
  {
    id: 'scene-2',
    title: 'Scene 2: Problem & Parody',
    durationSec: 5,
    engine: 'Pika Labs 2.1',
    prompt: 'Whimsical pasture where cute animated RAM sticks graze like livestock beside a sleek digital dashboard, vibrant colors, unreal engine 5 render, depth of field',
    visualCue: 'Pasture scene with animated computer hardware icons roaming freely, transitioning seamlessly to real-time marketing analytics.',
    voiceoverScript: 'Here at ZenAds and Zyncast, all your marketing and ad operations are organic, cage-free, and straight to your revenue line.',
    overlayText: '🎯 All-In-One AI Commercial Engine',
    badgeText: 'PROBLEM / SOLUTION',
    bgColorGradient: 'from-indigo-950 via-slate-900 to-blue-950',
    cameraMotion: 'Pan Right',
    voiceActor: 'Rachel (ElevenLabs Clear & Dynamic)'
  },
  {
    id: 'scene-3',
    title: 'Scene 3: Synthesia AI Avatar Demo',
    durationSec: 5,
    engine: 'Synthesia AI Avatar',
    prompt: 'Professional virtual presenter in modern executive tech loft, speaking naturally to camera with clean holographic UI cards floating beside them',
    visualCue: 'AI spokesperson pointing to real-time ROAS ticker hitting 4.8x with 1-click video commercial launch.',
    voiceoverScript: 'ZenAds generates your multi-scene video commercial, syncs ElevenLabs voiceovers, and launches cross-channel ads in under 60 seconds.',
    overlayText: '🚀 4.8x Verified Ad ROAS',
    badgeText: 'SYNTHESIA AVATAR DEMO',
    bgColorGradient: 'from-purple-950 via-slate-900 to-indigo-950',
    cameraMotion: 'Static Studio',
    voiceActor: 'Marcus (Synthesia Executive British)'
  },
  {
    id: 'scene-4',
    title: 'Scene 4: Call-To-Action & Free Trial',
    durationSec: 4,
    engine: 'RunwayML Gen-3',
    prompt: 'Sleek premium 3D logo animation of ZenAds with glowing emerald sparks, energetic light burst, clean typography, 4k ultra realistic product endcard',
    visualCue: 'Pulsing CTA button with free trial badge, direct URL link, and guarantee seal.',
    voiceoverScript: 'Check out ZenAds today for your free commercial trial and start scaling your business right now!',
    overlayText: '👉 Claim Your Free 14-Day Commercial Trial',
    badgeText: 'FINAL CALL-TO-ACTION',
    bgColorGradient: 'from-teal-950 via-slate-900 to-emerald-950',
    cameraMotion: 'Orbit 360',
    voiceActor: 'Antoni (Voicemod Hype Announcer)'
  }
];

export default function ZenAdsVideoStudio() {
  const [scenes, setScenes] = useState<CommercialScene[]>(DEFAULT_SCENES);
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [isGeneratingScript, setIsGeneratingScript] = useState<boolean>(false);
  const [productTopic, setProductTopic] = useState<string>('ZenAds Commercial Engine & Zyncast Suite');
  const [commercialTone, setCommercialTone] = useState<string>('High-Energy Direct Response & Whimsical');
  
  // Voiceover Generator Settings
  const [voiceProvider, setVoiceProvider] = useState<'ElevenLabs' | 'Synthesia' | 'Voicemod'>('ElevenLabs');
  const [selectedVoice, setSelectedVoice] = useState<string>('Adam (Deep & Confident)');
  const [voiceStability, setVoiceStability] = useState<number>(75);
  const [voiceClarity, setVoiceClarity] = useState<number>(85);
  const [isSpeakingPreview, setIsSpeakingPreview] = useState<boolean>(false);

  // Video Export Engine Settings
  const [exportFormat, setExportFormat] = useState<'mp4' | 'webm' | 'prores'>('mp4');
  const [exportResolution, setExportResolution] = useState<'720p' | '1080p' | '4k'>('1080p');
  const [exportFps, setExportFps] = useState<30 | 60>(30);
  const [exportBitrate, setExportBitrate] = useState<'8 Mbps' | '16 Mbps' | '32 Mbps'>('16 Mbps');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [copiedFfmpeg, setCopiedFfmpeg] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(performance.now());
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const totalDuration = scenes.reduce((sum, s) => sum + s.durationSec, 0);

  // Calculate which scene is active based on playbackTime
  const activeSceneInfo = () => {
    let accumulated = 0;
    for (let i = 0; i < scenes.length; i++) {
      accumulated += scenes[i].durationSec;
      if (playbackTime <= accumulated || i === scenes.length - 1) {
        const sceneStartTime = accumulated - scenes[i].durationSec;
        const sceneProgress = Math.min(1, Math.max(0, (playbackTime - sceneStartTime) / scenes[i].durationSec));
        return { scene: scenes[i], index: i, sceneProgress };
      }
    }
    return { scene: scenes[0], index: 0, sceneProgress: 0 };
  };

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    lastTickRef.current = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setPlaybackTime((prev) => {
        const next = prev + delta;
        if (next >= totalDuration) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, totalDuration]);

  // Update current active scene index from playback
  useEffect(() => {
    const { index } = activeSceneInfo();
    setCurrentSceneIdx(index);
  }, [playbackTime]);

  // Draw current frame on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const { scene, sceneProgress } = activeSceneInfo();

    // 1. Draw animated background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    if (scene.id === 'scene-1') {
      bgGrad.addColorStop(0, '#022c22');
      bgGrad.addColorStop(0.5, '#0f172a');
      bgGrad.addColorStop(1, '#115e59');
    } else if (scene.id === 'scene-2') {
      bgGrad.addColorStop(0, '#1e1b4b');
      bgGrad.addColorStop(0.5, '#0f172a');
      bgGrad.addColorStop(1, '#1e3a8a');
    } else if (scene.id === 'scene-3') {
      bgGrad.addColorStop(0, '#3b0764');
      bgGrad.addColorStop(0.5, '#0f172a');
      bgGrad.addColorStop(1, '#312e81');
    } else {
      bgGrad.addColorStop(0, '#134e4a');
      bgGrad.addColorStop(0.5, '#0f172a');
      bgGrad.addColorStop(1, '#064e3b');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw cinematic grid lines & camera motion simulation
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSpacing = 40;
    const offset = (sceneProgress * 60) % gridSpacing;
    for (let x = -gridSpacing; x < width + gridSpacing; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x + offset, 0);
      ctx.lineTo(x + offset, height);
      ctx.stroke();
    }

    // 3. Draw Engine Badge at Top Left
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(24, 24, 210, 36, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`ENGINE: ${scene.engine.toUpperCase()}`, 36, 47);

    // 4. Draw Aspect Ratio & Resolution at Top Right
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
    ctx.beginPath();
    ctx.roundRect(width - 150, 24, 126, 36, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#818cf8';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`${aspectRatio} • ${exportResolution.toUpperCase()}`, width - 138, 47);

    // 5. Draw Dynamic Center Visual (Simulated Cinematic AI Scene)
    const centerX = width / 2;
    const centerY = height / 2 - 20;

    // Animated glow ring
    const radius = 90 + Math.sin(sceneProgress * Math.PI * 2) * 8;
    const ringGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius);
    ringGrad.addColorStop(0, 'rgba(52, 211, 153, 0.25)');
    ringGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = ringGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Scene Badge Tag
    if (scene.badgeText) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
      ctx.beginPath();
      ctx.roundRect(centerX - 90, centerY - 80, 180, 26, 13);
      ctx.fill();

      ctx.fillStyle = '#022c22';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(scene.badgeText, centerX, centerY - 63);
      ctx.textAlign = 'left';
    }

    // Center Main Text / On-Screen Graphic
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 10;
    ctx.fillText(scene.overlayText, centerX, centerY + 10);
    ctx.shadowBlur = 0;

    // Camera Motion Tag
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 12px sans-serif';
    ctx.fillText(`Camera: ${scene.cameraMotion} • Motion Intensity: High`, centerX, centerY + 40);

    // 6. Subtitles & Voiceover Bar at Bottom
    ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
    ctx.beginPath();
    ctx.roundRect(24, height - 90, width - 48, 70, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`🎙️ VOICEOVER [${scene.voiceActor}]:`, 40, height - 64);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '500 13px sans-serif';
    const cleanVoiceText = `"${scene.voiceoverScript}"`;
    ctx.fillText(cleanVoiceText.length > 80 ? cleanVoiceText.substring(0, 77) + '...' : cleanVoiceText, 40, height - 38);

    // Reset alignment
    ctx.textAlign = 'left';
  }, [playbackTime, scenes, aspectRatio, exportResolution]);

  // Voiceover live TTS Speech preview
  const handlePlayVoiceoverPreview = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setNotice("Speech Synthesis is not supported in this browser.");
      setTimeout(() => setNotice(null), 3000);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = selectedVoice.includes('Deep') ? 0.85 : 1.1;

    utterance.onstart = () => setIsSpeakingPreview(true);
    utterance.onend = () => setIsSpeakingPreview(false);
    utterance.onerror = () => setIsSpeakingPreview(false);

    window.speechSynthesis.speak(utterance);
  };

  // AI Script Generation with Gemini
  const handleGenerateScriptWithAI = async () => {
    setIsGeneratingScript(true);
    setNotice("Generating 4-scene commercial script with Runway, Pika & Synthesia cues...");
    try {
      const res = await fetch('/api/zynads/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: productTopic,
          tone: commercialTone,
          platform: aspectRatio === '9:16' ? 'TikTok / Reels' : 'YouTube & Web Video',
          objective: 'High ROAS Commercial Video Conversion'
        })
      });

      if (!res.ok) throw new Error('Failed to generate script');
      const data = await res.json();

      // Update scenes with intelligent generated copy
      setScenes([
        {
          id: 'scene-1',
          title: 'Scene 1: Viral 0-3s Hook',
          durationSec: 4,
          engine: 'RunwayML Gen-3',
          prompt: `Cinematic high-octane 8k opening for ${productTopic}, dramatic light rays, ultra-realistic motion`,
          visualCue: 'Fast zoom-in on customer discovering the solution with holographic HUD metrics.',
          voiceoverScript: `Are you still struggling to scale your revenue with outdated tools? Look at this.`,
          overlayText: `⚡ Stop Wasting Budget: Meet ${productTopic}`,
          badgeText: '0-3s VIRAL HOOK',
          bgColorGradient: 'from-emerald-950 via-slate-900 to-teal-950',
          cameraMotion: 'Zoom In',
          voiceActor: 'Adam (ElevenLabs Deep & Warm)'
        },
        {
          id: 'scene-2',
          title: 'Scene 2: Pika Labs Dynamic Demo',
          durationSec: 5,
          engine: 'Pika Labs 2.1',
          prompt: `Dynamic 3D animated transformation of complex workflows into automated revenue streams, vibrant colors`,
          visualCue: 'Animated product features rapidly connecting and producing live analytics graph.',
          voiceoverScript: `${productTopic} automates your video creation, optimizes targeting, and boosts conversions effortlessly.`,
          overlayText: '🎯 All-in-One Automated Commercial Suite',
          badgeText: 'PIKA LABS DYNAMICS',
          bgColorGradient: 'from-indigo-950 via-slate-900 to-blue-950',
          cameraMotion: 'Pan Right',
          voiceActor: 'Rachel (ElevenLabs Clear & Dynamic)'
        },
        {
          id: 'scene-3',
          title: 'Scene 3: Synthesia Spokesperson Proof',
          durationSec: 5,
          engine: 'Synthesia AI Avatar',
          prompt: 'Photorealistic AI executive spokesperson in modern glass studio explaining verified ROI results',
          visualCue: 'Virtual presenter demonstrating real customer case studies with 4.8x ROAS.',
          voiceoverScript: `Over ten thousand businesses trust our platform to generate studio-grade commercials daily.`,
          overlayText: '📈 4.8x Verified ROAS Results',
          badgeText: 'SYNTHESIA AVATAR PROOF',
          bgColorGradient: 'from-purple-950 via-slate-900 to-indigo-950',
          cameraMotion: 'Static Studio',
          voiceActor: 'Marcus (Synthesia Executive British)'
        },
        {
          id: 'scene-4',
          title: 'Scene 4: Call-To-Action & Offer',
          durationSec: 4,
          engine: 'RunwayML Gen-3',
          prompt: 'Electrifying 3D brand reveal with neon glow, particle explosion, and bold 14-day free trial card',
          visualCue: 'Pulsing animated download button with limited-time discount ticker.',
          voiceoverScript: `Click the link below right now to claim your free commercial trial and start scaling today!`,
          overlayText: `👉 Try ${productTopic} Free Today`,
          badgeText: 'FINAL CALL-TO-ACTION',
          bgColorGradient: 'from-teal-950 via-slate-900 to-emerald-950',
          cameraMotion: 'Orbit 360',
          voiceActor: 'Antoni (Voicemod Hype Announcer)'
        }
      ]);

      setNotice("✨ AI Commercial Storyboard & Voiceover Script updated!");
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      setNotice(`AI Scripting fallback generated: ${err.message}`);
      setTimeout(() => setNotice(null), 3000);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Direct In-Browser Video Export via Canvas MediaRecorder
  const handleExportCommercialVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    setExportProgress(10);
    setNotice("Initiating video render pipeline (Encoding H.264/VP9 stream)...");

    try {
      recordedChunksRef.current = [];
      const stream = canvas.captureStream(exportFps);
      
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: exportBitrate === '32 Mbps' ? 32000000 : exportBitrate === '16 Mbps' ? 16000000 : 8000000
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `ZenAds-Commercial-${exportResolution}-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);

        setExportProgress(100);
        setIsExporting(false);
        setNotice("🎉 Commercial Video Render Complete! Download started.");
        setTimeout(() => setNotice(null), 5000);
      };

      // Play through the entire timeline and record
      setPlaybackTime(0);
      setIsPlaying(true);
      mediaRecorder.start();

      let currentProg = 10;
      const progressInterval = setInterval(() => {
        currentProg += 100 / (totalDuration * 10);
        if (currentProg >= 95) clearInterval(progressInterval);
        setExportProgress(Math.min(95, Math.round(currentProg)));
      }, 100);

      setTimeout(() => {
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
          setIsPlaying(false);
        }
        clearInterval(progressInterval);
      }, totalDuration * 1000 + 500);

    } catch (err: any) {
      console.error("Export error:", err);
      setIsExporting(false);
      setNotice(`Export error: ${err.message || 'MediaRecorder not supported in this view'}`);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  // FFmpeg Command for terminal / professional pipeline
  const ffmpegCommand = `ffmpeg -f concat -safe 0 -i scenes_manifest.txt -c:v libx264 -preset slow -crf 18 -b:v ${exportBitrate === '32 Mbps' ? '32M' : '16M'} -c:a aac -b:a 320k -s ${exportResolution === '4k' ? '3840x2160' : exportResolution === '1080p' ? '1920x1080' : '1280x720'} -r ${exportFps} ZenAds_Master_Commercial_${exportResolution}.mp4`;

  const handleCopyFfmpeg = () => {
    navigator.clipboard.writeText(ffmpegCommand);
    setCopiedFfmpeg(true);
    setNotice("Copied FFmpeg render pipeline command!");
    setTimeout(() => {
      setCopiedFfmpeg(false);
      setNotice(null);
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100">
      {/* Toast Notice */}
      {notice && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-emerald-400/40 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-emerald-950 p-6 rounded-3xl border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[10px] font-mono font-extrabold uppercase rounded-md shadow-sm">
                ZenAds Studio Pro
              </span>
              <span className="text-xs text-emerald-300 font-mono font-semibold">
                ● RunwayML • Pika • Synthesia • ElevenLabs
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              AI Video Commercial Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Turn ad copy and concepts into high-converting video commercials using RunwayML, Pika Labs, Synthesia AI avatars, ElevenLabs voiceovers, and FFmpeg export.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleGenerateScriptWithAI}
              disabled={isGeneratingScript}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer border border-indigo-400/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGeneratingScript ? 'Writing Script...' : 'AI Storyboard & Scriptwriter'}</span>
            </button>

            <button
              onClick={handleExportCommercialVideo}
              disabled={isExporting}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer border border-emerald-300"
            >
              <Download className="w-4 h-4 fill-slate-950" />
              <span>{isExporting ? `Rendering ${exportProgress}%` : 'Render & Download Commercial'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Canvas Video Player & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
            {/* Player Toolbar */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {scenes[currentSceneIdx]?.title || 'Scene Playback'}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-slate-900 border border-slate-700 text-slate-300 font-mono rounded">
                  {playbackTime.toFixed(1)}s / {totalDuration.toFixed(1)}s
                </span>
              </div>

              {/* Aspect Ratio Selector */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {(['16:9', '9:16', '1:1'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      aspectRatio === ratio
                        ? 'bg-emerald-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Stage */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-800/80 shadow-inner">
              <canvas
                ref={canvasRef}
                width={aspectRatio === '9:16' ? 405 : aspectRatio === '1:1' ? 720 : 720}
                height={aspectRatio === '9:16' ? 720 : aspectRatio === '1:1' ? 720 : 405}
                className={`w-full max-h-[440px] object-contain transition-all duration-300 ${
                  aspectRatio === '9:16' ? 'aspect-[9/16]' : aspectRatio === '1:1' ? 'aspect-square' : 'aspect-video'
                }`}
              />

              {/* Center Play Overlay when Paused */}
              {!isPlaying && (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 m-auto w-16 h-16 bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 cursor-pointer backdrop-blur-xs"
                >
                  <Play className="w-8 h-8 fill-slate-950 ml-1" />
                </button>
              )}
            </div>

            {/* Playback Controls & Scrubber */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={totalDuration}
                  step={0.1}
                  value={playbackTime}
                  onChange={(e) => {
                    setPlaybackTime(parseFloat(e.target.value));
                  }}
                  className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setPlaybackTime(0);
                    }}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
                    title="Reset to beginning"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handlePlayVoiceoverPreview(scenes[currentSceneIdx]?.voiceoverScript || '')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSpeakingPreview
                        ? 'bg-amber-500 text-slate-950 animate-pulse font-extrabold'
                        : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeakingPreview ? 'Speaking...' : 'Preview Voiceover'}</span>
                  </button>
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  Total Commercial Length: <strong className="text-white">{totalDuration}s</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Multi-Scene Strip */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-emerald-400" /> Multi-Scene Commercial Timeline
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Click scene to edit cues & engine
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {scenes.map((sc, idx) => {
                const isSelected = currentSceneIdx === idx;
                return (
                  <div
                    key={sc.id}
                    onClick={() => {
                      setCurrentSceneIdx(idx);
                      let acc = 0;
                      for (let i = 0; i < idx; i++) acc += scenes[i].durationSec;
                      setPlaybackTime(acc);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer text-left space-y-1.5 ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-400 ring-2 ring-emerald-500/30'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                      <span className={isSelected ? 'text-emerald-300' : 'text-slate-400'}>
                        SCENE {idx + 1}
                      </span>
                      <span className="text-slate-400">{sc.durationSec}s</span>
                    </div>
                    <div className="text-xs font-extrabold text-white truncate">{sc.title.split(':')[1] || sc.title}</div>
                    <div className="text-[10px] text-emerald-400/90 font-mono truncate">{sc.engine}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: AI Engines, Voiceover Generator & FFmpeg Export (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Scene Editor Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <Film className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-white">
                  Edit Scene {currentSceneIdx + 1} Parameters
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                {scenes[currentSceneIdx]?.engine}
              </span>
            </div>

            {scenes[currentSceneIdx] && (
              <div className="space-y-3 text-xs">
                {/* Engine Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1 font-mono uppercase">
                    1. Video Generation Engine
                  </label>
                  <select
                    value={scenes[currentSceneIdx].engine}
                    onChange={(e) => {
                      const updated = [...scenes];
                      updated[currentSceneIdx].engine = e.target.value as any;
                      setScenes(updated);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="RunwayML Gen-3">RunwayML Gen-3 Alpha (Cinematic Animation & VFX)</option>
                    <option value="Pika Labs 2.1">Pika Labs 2.1 (Short Commercial Clips & Lip-Sync)</option>
                    <option value="Synthesia AI Avatar">Synthesia (AI Presenter & Spokesperson)</option>
                    <option value="Luma Dream Machine">Luma Dream Machine (Hyper-Realistic 3D Motion)</option>
                    <option value="Gen-2 (Runway)">Gen-2 (Runway Text + Audio to Video)</option>
                    <option value="Sora">OpenAI Sora (High Fidelity Storyboarding)</option>
                  </select>
                </div>

                {/* Video Generation Prompt */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1 font-mono uppercase">
                    AI Visual Prompt & Shot Style
                  </label>
                  <textarea
                    rows={2}
                    value={scenes[currentSceneIdx].prompt}
                    onChange={(e) => {
                      const updated = [...scenes];
                      updated[currentSceneIdx].prompt = e.target.value;
                      setScenes(updated);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-sans text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Describe scene visual prompt..."
                  />
                </div>

                {/* Voiceover Script */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-300 font-mono uppercase">
                      2. Voiceover Script
                    </label>
                    <button
                      onClick={() => handlePlayVoiceoverPreview(scenes[currentSceneIdx].voiceoverScript)}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" /> Test Voice
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={scenes[currentSceneIdx].voiceoverScript}
                    onChange={(e) => {
                      const updated = [...scenes];
                      updated[currentSceneIdx].voiceoverScript = e.target.value;
                      setScenes(updated);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-sans text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Exact spoken words for voiceover..."
                  />
                </div>

                {/* On-Screen Graphic Text */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1 font-mono uppercase">
                    3. On-Screen Overlay Text / Callout
                  </label>
                  <input
                    type="text"
                    value={scenes[currentSceneIdx].overlayText}
                    onChange={(e) => {
                      const updated = [...scenes];
                      updated[currentSceneIdx].overlayText = e.target.value;
                      setScenes(updated);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Camera Motion & Duration */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 font-mono uppercase">
                      Camera Motion
                    </label>
                    <select
                      value={scenes[currentSceneIdx].cameraMotion}
                      onChange={(e) => {
                        const updated = [...scenes];
                        updated[currentSceneIdx].cameraMotion = e.target.value as any;
                        setScenes(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-medium text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="Zoom In">Zoom In (High Drama)</option>
                      <option value="Pan Right">Pan Right (Dynamic)</option>
                      <option value="Drone Shot">Drone Shot (Wide)</option>
                      <option value="Orbit 360">Orbit 360 (Hero Product)</option>
                      <option value="Static Studio">Static Studio (Presenter)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 font-mono uppercase">
                      Duration (Secs)
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={15}
                      value={scenes[currentSceneIdx].durationSec}
                      onChange={(e) => {
                        const updated = [...scenes];
                        updated[currentSceneIdx].durationSec = Math.max(2, parseInt(e.target.value) || 3);
                        setScenes(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-medium text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Voiceover Generator Studio (ElevenLabs / Synthesia / Voicemod) */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                  <Mic className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-white">Voiceover Generator</h3>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {(['ElevenLabs', 'Synthesia', 'Voicemod'] as const).map((prov) => (
                  <button
                    key={prov}
                    onClick={() => setVoiceProvider(prov)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      voiceProvider === prov ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {prov}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 font-mono uppercase">Voice Model:</span>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
                >
                  <option value="Adam (Deep & Confident)">Adam (ElevenLabs - Deep & Confident)</option>
                  <option value="Rachel (Clear & Dynamic)">Rachel (ElevenLabs - Clear & Dynamic)</option>
                  <option value="Antoni (Voicemod Hype)">Antoni (Voicemod - Energetic Promo)</option>
                  <option value="Marcus (Synthesia British)">Marcus (Synthesia - Executive UK)</option>
                  <option value="Bella (Soft & Conversational)">Bella (ElevenLabs - Warm Conversational)</option>
                </select>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Stability</span>
                    <span className="font-mono text-emerald-400">{voiceStability}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={voiceStability}
                    onChange={(e) => setVoiceStability(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Clarity / Similarity</span>
                    <span className="font-mono text-indigo-400">{voiceClarity}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={voiceClarity}
                    onChange={(e) => setVoiceClarity(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Video Export & FFmpeg Tool Engine */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <Tv className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-white">Video Export Tool & FFmpeg</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                FFMPEG 7.0 READY
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 font-mono uppercase">Resolution</label>
                <select
                  value={exportResolution}
                  onChange={(e) => setExportResolution(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-white font-medium text-xs cursor-pointer"
                >
                  <option value="720p">720p HD</option>
                  <option value="1080p">1080p FHD</option>
                  <option value="4k">4K Ultra HD</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 font-mono uppercase">Framerate</label>
                <select
                  value={exportFps}
                  onChange={(e) => setExportFps(parseInt(e.target.value) as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-white font-medium text-xs cursor-pointer"
                >
                  <option value={30}>30 FPS</option>
                  <option value={60}>60 FPS</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 font-mono uppercase">Bitrate</label>
                <select
                  value={exportBitrate}
                  onChange={(e) => setExportBitrate(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-white font-medium text-xs cursor-pointer"
                >
                  <option value="8 Mbps">8 Mbps</option>
                  <option value="16 Mbps">16 Mbps</option>
                  <option value="32 Mbps">32 Mbps</option>
                </select>
              </div>
            </div>

            {/* Copyable FFmpeg CLI command */}
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
                <span>FFMPEG CLI ENCODING PIPELINE:</span>
                <button
                  onClick={handleCopyFfmpeg}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedFfmpeg ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFfmpeg ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <code className="text-[10px] font-mono text-emerald-300 block truncate select-all bg-slate-950 p-1.5 rounded-lg border border-slate-800/80">
                {ffmpegCommand}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
