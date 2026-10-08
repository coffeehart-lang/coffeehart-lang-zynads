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
  Layers, 
  Film, 
  Wand2, 
  Check, 
  Upload, 
  Music, 
  FileVideo,
  Radio,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Flame,
  LayoutTemplate,
  Sliders,
  DollarSign,
  Activity,
  Cpu
} from 'lucide-react';

export type VisualSceneType = 'cockpit' | 'comparison' | 'ai-core' | 'cta-endcard';

export interface CommercialScene {
  id: string;
  title: string;
  durationSec: number;
  visualType: VisualSceneType;
  headline: string;
  subheadline: string;
  badgeText: string;
  voiceoverScript: string;
  accentColor: string; // hex
  customMediaUrl?: string; // uploaded video or image
}

export interface CommercialCampaignTemplate {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  scenes: CommercialScene[];
}

const CAMPAIGN_TEMPLATES: CommercialCampaignTemplate[] = [
  {
    id: 'cash-crunch',
    name: '🚨 The Surprise Cash Crunch (High Urgency)',
    description: 'Hooks founders on the fear of surprise cash shortfalls and shows instant runway clarity.',
    targetAudience: 'Startup Founders, Agency Owners, SMB Operators',
    scenes: [
      {
        id: 's1',
        title: 'Scene 1: The Cash Flow Shock',
        durationSec: 5,
        visualType: 'cockpit',
        headline: 'Still Guessing If You\'ll Make Payroll?',
        subheadline: 'Most businesses fail not from lack of sales, but running out of cash unexpectedly.',
        badgeText: '0-5s HOOK',
        voiceoverScript: 'Most businesses don\'t fail from lack of sales. They fail because they ran out of cash without seeing it coming.',
        accentColor: '#ef4444'
      },
      {
        id: 's2',
        title: 'Scene 2: QuickBooks vs Reality',
        durationSec: 5,
        visualType: 'comparison',
        headline: 'QuickBooks Shows the Past. We Predict the Future.',
        subheadline: 'Backward-looking spreadsheets leave you blind. Zyncast models your next 90 days.',
        badgeText: 'PROBLEM & CONTRAST',
        voiceoverScript: 'Traditional bookkeeping only tells you what happened last month. It doesn\'t forecast your next 90 days.',
        accentColor: '#f59e0b'
      },
      {
        id: 's3',
        title: 'Scene 3: Real-Time Runway AI',
        durationSec: 6,
        visualType: 'ai-core',
        headline: 'Your 24/7 Multi-Model AI Financial Analyst',
        subheadline: 'Simulate new hires, track burn rate, and test what-if scenarios in seconds.',
        badgeText: 'SOLUTION & INTELLIGENCE',
        voiceoverScript: 'Meet Zyncast CFO. Simulate new hires, predict your exact cash runway, and make confident financial decisions.',
        accentColor: '#10b981'
      },
      {
        id: 's4',
        title: 'Scene 4: Instant Activation CTA',
        durationSec: 5,
        visualType: 'cta-endcard',
        headline: 'Stop Flying Blind. Launch Zyncast CFO.',
        subheadline: 'Claim your 14-day free trial at zyncastcfo.com. No credit card required.',
        badgeText: 'START FREE TRIAL',
        voiceoverScript: 'Stop flying blind. Visit zyncastcfo.com today and claim your free trial.',
        accentColor: '#14b8a6'
      }
    ]
  },
  {
    id: 'fractional-cfo',
    name: '🏛️ Fractional CFO in Your Pocket (High Authority)',
    description: 'Positions Zyncast CFO as a $15,000/mo fractional CFO replacement at a fraction of the cost.',
    targetAudience: 'CEOs, Managing Directors, Bootstrapped Founders',
    scenes: [
      {
        id: 's1',
        title: 'Scene 1: The $15,000 Dilemma',
        durationSec: 5,
        visualType: 'comparison',
        headline: 'Fire the $15,000/mo Fractional CFO.',
        subheadline: 'Get enterprise-grade financial modeling and runway intelligence instantly.',
        badgeText: 'THE HIGH-VALUE HOOK',
        voiceoverScript: 'You don\'t need a fifteen thousand dollar a month fractional CFO to know if you can afford your next hire.',
        accentColor: '#06b6d4'
      },
      {
        id: 's2',
        title: 'Scene 2: Automated Ledger Sync',
        durationSec: 5,
        visualType: 'cockpit',
        headline: '8-Cycle AI Payroll & General Ledger Sync',
        subheadline: 'Direct QuickBooks integration turns static accounting entries into dynamic forecasts.',
        badgeText: 'LIVE INTEGRATION',
        voiceoverScript: 'Zyncast CFO connects directly to your ledger, automating payroll cycles and cash flow curves.',
        accentColor: '#10b981'
      },
      {
        id: 's3',
        title: 'Scene 3: What-If Scenario Modeler',
        durationSec: 5,
        visualType: 'ai-core',
        headline: 'Simulate Any Business Move Before Spending',
        subheadline: 'Double ad spend? Add 3 engineers? Model the cash impact before committing capital.',
        badgeText: 'SCENARIO MODELING',
        voiceoverScript: 'Model real-world scenarios before spending a single dollar. Watch your solvency runway adjust live.',
        accentColor: '#8b5cf6'
      },
      {
        id: 's4',
        title: 'Scene 4: Exclusive Founder Offer',
        durationSec: 5,
        visualType: 'cta-endcard',
        headline: 'Command Your Financial Future Today',
        subheadline: 'Instant 60-second setup. Visit zyncastcfo.com right now.',
        badgeText: 'CLAIM FREE TRIAL',
        voiceoverScript: 'Take control of your runway today. Start your free trial at zyncastcfo.com.',
        accentColor: '#10b981'
      }
    ]
  },
  {
    id: 'agency-growth',
    name: '📈 Agency & Client Retainer Forecaster',
    description: 'Geared towards marketing, design, and service agencies with fluctuating client retainers.',
    targetAudience: 'Agency Founders, Consultancies, Freelancers',
    scenes: [
      {
        id: 's1',
        title: 'Scene 1: Retainer Churn Nightmare',
        durationSec: 5,
        visualType: 'cockpit',
        headline: 'What If Your Biggest Client Cancels Tomorrow?',
        subheadline: 'Client churn can wipe out your runway before you even notice.',
        badgeText: 'AGENCY REALITY',
        voiceoverScript: 'What happens to your business if your biggest client pauses their retainer tomorrow?',
        accentColor: '#f43f5e'
      },
      {
        id: 's2',
        title: 'Scene 2: Predictive Solvency Shield',
        durationSec: 5,
        visualType: 'ai-core',
        headline: 'Stress-Test Your Client Retainers in Real-Time',
        subheadline: 'Know your exact break-even point and payroll safety threshold down to the dollar.',
        badgeText: 'PREDICTIVE SHIELD',
        voiceoverScript: 'Zyncast CFO stress-tests your revenue in real time so you always stay ahead of client churn.',
        accentColor: '#3b82f6'
      },
      {
        id: 's3',
        title: 'Scene 3: The Growth Cockpit',
        durationSec: 5,
        visualType: 'comparison',
        headline: 'Scale Confidently With Real Runway Data',
        subheadline: 'Plan hiring, contractor budgets, and office expansion with zero guesswork.',
        badgeText: 'GROWTH CONFIDENCE',
        voiceoverScript: 'Scale your team and expand operations with complete confidence in your cash runway.',
        accentColor: '#10b981'
      },
      {
        id: 's4',
        title: 'Scene 4: Final Call to Action',
        durationSec: 5,
        visualType: 'cta-endcard',
        headline: 'Build a Recession-Proof Agency at zyncastcfo.com',
        subheadline: 'Free trial • No credit card • Instant dashboard activation.',
        badgeText: 'START TODAY',
        voiceoverScript: 'Build a profitable, resilient business. Start your free trial at zyncastcfo.com today.',
        accentColor: '#14b8a6'
      }
    ]
  }
];

