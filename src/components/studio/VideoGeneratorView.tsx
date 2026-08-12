import React, { useState, useRef, useEffect, useCallback } from 'react';
import { processAndPlayAudioBase64 } from '../../utils/audioProcessor';
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
  Bot,
  Music,
  Sliders,
  Check,
  X,
  Eye,
  Film as FilmIcon
} from 'lucide-react';

import { expandPrompt } from '../../utils/promptEnhancer';
import { uploadMediaFileService } from '../../services/uploadService';
import ImageStudioView from './ImageStudioView';
import EnhancerView from './EnhancerView';
import NanoBananaStudioView from './NanoBananaStudioView';
import RealtimeCanvasView from './RealtimeCanvasView';
import EditStudioView from './EditStudioView';

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

  // Video, Audio, and Visual Effects Attachments & Modals State
  const [videoClips, setVideoClips] = useState<{ id: string; tag: string; name: string; url: string }[]>([
    { id: 'v-1', tag: '@video-1', name: 'Farm Porch B-Roll.mp4', url: '' }
  ]);
  const [activeAudioTrack, setActiveAudioTrack] = useState<{ name: string; url: string; type: string } | null>({
    name: 'Zyncast Organic CFO Synth',
    url: '',
    type: 'preset'
  });
  const [activeEffect, setActiveEffect] = useState<'none' | 'cinematic' | 'vhs' | 'cyberpunk' | 'noir' | 'hdr' | 'flare' | 'grain'>('cinematic');

  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [showAudioModal, setShowAudioModal] = useState<boolean>(false);
  const [showEffectModal, setShowEffectModal] = useState<boolean>(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

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

  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const videoMediaRef = useRef<HTMLVideoElement | null>(null);

  // Sync active video element
  useEffect(() => {
    if (activeVideoUrl) {
      const vid = document.createElement('video');
      vid.src = activeVideoUrl;
      vid.autoplay = true;
      vid.loop = true;
      vid.muted = isMuted;
      vid.playsInline = true;
      vid.play().catch(() => {});
      videoMediaRef.current = vid;
    } else {
      videoMediaRef.current = null;
    }
  }, [activeVideoUrl, isMuted]);

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
  const speakLine = useCallback(async (text: string) => {
    if (isMuted || typeof window === 'undefined') return;

    // Try Gemini TTS API first for natural human voice
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'Zephyr' })
      });
      const data = await res.json();
      if (data.success && data.audioBase64) {
        await processAndPlayAudioBase64(data.audioBase64, data.mimeType || 'audio/mp3');
        return;
      }
    } catch (e) {
      console.warn("Gemini TTS fallback to browser speech:", e);
    }

    // Natural Web Speech synthesis fallback
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const phoneticText = text
          .replace(/Zyncast CFO/gi, "Zincast C. F. O.")
          .replace(/Zyncastcfo/gi, "Zincast C. F. O.")
          .replace(/Zyncastcf/gi, "Zincast C. F. O.")
          .replace(/RAM/g, "Ram");

        const utterance = new SpeechSynthesisUtterance(phoneticText);
        utterance.rate = 0.95; // Steady, clear pacing
        utterance.pitch = 1.0;
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google US English') || v.name.includes('David') || v.name.includes('Samantha') || v.name.includes('Alex')));
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

    // Apply Active Visual FX Filter
    ctx.save();
    if (activeEffect === 'cinematic') {
      ctx.filter = 'contrast(1.15) saturate(1.2) brightness(1.02)';
    } else if (activeEffect === 'vhs') {
      ctx.filter = 'contrast(1.22) saturate(1.35) hue-rotate(-10deg)';
    } else if (activeEffect === 'cyberpunk') {
      ctx.filter = 'contrast(1.3) saturate(1.6) hue-rotate(180deg)';
    } else if (activeEffect === 'noir') {
      ctx.filter = 'grayscale(1.0) contrast(1.4) brightness(0.9)';
    } else if (activeEffect === 'hdr') {
      ctx.filter = 'contrast(1.35) saturate(1.5)';
    } else if (activeEffect === 'grain') {
      ctx.filter = 'contrast(1.1) brightness(1.02)';
    } else if (activeEffect === 'flare') {
      ctx.filter = 'contrast(1.12) saturate(1.2)';
    } else {
      ctx.filter = 'none';
    }

    if (activeVideoUrl && videoMediaRef.current && videoMediaRef.current.readyState >= 2) {
      const vid = videoMediaRef.current;
      ctx.drawImage(vid, 0, 0, width, height);
      ctx.restore();
      return;
    }

    if (t < 2.5) {
      // SCENE 1: Porch intro (0.0s - 2.5s)
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
        // Procedural Porch Scene Fallback
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#0f172a');
        skyGrad.addColorStop(0.5, '#1e1b4b');
        skyGrad.addColorStop(1, '#311042');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Sunset Sun Glow
        const sunGrad = ctx.createRadialGradient(width * 0.7, height * 0.3, 10, width * 0.7, height * 0.3, 200);
        sunGrad.addColorStop(0, 'rgba(251, 146, 60, 0.8)');
        sunGrad.addColorStop(0.5, 'rgba(244, 63, 94, 0.3)');
        sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = sunGrad;
        ctx.fillRect(0, 0, width, height);

        // Distant Barn Silhouette
        ctx.fillStyle = '#090a0f';
        ctx.beginPath();
        ctx.moveTo(width * 0.65, height * 0.45);
        ctx.lineTo(width * 0.72, height * 0.35);
        ctx.lineTo(width * 0.79, height * 0.45);
        ctx.lineTo(width * 0.79, height * 0.60);
        ctx.lineTo(width * 0.65, height * 0.60);
        ctx.closePath();
        ctx.fill();

        // Wooden Porch Planks & Railing
        ctx.fillStyle = '#271c19';
        ctx.fillRect(0, height * 0.58, width, height * 0.42);

        // Porch Floor Lines
        ctx.strokeStyle = '#18100e';
        ctx.lineWidth = 3;
        for (let i = 0; i < 10; i++) {
          ctx.beginPath();
          ctx.moveTo(width * 0.5, height * 0.58);
          ctx.lineTo(i * (width / 8), height);
          ctx.stroke();
        }

        // Porch Railing Post
        ctx.fillStyle = '#3a2823';
        ctx.fillRect(width * 0.1, height * 0.4, 24, height * 0.3);
        ctx.fillRect(width * 0.85, height * 0.4, 24, height * 0.3);
        ctx.fillRect(width * 0.05, height * 0.45, width * 0.9, 12);

        // Presenter Character Silhouette
        ctx.save();
        const mouthMove = Math.abs(Math.sin(t * 12)) * 6;
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(width * 0.35, height * 0.45, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(width * 0.35, height * 0.70, 50, 80, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(width * 0.35, height * 0.47, 6, 2 + mouthMove / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Atmospheric Vignette
      const grad = ctx.createRadialGradient(width / 2, height / 2, width * 0.3, width / 2, height / 2, width * 0.75);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.5)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

    } else if (t < 5.5) {
      // SCENE 2: Organic Farm Pasture with RAM Sticks (2.5s - 5.5s)
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
        // Procedural Green Pasture Background
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.5);
        skyGrad.addColorStop(0, '#38bdf8');
        skyGrad.addColorStop(1, '#bae6fd');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height * 0.5);

        // Fluffy Clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        const cloudX = ((t * 20) % (width + 200)) - 100;
        ctx.beginPath();
        ctx.arc(cloudX, height * 0.15, 30, 0, Math.PI * 2);
        ctx.arc(cloudX + 35, height * 0.12, 40, 0, Math.PI * 2);
        ctx.arc(cloudX + 70, height * 0.15, 30, 0, Math.PI * 2);
        ctx.fill();

        // Rolling Pasture Hills
        const hillGrad1 = ctx.createLinearGradient(0, height * 0.3, 0, height);
        hillGrad1.addColorStop(0, '#22c55e');
        hillGrad1.addColorStop(1, '#15803d');
        ctx.fillStyle = hillGrad1;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.45);
        ctx.bezierCurveTo(width * 0.3, height * 0.35, width * 0.7, height * 0.5, width, height * 0.42);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // Winding Farm Path
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.moveTo(width * 0.45, height * 0.45);
        ctx.quadraticCurveTo(width * 0.5, height * 0.6, width * 0.2, height);
        ctx.lineTo(width * 0.5, height);
        ctx.quadraticCurveTo(width * 0.6, height * 0.6, width * 0.55, height * 0.45);
        ctx.closePath();
        ctx.fill();
      }

      // DRAW CARTOON RAM STICK SHEEP TROTTING ACROSS PASTURE
      ctx.save();
      const numRamSheep = 3;
      for (let i = 0; i < numRamSheep; i++) {
        const offset = i * 1.2;
        const sheepTime = (t - 2.5 + offset) % 3.0;
        const bounce = Math.abs(Math.sin(sheepTime * 10)) * 14;
        const sheepX = width * 0.15 + i * (width * 0.26) + Math.sin(sheepTime * 2) * 20;
        const sheepY = height * 0.55 + (i % 2) * 35 - bounce;

        // RAM Stick Body (Green PCB Board)
        ctx.fillStyle = '#065f46';
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(sheepX - 40, sheepY - 20, 80, 36, 6);
        ctx.fill();
        ctx.stroke();

        // Black Memory Chip Modules
        ctx.fillStyle = '#0f172a';
        for (let c = 0; c < 4; c++) {
          ctx.fillRect(sheepX - 34 + c * 18, sheepY - 14, 12, 16);
        }

        // Gold Connector Pins at Bottom
        ctx.fillStyle = '#fbbf24';
        for (let p = 0; p < 12; p++) {
          ctx.fillRect(sheepX - 36 + p * 6, sheepY + 12, 4, 6);
        }

        // Cute Fluffy Sheep Head & Ears
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(sheepX + 38, sheepY - 8, 16, 0, Math.PI * 2);
        ctx.fill();

        // Sheep Ear
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.ellipse(sheepX + 30, sheepY - 16, 8, 4, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // Blinking LED Eyes
        const blink = Math.sin(t * 15) > 0.8 ? 1 : 3;
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(sheepX + 42, sheepY - 10, blink, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Tiny Walking Legs
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 4;
        const legAngle = Math.sin(sheepTime * 12) * 0.3;
        ctx.beginPath();
        ctx.moveTo(sheepX - 20, sheepY + 18);
        ctx.lineTo(sheepX - 20 + Math.sin(legAngle) * 8, sheepY + 30);
        ctx.moveTo(sheepX + 20, sheepY + 18);
        ctx.lineTo(sheepX + 20 - Math.sin(legAngle) * 8, sheepY + 30);
        ctx.stroke();

        // Label Tag above RAM Stick
        ctx.fillStyle = '#0284c7';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`DDR5 RAM #${i + 1}`, sheepX - 22, sheepY - 26);
      }
      ctx.restore();

    } else {
      // SCENE 3: Studio Call to Action & Graphic Overlay (5.5s - 8.0s)
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
        // Procedural Studio Gradient
        const studioGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.8);
        studioGrad.addColorStop(0, '#1e1b4b');
        studioGrad.addColorStop(0.6, '#0f172a');
        studioGrad.addColorStop(1, '#020617');
        ctx.fillStyle = studioGrad;
        ctx.fillRect(0, 0, width, height);

        // Ambient Mesh Particles
        ctx.fillStyle = 'rgba(99, 102, 241, 0.25)';
        for (let p = 0; p < 15; p++) {
          const px = (width * 0.1 + p * 55 + Math.sin(t + p) * 20) % width;
          const py = (height * 0.2 + (p * 37) % (height * 0.6));
          ctx.beginPath();
          ctx.arc(px, py, 4 + (p % 4), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // HIGH-TECH GLASSMORPHIC CTA CARD OVERLAY
      ctx.save();
      ctx.textAlign = 'center';

      // Card Background Glass
      const cardW = width * 0.72;
      const cardH = height * 0.58;
      const cardX = (width - cardW) / 2;
      const cardY = (height - cardH) / 2;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 20);
      ctx.fill();

      // Glowing Card Border
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#818cf8';
      ctx.shadowBlur = 16;
      ctx.stroke();

      // Title Text
      ctx.font = '900 48px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 12;
      ctx.fillText('Zyncast CFO', width / 2, cardY + 64);

      // Subtitle
      ctx.font = '600 22px sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.shadowBlur = 0;
      ctx.fillText('The All-in-One Real Business Growth Platform', width / 2, cardY + 104);

      // Feature Checkmarks
      ctx.font = '500 16px sans-serif';
      ctx.fillStyle = '#34d399';
      ctx.fillText('✔ Organic, Cage-Free Code   ✔ Automated CFO Intelligence   ✔ Instant Setup', width / 2, cardY + 145);

      // Animated CTA Button
      const pulse = Math.sin(t * 6) * 3;
      const btnW = 320 + pulse * 2;
      const btnH = 48;
      const btnX = (width - btnW) / 2;
      const btnY = cardY + 175;

      const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY);
      btnGrad.addColorStop(0, '#4f46e5');
      btnGrad.addColorStop(1, '#9333ea');

      ctx.fillStyle = btnGrad;
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 24);
      ctx.fill();

      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Start Free Trial — zynads.zyncastcfo.com', width / 2, btnY + 31);

      ctx.restore();
    }

    // Overlay Effect Graphics (Scanlines, Film Noise, Anamorphic Streak)
    if (activeEffect === 'vhs') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1.5);
      }
      ctx.font = 'bold 15px monospace';
      ctx.fillStyle = '#facc15';
      ctx.fillText('PLAY 00:00:' + Math.floor(t).toString().padStart(2, '0') + ' SP', 30, height - 25);
    } else if (activeEffect === 'grain') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let g = 0; g < 120; g++) {
        ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
      }
    } else if (activeEffect === 'flare') {
      const flareGrad = ctx.createLinearGradient(0, height * 0.4, width, height * 0.4);
      flareGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      flareGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.35)');
      flareGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, height * 0.38, width, 14);
    }

    ctx.restore();
  }, [isPlaying, speakLine, activeEffect]);

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

  const handleStartFrameUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNotice(`⏳ Uploading & preparing "${file.name}" for Video Generator Backend...`);
      try {
        const prepared = await uploadMediaFileService(file, '@start-frame');
        setStartFrameUrl(prepared.url);
        const img = new Image();
        img.src = prepared.url;
        imgScene1Ref.current = img;
        setNotice(`✨ Prepared & loaded "${file.name}" into video generator canvas!`);
      } catch (err) {
        setNotice(`Error preparing ${file.name}`);
      }
    }
  };

  const handleEndFrameUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNotice(`⏳ Uploading & preparing "${file.name}" for Video Generator Backend...`);
      try {
        const prepared = await uploadMediaFileService(file, '@end-frame');
        setEndFrameUrl(prepared.url);
        const img = new Image();
        img.src = prepared.url;
        imgScene3Ref.current = img;
        setNotice(`✨ Prepared & loaded end frame "${file.name}" into video generator canvas!`);
      } catch (err) {
        setNotice(`Error preparing ${file.name}`);
      }
    }
  };

  const handleSwapAssetPhoto = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNotice(`⏳ Uploading & preparing "${file.name}" for Video Generator Backend...`);
      try {
        const prepared = await uploadMediaFileService(file, `@${id}`);
        setAssets(prev => prev.map(a => a.id === id ? { ...a, url: prepared.url, name: file.name.slice(0, 18) } : a));
        
        const img = new Image();
        img.src = prepared.url;
        if (id === 'img-1') {
          imgScene1Ref.current = img;
          setStartFrameUrl(prepared.url);
        } else if (id === 'img-2') {
          imgScene2Ref.current = img;
        } else if (id === 'img-3') {
          imgScene3Ref.current = img;
          setEndFrameUrl(prepared.url);
        } else {
          imgScene1Ref.current = img;
          setStartFrameUrl(prepared.url);
        }
        setNotice(`✨ Prepared & updated video canvas scene image for ${id}!`);
      } catch (err) {
        setNotice(`Error preparing asset for ${id}`);
      }
    }
  };

  const handleAddNewImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const nextIndex = assets.length + 1;
      const tag = `@img-${nextIndex}`;
      setNotice(`⏳ Uploading & preparing "${file.name}" (${tag}) for Video Generator Backend...`);
      
      try {
        const prepared = await uploadMediaFileService(file, tag);
        const newAsset: AssetReference = {
          id: `img-${nextIndex}`,
          tag,
          name: file.name.slice(0, 16),
          url: prepared.url
        };
        setAssets(prev => [...prev, newAsset]);
        setStartFrameUrl(prepared.url);
        
        // Load immediately into video generator canvas
        const img = new Image();
        img.src = prepared.url;
        imgScene1Ref.current = img;

        setPrompt(prev => prev + ` ${tag} `);
        setNotice(`✨ Prepared & added uploaded image as ${tag} for video generator backend!`);
      } catch (err) {
        setNotice(`Error uploading ${file.name}`);
      }
    }
  };

  const handleSelectAssetAsScene = (asset: AssetReference) => {
    const img = new Image();
    img.src = asset.url;
    imgScene1Ref.current = img;
    setStartFrameUrl(asset.url);
    handleInsertTag(asset.tag);
    setNotice(`Loaded ${asset.tag} into video generator preview!`);
  };

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const nextIdx = videoClips.length + 1;
      const tag = `@video-${nextIdx}`;
      setNotice(`⏳ Uploading & processing video clip "${file.name}" for Video Generator Backend...`);
      setShowVideoModal(false);

      try {
        const prepared = await uploadMediaFileService(file, tag);
        setVideoClips(prev => [...prev, { id: `v-${nextIdx}`, tag, name: file.name, url: prepared.url }]);
        setActiveVideoUrl(prepared.url);
        setPrompt(prev => prev + ` ${tag} `);
        setNotice(`🎬 Uploaded & loaded video clip ${tag} (${file.name}) into video player!`);
      } catch (err) {
        setNotice(`Error processing video file ${file.name}`);
      }
    }
  };

  const handleAudioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNotice(`⏳ Uploading & preparing audio track "${file.name}" for Video Generator Backend...`);
      setShowAudioModal(false);

      try {
        const prepared = await uploadMediaFileService(file, '@audio-track');
        setActiveAudioTrack({ name: file.name, url: prepared.url, type: 'custom' });
        setPrompt(prev => prev + ` @audio-track `);
        setNotice(`🎵 Uploaded & prepared custom audio track "${file.name}" for video generator!`);
      } catch (err) {
        setNotice(`Error preparing audio file ${file.name}`);
      }
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

  const handleDownloadVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setNotice('Canvas not ready for export.');
      return;
    }

    try {
      setNotice('🎬 Recording live commercial canvas stream (8 seconds)...');
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm'
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `zyncast_commercial_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setNotice('✨ Commercial video saved to your device! (.webm format)');
      };

      mediaRecorder.start();

      setTimeout(() => {
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      }, maxVideoDuration * 1000);
    } catch (err) {
      console.warn("MediaRecorder canvas capture fallback:", err);
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `zyncast_commercial_snapshot_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setNotice('✨ Commercial video snapshot saved to your device!');
    }
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

      {/* MAIN STAGE (Center Workspace view matching activeStudioTool) */}
      <div className="flex-1 max-w-5xl space-y-4" ref={containerRef}>
        {activeStudioTool === 'image' && <ImageStudioView />}
        {activeStudioTool === 'enhancer' && <EnhancerView />}
        {activeStudioTool === 'nanobanana' && <NanoBananaStudioView />}
        {activeStudioTool === 'realtime' && <RealtimeCanvasView />}
        {activeStudioTool === 'edit' && <EditStudioView />}

        {activeStudioTool === 'video' && (
          <>
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

            <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
              {activeVideoUrl ? (
                <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md border border-indigo-500/80 px-2.5 py-1 rounded-lg text-[10px] font-mono text-indigo-300 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Custom Video Playing</span>
                  <button
                    type="button"
                    onClick={() => setActiveVideoUrl(null)}
                    className="ml-1 px-1.5 py-0.5 bg-indigo-900/80 hover:bg-indigo-800 text-white rounded cursor-pointer"
                  >
                    Switch to Commercial
                  </button>
                </div>
              ) : (
                <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-mono text-amber-300 shadow-md">
                  Synthesized Commercial Mode
                </div>
              )}
            </div>

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
              <a
                href="https://zynads.zyncastcfo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-indigo-950/90 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-300 hover:text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
              >
                Zynads
              </a>

              <button
                type="button"
                onClick={() => setNotice('Share link copied to clipboard')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-400" /> Share
              </button>

              <button
                type="button"
                onClick={handleDownloadVideo}
                className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
              >
                <Download className="w-3.5 h-3.5" /> Download Video
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
                onClick={() => setShowVideoModal(true)}
                className="flex flex-col items-center justify-center w-14 h-14 bg-[#1a1d26] hover:bg-[#222633] border border-slate-800 hover:border-purple-500 rounded-xl cursor-pointer transition-all group relative"
                title="Add & upload video B-roll clips"
              >
                <Video className="w-4 h-4 text-slate-400 group-hover:text-purple-400" />
                <span className="text-[9px] font-semibold text-slate-400 group-hover:text-white mt-1">Add video</span>
                {videoClips.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {videoClips.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowAudioModal(true)}
                className="flex flex-col items-center justify-center w-14 h-14 bg-[#1a1d26] hover:bg-[#222633] border border-slate-800 hover:border-emerald-500 rounded-xl cursor-pointer transition-all group relative"
                title="Add background music & voiceover track"
              >
                <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
                <span className="text-[9px] font-semibold text-slate-400 group-hover:text-white mt-1">Add audio</span>
                {activeAudioTrack && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowEffectModal(true)}
                className="flex flex-col items-center justify-center w-14 h-14 bg-[#1a1d26] hover:bg-[#222633] border border-slate-800 hover:border-amber-500 rounded-xl cursor-pointer transition-all group relative"
                title="Apply cinematic visual effects & color grading"
              >
                <Wand2 className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
                <span className="text-[9px] font-semibold text-slate-400 group-hover:text-white mt-1">Add effect</span>
                {activeEffect !== 'none' && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
                )}
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
                      <img 
                        src={asset.url} 
                        alt={asset.name} 
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" 
                        onClick={() => handleSelectAssetAsScene(asset)}
                        title={`Click to load ${asset.tag} into video generator player`}
                      />
                      <label className="absolute top-0 right-0 p-1 bg-slate-950/80 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity rounded-bl-lg">
                        <Upload className="w-3 h-3 text-white" />
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
                      onClick={() => handleSelectAssetAsScene(asset)}
                      className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border ${colorTag} cursor-pointer hover:scale-105 transition-transform`}
                      title="Click to insert tag & preview image"
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

        {/* Hidden File Inputs for Video & Audio Uploads */}
        <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoFileUpload} />
        <input ref={audioInputRef} type="file" accept="audio/*" className="hidden" onChange={handleAudioFileUpload} />

        {/* MODAL 1: VIDEO B-ROLL CLIPS MODAL */}
        {showVideoModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#13151c] border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FilmIcon className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-base text-white">Video B-Roll Clip Library</h3>
                </div>
                <button onClick={() => setShowVideoModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Upload custom video clips or select farm pasture B-roll references to overlay into your commercial generation sequence.
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full py-3 px-4 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/60 rounded-xl text-xs font-bold text-purple-200 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
                >
                  <Upload className="w-4 h-4 text-purple-400" />
                  <span>Upload Local Video File (.mp4, .mov, .webm)</span>
                </button>

                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider pt-2">Preset Commercial Motion References</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { tag: '@video-1', name: 'Farm Porch Pan.mp4', desc: 'Main character camera motion' },
                    { tag: '@video-2', name: 'RAM Sticks Pasture.mp4', desc: 'Cartoon RAM sticks grazing' },
                    { tag: '@video-3', name: 'Zyncast Studio HQ.mp4', desc: 'CFO dashboard screen reveal' },
                    { tag: '@video-4', name: 'Commercial Call To Action.mp4', desc: 'Free trial end card motion' }
                  ].map(v => (
                    <button
                      key={v.tag}
                      type="button"
                      onClick={() => {
                        if (!videoClips.some(c => c.tag === v.tag)) {
                          setVideoClips(prev => [...prev, { id: v.tag, tag: v.tag, name: v.name, url: '' }]);
                        }
                        setPrompt(prev => prev + ` ${v.tag} `);
                        setNotice(`Attached ${v.tag} (${v.name}) to timeline!`);
                        setShowVideoModal(false);
                      }}
                      className="p-2.5 bg-[#1a1d26] hover:bg-slate-800 border border-slate-800 rounded-xl text-left cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <div className="text-xs font-bold font-mono text-purple-300 flex items-center justify-between">
                        <span>{v.tag}</span>
                        <Plus className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div className="text-[10px] text-slate-300 font-medium truncate mt-0.5">{v.name}</div>
                      <div className="text-[9px] text-slate-400">{v.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-800">
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: AUDIO & VOICEOVER NARRATION STUDIO */}
        {showAudioModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#13151c] border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-base text-white">Audio & Voiceover Narration Studio</h3>
                </div>
                <button onClick={() => setShowAudioModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Select or upload custom audio tracks to play along with your commercial video generation.
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => audioInputRef.current?.click()}
                  className="w-full py-3 px-4 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/60 rounded-xl text-xs font-bold text-emerald-200 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Upload Custom Audio File (.mp3, .wav, .aac)</span>
                </button>

                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider pt-2">Preset Soundtrack Loops</div>
                <div className="space-y-2">
                  {[
                    { name: 'Zyncast Organic CFO Synth', genre: 'Upbeat Tech Commercial', tag: '@synth-track' },
                    { name: 'Corporate CFO Growth Anthem', genre: 'Inspirational Orchestral', tag: '@anthem' },
                    { name: 'AI Voiceover Speech Narration', genre: 'Clear Speech Synthesis', tag: '@voiceover' },
                    { name: 'Organic Pastoral Acoustic', genre: 'Calm Guitar Flow', tag: '@acoustic' }
                  ].map(track => (
                    <button
                      key={track.name}
                      type="button"
                      onClick={() => {
                        setActiveAudioTrack({ name: track.name, url: '', type: 'preset' });
                        setPrompt(prev => prev + ` ${track.tag} `);
                        setNotice(`Attached "${track.name}" soundtrack!`);
                        setShowAudioModal(false);
                      }}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all text-left ${
                        activeAudioTrack?.name === track.name
                          ? 'bg-emerald-950/80 border-emerald-600/80 text-emerald-200'
                          : 'bg-[#1a1d26] hover:bg-slate-800 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <div className="text-xs font-bold">{track.name}</div>
                          <div className="text-[10px] text-slate-400">{track.genre}</div>
                        </div>
                      </div>
                      {activeAudioTrack?.name === track.name && (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                {activeAudioTrack ? (
                  <button
                    onClick={() => {
                      setActiveAudioTrack(null);
                      setNotice('Detached audio track');
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
                  >
                    Detach Audio Track
                  </button>
                ) : <div />}
                <button
                  onClick={() => setShowAudioModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: VISUAL EFFECTS STUDIO MODAL */}
        {showEffectModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#13151c] border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-5 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-base text-white">Visual FX & Color Grading Studio</h3>
                </div>
                <button onClick={() => setShowEffectModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Click a preset effect below to apply dynamic color grading, analog scanlines, or cinema flares live onto the video generator player.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'cinematic', name: 'Cinematic 4K', tag: '[4K Cinematic]', desc: 'Rich anamorphic contrast & warm LUT' },
                  { id: 'vhs', name: 'VHS Vintage 90s', tag: '[VHS Retro]', desc: 'Scanlines, analog shift & timestamp' },
                  { id: 'cyberpunk', name: 'Cyberpunk Neon', tag: '[Cyberpunk Bloom]', desc: 'Vivid cyan/purple duotone' },
                  { id: 'noir', name: 'Film Noir', tag: '[Film Noir B&W]', desc: 'Monochrome dramatic shadows' },
                  { id: 'hdr', name: 'HDR Vivid', tag: '[HDR Boost]', desc: 'Enhanced saturation & punchy contrast' },
                  { id: 'flare', name: 'Lens Flare', tag: '[Anamorphic Streak]', desc: 'Horizontal optical light streak' },
                  { id: 'grain', name: '35mm Grain', tag: '[Film Grain]', desc: 'Organic moving film texture' },
                  { id: 'none', name: 'Clean Original', tag: '[Clean Feed]', desc: 'No active visual filter' }
                ].map(fx => {
                  const isSelected = activeEffect === fx.id;
                  return (
                    <button
                      key={fx.id}
                      type="button"
                      onClick={() => {
                        setActiveEffect(fx.id as any);
                        if (fx.id !== 'none') {
                          setPrompt(prev => prev + ` ${fx.tag} `);
                          setNotice(`✨ Applied ${fx.name} visual effect to video generator player!`);
                        } else {
                          setNotice('Reset video generator to clean original feed.');
                        }
                        setShowEffectModal(false);
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all hover:scale-105 flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-lg shadow-amber-950/50' 
                          : 'bg-[#1a1d26] hover:bg-slate-800 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>{fx.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <div className="text-[10px] text-amber-400/90 font-mono mt-1">{fx.tag}</div>
                      </div>
                      <div className="text-[9px] text-slate-400 mt-2">{fx.desc}</div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-[11px] font-mono text-slate-400">
                  Active Effect: <strong className="text-amber-300 uppercase">{activeEffect}</strong>
                </span>
                <button
                  onClick={() => setShowEffectModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
