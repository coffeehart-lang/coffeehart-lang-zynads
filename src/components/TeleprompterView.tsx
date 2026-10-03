import { useState, useEffect, useRef } from 'react';
import { VoiceDictationButton } from './VoiceDictationButton';
import { AudioWaveformVisualizer } from './AudioWaveformVisualizer';
import { createProcessedAudioStream } from '../utils/audioProcessor';
import VideoGeneratorView from './studio/VideoGeneratorView';
import RealtimeCanvasView from './studio/RealtimeCanvasView';
import EnhancerView from './studio/EnhancerView';
import NodeEditorView from './studio/NodeEditorView';
import AssetManagerView from './studio/AssetManagerView';
import { 
  Video, 
  Play, 
  Pause, 
  RotateCcw, 
  Type, 
  FlipHorizontal, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  FileText, 
  Camera, 
  CameraOff, 
  Download, 
  Circle, 
  StopCircle, 
  Volume2, 
  Image as ImageIcon, 
  Layers, 
  Phone, 
  Check,
  Eye,
  EyeOff,
  ArrowRight,
  Tv,
  Upload,
  User,
  Clapperboard,
  Wand2,
  Plus,
  Copy,
  ExternalLink,
  Palette,
  Workflow,
  Film
} from 'lucide-react';

const PRESET_SCRIPTS = [
  {
    id: 'script-farm-1',
    title: '🎬 30s Zencast & Zen Ads Commercial Showcase',
    duration: '30 seconds',
    text: `Welcome to Zencast & Zen Ads — the premier platform for AI video commercials and campaign automation!

Here in our high-definition studio canvas, you can record live webcam commercials with smart teleprompter scrolling and custom brand overlays.

Whether you're presenting a new product or launching an automated ad campaign, Zencast gives you 4K studio quality right in your browser.

Start creating your commercials on Zencast and Zen Ads today!`
  },
  {
    id: 'script-farm-2',
    title: '⚡ 15s Zencast & Zen Ads Quick Pitch',
    duration: '15 seconds',
    text: `Ready to create professional video ads in seconds?

At Zencast & Zen Ads, record live teleprompter videos with custom overlays, real-time audio meters, and instant AI commercial prompts!

Try Zencast and Zen Ads free today!`
  },
  {
    id: 'script-1',
    title: '15s Small Business Growth Hook',
    duration: '15 seconds',
    text: `Are you tired of overpaying for online advertising?

Discover Zencast and Zen Ads — the all-in-one growth platform built for local businesses.

We help you attract loyal customers, optimize ad budgets, and automate your video pipeline in minutes!

Visit Zencast and Zen Ads today to claim your free trial!`
  },
  {
    id: 'script-2',
    title: '30s Grand Opening Announcement Commercial',
    duration: '30 seconds',
    text: `Big news! We are thrilled to announce our grand opening sale!

For one week only, get up to 40% off all premium services and custom ad campaigns on Zen Ads.

Whether you're starting fresh or upgrading your current strategy, our platform is here to help you scale fast.

Don't wait — launch your first commercial on Zencast and Zen Ads today!`
  },
  {
    id: 'script-3',
    title: '60s Creator & Founder Pitch for Zencast & Zen Ads',
    duration: '60 seconds',
    text: `Hi, I'm the Creator and Founder of Zencast and Zen Ads. When we built this platform, we had one simple goal: make professional advertising accessible to every business owner, without massive studio fees.

Over the past year, we've helped founders double their customer leads while cutting ad waste dramatically.

Here is how it works: You choose your campaign budget, pick from high-converting video templates, and our AI teleprompter and campaign optimizer handle target audience matching automatically.

No complicated setup. No hidden fees. Just clean, measurable results delivered straight to your dashboard.

Join thousands of growing businesses today. Visit Zencast and Zen Ads now to launch your campaign!`
  }
];

const PRESET_SCENE_IDEAS = [
  {
    id: 'scene-ram-pasture',
    title: '✨ Zencast Studio & Video Sanctuary',
    description: 'Presenting Zencast video studio canvas with teleprompter and custom overlays',
    action: 'Demonstrating Zencast Video Engine',
    prop: 'Zencast Teleprompter Studio',
    badge: 'ZENCAST & ZEN ADS STUDIO',
    bgId: 'farm-pasture',
    speakerName: 'Creator & Founder of Zencast & Zen Ads',
    speakerTitle: 'Creator & Founder of Zencast and Zen Ads',
    ctaText: 'Visit Zencast & Zen Ads | Next-Gen AI Video Studio',
    dialogue: `Welcome to Zencast & Zen Ads — the premier platform for AI video commercials!

Here on our studio canvas, you can craft 100% automated or live-recorded video ads with teleprompter controls and custom overlays.

Start creating your commercial on Zencast & Zen Ads today!`
  },
  {
    id: 'scene-gpu-demo',
    title: '🖥️ Zencast Tech & Performance Stage',
    description: 'At high-tech studio glass workbench presenting liquid-cooled rendering and 4K commercial output',
    action: 'Holding Tech Hardware & Pointing at FPS Counter',
    prop: 'GPU Hardware',
    badge: '4K LIQUID-COOLED RENDERING',
    bgId: 'cyber-neon',
    speakerName: 'Zencast Commercial Anchor',
    speakerTitle: 'Zencast AI Studio Presenter',
    ctaText: 'Generate 4K Commercials | Visit Zencast & Zen Ads',
    dialogue: `Tired of slow rendering times for your commercial ad campaigns?

Zencast delivers instant real-time canvas recording and AI video generation with zero thermal throttling.

Upgrade your video marketing suite today with Zencast and Zen Ads!`
  },
  {
    id: 'scene-executive-desk',
    title: '🏢 Executive Studio Presentation',
    description: 'Sitting at founder glass desk presenting commercial revenue and AI campaign metrics',
    action: 'Holding Coffee Mug & Presenting Dashboard',
    prop: 'Coffee Mug',
    badge: 'ZENCAST FOUNDER SKYLINE',
    bgId: 'office-glass',
    speakerName: 'Creator & Founder of Zencast & Zen Ads',
    speakerTitle: 'Creator & Founder of Zencast and Zen Ads',
    ctaText: 'Claim Your Free 14-Day Growth Trial | Visit Zencast & Zen Ads',
    dialogue: `Hi, I'm the Creator and Founder of Zencast and Zen Ads. We built this platform with one simple goal: make professional advertising and video creation accessible to everyone.

Our AI teleprompter and video engine handle audience targeting and video presentation seamlessly.

Experience Zencast and Zen Ads today and take your video marketing to the next level!`
  },
  {
    id: 'scene-cyber-stage',
    title: '⚡ Cyber Terminal & Clean Code',
    description: 'Holding up a laptop running terminal code presenting clean, hand-crafted software without bloat',
    action: 'Demonstrating Clean Terminal Code',
    prop: 'Terminal Laptop',
    badge: 'HAND-CRAFTED ZENCAST CODE',
    bgId: 'cyber-neon',
    speakerName: 'Zen Ads Campaign Director',
    speakerTitle: 'Zen Ads Strategy Lead',
    ctaText: 'Deploy Hand-Crafted Software | Visit Zencast & Zen Ads',
    dialogue: `At Zencast and Zen Ads, our codebase is built with craftsmanship. It's clean, lightning-fast, and running directly in your browser.

No bloat, no unnecessary lag — just pure high-performance video generation.

Try Zencast and Zen Ads today!`
  }
];

interface BackgroundPreset {
  id: string;
  name: string;
  bgClass: string;
  borderClass: string;
  imageUrl?: string;
  isAiGenerated?: boolean;
  promptText?: string;
  canvasColors: [string, string, string];
}

const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { 
    id: 'broadcast-studio', 
    name: '📺 Modern Broadcast News Studio', 
    bgClass: 'bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950', 
    borderClass: 'border-indigo-600',
    imageUrl: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1920&q=80',
    canvasColors: ['#1e1b4b', '#0f172a', '#020617']
  },
  { 
    id: 'office-glass', 
    name: '🏙️ Executive Founder Glass Skyline', 
    bgClass: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900', 
    borderClass: 'border-indigo-800',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
    canvasColors: ['#0f172a', '#1e1b4b', '#0f172a']
  },
  { 
    id: 'cyber-neon', 
    name: '⚡ Cyberpunk RGB Tech Lab', 
    bgClass: 'bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950', 
    borderClass: 'border-purple-800',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80',
    canvasColors: ['#581c87', '#020617', '#312e81']
  },
  { 
    id: 'dark-studio', 
    name: '🎬 Dark Anamorphic Cinema Stage', 
    bgClass: 'bg-slate-950', 
    borderClass: 'border-slate-800',
    imageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1920&q=80',
    canvasColors: ['#020617', '#0f172a', '#020617']
  },
  { 
    id: 'eco-studio', 
    name: '🌿 Eco Tech Glass Studio', 
    bgClass: 'bg-gradient-to-br from-emerald-950 via-teal-900/90 to-slate-950', 
    borderClass: 'border-emerald-600',
    imageUrl: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1920&q=80',
    canvasColors: ['#022c22', '#134e4a', '#020617']
  },
  { 
    id: 'sunset-bay', 
    name: '🌅 Golden Hour Sunset Penthouse', 
    bgClass: 'bg-gradient-to-br from-amber-950 via-slate-900 to-rose-950', 
    borderClass: 'border-amber-800',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80',
    canvasColors: ['#451a03', '#0f172a', '#4c0519']
  },
  { 
    id: 'green-screen', 
    name: '🟩 Studio Green Screen (Chroma Key)', 
    bgClass: 'bg-emerald-600', 
    borderClass: 'border-emerald-500',
    canvasColors: ['#059669', '#10b981', '#059669']
  }
];

export interface PresenterAvatarPreset {
  id: string;
  name: string;
  title: string;
  url: string;
  badge: string;
}

export const DEFAULT_PRESENTER_AVATARS: PresenterAvatarPreset[] = [
  {
    id: 'presenter-creator',
    name: 'Creator & Founder of Zencast & Zen Ads',
    title: 'Creator & Founder of Zencast and Zen Ads',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    badge: 'ZENCAST CREATOR & FOUNDER'
  },
  {
    id: 'presenter-anchor',
    name: 'Zencast Commercial Anchor',
    title: 'Zencast AI Studio Presenter',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    badge: 'ZENCAST COMMERCIAL ANCHOR'
  },
  {
    id: 'presenter-lead',
    name: 'Zen Ads Campaign Director',
    title: 'Zen Ads Strategy Lead',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    badge: 'ZEN ADS STRATEGY DIRECTOR'
  }
];