export default function ZynAdsVideoStudio() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('cash-crunch');
  const [scenes, setScenes] = useState<CommercialScene[]>(CAMPAIGN_TEMPLATES[0].scenes);
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  
  // Audio Controls
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [isMusicEnabled, setIsMusicEnabled] = useState<boolean>(true);
  const [voiceVolume, setVoiceVolume] = useState<number>(0.9);
  const [musicVolume, setMusicVolume] = useState<number>(0.25);
  
  // Export State
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportQuality, setExportQuality] = useState<'1080p' | '720p'>('1080p');
  const [notice, setNotice] = useState<string | null>(null);

  // References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const musicOscNodesRef = useRef<OscillatorNode[]>([]);
  const musicGainRef = useRef<GainNode | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const lastSpokenSceneIdxRef = useRef<number>(-1);

  // Calculate total duration
  const totalDuration = scenes.reduce((acc, s) => acc + s.durationSec, 0);

  // Find active scene and progress
  const getActiveSceneInfo = () => {
    let accumulated = 0;
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      if (playbackTime >= accumulated && playbackTime < accumulated + scene.durationSec) {
        const sceneLocalTime = playbackTime - accumulated;
        const progress = Math.min(1, Math.max(0, sceneLocalTime / scene.durationSec));
        return { scene, index: i, progress, localTime: sceneLocalTime };
      }
      accumulated += scene.durationSec;
    }
    const lastIdx = scenes.length - 1;
    return { scene: scenes[lastIdx], index: lastIdx, progress: 1, localTime: scenes[lastIdx].durationSec };
  };

  // Switch template
  const handleSelectTemplate = (templateId: string) => {
    const tmpl = CAMPAIGN_TEMPLATES.find(t => t.id === templateId);
    if (!tmpl) return;
    setSelectedTemplateId(templateId);
    setScenes(tmpl.scenes);
    setPlaybackTime(0);
    setIsPlaying(false);
    lastSpokenSceneIdxRef.current = -1;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setNotice(`Loaded commercial template: ${tmpl.name}`);
    setTimeout(() => setNotice(null), 3000);
  };

  // Play / Pause Toggle
  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopAudioMusic();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      if (playbackTime >= totalDuration) {
        setPlaybackTime(0);
        lastSpokenSceneIdxRef.current = -1;
      }
      setIsPlaying(true);
      startAudioMusic();
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPlaybackTime(0);
    lastSpokenSceneIdxRef.current = -1;
    stopAudioMusic();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  // Synthesize background corporate ambient synth music via Web Audio API
  const startAudioMusic = () => {
    if (!isMusicEnabled) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Stop existing if any
      stopAudioMusic();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(musicVolume * 0.15, ctx.currentTime);
      masterGain.connect(ctx.destination);
      musicGainRef.current = masterGain;

      // Chord progression frequencies (C minor / Ab / Bb / G)
      const chordSets = [
        [130.81, 155.56, 196.00], // C3, Eb3, G3
        [103.83, 130.81, 155.56], // Ab2, C3, Eb3
        [116.54, 146.83, 174.61], // Bb2, D3, F3
        [98.00, 123.47, 146.83]   // G2, B2, D3
      ];

      const oscs: OscillatorNode[] = [];
      const now = ctx.currentTime;

      // Create warm low-pass filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.connect(masterGain);

      // Play soft ambient drones
      chordSets[0].forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(filter);
        osc.start(now);
        oscs.push(osc);
      });

      musicOscNodesRef.current = oscs;
    } catch (e) {
      console.warn("Web Audio background music unavailable:", e);
    }
  };

  const stopAudioMusic = () => {
    try {
      musicOscNodesRef.current.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch {}
      });
      musicOscNodesRef.current = [];
    } catch {}
  };

  // Speak voiceover for scene
  const triggerVoiceoverForScene = (scene: CommercialScene, idx: number) => {
    if (!isAudioEnabled || !('speechSynthesis' in window)) return;
    if (lastSpokenSceneIdxRef.current === idx) return;

    lastSpokenSceneIdxRef.current = idx;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(scene.voiceoverScript);
    utterance.volume = voiceVolume;
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick best English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')) && v.lang.startsWith('en'));
    if (naturalVoice) utterance.voice = naturalVoice;

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Main playback loop
  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = null;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const step = (timestamp: number) => {
      if (lastTimestampRef.current !== null) {
        const delta = (timestamp - lastTimestampRef.current) / 1000;
        setPlaybackTime(prev => {
          const next = prev + delta;
          if (next >= totalDuration) {
            setIsPlaying(false);
            stopAudioMusic();
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            return totalDuration;
          }
          return next;
        });
      }
      lastTimestampRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, totalDuration]);

  // Sync scene changes & voiceover
  useEffect(() => {
    const { scene, index } = getActiveSceneInfo();
    setCurrentSceneIdx(index);
    if (isPlaying) {
      triggerVoiceoverForScene(scene, index);
    }
  }, [playbackTime, isPlaying]);

  // Canvas Drawing Engine (CINEMATIC, HIGH-END GRAPHICS ONLY)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const { scene, progress } = getActiveSceneInfo();

    // Clear
    ctx.clearRect(0, 0, width, height);

    // 1. Deep Modern Film Background Gradient
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height) * 0.8);
    bgGrad.addColorStop(0, '#0f172a'); // slate-900 center
    bgGrad.addColorStop(0.6, '#020617'); // slate-950
    bgGrad.addColorStop(1, '#000000'); // pure black edges
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Animated Ambient Glow Burst based on scene accent color
    const glowX = width * 0.5 + Math.sin(progress * Math.PI) * (width * 0.05);
    const glowY = height * 0.45;
    const radialGlow = ctx.createRadialGradient(glowX, glowY, 10, glowX, glowY, width * 0.45);
    radialGlow.addColorStop(0, `${scene.accentColor}25`); // 15% opacity accent
    radialGlow.addColorStop(0.5, 'rgba(15, 23, 42, 0.15)');
    radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGlow;
    ctx.beginPath();
    ctx.arc(glowX, glowY, width * 0.45, 0, Math.PI * 2);
    ctx.fill();

    // 3. Floating Light Particles (Cinematic Dust)
    const particleCount = 24;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let p = 0; p < particleCount; p++) {
      const px = (Math.sin(p * 99 + progress * 2) * 0.5 + 0.5) * width;
      const py = ((p * 45 + progress * 80) % height);
      const pSize = (p % 3) + 1;
      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Subtle Perspective Grid Lines (Depth)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    const gridStep = 45;
    for (let x = 0; x < width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // -------------------------------------------------------------
    // 5. RENDER THE SCENE-SPECIFIC VISUAL COMPONENT
    // -------------------------------------------------------------
    const visualBoxY = height * 0.12;
    const visualBoxHeight = height * 0.52;

    if (scene.visualType === 'cockpit') {
      // -------------------------------------------------------------
      // SCENE TYPE A: FINANCIAL COCKPIT & LIVE CHART
      // -------------------------------------------------------------
      const chartWidth = width * 0.82;
      const chartHeight = visualBoxHeight * 0.8;
      const chartX = (width - chartWidth) / 2;
      const chartY = visualBoxY + 15;

      // Frosted Glass Card Container
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(chartX, chartY, chartWidth, chartHeight, 16);
      ctx.fill();
      ctx.stroke();

      // Card Header
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillText('⚡ ZYNCAST CFO • LIVE SOLVENCY COCKPIT', chartX + 20, chartY + 28);

      // Status Badge
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('● GL & PAYROLL IN SYNC', chartX + chartWidth - 160, chartY + 28);

      // Mini KPI Row inside Card
      const kpiW = (chartWidth - 50) / 3;
      const kpis = [
        { label: 'CASH RUNWAY', value: '18.4 MONTHS', color: '#10b981' },
        { label: 'CASH VAULT', value: '$495,200', color: '#38bdf8' },
        { label: 'NET PROFIT', value: '+$142,800/MO', color: '#34d399' }
      ];

      kpis.forEach((kpi, ki) => {
        const kx = chartX + 15 + ki * (kpiW + 10);
        const ky = chartY + 45;
        ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.beginPath();
        ctx.roundRect(kx, ky, kpiW, 46, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(kpi.label, kx + 10, ky + 18);

        ctx.fillStyle = kpi.color;
        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.fillText(kpi.value, kx + 10, ky + 37);
      });

      // Animated Real-Time Cash Curve
      const lineStartY = chartY + chartHeight - 25;
      const linePoints = 12;
      const stepX = (chartWidth - 40) / (linePoints - 1);

      ctx.beginPath();
      for (let p = 0; p < linePoints; p++) {
        const px = chartX + 20 + p * stepX;
        // Growth curve with wave
        const py = lineStartY - (Math.pow(p / (linePoints - 1), 1.3) * 75) - Math.sin(p + progress * 6) * 6;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Glow Point at end of curve
      const endX = chartX + 20 + (linePoints - 1) * stepX;
      const endY = lineStartY - 75;
      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.arc(endX, endY, 5, 0, Math.PI * 2);
      ctx.fill();

    } else if (scene.visualType === 'comparison') {
      // -------------------------------------------------------------
      // SCENE TYPE B: SPLIT COMPARISON (PAST VS PREDICTION)
      // -------------------------------------------------------------
      const compWidth = width * 0.84;
      const compHeight = visualBoxHeight * 0.82;
      const startX = (width - compWidth) / 2;
      const startY = visualBoxY + 12;
      const halfW = (compWidth - 20) / 2;

      // Left: Legacy Bookkeeping (Red/Warning)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(startX, startY, halfW, compHeight, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('❌ TRADITIONAL BOOKKEEPING', startX + 16, startY + 28);

      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillText('Backward-Looking Only', startX + 16, startY + 54);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillText('• Tells you what happened last month', startX + 16, startY + 80);
      ctx.fillText('• Clunky static spreadsheets', startX + 16, startY + 102);
      ctx.fillText('• Zero runway warning system', startX + 16, startY + 124);

      // Warning Stamp
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.beginPath();
      ctx.roundRect(startX + 16, startY + compHeight - 38, halfW - 32, 26, 6);
      ctx.fill();
      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('⚠️ SURPRISE CASH CRUNCH RISK', startX + 24, startY + compHeight - 21);

      // Right: Zyncast CFO (Emerald/Predictive)
      const rightX = startX + halfW + 20;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.beginPath();
      ctx.roundRect(rightX, startY, halfW, compHeight, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('✅ ZYNCAST CFO ENGINE', rightX + 16, startY + 28);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillText('Forward 90-Day Forecast', rightX + 16, startY + 54);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillText('• Real-time "What-If" scenario modeler', rightX + 16, startY + 80);
      ctx.fillText('• 8-Cycle AI payroll & ledger sync', rightX + 16, startY + 102);
      ctx.fillText('• Multi-model AI financial intelligence', rightX + 16, startY + 124);

      // Solvency Badge
      ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.beginPath();
      ctx.roundRect(rightX + 16, startY + compHeight - 38, halfW - 32, 26, 6);
      ctx.fill();
      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('🛡️ PREDICTIVE SOLVENCY SECURED', rightX + 24, startY + compHeight - 21);

    } else if (scene.visualType === 'ai-core') {
      // -------------------------------------------------------------
      // SCENE TYPE C: AI INTELLIGENCE CORE & ORBITAL RINGS
      // -------------------------------------------------------------
      const coreX = width / 2;
      const coreY = visualBoxY + visualBoxHeight * 0.45;

      // Rotating Orbital Rings
      const ringRadius = 60 + Math.sin(progress * Math.PI * 4) * 5;
      
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(coreX, coreY, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(coreX, coreY, ringRadius * 1.35, ringRadius * 0.55, progress * Math.PI, 0, Math.PI * 2);
      ctx.stroke();

      // Glowing Center Core
      const coreGrad = ctx.createRadialGradient(coreX, coreY, 5, coreX, coreY, 40);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.4, '#10b981');
      coreGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, 40, 0, Math.PI * 2);
      ctx.fill();

      // Surrounding Floating Intelligence Badges
      const badges = [
        { text: '🧠 GEMINI 2.5 FLASH ANALYST', x: coreX - 180, y: coreY - 45 },
        { text: '📊 90-DAY CASH FORECASTER', x: coreX + 60, y: coreY - 45 },
        { text: '⚡ 8-CYCLE PAYROLL ENGINE', x: coreX - 170, y: coreY + 60 },
        { text: '🎯 12 WHAT-IF SCENARIOS', x: coreX + 70, y: coreY + 60 }
      ];

      badges.forEach(b => {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, 140, 24, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(b.text, b.x + 8, b.y + 16);
      });

    } else {
      // -------------------------------------------------------------
      // SCENE TYPE D: HIGH-CONVERTING 3D CTA ENDCARD
      // -------------------------------------------------------------
      const endX = width / 2;
      const endY = visualBoxY + visualBoxHeight * 0.42;

      // Glowing 3D Brand Badge
      const badgeW = 260;
      const badgeH = 56;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.roundRect(endX - badgeW / 2, endY - 60, badgeW, badgeH, 14);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ZyncastCFO', endX - 25, endY - 26);
      ctx.fillStyle = '#34d399';
      ctx.fillText('SUITE', endX + 65, endY - 26);

      // Pulsating High-CTR Action Button
      const pulseScale = 1 + Math.sin(progress * Math.PI * 3) * 0.03;
      const btnW = 240 * pulseScale;
      const btnH = 46 * pulseScale;
      
      const btnGrad = ctx.createLinearGradient(endX - btnW / 2, 0, endX + btnW / 2, 0);
      btnGrad.addColorStop(0, '#10b981');
      btnGrad.addColorStop(0.5, '#14b8a6');
      btnGrad.addColorStop(1, '#06b6d4');
      ctx.fillStyle = btnGrad;
      ctx.beginPath();
      ctx.roundRect(endX - btnW / 2, endY + 16, btnW, btnH, 23);
      ctx.fill();

      ctx.fillStyle = '#022c22';
      ctx.font = '900 14px system-ui, sans-serif';
      ctx.fillText('START FREE 14-DAY TRIAL', endX, endY + 44);

      // Domain Badge
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('👉 zyncastcfo.com', endX, endY + 84);
      ctx.textAlign = 'left';
    }

    // -------------------------------------------------------------
    // 6. KINETIC COMMERCIAL HEADLINES & ON-SCREEN TYPOGRAPHY
    // -------------------------------------------------------------
    const textStartY = height * 0.69;

    // Badge Pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = scene.accentColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(width * 0.1, textStartY, 140, 22, 11);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = scene.accentColor;
    ctx.font = 'bold 10px monospace';
    ctx.fillText(scene.badgeText, width * 0.1 + 14, textStartY + 15);

    // Primary Kinetic Headline (Big, Bold, Legible)
    ctx.fillStyle = '#ffffff';
    ctx.font = width > 700 ? '900 24px system-ui, sans-serif' : '900 18px system-ui, sans-serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 8;
    ctx.fillText(scene.headline, width * 0.1, textStartY + 48);
    ctx.shadowBlur = 0;

    // Subheadline / Key Benefit
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 13px system-ui, sans-serif';
    const subText = scene.subheadline.length > 85 ? scene.subheadline.substring(0, 82) + '...' : scene.subheadline;
    ctx.fillText(subText, width * 0.1, textStartY + 72);

    // -------------------------------------------------------------
    // 7. BROADCAST LOWER-THIRD / SPOKEN CAPTION RIBBON
    // -------------------------------------------------------------
    const ribbonH = 38;
    const ribbonY = height - ribbonH - 12;
    ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(width * 0.06, ribbonY, width * 0.88, ribbonH, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('🎙️ AUDIO:', width * 0.06 + 14, ribbonY + 23);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'italic 12px system-ui, sans-serif';
    const cleanSpeech = `"${scene.voiceoverScript}"`;
    const speechDisplay = cleanSpeech.length > 70 ? cleanSpeech.substring(0, 67) + '...' : cleanSpeech;
    ctx.fillText(speechDisplay, width * 0.06 + 82, ribbonY + 23);

  }, [playbackTime, scenes, aspectRatio, exportQuality]);

  // Export Real Video with Audio Track
  const handleExportCommercialVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    setExportProgress(5);
    setNotice("🎬 Recording broadcast commercial with audio...");

    try {
      recordedChunksRef.current = [];

      // 1. Capture Canvas 30fps Stream
      const canvasStream = canvas.captureStream(30);

      // 2. Set up Web Audio Stream Destination for Export Audio Track
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const dest = audioCtx.createMediaStreamDestination();

      // Add gentle synth background tone to destination stream
      const bgOsc = audioCtx.createOscillator();
      const bgGain = audioCtx.createGain();
      bgOsc.type = 'sine';
      bgOsc.frequency.setValueAtTime(130.81, audioCtx.currentTime); // C3
      bgGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      bgOsc.connect(bgGain);
      bgGain.connect(dest);
      bgOsc.start();

      // Combine video + audio streams
      const combinedTracks = [
        ...canvasStream.getVideoTracks(),
        ...dest.stream.getAudioTracks()
      ];
      const combinedStream = new MediaStream(combinedTracks);

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : 'video/webm';

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: exportQuality === '1080p' ? 12000000 : 6000000
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        try { bgOsc.stop(); audioCtx.close(); } catch {}

        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `ZyncastCFO-Commercial-${exportQuality}-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);

        setExportProgress(100);
        setIsExporting(false);
        setNotice("🎉 Real Commercial Video Exported Successfully!");
        setTimeout(() => setNotice(null), 5000);
      };

      // Rewind and start playback recording
      setPlaybackTime(0);
      lastSpokenSceneIdxRef.current = -1;
      setIsPlaying(true);
      mediaRecorder.start();

      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.round(100 / (totalDuration * 2));
        });
      }, 500);

      // Stop at end of total duration
      setTimeout(() => {
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
          setIsPlaying(false);
        }
        clearInterval(progressInterval);
      }, totalDuration * 1000 + 400);

    } catch (err: any) {
      console.error("Export error:", err);
      setIsExporting(false);
      setNotice(`Export error: ${err.message || 'MediaRecorder failed'}`);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner Notice */}
      {notice && (
        <div className="p-3.5 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            {notice}
          </span>
          <button onClick={() => setNotice(null)} className="text-emerald-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-950 text-teal-400 border border-teal-800/80 uppercase">
                ZYNADS VIDEO STUDIO PRO
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Cinematic Motion Graphics & Video Commercial Generator
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <Film className="w-7 h-7 text-teal-400" />
              Zyncast CFO Commercial Video Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Produce broadcast-ready video commercials with animated financial cockpits, live Solvency Runway curves, and synchronized audio narration.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCommercialVideo}
              disabled={isExporting}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                isExporting
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-600 text-slate-950 hover:brightness-110 shadow-teal-500/20 active:scale-95'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? `Rendering (${exportProgress}%)` : 'Export Commercial (WebM)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Video Preview & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
            
            {/* Aspect Ratio & Format Controls */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Aspect Ratio:</span>
                {(['16:9', '9:16', '1:1'] as const).map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      aspectRatio === ratio
                        ? 'bg-teal-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {ratio === '16:9' ? '16:9 (YouTube/Web)' : ratio === '9:16' ? '9:16 (TikTok/Reels)' : '1:1 (Square)'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">Quality:</span>
                <select
                  value={exportQuality}
                  onChange={(e) => setExportQuality(e.target.value as any)}
                  className="bg-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1 border border-slate-700"
                >
                  <option value="1080p">1080p Full HD</option>
                  <option value="720p">720p HD</option>
                </select>
              </div>
            </div>

            {/* Canvas Video Viewport */}
            <div className="relative bg-black rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 min-h-[380px]">
              <canvas
                ref={canvasRef}
                width={aspectRatio === '9:16' ? 720 : aspectRatio === '1:1' ? 720 : 1280}
                height={aspectRatio === '9:16' ? 1280 : aspectRatio === '1:1' ? 720 : 720}
                className={`w-full max-h-[460px] object-contain transition-all duration-200 ${
                  aspectRatio === '9:16' ? 'aspect-[9/16]' : aspectRatio === '1:1' ? 'aspect-square' : 'aspect-video'
                }`}
              />

              {/* Play Overlay if paused */}
              {!isPlaying && (
                <div 
                  onClick={togglePlayPause}
                  className="absolute inset-0 bg-black/40 hover:bg-black/30 flex items-center justify-center cursor-pointer transition-all group"
                >
                  <div className="p-4 bg-teal-500/90 text-slate-950 rounded-full shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-slate-950" />
                  </div>
                </div>
              )}
            </div>

            {/* Playback Controls & Timeline Scrubber */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{playbackTime.toFixed(1)}s / {totalDuration}s</span>
                <span className="text-teal-400 font-bold">
                  Scene {currentSceneIdx + 1} of {scenes.length}: {scenes[currentSceneIdx]?.title}
                </span>
              </div>

              {/* Scrubber Bar */}
              <input
                type="range"
                min={0}
                max={totalDuration}
                step={0.1}
                value={playbackTime}
                onChange={(e) => {
                  setPlaybackTime(parseFloat(e.target.value));
                  lastSpokenSceneIdxRef.current = -1;
                }}
                className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />

              {/* Buttons Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlayPause}
                    className="p-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold flex items-center gap-1.5 text-xs transition-all cursor-pointer shadow-md"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlaying ? 'Pause' : 'Play Commercial'}</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restart</span>
                  </button>
                </div>

                {/* Audio Toggles */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isAudioEnabled ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/60' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Voiceover: {isAudioEnabled ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => setIsMusicEnabled(!isMusicEnabled)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isMusicEnabled ? 'bg-teal-950 text-teal-300 border border-teal-700/60' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>Soundtrack: {isMusicEnabled ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Template Selector & Scene Editor (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Template Preset Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 font-mono flex items-center gap-1.5">
              <LayoutTemplate className="w-3.5 h-3.5" />
              Proven Commercial Campaign Presets
            </h3>
            
            <div className="space-y-2">
              {CAMPAIGN_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTemplateId === tmpl.id
                      ? 'bg-teal-950/50 border-teal-500 shadow-md ring-1 ring-teal-500'
                      : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{tmpl.name}</span>
                    {selectedTemplateId === tmpl.id && (
                      <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-950 px-1.5 py-0.5 rounded border border-teal-700">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{tmpl.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scene Breakdown Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-400" />
                Commercial Scenes ({scenes.length})
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Total: {totalDuration}s</span>
            </div>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {scenes.map((scene, idx) => (
                <div
                  key={scene.id}
                  onClick={() => {
                    let acc = 0;
                    for (let i = 0; i < idx; i++) acc += scenes[i].durationSec;
                    setPlaybackTime(acc);
                    setCurrentSceneIdx(idx);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    currentSceneIdx === idx
                      ? 'bg-slate-800 border-teal-500 shadow-md ring-1 ring-teal-500'
                      : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-mono flex items-center justify-center text-teal-400 border border-teal-800">
                        {idx + 1}
                      </span>
                      {scene.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{scene.durationSec}s</span>
                  </div>

                  <p className="text-xs font-bold text-teal-300">{scene.headline}</p>
                  <p className="text-[11px] text-slate-400 italic mt-1 leading-snug">
                    "{scene.voiceoverScript}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