const formatTime = (totalSeconds: number) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function TeleprompterView() {
  // Studio Suite Tool Mode Switcher (Krea AI Suite + Teleprompter Studio)
  const [studioTool, setStudioTool] = useState<'video-gen' | 'teleprompter' | 'realtime' | 'enhancer' | 'node-editor' | 'assets'>('video-gen');

  // 3-Step Simple Production Workflow Navigation: Step 1 (Create), Step 2 (Record/Generate), Step 3 (Watch)
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  const [selectedScriptId, setSelectedScriptId] = useState('script-farm-1');
  const [scriptText, setScriptText] = useState(PRESET_SCRIPTS[0].text);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(3); // 1-10 scale
  const [fontSize, setFontSize] = useState(32); // px
  const [isMirrored, setIsMirrored] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Scene & Character Interaction state ("Scene" feature)
  const [sceneDescription, setSceneDescription] = useState<string>(
    'Presenting Zencast & Zen Ads video studio canvas with teleprompter and custom overlays'
  );
  const [sceneInteraction, setSceneInteraction] = useState<string>(
    'Demonstrating Zencast Video Engine'
  );
  const [activePropItem, setActivePropItem] = useState<string>('Zyncast Studio Engine');
  const [isGeneratingScene, setIsGeneratingScene] = useState<boolean>(false);

  // Active Scene AI Feedback & Memory Bank state
  const [activeSceneFeedback, setActiveSceneFeedback] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    title?: string;
    prop?: string;
    overlayText?: string;
    visualCue?: string;
    extractedDialogue?: string;
    message?: string;
  }>({ status: 'idle' });

  const [sceneMemories, setSceneMemories] = useState<Array<{
    id: string;
    title: string;
    description: string;
    action: string;
    prop: string;
    timestamp: string;
    backdropPrompt?: string;
    extractedDialogue?: string;
  }>>([
    {
      id: 'mem-1',
      title: '✨ Zyncast Commercial Studio',
      description: 'Standing in high-tech video studio presenting automated AI commercial generation',
      action: 'Demonstrating Zyncast Video Engine',
      prop: 'Zyncast Studio Engine',
      timestamp: 'Active Scene Memory #1',
      extractedDialogue: 'At Zyncast, our commercial video studio is built for instant, professional production.'
    },
    {
      id: 'mem-2',
      title: '💻 Code Terminal & Nano Editor',
      description: 'Holding up a laptop running nano in the terminal presenting clean hand-crafted code without bloat',
      action: 'Demonstrating Organic Terminal Code',
      prop: 'Terminal Laptop',
      timestamp: 'Active Scene Memory #2',
      extractedDialogue: 'At Zyncast, our code is different. It\'s organic, free-range, and hand-crafted right from the terminal.'
    }
  ]);

  // Presenter / Character Image state ("Use Own Image" feature)
  const [presenterImageSrc, setPresenterImageSrc] = useState<string | null>(DEFAULT_PRESENTER_AVATARS[0].url);
  const [presenterName, setPresenterName] = useState<string>(DEFAULT_PRESENTER_AVATARS[0].name);
  const [presenterFrameStyle, setPresenterFrameStyle] = useState<'circle' | 'cutout' | 'floating'>('circle');
  const [presenterScale, setPresenterScale] = useState<number>(1);
  const presenterImgRef = useRef<HTMLImageElement | null>(null);
  const bgImgCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Auto-load Presenter Avatar Image on startup & when presenterImageSrc changes
  useEffect(() => {
    if (presenterImageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        presenterImgRef.current = img;
      };
      img.onerror = (e) => {
        console.warn("Failed to load presenter avatar image:", e);
      };
      img.src = presenterImageSrc;
    } else {
      presenterImgRef.current = null;
    }
  }, [presenterImageSrc]);

  // Webcam & Commercial Recording state
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cameraDisplayMode, setCameraDisplayMode] = useState<'pip' | 'fullscreen'>('fullscreen');
  const [isRecording, setIsRecording] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Text Overlay on Video Control (Default to FALSE so words do NOT cover presenter face)
  const [showTextOverlayOnVideo, setShowTextOverlayOnVideo] = useState<boolean>(false);

  // Virtual Background & Overlays state
  const [selectedBg, setSelectedBg] = useState('broadcast-studio');
  const [bgBlur, setBgBlur] = useState(0); // 0-20px
  const [showLowerThird, setShowLowerThird] = useState(true);
  const [speakerName, setSpeakerName] = useState('Creator & Founder of Zencast & Zen Ads');
  const [speakerTitle, setSpeakerTitle] = useState('Creator & Founder of Zencast and Zen Ads');
  const [showCtaBanner, setShowCtaBanner] = useState(true);
  const [ctaText, setCtaText] = useState('🚀 Visit Zencast & Zen Ads | Next-Gen Commercial Video Platform');
  const [badgeText, setBadgeText] = useState('ZENCAST & ZEN ADS STUDIO');

  // Commercial Duration & Timer Control state
  const [targetDuration, setTargetDuration] = useState<number>(30); // in seconds
  const [autoStopOnTimer, setAutoStopOnTimer] = useState<boolean>(true);
  const [recordingSecondsElapsed, setRecordingSecondsElapsed] = useState<number>(0);

  // AI Backdrop Generator state
  const [aiBackdropPrompt, setAiBackdropPrompt] = useState<string>('');
  const [isGeneratingBackdrop, setIsGeneratingBackdrop] = useState<boolean>(false);
  const [lastGeneratedNotice, setLastGeneratedNotice] = useState<string | null>(null);
  const [dynamicPresets, setDynamicPresets] = useState<BackgroundPreset[]>(BACKGROUND_PRESETS);

  // AI Voice Synthesis state
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [speechRate, setSpeechRate] = useState(1);

  // Dedicated Zyncast AI Commercial Video Prompt Synthesizer
  const [aiVideoTool, setAiVideoTool] = useState<'zyn4k' | 'zyncinematic' | 'zynreel'>('zyn4k');
  const [cameraMovement, setCameraMovement] = useState<'dolly-in' | 'orbit' | 'pan-horizontal' | 'drone-overfly' | 'close-up-presenter'>('dolly-in');
  const [lightingStyle, setLightingStyle] = useState<'cinematic-golden-hour' | 'cyberpunk-neon' | 'studio-softbox' | 'dramatic-anamorphic'>('cinematic-golden-hour');
  const [videoAspect, setVideoAspect] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [negativePrompt, setNegativePrompt] = useState<string>('blurry, low resolution, distorted faces, oversaturated, text artifacts, bad anatomy');
  const [copiedPromptStatus, setCopiedPromptStatus] = useState<boolean>(false);

  const getFormattedAIVideoPrompt = () => {
    const cleanScene = sceneDescription || 'Commercial studio setup with presenter';
    const cleanScript = scriptText ? scriptText.replace(/\n+/g, ' ').trim() : '';

    if (aiVideoTool === 'zyn4k') {
      return `Photorealistic 4K 60fps video commercial clip. Scene: ${cleanScene}. Camera motion: ${cameraMovement}. Lighting & Atmosphere: ${lightingStyle}. Aspect Ratio: ${videoAspect}.${cleanScript ? ` Spoken script audio: "${cleanScript}".` : ''} Style: Anamorphic cinema lens, 8K render, photorealistic detail. Avoid: ${negativePrompt}`;
    } else if (aiVideoTool === 'zyncinematic') {
      return `Hyper-realistic commercial studio shot. Scene: ${cleanScene}. Motion direction: ${cameraMovement}. Lighting: ${lightingStyle}. Aspect Ratio: ${videoAspect}.${cleanScript ? ` Script dialogue: "${cleanScript}".` : ''} Cinematic color grade, photorealistic 3D realism. Avoid: ${negativePrompt}`;
    } else {
      return `Cinematic commercial video reel. Scene: ${cleanScene}. Camera movement: ${cameraMovement}. Lighting: ${lightingStyle}. Aspect ratio: ${videoAspect}.${cleanScript ? ` Script audio: "${cleanScript}".` : ''} High-fidelity audio-visual sync. Avoid: ${negativePrompt}`;
    }
  };

  const handleCopyAIVideoPrompt = () => {
    const promptText = getFormattedAIVideoPrompt();
    navigator.clipboard.writeText(promptText);
    setCopiedPromptStatus(true);
    setLastGeneratedNotice(`📋 Zyncast AI Commercial Prompt copied to clipboard!`);
    setTimeout(() => setCopiedPromptStatus(false), 2500);
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const studioRenderFrameRef = useRef<number | null>(null);
  const frameCountRef = useRef<number>(0);

  // Handle Photo Upload ("Use Own Image")
  const handlePresenterPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPresenterImageSrc(result);
        const img = new Image();
        img.onload = () => {
          presenterImgRef.current = img;
        };
        img.src = result;
        setSpeakerName(presenterName || 'Your Custom Presenter');
        setLastGeneratedNotice("✨ Your photo uploaded! Your character is now placed in the commercial performing your custom Scene.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle AI Scene Synthesis
  const handleGenerateAIScene = async () => {
    if (!sceneDescription.trim()) return;
    setIsGeneratingScene(true);
    setActiveSceneFeedback({
      status: 'loading',
      message: '⚡ AI Commercial Director analyzing scene visuals, rendering interactive props & stage background...'
    });

    try {
      const res = await fetch('/api/zynads/scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenePrompt: sceneDescription, characterInteraction: sceneInteraction })
      });
      const data = await res.json();
      if (data.success && data.scene) {
        const scene = data.scene;
        if (scene.overlayText) setSceneInteraction(scene.overlayText);
        if (scene.propItem) setActivePropItem(scene.propItem);

        // Extract quotes/speech if present & load into Actor Spoken Script automatically
        let dialogue = scene.extractedDialogue || '';
        if (!dialogue) {
          const m = sceneDescription.match(/"([^"]+)"/);
          if (m) dialogue = m[1];
        }
        if (dialogue) {
          setScriptText(dialogue);
        }

        // Auto-select matching virtual set backdrop
        const sceneLower = sceneDescription.toLowerCase();
        if (sceneLower.includes('pasture') || sceneLower.includes('ram') || sceneLower.includes('sanctuary') || sceneLower.includes('lamb')) {
          setSelectedBg('farm-pasture');
        } else if (sceneLower.includes('cyber') || sceneLower.includes('neon') || sceneLower.includes('gpu') || sceneLower.includes('benchmark')) {
          setSelectedBg('cyber-neon');
        } else if (sceneLower.includes('office') || sceneLower.includes('desk') || sceneLower.includes('executive') || sceneLower.includes('ceo')) {
          setSelectedBg('office-glass');
        }

        // Add to Saved Scene Memories Bank
        const newMemoryItem = {
          id: `mem-${Date.now()}`,
          title: scene.sceneTitle || `Custom Scene (${sceneDescription.slice(0, 20)}...)`,
          description: sceneDescription,
          action: scene.overlayText || sceneInteraction,
          prop: scene.propItem || activePropItem,
          timestamp: `Saved ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          backdropPrompt: scene.recommendedBackdropPrompt || sceneDescription,
          extractedDialogue: dialogue
        };

        setSceneMemories(prev => [newMemoryItem, ...prev.filter(m => m.description !== sceneDescription)]);

        // Auto-set backdrop prompt
        if (scene.recommendedBackdropPrompt) {
          setAiBackdropPrompt(scene.recommendedBackdropPrompt);
        }

        setActiveSceneFeedback({
          status: 'success',
          title: scene.sceneTitle || 'Custom Scene',
          prop: scene.propItem || 'Interactive Prop',
          overlayText: scene.overlayText || sceneInteraction,
          visualCue: scene.visualCue || sceneDescription,
          extractedDialogue: dialogue,
          message: '✨ AI Scene & Props Synthesized into Active Studio Memory!'
        });

        setLastGeneratedNotice(`✨ AI Scene Customization Synthesized: "${scene.sceneTitle || 'Custom Scene'}"`);

        // Smooth focus to Studio Canvas
        if (canvasRef.current) {
          canvasRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    } catch (e: any) {
      console.error("Scene generation error:", e);
      setActiveSceneFeedback({
        status: 'error',
        message: '⚠️ Scene applied to commercial stage!'
      });
    } finally {
      setIsGeneratingScene(false);
    }
  };

  // Load available speech synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Handle Speech Synthesis Read-Aloud
  const speakScript = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!isVoiceEnabled) return;

    const utterance = new SpeechSynthesisUtterance(scriptText);
    if (availableVoices.length > 0 && availableVoices[selectedVoiceIndex]) {
      utterance.voice = availableVoices[selectedVoiceIndex];
    }
    utterance.pitch = speechPitch;
    utterance.rate = speechRate * (scrollSpeed / 3);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Toggle Camera
  const toggleCamera = async () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      try {
        setCameraError(null);
        let rawStream: MediaStream;
        try {
          rawStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });
        } catch (audioErr) {
          console.warn("Camera with audio failed, attempting video only:", audioErr);
          rawStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
          });
        }

        let stream = rawStream;
        if (rawStream.getAudioTracks().length > 0) {
          try {
            const { processedStream } = createProcessedAudioStream(rawStream);
            const videoTrack = rawStream.getVideoTracks()[0];
            const audioTrack = processedStream.getAudioTracks()[0];
            const compositeStream = new MediaStream();
            if (videoTrack) compositeStream.addTrack(videoTrack);
            if (audioTrack) compositeStream.addTrack(audioTrack);
            stream = compositeStream;
          } catch (dspErr) {
            console.warn("DSP audio filter fallback:", dspErr);
          }
        }

        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
        setCameraDisplayMode('pip');
        setLastGeneratedNotice("🎥 Camera activated! Audio normalized & enhanced with Web Audio API DSP filter.");
      } catch (err: any) {
        console.error("Camera access error:", err);
        setCameraError("Unable to access camera/microphone. Please grant camera permissions in your browser.");
        setIsCameraOn(false);
      }
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  // Handle AI Backdrop Generation (Google Imagen 3)
  const handleGenerateAIBackdrop = async () => {
    if (!aiBackdropPrompt.trim()) return;
    setIsGeneratingBackdrop(true);
    setLastGeneratedNotice(null);
    try {
      const res = await fetch('/api/zynads/backdrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiBackdropPrompt })
      });
      const data = await res.json();
      if (data.success && data.backdrop) {
        const bgName = data.backdrop.name || `Google Imagen 3: ${aiBackdropPrompt.slice(0, 20)}`;
        const newPreset: BackgroundPreset = {
          id: `ai-bg-${Date.now()}`,
          name: bgName,
          bgClass: data.backdrop.bgClass || 'bg-gradient-to-r from-indigo-950 via-slate-950 to-purple-950',
          borderClass: data.backdrop.borderClass || 'border-indigo-500',
          imageUrl: data.backdrop.imageUrl,
          isAiGenerated: true,
          promptText: aiBackdropPrompt,
          canvasColors: ['#0f172a', '#1e1b4b', '#020617']
        };
        setDynamicPresets(prev => [newPreset, ...prev]);
        setSelectedBg(newPreset.id);
        if (data.backdrop.badgeText) {
          setBadgeText(data.backdrop.badgeText);
        }
        setLastGeneratedNotice(`✨ Google Imagen 3 Background Generated & Active: "${bgName}"`);
      }
    } catch (err) {
      console.error("Backdrop generation error:", err);
      setLastGeneratedNotice("⚠️ Defaulting to studio virtual backdrop fallback.");
    } finally {
      setIsGeneratingBackdrop(false);
    }
  };

  // Handle Custom Backdrop Photo Upload
  const handleCustomBackdropUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const customPreset: BackgroundPreset = {
          id: `custom-bg-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, "") || 'Uploaded Studio Backdrop',
          bgClass: 'bg-slate-950',
          borderClass: 'border-purple-500',
          imageUrl: result,
          isAiGenerated: false,
          canvasColors: ['#0f172a', '#1e1b4b', '#020617']
        };
        setDynamicPresets(prev => [customPreset, ...prev]);
        setSelectedBg(customPreset.id);
        setLastGeneratedNotice("✨ Custom studio backdrop uploaded & active on canvas!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Live Studio Composite Canvas Renderer
  // Renders: Background Preset/AI Backdrop + Camera Feed/Presenter + Lower Thirds + CTA Banner + Recording Status
  const activeBg = dynamicPresets.find(b => b.id === selectedBg) || dynamicPresets[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isSubscribed = true;

    const renderLoop = () => {
      if (!isSubscribed) return;
      frameCountRef.current++;
      const frame = frameCountRef.current;

      // 1. Draw Virtual Backdrop Set Graphic based on activeBg or sceneDescription
      const bgId = activeBg?.id || 'broadcast-studio';
      const descLower = (sceneDescription + ' ' + (activeBg?.name || '')).toLowerCase();

      // Check for photorealistic backdrop image
      let hasDrawnImage = false;
      if (activeBg?.imageUrl) {
        let bgImg = bgImgCacheRef.current.get(activeBg.imageUrl);
        if (!bgImg) {
          bgImg = new Image();
          bgImg.crossOrigin = 'anonymous';
          bgImg.src = activeBg.imageUrl;
          bgImgCacheRef.current.set(activeBg.imageUrl, bgImg);
        }
        if (bgImg.complete && bgImg.naturalWidth !== 0) {
          ctx.drawImage(bgImg, 0, 0, 1280, 720);
          hasDrawnImage = true;
          if (bgBlur > 0) {
            ctx.fillStyle = `rgba(15, 23, 42, ${Math.min(0.85, bgBlur / 25)})`;
            ctx.fillRect(0, 0, 1280, 720);
          }
        }
      }

      if (!hasDrawnImage) {
        // Modern Photorealistic Virtual Broadcast Studio Backdrop
        const grad = ctx.createLinearGradient(0, 0, 1280, 720);
        if (bgId === 'dark-studio' || descLower.includes('studio')) {
          grad.addColorStop(0, '#020617');
          grad.addColorStop(0.5, '#0f172a');
          grad.addColorStop(1, '#020617');
        } else if (bgId === 'cyber-neon' || descLower.includes('cyber') || descLower.includes('neon')) {
          grad.addColorStop(0, '#1e1b4b');
          grad.addColorStop(0.5, '#311042');
          grad.addColorStop(1, '#020617');
        } else if (bgId === 'office-glass' || descLower.includes('office') || descLower.includes('executive')) {
          grad.addColorStop(0, '#0f172a');
          grad.addColorStop(0.5, '#1e1b4b');
          grad.addColorStop(1, '#020617');
        } else {
          grad.addColorStop(0, '#0f172a');
          grad.addColorStop(0.5, '#1e1b4b');
          grad.addColorStop(1, '#020617');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1280, 720);
      }

      // Studio Overhead Spotlight Beams
      const spotGrad1 = ctx.createRadialGradient(320, 0, 20, 320, 0, 480);
      spotGrad1.addColorStop(0, 'rgba(52, 211, 153, 0.25)');
      spotGrad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = spotGrad1;
      ctx.beginPath();
      ctx.arc(320, 0, 480, 0, Math.PI * 2);
      ctx.fill();

      const spotGrad2 = ctx.createRadialGradient(960, 0, 20, 960, 0, 480);
      spotGrad2.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
      spotGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = spotGrad2;
      ctx.beginPath();
      ctx.arc(960, 0, 480, 0, Math.PI * 2);
      ctx.fill();

      // Studio Acoustic Slat Wall / Grid Background Panels
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 1280; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 480);
        ctx.stroke();
      }

      // Studio Soft Ambient Bokeh Particles
      ctx.fillStyle = 'rgba(52, 211, 153, 0.15)';
      for (let i = 0; i < 12; i++) {
        const px = (120 * i + frame * 0.8) % 1280;
        const py = 80 + Math.sin(frame / 20 + i) * 40;
        ctx.beginPath();
        ctx.arc(px, py, 4 + (i % 5), 0, Math.PI * 2);
        ctx.fill();
      }

      // Polished Glass Broadcast News & Podcast Desk Surface (Bottom Stage Console)
      const deskGrad = ctx.createLinearGradient(0, 640, 0, 720);
      deskGrad.addColorStop(0, 'rgba(15, 23, 42, 0.92)');
      deskGrad.addColorStop(0.5, 'rgba(30, 41, 59, 0.95)');
      deskGrad.addColorStop(1, 'rgba(2, 6, 23, 0.98)');
      ctx.fillStyle = deskGrad;
      ctx.beginPath();
      ctx.moveTo(0, 670);
      ctx.bezierCurveTo(320, 650, 960, 650, 1280, 670);
      ctx.lineTo(1280, 720);
      ctx.lineTo(0, 720);
      ctx.closePath();
      ctx.fill();

      // Glowing LED Edge Strip along Broadcast Desk
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, 670);
      ctx.bezierCurveTo(320, 650, 960, 650, 1280, 670);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      // 2. Draw Presenter Stage Center (Webcam, User Photo, OR Polished Broadcaster)
      const video = videoRef.current;
      const pulse = Math.sin(frame / 12) * 8;

      if (isCameraOn && video && video.readyState >= 2) {
        ctx.save();
        if (cameraDisplayMode === 'fullscreen') {
          // Fullscreen Broadcast Camera View
          if (isMirrored) {
            ctx.translate(1280, 0);
            ctx.scale(-1, 1);
          }
          ctx.drawImage(video, 0, 0, 1280, 720);
          ctx.restore();

          // 4K Broadcast HUD Viewfinder Overlay
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 2;

          // Corner Brackets
          const bracketSize = 24;
          const pad = 24;
          // Top Left
          ctx.beginPath(); ctx.moveTo(pad, pad + bracketSize); ctx.lineTo(pad, pad); ctx.lineTo(pad + bracketSize, pad); ctx.stroke();
          // Top Right
          ctx.beginPath(); ctx.moveTo(1280 - pad - bracketSize, pad); ctx.lineTo(1280 - pad, pad); ctx.lineTo(1280 - pad, pad + bracketSize); ctx.stroke();
          // Bottom Left
          ctx.beginPath(); ctx.moveTo(pad, 720 - pad - bracketSize); ctx.lineTo(pad, 720 - pad); ctx.lineTo(pad + bracketSize, 720 - pad); ctx.stroke();
          // Bottom Right
          ctx.beginPath(); ctx.moveTo(1280 - pad - bracketSize, 720 - pad); ctx.lineTo(1280 - pad, 720 - pad); ctx.lineTo(1280 - pad, 720 - pad - bracketSize); ctx.stroke();

          // Live 4K Broadcast Badge Top Left
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.beginPath();
          ctx.roundRect(pad + 10, pad + 10, 220, 32, 8);
          ctx.fill();
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(pad + 28, pad + 26, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'left';
          ctx.fillText('LIVE 4K BROADCAST • HDR', pad + 40, pad + 30);

          // Audio Meter Bars Top Right
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.beginPath();
          ctx.roundRect(1280 - pad - 230, pad + 10, 220, 32, 8);
          ctx.fill();

          ctx.fillStyle = '#34d399';
          for (let b = 0; b < 10; b++) {
            const barH = 8 + Math.abs(Math.sin(frame / 4 + b)) * 14;
            ctx.fillRect(1280 - pad - 215 + (b * 8), pad + 26 - barH / 2, 5, barH);
          }
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px monospace';
          ctx.fillText('48kHz STEREO', 1280 - pad - 125, pad + 30);

        } else {
          // Studio PIP Executive 16:9 Monitor Screen Card Mode
          const pipX = 320;
          const pipY = 120;
          const pipW = 640;
          const pipH = 360;

          // Monitor Shadow & Outer Glow
          ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
          ctx.shadowBlur = 25;
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.roundRect(pipX - 8, pipY - 8, pipW + 16, pipH + 16, 20);
          ctx.fill();
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.shadowBlur = 0; // reset

          // Monitor Video Clip
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(pipX, pipY, pipW, pipH, 14);
          ctx.clip();

          if (isMirrored) {
            ctx.translate(pipX + pipW, pipY);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, pipW, pipH);
          } else {
            ctx.drawImage(video, pipX, pipY, pipW, pipH);
          }
          ctx.restore();

          // Monitor Glass Reflection Overlay
          const reflGrad = ctx.createLinearGradient(pipX, pipY, pipX + pipW, pipY + pipH);
          reflGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
          reflGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.02)');
          reflGrad.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
          ctx.fillStyle = reflGrad;
          ctx.beginPath();
          ctx.roundRect(pipX, pipY, pipW, pipH, 14);
          ctx.fill();

          // Presenter Title Badge underneath PIP monitor
          ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
          ctx.beginPath();
          ctx.roundRect(pipX + 160, pipY + pipH + 12, 320, 28, 14);
          ctx.fill();
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.fillStyle = '#6ee7b7';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`🎥 Live Presenter: ${speakerName || 'Presenter'}`, pipX + 320, pipY + pipH + 30);

          ctx.restore();
        }
      } else if (presenterImgRef.current && presenterImageSrc) {
        // User Uploaded Photo Presenter - Widescreen Executive Studio Display
        const pW = 760;
        const pH = 425;
        const pX = (1280 - pW) / 2; // 260
        const pY = 70;

        ctx.save();

        // 16:9 Studio Monitor Frame & Neon Glow
        ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
        ctx.shadowBlur = 25;
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(pX - 10, pY - 10, pW + 20, pH + 20, 20);
        ctx.fill();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset

        // Image Display Clip
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(pX, pY, pW, pH, 14);
        ctx.clip();

        ctx.drawImage(presenterImgRef.current, pX, pY, pW, pH);

        // Glass Reflection Sheen
        const reflGrad = ctx.createLinearGradient(pX, pY, pX + pW, pY + pH);
        reflGrad.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        reflGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.02)');
        reflGrad.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
        ctx.fillStyle = reflGrad;
        ctx.beginPath();
        ctx.roundRect(pX, pY, pW, pH, 14);
        ctx.fill();

        ctx.restore();

        // Studio Presenter Tag Badge
        ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
        ctx.beginPath();
        ctx.roundRect(pX + 220, pY + pH + 12, 320, 28, 14);
        ctx.fill();
        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = '#a5b4fc';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`📸 Custom Studio Presenter: ${speakerName || 'Executive Presenter'}`, pX + 360, pY + pH + 30);

        ctx.restore();
      } else {
        // High-Tech Executive Broadcast Studio Stage (1080p Broadcast Display)
        const pW = 760;
        const pH = 425;
        const pX = (1280 - pW) / 2; // 260
        const pY = 70;

        ctx.save();

        // 16:9 Executive Monitor Screen Frame
        ctx.shadowColor = 'rgba(16, 185, 129, 0.35)';
        ctx.shadowBlur = 25;
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.roundRect(pX - 10, pY - 10, pW + 20, pH + 20, 20);
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset

        // Monitor Inner Stage Clip
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(pX, pY, pW, pH, 14);
        ctx.clip();

        // High-Tech Studio Stage Backdrop
        const innerGrad = ctx.createLinearGradient(pX, pY, pX, pY + pH);
        innerGrad.addColorStop(0, '#020617');
        innerGrad.addColorStop(0.5, '#0f172a');
        innerGrad.addColorStop(1, '#020617');
        ctx.fillStyle = innerGrad;
        ctx.fillRect(pX, pY, pW, pH);

        // Stage Dual Spotlights
        const spotGrad1 = ctx.createRadialGradient(pX + 180, pY + 100, 10, pX + 180, pY + 100, 280);
        spotGrad1.addColorStop(0, 'rgba(56, 189, 248, 0.3)');
        spotGrad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = spotGrad1;
        ctx.fillRect(pX, pY, pW, pH);

        const spotGrad2 = ctx.createRadialGradient(pX + pW - 180, pY + 100, 10, pX + pW - 180, pY + 100, 280);
        spotGrad2.addColorStop(0, 'rgba(129, 140, 248, 0.3)');
        spotGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = spotGrad2;
        ctx.fillRect(pX, pY, pW, pH);

        // Animated Audio Equalizer Signal Bars
        const eqBarCount = 28;
        const eqWidth = 14;
        const eqGap = 6;
        const eqStartX = pX + (pW - (eqBarCount * (eqWidth + eqGap))) / 2;
        ctx.fillStyle = 'rgba(52, 211, 153, 0.85)';
        for (let i = 0; i < eqBarCount; i++) {
          const barH = 20 + Math.abs(Math.sin((frameCountRef.current * 0.12) + (i * 0.4))) * 90;
          ctx.fillRect(eqStartX + (i * (eqWidth + eqGap)), pY + pH - 90 - barH, eqWidth, barH);
        }

        // Executive Studio Presenter Silhouette & HUD Frame
        const posX = 640;
        const posY = pY + 220;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.beginPath();
        ctx.ellipse(posX, posY + 80, 140, 75, 0, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = 'rgba(30, 41, 59, 0.95)';
        ctx.beginPath();
        ctx.arc(posX, posY - 25, 60, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎙️ BROADCAST PRESENTATION', posX, posY - 20);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('HIGH-DEFINITION COMMERCIAL STAGE', posX, posY);

        ctx.restore(); // end clip

        // Glass Reflection Sheen
        const reflGrad = ctx.createLinearGradient(pX, pY, pX + pW, pY + pH);
        reflGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
        reflGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.01)');
        reflGrad.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
        ctx.fillStyle = reflGrad;
        ctx.beginPath();
        ctx.roundRect(pX, pY, pW, pH, 14);
        ctx.fill();

        // Upload Photo Notice Badge (Below Presenter Stage)
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.beginPath();
        ctx.roundRect(pX + 220, pY + pH + 12, 320, 26, 13);
        ctx.fill();
        ctx.strokeStyle = '#a7f3d0';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#6ee7b7';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('📷 Broadcaster Presenter (Select Avatar or Upload Photo)', 640, pY + pH + 29);

        ctx.restore();
      }

      // 3A. Scene Top Title Box (Clean Non-Colliding Layout)
      if (sceneDescription) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.beginPath();
        ctx.roundRect(180, 20, 700, 44, 14);
        ctx.fill();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        const displayScene = sceneDescription.length > 55 ? `${sceneDescription.slice(0, 55)}...` : sceneDescription;
        ctx.fillText(`🎬 SCENE: "${displayScene}"`, 530, 48);
      }

      // 3B. Top-Right Neon Badge
      if (badgeText) {
        ctx.fillStyle = '#4f46e5';
        ctx.beginPath();
        ctx.roundRect(900, 20, 340, 44, 14);
        ctx.fill();
        ctx.strokeStyle = '#a5b4fc';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`✨ ${badgeText}`, 1070, 48);
      }

      // 3C. Character Action Bar (Middle-Bottom)
      if (sceneInteraction) {
        ctx.fillStyle = 'rgba(2, 44, 34, 0.94)';
        ctx.beginPath();
        ctx.roundRect(320, 500, 640, 38, 12);
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#6ee7b7';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`🎭 Action: ${sceneInteraction.slice(0, 58)}`, 640, 524);
      }

      // 3D. Draw Interactive Prop Graphic on Stage Pedestal (Right Side)
      const propY = 280 + pulse;
      const propLower = (activePropItem || '').toLowerCase();

      // Glass Pedestal Surface
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.beginPath();
      ctx.ellipse(1080, propY + 70, 90, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Floating Neon Prop Tag
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(1000, propY - 45, 160, 26, 13);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`📦 ${activePropItem || 'Interactive Prop'}`, 1080, propY - 28);

      if (propLower.includes('ram') || propLower.includes('hardware') || propLower.includes('stick')) {
        // RAM Stick Prop
        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.roundRect(1020, propY, 120, 42, 6);
        ctx.fill();
        ctx.fillStyle = '#fbbf24';
        for (let px = 1030; px <= 1120; px += 10) {
          ctx.fillRect(px, propY + 30, 6, 10);
        }
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('DDR5 RAM STICK', 1080, propY + 20);
      } else if (propLower.includes('gpu') || propLower.includes('card')) {
        // GPU Prop
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(1010, propY, 140, 50, 8);
        ctx.fill();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(1045, propY + 25, 14, 0, Math.PI * 2);
        ctx.arc(1115, propY + 25, 14, 0, Math.PI * 2);
        ctx.fill();
      } else if (propLower.includes('laptop') || propLower.includes('terminal') || propLower.includes('nano') || propLower.includes('code')) {
        // Terminal Laptop Prop
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(1005, propY - 15, 150, 80, 6);
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#022c22';
        ctx.fillRect(1012, propY - 8, 136, 54);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('GNU nano (Terminal)', 1016, propY + 4);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('At Zyncast, organic code', 1016, propY + 18);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('> deploy --organic', 1016, propY + 32);

        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.roundRect(995, propY + 65, 170, 10, 3);
        ctx.fill();
      } else {
        // Trophy / Star Prop
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(1080, propY + 25, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★', 1080, propY + 31);
      }

      // 4. Lower-Third Broadcast Speaker Banner (Bottom Left - Compact Non-Colliding Layout)
      if (showLowerThird) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.beginPath();
        ctx.roundRect(40, 490, 420, 85, 12);
        ctx.fill();
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(40, 490, 8, 85);
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(speakerName || 'Executive Presenter', 60, 518);

        ctx.fillStyle = '#818cf8';
        ctx.font = '12px monospace';
        ctx.fillText(speakerTitle || 'ZenAds Broadcast Director', 60, 540);

        ctx.fillStyle = '#a7f3d0';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`📢 Commercial CTA: "${ctaText}"`, 60, 560);
      }

      // 5. CTA Top-Right Secondary Banner
      if (showCtaBanner) {
        ctx.fillStyle = 'rgba(5, 150, 105, 0.95)';
        ctx.beginPath();
        ctx.roundRect(880, 80, 360, 40, 10);
        ctx.fill();
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`📞 ${ctaText}`, 1060, 105);
      }

      // 6. Recording Progress Status HUD Indicator
      if (isRecording) {
        ctx.fillStyle = 'rgba(159, 18, 57, 0.95)';
        ctx.beginPath();
        ctx.roundRect(24, 24, 280, 44, 12);
        ctx.fill();
        ctx.strokeStyle = '#fda4af';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const dotRadius = 5 + Math.abs(Math.sin(frame / 15)) * 3;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(42, 46, dotRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`REC ${formatTime(recordingSecondsElapsed)} / ${formatTime(targetDuration)}`, 56, 51);
      }

      // 7. Teleprompter Text Subtitle Overlay on Video (Full Bottom Center Bar - Y: 595 to 695)
      if (showTextOverlayOnVideo || isRecording || isPlaying) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
        ctx.beginPath();
        ctx.roundRect(60, 595, 1160, 95, 16);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        
        // Calculate spoken script snippet
        const lines = scriptText.split('\n').filter(l => l.trim().length > 0);
        const activeLineIndex = Math.floor((frame / 120) % Math.max(1, lines.length));
        const currentLine = lines[activeLineIndex] || scriptText.slice(0, 100);
        const nextLine = lines[(activeLineIndex + 1) % lines.length] || '';

        ctx.fillText(`📜 "${currentLine.slice(0, 85)}"`, 640, 632);

        if (nextLine) {
          ctx.fillStyle = '#cbd5e1';
          ctx.font = '13px sans-serif';
          ctx.fillText(`NEXT: ${nextLine.slice(0, 90)}`, 640, 665);
        }
      }

      studioRenderFrameRef.current = requestAnimationFrame(renderLoop);
    };

    studioRenderFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isSubscribed = false;
      if (studioRenderFrameRef.current) cancelAnimationFrame(studioRenderFrameRef.current);
    };
  }, [
    cameraDisplayMode,
    isPlaying,
    activeBg, 
    isCameraOn, 
    isMirrored, 
    showLowerThird, 
    speakerName, 
    speakerTitle, 
    showCtaBanner, 
    ctaText, 
    badgeText, 
    isRecording, 
    recordingSecondsElapsed, 
    targetDuration, 
    showTextOverlayOnVideo, 
    scriptText, 
    selectedScriptId,
    sceneDescription,
    sceneInteraction,
    activePropItem,
    presenterImageSrc,
    presenterFrameStyle,
    presenterScale
  ]);

  // Recording Timer Effect (Runs for the FULL targetDuration selected by user, e.g. 15s, 30s, 60s, 90s)
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSecondsElapsed(prev => {
          const next = prev + 1;
          if (autoStopOnTimer && next >= targetDuration) {
            stopRecordingCommercial();
            return targetDuration;
          }
          return next;
        });
      }, 1000);
    } else {
      setRecordingSecondsElapsed(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, targetDuration, autoStopOnTimer]);

  useEffect(() => {
    return () => {
      stopCamera();
      stopSpeech();
    };
  }, []);

  // Start Commercial Recording (Live Camera or Studio Canvas)
  const startRecordingCommercial = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    recordedChunksRef.current = [];
    try {
      // Capture 30fps stream directly from the Composite Studio Canvas
      const canvasStream = canvas.captureStream(30);

      // Attach audio track: from webcam mic if active, or via Web Audio API audio destination
      let hasAudioTrack = false;
      if (mediaStreamRef.current && mediaStreamRef.current.getAudioTracks().length > 0) {
        mediaStreamRef.current.getAudioTracks().forEach(track => {
          canvasStream.addTrack(track);
          hasAudioTrack = true;
        });
      }

      if (!hasAudioTrack && typeof window !== 'undefined') {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const audioCtx = new AudioContextClass();
            const dest = audioCtx.createMediaStreamDestination();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            gain.gain.value = 0.0001; // Silent baseline audio track for WebM container
            osc.connect(gain);
            gain.connect(dest);
            osc.start();
            dest.stream.getAudioTracks().forEach(track => canvasStream.addTrack(track));
          }
        } catch (audErr) {
          console.warn("Audio destination stream fallback:", audErr);
        }
      }

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const recorder = new MediaRecorder(canvasStream, { mimeType });
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setActiveStep(3); // Switch automatically to "Watch Commercial"
        setLastGeneratedNotice(`✨ Commercial Recording Complete! Full ${targetDuration}s video recorded with "${activeBg.name}" virtual backdrop.`);
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;

      setRecordingSecondsElapsed(0);
      setIsRecording(true);
      setCountdown(3);

      // Reset teleprompter scroll to top
      if (containerRef.current) containerRef.current.scrollTop = 0;
    } catch (e: any) {
      console.error("Recording error:", e);
      setCameraError("Commercial recording failed to start.");
    }
  };

  const stopRecordingCommercial = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPlaying(false);
    stopSpeech();
  };

  // Auto-Generate AI Commercial Video (Synthesizes full canvas duration + speech)
  const generateAICommercialVideo = async () => {
    setIsGeneratingVideo(true);
    stopSpeech();
    setLastGeneratedNotice(`🎬 Synthesizing AI Commercial Video (${targetDuration}s) with "${activeBg.name}" virtual backdrop...`);

    startRecordingCommercial();
    speakScript();

    // Auto stop after full target duration
    setTimeout(() => {
      stopRecordingCommercial();
      setIsGeneratingVideo(false);
    }, targetDuration * 1000 + 500);
  };

  const handleSelectScript = (id: string) => {
    setSelectedScriptId(id);
    const found = PRESET_SCRIPTS.find(s => s.id === id);
    if (found) {
      setScriptText(found.text);
      setIsPlaying(false);
      stopSpeech();
      if (containerRef.current) containerRef.current.scrollTop = 0;
    }
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setCountdown(null);
      stopSpeech();
    } else {
      setCountdown(3);
    }
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCountdown(null);
      setIsPlaying(true);
      if (isVoiceEnabled) {
        speakScript();
      }
    }
  }, [countdown]);

  // Teleprompter smooth auto-scroll loop (Only controls text scroll, does NOT prematurely kill recording!)
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const scroll = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop += scrollSpeed * 0.5;
        if (
          containerRef.current.scrollTop + containerRef.current.clientHeight >=
          containerRef.current.scrollHeight - 5
        ) {
          setIsPlaying(false);
          stopSpeech();
          return;
        }
      }
      animFrameRef.current = requestAnimationFrame(scroll);
    };

    animFrameRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, scrollSpeed]);

  const handleReset = () => {
    setIsPlaying(false);
    setCountdown(null);
    stopSpeech();
    if (containerRef.current) containerRef.current.scrollTop = 0;
  };

  const words = scriptText.trim().split(/\s+/).filter(Boolean).length;
  const estimatedSeconds = Math.round((words / 130) * 60);

  return (
    <div className={isTheater ? "space-y-6 animate-fadeIn fixed inset-0 z-50 bg-slate-950 p-6 flex flex-col justify-between overflow-hidden" : "space-y-6 animate-fadeIn"}>
      <video ref={videoRef} autoPlay playsInline muted style={{ display: 'none' }} />
      {/* Header Banner */}
      {!isTheater && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-indigo-500/30 text-indigo-300 text-[10px] font-mono font-bold uppercase rounded border border-indigo-500/40">
                Commercial Production Studio
              </span>
              <span className="text-xs text-slate-400">3-Step Studio • Virtual Backdrops • Full Duration Recording</span>
            </div>
            <h2 className="text-2xl font-bold font-sans tracking-tight">Create Your Video Commercial</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Select your commercial script, pick an AI virtual backdrop, record live or auto-generate for your full selected time, and watch the finished commercial product!
            </p>
          </div>
          
          <div className="flex items-center gap-3 font-mono text-xs bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800 shrink-0">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Word Count</span>
              <strong className="text-indigo-400 text-sm">{words} words</strong>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Est. Read Time</span>
              <strong className="text-emerald-400 text-sm">{estimatedSeconds}s</strong>
            </div>
          </div>
        </div>
      )}

      {/* Alert Error / Notification Notice */}
      {cameraError && (
        <div className="p-3 bg-rose-950/90 border border-rose-500/80 text-rose-200 text-xs rounded-xl flex items-center justify-between font-medium">
          <span>{cameraError}</span>
          <button onClick={() => setCameraError(null)} className="text-rose-400 hover:text-white font-bold cursor-pointer">✕</button>
        </div>
      )}

      {lastGeneratedNotice && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 text-xs rounded-xl flex items-center justify-between font-mono animate-fadeIn shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-base">✨</span>
            <span>{lastGeneratedNotice}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setLastGeneratedNotice(null)} 
            className="text-emerald-400 hover:text-white font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Studio Suite Navigation Bar (Krea AI Suite + Live Teleprompter) */}
      {!isTheater && (
        <div className="bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
            <button
              type="button"
              onClick={() => setStudioTool('video-gen')}
              className={`px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                studioTool === 'video-gen'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-400 text-white shadow-lg font-bold'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Film className={`w-4 h-4 shrink-0 ${studioTool === 'video-gen' ? 'text-amber-300 animate-pulse' : 'text-indigo-400'}`} />
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">MiniMax H3 Video</div>
                <div className="text-[9px] opacity-75 font-mono truncate">@img Tagged Gen</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setStudioTool('realtime')}
              className={`px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                studioTool === 'realtime'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 text-white shadow-lg font-bold'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Palette className={`w-4 h-4 shrink-0 ${studioTool === 'realtime' ? 'text-white' : 'text-cyan-400'}`} />
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">Realtime Canvas</div>
                <div className="text-[9px] opacity-75 font-mono truncate">Live AI Drawing</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setStudioTool('teleprompter')}
              className={`px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                studioTool === 'teleprompter'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 border-rose-400 text-white shadow-lg font-bold'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Video className={`w-4 h-4 shrink-0 ${studioTool === 'teleprompter' ? 'text-white' : 'text-rose-400'}`} />
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">Live Teleprompter</div>
                <div className="text-[9px] opacity-75 font-mono truncate">Webcam & Overlays</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setStudioTool('enhancer')}
              className={`px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                studioTool === 'enhancer'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400 text-white shadow-lg font-bold'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Wand2 className={`w-4 h-4 shrink-0 ${studioTool === 'enhancer' ? 'text-amber-300' : 'text-purple-400'}`} />
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">AI 4K Enhancer</div>
                <div className="text-[9px] opacity-75 font-mono truncate">Upscale & Denoise</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setStudioTool('node-editor')}
              className={`px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                studioTool === 'node-editor'
                  ? 'bg-gradient-to-r from-indigo-600 to-teal-600 border-teal-400 text-white shadow-lg font-bold'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Workflow className={`w-4 h-4 shrink-0 ${studioTool === 'node-editor' ? 'text-white' : 'text-teal-400'}`} />
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">Node Editor</div>
                <div className="text-[9px] opacity-75 font-mono truncate">Workflow Graph</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setStudioTool('assets')}
              className={`px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                studioTool === 'assets'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 border-amber-400 text-white shadow-lg font-bold'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers className={`w-4 h-4 shrink-0 ${studioTool === 'assets' ? 'text-slate-950' : 'text-amber-400'}`} />
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">Assets & LoRA</div>
                <div className="text-[9px] opacity-75 font-mono truncate">Character Trainer</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Render Selected Studio Tool View */}
      {studioTool === 'video-gen' && <VideoGeneratorView />}
      {studioTool === 'realtime' && <RealtimeCanvasView />}
      {studioTool === 'enhancer' && <EnhancerView />}
      {studioTool === 'node-editor' && <NodeEditorView />}
      {studioTool === 'assets' && <AssetManagerView />}

      {/* RENDER LIVE TELEPROMPTER ONLY WHEN studioTool === 'teleprompter' */}
      {studioTool === 'teleprompter' && (
        <>
          {/* 3-Step Simple Commercial Production Workflow Bar */}
          {!isTheater && (
        <div className="bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              activeStep === 1
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 border-indigo-400 text-white shadow-lg'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 ${activeStep === 1 ? 'bg-white text-indigo-700' : 'bg-slate-800 text-slate-300'}`}>
              1
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 font-sans">
                ✍️ 1. CREATE COMMERCIAL
              </div>
              <div className="text-[11px] opacity-80">Script, Set & AI Backdrop</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              activeStep === 2
                ? 'bg-gradient-to-r from-rose-600 to-rose-700 border-rose-400 text-white shadow-lg'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 ${activeStep === 2 ? 'bg-white text-rose-700' : 'bg-slate-800 text-slate-300'}`}>
              2
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 font-sans">
                🎬 2. RECORD & GENERATE
              </div>
              <div className="text-[11px] opacity-80">Record or AI Auto-Synthesize</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 relative overflow-hidden ${
              activeStep === 3
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 border-emerald-400 text-white shadow-lg'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 ${activeStep === 3 ? 'bg-white text-emerald-700' : 'bg-slate-800 text-slate-300'}`}>
              3
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 font-sans">
                📺 3. WATCH COMMERCIAL
              </div>
              <div className="text-[11px] opacity-80">
                {recordedVideoUrl ? '✨ Finished Product Ready!' : 'Preview & Download Video'}
              </div>
            </div>
          </button>
        </div>
      )}

      {/* STEP 1: CREATE & CUSTOMIZE COMMERCIAL (AI Scene Prompt, Overlays, AI Backdrop) */}
      {activeStep === 1 && !isTheater && (
        <div className="space-y-6 animate-fadeIn">
          {/* Box 1: AI Commercial Scene & Settings Prompt Director */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-indigo-600" />
                  <label className="text-xs font-bold text-slate-900 font-sans">
                    1. 🪄 AI Commercial Vision & Scene Director (Prompt Your Desired Commercial Scene & Settings):
                  </label>
                </div>
                <p className="text-[11px] text-slate-500 font-sans pl-6">
                  Describe or dictate your vision for the commercial. The AI Director will automatically implement the virtual backdrop, stage props, overlays, and generate the teleprompter spoken script!
                </p>
              </div>

              <div className="flex items-center gap-3">
                <VoiceDictationButton
                  variant="light"
                  size="sm"
                  onTranscript={(text) => {
                    setSceneDescription((prev) => (prev ? `${prev} ${text}` : text));
                    setLastGeneratedNotice("🎙️ Dictated vision added to AI Commercial Scene prompt!");
                  }}
                />
              </div>
            </div>

            <textarea
              rows={3}
              value={sceneDescription}
              onChange={(e) => setSceneDescription(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
              placeholder="e.g. Create a 30s funny Silicon Acres computer parts sanctuary commercial where a presenter feeds DDR5 RAM sticks to a mechanical lamb in a motherboard pasture..."
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateAIScene}
                  disabled={isGeneratingScene || !sceneDescription.trim()}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  {isGeneratingScene ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin text-amber-300" /> Synthesizing Scene & Script...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" /> ✨ AI Generate Scene, Settings & Script
                    </>
                  )}
                </button>
                <span className="text-[11px] text-slate-500 font-mono">
                  (Automatically populates teleprompter script in Step 2)
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600">
                <span>Preset Concepts:</span>
                <select
                  value={selectedScriptId}
                  onChange={(e) => {
                    handleSelectScript(e.target.value);
                    const sel = PRESET_SCRIPTS.find(s => s.id === e.target.value) as any;
                    if (sel) {
                      if (sel.sceneDesc || sel.title) setSceneDescription(sel.sceneDesc || sel.title);
                      if (sel.action) setSceneInteraction(sel.action);
                      if (sel.prop) setActivePropItem(sel.prop);
                      if (sel.bgId) setSelectedBg(sel.bgId);
                    }
                  }}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  {PRESET_SCRIPTS.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.duration})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* AI Virtual Backdrop Prompt Generator (Google Imagen 3) & Gallery */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-indigo-400">
                <Sparkles className="w-4 h-4 text-amber-400" /> 2. Google Imagen 3 Virtual Studio Set Backdrop & Photo Generator
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">✨ Powered by Google Imagen 3 AI</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  value={aiBackdropPrompt}
                  onChange={(e) => setAiBackdropPrompt(e.target.value)}
                  placeholder="e.g. Modern Broadcast Newsroom with LED video walls, Executive Glass Skyline, Cyberpunk Stage..."
                  className="w-full pl-3.5 pr-28 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <div className="absolute right-1.5">
                  <VoiceDictationButton
                    variant="dark"
                    size="sm"
                    onTranscript={(text) => {
                      setAiBackdropPrompt((prev) => (prev ? `${prev} ${text}` : text));
                      setLastGeneratedNotice("🎙️ Dictated speech added to AI Backdrop prompt!");
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateAIBackdrop}
                  disabled={isGeneratingBackdrop || !aiBackdropPrompt.trim()}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 border border-indigo-400/30"
                >
                  {isGeneratingBackdrop ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin text-amber-300" /> Generating Imagen 3 Set...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> Generate Imagen 3 Backdrop
                    </>
                  )}
                </button>

                <label className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer flex items-center justify-center gap-1.5 shrink-0 transition-all">
                  <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Upload Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleCustomBackdropUpload} />
                </label>
              </div>
            </div>

            {/* Virtual Background Cards Picker */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono">
                <label className="text-slate-300 font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> Select Studio Virtual Background Set:
                </label>
                <span className="text-[10px] text-slate-400 font-semibold">{dynamicPresets.length} Sets Available</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {dynamicPresets.map((bg) => {
                  const isActive = selectedBg === bg.id;
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => {
                        setSelectedBg(bg.id);
                        setLastGeneratedNotice(`Activated studio background: "${bg.name}"`);
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between min-h-[90px] ${
                        isActive 
                          ? 'border-emerald-400 bg-slate-800 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-950/50' 
                          : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      {bg.imageUrl ? (
                        <div className="w-full h-12 rounded-lg overflow-hidden border border-slate-800 mb-1.5 relative group-hover:scale-105 transition-transform bg-slate-950">
                          <img src={bg.imageUrl} alt={bg.name} className="w-full h-full object-cover" />
                          <div className="absolute top-1 left-1 bg-slate-950/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-amber-300 border border-slate-700/50">
                            {bg.isAiGenerated ? '✨ IMAGEN 3' : 'STUDIO SET'}
                          </div>
                          {isActive && (
                            <div className="absolute top-1 right-1 bg-emerald-500 text-slate-950 px-1 py-0.5 rounded text-[8px] font-bold">
                              ✓ ACTIVE
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={`w-full h-8 rounded-md ${bg.bgClass} border ${bg.borderClass} mb-1.5 flex items-center justify-between px-2 text-[9px] font-mono text-white font-bold shadow-inner`}>
                          <span>{bg.isAiGenerated ? '✨ IMAGEN 3' : 'PRESET'}</span>
                          {isActive && <span className="text-emerald-300 bg-slate-950/80 px-1 rounded">✓ ACTIVE</span>}
                        </div>
                      )}

                      <div className="space-y-0.5">
                        <div className="text-[11px] font-bold text-white truncate leading-snug">
                          {bg.name}
                        </div>
                        <div className="text-[9px] font-mono text-slate-400 truncate">
                          {isActive ? '● Active on Broadcast Canvas' : 'Click to activate set'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lower Thirds & Speaker Customization */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-indigo-400">
                <Layers className="w-4 h-4 text-indigo-400" /> 3. Lower-Third Name Banners & Call-To-Action (CTA)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    Lower-Third Name Banner:
                  </label>
                  <input
                    type="checkbox"
                    checked={showLowerThird}
                    onChange={(e) => setShowLowerThird(e.target.checked)}
                    className="accent-indigo-500 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={speakerName}
                  onChange={(e) => setSpeakerName(e.target.value)}
                  placeholder="Presenter Name"
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium text-xs mb-1"
                />
                <input
                  type="text"
                  value={speakerTitle}
                  onChange={(e) => setSpeakerTitle(e.target.value)}
                  placeholder="Business Title / Offer"
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-300 text-xs"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    Bottom CTA Offer Banner:
                  </label>
                  <input
                    type="checkbox"
                    checked={showCtaBanner}
                    onChange={(e) => setShowCtaBanner(e.target.checked)}
                    className="accent-indigo-500 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Visit Website | Call (555) 019-2831"
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium text-xs mb-1"
                />
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="Top Right Badge (e.g. FREE-RANGE HARDWARE)"
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-300 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Scene Customizer & Character Interaction ("Scene" Feature) */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-emerald-400">
                <Clapperboard className="w-4 h-4 text-emerald-400" /> 3. Scene Customizer & Character Interaction ("Scene")
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Describe how character interacts with scene</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 block">
                    🎬 Scene Environment Description:
                  </label>
                  <VoiceDictationButton
                    variant="dark"
                    size="sm"
                    onTranscript={(text) => {
                      setSceneDescription((prev) => (prev ? `${prev} ${text}` : text));
                      setLastGeneratedNotice("🎙️ Dictated speech added to Scene Environment!");
                    }}
                  />
                </div>
                <textarea
                  rows={3}
                  value={sceneDescription}
                  onChange={(e) => setSceneDescription(e.target.value)}
                  placeholder="e.g. Standing in motherboard pasture with RAM sticks, or holding up a laptop running nano in terminal: 'At Zyncast, our code is different...'"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 block">
                    🎭 Character Action / Interaction:
                  </label>
                  <VoiceDictationButton
                    variant="dark"
                    size="sm"
                    onTranscript={(text) => {
                      setSceneInteraction((prev) => (prev ? `${prev} ${text}` : text));
                      setLastGeneratedNotice("🎙️ Dictated speech added to Character Action!");
                    }}
                  />
                </div>
                <input
                  type="text"
                  value={sceneInteraction}
                  onChange={(e) => setSceneInteraction(e.target.value)}
                  placeholder="e.g. Feeding DDR5 RAM stick to mechanical lamb, presenting GPU benchmark..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none mb-2"
                />

                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Interactive Prop Item:</label>
                    <input
                      type="text"
                      value={activePropItem}
                      onChange={(e) => setActivePropItem(e.target.value)}
                      placeholder="e.g. RAM Stick, Terminal Laptop, GPU"
                      className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateAIScene}
                    disabled={isGeneratingScene || !sceneDescription.trim()}
                    className="mt-4 px-3.5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border border-emerald-400/30"
                  >
                    {isGeneratingScene ? (
                      <RotateCcw className="w-4 h-4 animate-spin text-amber-300" />
                    ) : (
                      <Wand2 className="w-4 h-4 text-amber-300 animate-pulse" />
                    )}
                    <span>AI Enhance Scene</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Inline AI Feedback & Dialogue Loader Card */}
            {activeSceneFeedback.status !== 'idle' && (
              <div className={`p-4 rounded-xl border transition-all ${
                activeSceneFeedback.status === 'loading'
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  : activeSceneFeedback.status === 'success'
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-100 shadow-lg'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      {activeSceneFeedback.status === 'loading' && <RotateCcw className="w-3.5 h-3.5 animate-spin text-amber-400" />}
                      {activeSceneFeedback.status === 'success' && <Sparkles className="w-4 h-4 text-emerald-400" />}
                      <span>{activeSceneFeedback.message}</span>
                    </div>

                    {activeSceneFeedback.status === 'success' && (
                      <div className="text-[11px] space-y-1 mt-2 text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-400">🎬 Scene Title:</span>
                          <span className="text-white font-medium">{activeSceneFeedback.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-400">📦 Prop Rendered:</span>
                          <span className="text-amber-300 font-mono font-bold">{activeSceneFeedback.prop}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-400">🎭 Action Caption:</span>
                          <span className="text-slate-200">{activeSceneFeedback.overlayText}</span>
                        </div>

                        {activeSceneFeedback.extractedDialogue && (
                          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-slate-300 text-[10px]">
                              🎙️ Dialogue Quote Detected: <span className="text-amber-200 italic">"{activeSceneFeedback.extractedDialogue}"</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setScriptText(activeSceneFeedback.extractedDialogue!);
                                  setLastGeneratedNotice("🎙️ Dialogue imported into Active Teleprompter Script below!");
                                }}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] rounded-md transition-all cursor-pointer shrink-0 flex items-center gap-1 shadow-sm"
                              >
                                <Check className="w-3 h-3" />
                                Load Dialogue into Script
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setScriptText(activeSceneFeedback.extractedDialogue!);
                                  setActiveStep(2);
                                  setLastGeneratedNotice("🎙️ Dialogue loaded! Switched to Step 2 Teleprompter Recording.");
                                }}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] rounded-md transition-all cursor-pointer shrink-0 flex items-center gap-1 shadow-sm"
                              >
                                <span>Load & Open Step 2 Teleprompter</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveSceneFeedback({ status: 'idle' })}
                    className="text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Active Teleprompter Script Editor directly inside Step 1 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/40 space-y-2 mt-3 shadow-inner">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <label className="text-xs font-bold text-white font-mono">
                    📜 Active Teleprompter Spoken Script:
                  </label>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                    Syncs Live across Studio & Voice AI
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <VoiceDictationButton
                    variant="dark"
                    size="sm"
                    onTranscript={(text) => {
                      setScriptText((prev) => (prev ? `${prev} ${text}` : text));
                      setLastGeneratedNotice("🎙️ Dictated speech added to Active Teleprompter Script!");
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    <span>Proceed to Step 2 Teleprompter</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <textarea
                rows={3}
                value={scriptText}
                onChange={(e) => {
                  setScriptText(e.target.value);
                  stopSpeech();
                }}
                className="w-full p-3 bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-sans text-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none leading-relaxed font-medium"
                placeholder="Type or load dialogue from scene memory or AI director..."
              />

              <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                <span>Word Count: <strong className="text-indigo-300">{words} words</strong> | Est. Duration: <strong className="text-emerald-400">{estimatedSeconds}s</strong></span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Ready on Live Recording Canvas & Voice AI Synthesizer
                </span>
              </div>
            </div>

            {/* Saved Scene Memories Bank */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  🧠 Saved Scene Memories ({sceneMemories.length}):
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Click memory to recall & load onto stage</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {sceneMemories.map((mem) => (
                  <button
                    key={mem.id}
                    type="button"
                    onClick={() => {
                      setSceneDescription(mem.description);
                      setSceneInteraction(mem.action);
                      setActivePropItem(mem.prop);
                      if (mem.backdropPrompt) setAiBackdropPrompt(mem.backdropPrompt);
                      if (mem.extractedDialogue) {
                        setScriptText(mem.extractedDialogue);
                      }
                      setActiveSceneFeedback({
                        status: 'success',
                        title: mem.title,
                        prop: mem.prop,
                        overlayText: mem.action,
                        visualCue: mem.description,
                        extractedDialogue: mem.extractedDialogue,
                        message: `🧠 Recreated Scene Memory: "${mem.title}"`
                      });
                      setLastGeneratedNotice(`🧠 Recreated Scene Memory: "${mem.title}"`);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer group ${
                      sceneDescription === mem.description
                        ? 'border-emerald-500 bg-emerald-950/40 text-white shadow-md ring-1 ring-emerald-500/50'
                        : 'border-slate-800 bg-slate-950/80 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200 truncate">
                        {mem.title}
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono shrink-0">{mem.timestamp}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-2">
                      {mem.description}
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-amber-300 rounded font-mono">
                        📦 {mem.prop}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Preset Scene Concepts */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-[11px] font-mono font-bold text-slate-300 block">
                ⚡ Quick Preset Scene Concepts:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {PRESET_SCENE_IDEAS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSceneDescription(preset.description);
                      setSceneInteraction(preset.action);
                      setActivePropItem(preset.prop);
                      setBadgeText(preset.badge);
                      if (preset.bgId) setSelectedBg(preset.bgId);
                      if (preset.speakerName) setSpeakerName(preset.speakerName);
                      if (preset.speakerTitle) setSpeakerTitle(preset.speakerTitle);
                      if (preset.ctaText) setCtaText(preset.ctaText);
                      if (preset.dialogue) setScriptText(preset.dialogue);

                      setActiveSceneFeedback({
                        status: 'success',
                        title: preset.title,
                        prop: preset.prop,
                        overlayText: preset.action,
                        visualCue: preset.description,
                        extractedDialogue: preset.dialogue,
                        message: `✨ Fully Integrated AI Preset: Script, Virtual Set, Lower-Thirds & Stage Props loaded!`
                      });
                      setLastGeneratedNotice(`✨ Fully Integrated Preset Loaded: "${preset.title}"`);

                      if (canvasRef.current) {
                        canvasRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      }
                    }}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-800 hover:border-slate-700 text-left transition-all cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200">
                      {preset.title}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                      {preset.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Character Placement & Photorealistic Studio Presenters */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-purple-400">
                <User className="w-4 h-4 text-purple-400" /> 4. Photorealistic Studio Presenters & Custom Photo Upload
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Select a presenter or upload your own photo</span>
            </div>

            {/* Photorealistic Presenter Avatars Preset Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 block">
                👤 Select Photorealistic Commercial Presenter:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DEFAULT_PRESENTER_AVATARS.map((avatar) => {
                  const isSelected = presenterImageSrc === avatar.url;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => {
                        setPresenterImageSrc(avatar.url);
                        setPresenterName(avatar.name);
                        setSpeakerName(`${avatar.name}`);
                        setSpeakerTitle(avatar.title);
                        setBadgeText(avatar.badge);
                        setLastGeneratedNotice(`✨ Selected Photorealistic Presenter: ${avatar.name} (${avatar.title})`);
                        if (canvasRef.current) {
                          canvasRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? 'border-purple-500 bg-purple-950/60 ring-2 ring-purple-500/50 shadow-lg'
                          : 'border-slate-800 bg-slate-950/80 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={avatar.url}
                        alt={avatar.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-700"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">{avatar.name}</div>
                        <div className="text-[10px] text-purple-300 truncate">{avatar.title}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-200 block">
                  📁 Or Upload Your Own Photo (JPG/PNG):
                </label>

                <div className="flex items-center gap-3">
                  <label className="flex-1 p-3 bg-slate-950 border-2 border-dashed border-purple-500/50 hover:border-purple-400 rounded-xl text-center cursor-pointer transition-all hover:bg-slate-900 group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePresenterPhotoUpload}
                      className="hidden"
                    />
                    <Upload className="w-5 h-5 text-purple-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-purple-300 block">Click or Drag Image Here</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Auto-composited into your AI commercial scene</span>
                  </label>

                  {presenterImageSrc && (
                    <div className="relative group shrink-0">
                      <img
                        src={presenterImageSrc}
                        alt="Uploaded Presenter"
                        className="w-20 h-20 rounded-xl object-cover border-2 border-purple-500 shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPresenterImageSrc(null);
                          presenterImgRef.current = null;
                          setLastGeneratedNotice("Removed custom presenter photo.");
                        }}
                        className="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-500 text-white w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center cursor-pointer shadow-md"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 block">Presenter Name Tag:</label>
                  <input
                    type="text"
                    value={presenterName}
                    onChange={(e) => {
                      setPresenterName(e.target.value);
                      setSpeakerName(e.target.value);
                    }}
                    placeholder="Your Name / Presenter Title"
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-200 block">
                  🎨 Character Framing & Scaling:
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPresenterFrameStyle('circle')}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      presenterFrameStyle === 'circle'
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    ⭕ Circle Stage Ring
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresenterFrameStyle('cutout')}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      presenterFrameStyle === 'cutout'
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    🖼️ Studio Frame
                  </button>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Character Image Scale:</span>
                    <span className="text-purple-300 font-bold">{Math.round(presenterScale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.6}
                    max={1.5}
                    step={0.1}
                    value={presenterScale}
                    onChange={(e) => setPresenterScale(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Zyncast AI Video Commercial Prompt & Shot Synthesizer */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-indigo-700/80 text-white space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/40">
                  <Video className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-sans text-white flex items-center gap-2">
                    5. Zyncast AI Commercial Prompt & Shot Synthesizer
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded font-mono font-bold">
                      ZYNCAST 4K STUDIO ENGINE
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5 max-w-3xl">
                    Synthesize cinematic video prompts tailored for Zyncast commercial video generation, including camera motions, lighting setups, aspect ratios, and spoken script dialogue.
                  </p>
                </div>
              </div>
            </div>

            {/* Controls for AI Video Tool selection & Prompt Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-sans">
              <div>
                <label className="block text-slate-300 font-bold mb-1 font-mono">Zyncast Video Preset:</label>
                <select
                  value={aiVideoTool}
                  onChange={(e) => setAiVideoTool(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="zyn4k">Zyncast 4K Ultra Engine (60fps Cinematic)</option>
                  <option value="zyncinematic">Zyncast Cinematic Studio (Anamorphic Lens)</option>
                  <option value="zynreel">Zyncast Commercial Social Reel (Vertical Feed)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 font-mono">Camera Angle & Motion:</label>
                <select
                  value={cameraMovement}
                  onChange={(e) => setCameraMovement(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="dolly-in">Cinematic Dolly Zoom In</option>
                  <option value="orbit">Smooth 360° Presenter Orbit</option>
                  <option value="pan-horizontal">Horizontal Slow Pan Left-to-Right</option>
                  <option value="drone-overfly">Overhead Studio Flyby</option>
                  <option value="close-up-presenter">Medium Close-Up Presenter Shot</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 font-mono">Lighting & Aesthetics:</label>
                <select
                  value={lightingStyle}
                  onChange={(e) => setLightingStyle(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="cinematic-golden-hour">Golden Hour Sunset Glow</option>
                  <option value="cyberpunk-neon">Cyberpunk Neon Stage Pulse</option>
                  <option value="studio-softbox">Studio Broadcast Softbox</option>
                  <option value="dramatic-anamorphic">Dramatic Anamorphic Lens Flare</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 font-mono">Aspect Ratio:</label>
                <select
                  value={videoAspect}
                  onChange={(e) => setVideoAspect(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="16:9">16:9 Widescreen Landscape</option>
                  <option value="9:16">9:16 Vertical Reel / TikTok</option>
                  <option value="1:1">1:1 Square Feed Ad</option>
                </select>
              </div>
            </div>

            {/* Formatted Prompt Display Box & Quick Actions */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <label className="text-slate-300 font-bold">Synthesized Commercial Prompt:</label>
                <span className="text-[10px] text-slate-400">Zyncast AI Production Format</span>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-indigo-200 leading-relaxed break-words relative group shadow-inner">
                {getFormattedAIVideoPrompt()}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyAIVideoPrompt}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  {copiedPromptStatus ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedPromptStatus ? 'Copied Prompt!' : 'Copy Synthesized Prompt'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveStep(2);
                    if (canvasRef.current) {
                      canvasRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Use Prompt on Zyncast Studio Canvas</span>
                </button>
              </div>
            </div>
          </div>

          {/* Proceed Button to Step 2 */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm rounded-xl shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Proceed to Step 2: Record & Generate ({targetDuration}s Commercial)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: RECORD & GENERATE COMMERCIAL (Live Studio, Composited Canvas, Teleprompter) */}
      {(activeStep === 2 || isTheater) && (
        <div className="space-y-6 animate-fadeIn">
          {/* Teleprompter Spoken Dialogue Script Editor (Right in Teleprompter Section) */}
          {!isTheater && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-rose-600" />
                    <label className="text-xs font-bold text-slate-900 font-sans">
                      📜 Actor / Presenter Spoken Dialogue Script (Teleprompter Speech):
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans pl-6">
                    This is the exact spoken speech read by the actor on the teleprompter during recording or AI synthesis.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <VoiceDictationButton
                    variant="light"
                    size="sm"
                    onTranscript={(text) => {
                      setScriptText((prev) => (prev ? `${prev} ${text}` : text));
                      setLastGeneratedNotice("🎙️ Dictated speech added to Actor Commercial Script!");
                    }}
                  />
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-500 font-mono">Script Presets:</span>
                    <select
                      value={selectedScriptId}
                      onChange={(e) => handleSelectScript(e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none cursor-pointer"
                    >
                      {PRESET_SCRIPTS.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.duration})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <textarea
                rows={4}
                value={scriptText}
                onChange={(e) => {
                  setScriptText(e.target.value);
                  stopSpeech();
                }}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none leading-relaxed font-medium"
                placeholder="Type or dictate the exact dialogue the actor / presenter will speak on the teleprompter..."
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-800 font-mono">⏱️ Target Recording Duration:</span>
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
                    {[15, 30, 60, 90].map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setTargetDuration(dur)}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                          targetDuration === dur
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                      >
                        {dur} Seconds
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-slate-600">
                  <input
                    type="checkbox"
                    id="auto-stop-chk-2"
                    checked={autoStopOnTimer}
                    onChange={(e) => setAutoStopOnTimer(e.target.checked)}
                    className="accent-rose-600 cursor-pointer"
                  />
                  <label htmlFor="auto-stop-chk-2" className="cursor-pointer font-medium">Auto-Stop at Target Duration</label>
                </div>
              </div>
            </div>
          )}

          {/* Production Controls Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleCamera}
                className={isCameraOn ? "px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100" : "px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"}
              >
                {isCameraOn ? (
                  <Camera className="w-4 h-4 text-emerald-600" />
                ) : (
                  <CameraOff className="w-4 h-4 text-slate-500" />
                )}
                Camera: {isCameraOn ? 'ON' : 'OFF'}
              </button>

              {isCameraOn && (
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setCameraDisplayMode('pip');
                      setLastGeneratedNotice("🎭 Switched to Studio Stage PIP: Camera placed in glowing presenter stage frame revealing AI scene & props!");
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      cameraDisplayMode === 'pip'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    🎭 Studio Stage PIP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCameraDisplayMode('fullscreen');
                      setLastGeneratedNotice("📺 Switched to Full Screen Camera Video");
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      cameraDisplayMode === 'fullscreen'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    📺 Full Screen
                  </button>
                </div>
              )}

              {isRecording ? (
                <button
                  type="button"
                  onClick={stopRecordingCommercial}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 animate-pulse cursor-pointer border border-rose-400"
                >
                  <div className="relative flex items-center justify-center w-2.5 h-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </div>
                  <StopCircle className="w-4 h-4" /> Stop REC ({formatTime(recordingSecondsElapsed)} / {formatTime(targetDuration)})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecordingCommercial}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Circle className="w-4 h-4 fill-current text-white" /> Record Full Commercial ({targetDuration}s)
                </button>
              )}

              {/* Instant AI Auto-Generate Video Button */}
              <button
                type="button"
                onClick={generateAICommercialVideo}
                disabled={isGeneratingVideo}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingVideo ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" /> Synthesizing {targetDuration}s AI Video...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" /> ✨ Auto-Generate {targetDuration}s AI Commercial
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePlayToggle}
                className={isPlaying ? "px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer bg-amber-500 hover:bg-amber-600 text-white" : "px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause Script
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> Play Teleprompter
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                title="Reset to top"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Teleprompter Text Overlay Toggle on Video */}
              <button
                type="button"
                onClick={() => setShowTextOverlayOnVideo(!showTextOverlayOnVideo)}
                className="px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                title="Toggle text overlay directly on video canvas"
              >
                {showTextOverlayOnVideo ? (
                  <Eye className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                )}
                Words on Video: {showTextOverlayOnVideo ? "ON" : "OFF"}
              </button>

              <button
                type="button"
                onClick={() => setIsMirrored(!isMirrored)}
                className="px-2.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1 bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                title="Mirror horizontally for teleprompters"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsTheater(!isTheater)}
                className="p-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="Full Theater Mode"
              >
                {isTheater ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl border-4 border-indigo-600 bg-black overflow-hidden shadow-2xl min-h-96 aspect-video flex items-center justify-center group">
            {/* Real-time Studio Canvas */}
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              className="w-full h-full object-contain"
            />

            {/* Real-time Audio Waveform Visualizer & Level Monitor HUD */}
            {isCameraOn && (
              <div className="absolute bottom-4 right-4 z-30 w-72 max-w-[85vw] pointer-events-auto">
                <AudioWaveformVisualizer
                  stream={mediaStreamRef.current}
                  isRecording={isRecording}
                  showDetails={true}
                />
              </div>
            )}

            {/* Pulsing REC Indicator & Visual Timer Overlay when Recording */}
            {(isRecording || isGeneratingVideo) && (
              <>
                {/* Visual Progress Bar along top edge when Recording */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-slate-900/80 z-20 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-rose-600 transition-all duration-300 ease-linear shadow-lg"
                    style={{
                      width: `${Math.min(100, (recordingSecondsElapsed / Math.max(1, targetDuration)) * 100)}%`
                    }}
                  />
                </div>

                {/* Top-Left Pulsing REC Badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2.5">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 bg-rose-950/90 border-2 border-rose-500/80 rounded-full text-white shadow-2xl backdrop-blur-md">
                    <div className="relative flex items-center justify-center w-3 h-3">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </div>
                    <span className="text-xs font-mono font-black tracking-widest text-rose-100 uppercase">REC</span>
                    <span className="text-slate-500 font-mono text-xs">|</span>
                    <span className="text-xs font-mono font-bold text-white tracking-wider">
                      {formatTime(recordingSecondsElapsed)}
                    </span>
                    <span className="text-[10px] font-mono text-rose-300/80">
                      / {formatTime(targetDuration)}
                    </span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-full text-rose-300 text-[11px] font-mono backdrop-blur-md shadow-lg font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    <span>LIVE COMMERCIAL RECORDING</span>
                  </div>
                </div>

                {/* Top-Right Remaining Countdown Visual Timer */}
                <div className="absolute top-4 right-4 z-20 px-3.5 py-1.5 bg-slate-950/90 border border-rose-500/60 rounded-xl text-white font-mono text-xs backdrop-blur-md flex items-center gap-2 shadow-2xl">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">TIME LEFT:</span>
                  <span className="text-rose-300 font-extrabold text-sm tracking-widest">
                    {formatTime(Math.max(0, targetDuration - recordingSecondsElapsed))}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Separate Teleprompter Script Drawer (Placed Below Clean Video Viewport) */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-white space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-sans">
              <div className="flex items-center gap-2 font-bold text-indigo-400 font-mono">
                <FileText className="w-4 h-4" /> Teleprompter Script Scroll (Separate below video frame):
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span>Speed:</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scrollSpeed}
                    onChange={(e) => setScrollSpeed(Number(e.target.value))}
                    className="w-20 accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <Type className="w-3.5 h-3.5 text-slate-400" />
                  <span>Font ({fontSize}px):</span>
                  <input
                    type="range"
                    min="18"
                    max="48"
                    step="2"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-20 accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div
              ref={containerRef}
              className="h-44 overflow-y-auto p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 font-sans font-bold leading-relaxed shadow-inner"
              style={{ fontSize: `${fontSize}px` }}
            >
              <div className="space-y-4">
                {scriptText.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="tracking-wide text-indigo-100">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: WATCH COMMERCIAL (Finished Product Commercial Preview & Player) */}
      {activeStep === 3 && !isTheater && (
        <div className="space-y-6 animate-fadeIn">
          {recordedVideoUrl ? (
            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-5 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40">
                    <Tv className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-sans text-white">Your Finished Commercial Product</h3>
                    <p className="text-xs text-slate-400 font-mono">Recorded with {activeBg.name} virtual backdrop &amp; overlays</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={recordedVideoUrl}
                    download="zynads_finished_commercial.webm"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download Video Commercial (.webm)
                  </a>
                </div>
              </div>

              {/* HD Video Player */}
              <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500/60 bg-slate-950 shadow-2xl relative group">
                <video 
                  src={recordedVideoUrl} 
                  controls 
                  playsInline
                  autoPlay
                  preload="auto"
                  className="w-full h-auto aspect-video object-contain bg-black" 
                />
              </div>

              {/* Commercial Summary Specs Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Commercial Script</span>
                  <strong className="text-indigo-300 truncate block">
                    {PRESET_SCRIPTS.find(s => s.id === selectedScriptId)?.title || 'Custom Script'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Virtual Studio Backdrop</span>
                  <strong className="text-emerald-300 truncate block">{activeBg.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Presenter & Offer</span>
                  <strong className="text-amber-300 truncate block">{speakerName}</strong>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Re-Record / Generate Another Commercial
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <Check className="w-4 h-4" /> Synced with ZynAds Workspace
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* No Video Recorded Yet Empty State */
            <div className="p-10 bg-slate-900 rounded-2xl border border-slate-800 text-center text-white space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto text-2xl shadow-inner">
                🎬
              </div>
              <div>
                <h3 className="text-lg font-bold font-sans">No Commercial Video Recorded Yet</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                  Click below to record your live webcam or auto-generate an AI commercial video in seconds!
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={generateAICommercialVideo}
                  disabled={isGeneratingVideo}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" /> ✨ Auto-Generate {targetDuration}s AI Commercial
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" /> Record Live Camera Commercial ({targetDuration}s)
                </button>
              </div>
            </div>
          )}
        </div>
      )}
        </>
      )}
    </div>
  );
}
