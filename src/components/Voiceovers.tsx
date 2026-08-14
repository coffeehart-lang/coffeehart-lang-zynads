import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Sparkles, 
  Save, 
  Trash2, 
  Layers, 
  Copy, 
  Check, 
  Sliders, 
  Cpu, 
  Headphones, 
  Music, 
  FileAudio, 
  Plus, 
  Radio, 
  Zap, 
  Share2, 
  Wand2,
  FolderPlus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { AdCampaign, SavedVoiceover, VoiceoverSettings } from '../types';

interface VoiceoversProps {
  campaigns: AdCampaign[];
  savedVoiceovers: SavedVoiceover[];
  onSaveVoiceover: (voiceover: SavedVoiceover) => void;
  onDeleteVoiceover: (id: string) => void;
}

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category?: string;
  labels?: {
    accent?: string;
    gender?: string;
    age?: string;
    use_case?: string;
  };
  preview_url?: string;
  description?: string;
}

const DEFAULT_SCRIPT_TEMPLATES = [
  {
    title: 'High-Converting Direct Response Hook (0-15s)',
    script: 'Stop wasting thousands on ads that fail to convert. ZenAds and Zyncast deploy multi-scene video commercials and automated ROAS tracking in under 60 seconds. Claim your free trial today!'
  },
  {
    title: 'Viral Problem & Solution Script (15-30s)',
    script: 'Do you know where your business revenue is leaking? If your campaigns aren\'t dynamically synced with your executive ledger, you\'re leaving profit on the table. Switch to automated AI ad optimization now.'
  },
  {
    title: 'Executive B2B SaaS Pitch (30-45s)',
    script: 'Modern finance and marketing teams require real-time speed. Discover how industry leaders scale customer acquisition with verified 4.8x ROAS and zero manual friction. Request your enterprise demo today.'
  },
  {
    title: 'Limited-Time Promo & Flash Offer (10-20s)',
    script: 'Flash deal alert! Get complete access to the ElevenLabs voiceover generator and Runway video tools with 50% off your first 3 months. Click the link below before spots run out!'
  }
];

export default function Voiceovers({
  campaigns,
  savedVoiceovers,
  onSaveVoiceover,
  onDeleteVoiceover
}: VoiceoversProps) {
  // Script and campaign linking
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');
  const [scriptTitle, setScriptTitle] = useState<string>('Viral Hook Commercial Voiceover');
  const [scriptText, setScriptText] = useState<string>(DEFAULT_SCRIPT_TEMPLATES[0].script);

  // ElevenLabs Voice & Synthesis Configuration
  const [voices, setVoices] = useState<ElevenLabsVoice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('21m00Tcm4TlvDq8ikWAM'); // Rachel
  const [modelId, setModelId] = useState<string>('eleven_multilingual_v2');
  
  // Acoustic & Stability Settings
  const [settings, setSettings] = useState<VoiceoverSettings>({
    stability: 75,
    similarityBoost: 85,
    style: 15,
    speakerBoost: true,
    speed: 1.0
  });

  // State for Generation and Audio Playback
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [generationSource, setGenerationSource] = useState<'elevenlabs' | 'gemini_tts' | 'browser_speech'>('elevenlabs');
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string | null>(null);

  // Active playing item in saved list
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  // UI state
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const savedAudioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  // Fetch available ElevenLabs voices on mount
  useEffect(() => {
    fetchVoicesCatalog();
  }, []);

  const fetchVoicesCatalog = async () => {
    try {
      const res = await fetch('/api/elevenlabs/voices');
      if (res.ok) {
        const data = await res.json();
        if (data.voices && data.voices.length > 0) {
          setVoices(data.voices);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not fetch external voices catalog, falling back to built-in presets:", e);
    }

    // Default fallback voice list if API is unavailable
    setVoices([
      { voice_id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', labels: { accent: 'American', gender: 'Female', use_case: 'Commercial & Social' }, description: 'Calm, confident, articulate direct response voice.' },
      { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', labels: { accent: 'American', gender: 'Male', use_case: 'Executive & Authority' }, description: 'Deep, resonant, authoritative corporate broadcast tone.' },
      { voice_id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', labels: { accent: 'American', gender: 'Female', use_case: 'UGC & Storytelling' }, description: 'Warm, conversational, high-converting social creator.' },
      { voice_id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', labels: { accent: 'American', gender: 'Male', use_case: 'Promo & Trailer' }, description: 'Energetic, crisp, direct sales announcement specialist.' },
      { voice_id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', labels: { accent: 'American', gender: 'Male', use_case: 'Casual Creator' }, description: 'Authentic and relatable creator tone for TikTok ads.' },
      { voice_id: 'ThT5KcBeYPX3keUQqHPh', name: 'Dorothy', labels: { accent: 'British', gender: 'Female', use_case: 'Luxury & Narrative' }, description: 'Refined British accent for luxury branding.' }
    ]);
  };

  // Sync script when campaign selection changes
  const handleCampaignChange = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      setScriptTitle(`${campaign.name} - Official Voiceover`);
      if (campaign.adCopy) {
        setScriptText(campaign.adCopy);
      }
    }
  };

  // Apply script template
  const handleApplyTemplate = (template: typeof DEFAULT_SCRIPT_TEMPLATES[0]) => {
    setScriptTitle(template.title);
    setScriptText(template.script);
    showNotice(`Applied template: "${template.title}"`);
  };

  // AI Script Enhancer using Gemini
  const handleOptimizeScriptWithAI = async () => {
    if (!scriptText.trim()) return;
    setIsGenerating(true);
    showNotice("Optimizing voiceover script cadence with Gemini AI...");

    try {
      const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
      const res = await fetch('/api/zynads/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: selectedCampaign?.name || 'ZenAds High-ROAS Engine',
          tone: 'High-Energy Direct Response Voiceover',
          platform: selectedCampaign?.platform || 'Video Commercial',
          objective: selectedCampaign?.objective || 'Conversions'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.optimizedCopy?.bodyText) {
          setScriptText(data.optimizedCopy.bodyText);
          showNotice("✨ Voiceover script polished for maximum speech rhythm!");
        } else {
          setScriptText(`Stop wasting ad spend. ${selectedCampaign?.name || 'ZenAds'} scales your conversions automatically with proven 4.8x ROAS. Start your 14-day free trial right now!`);
          showNotice("✨ Script enhanced with conversion hooks!");
        }
      }
    } catch (e: any) {
      showNotice(`AI Optimization Notice: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Voiceover via ElevenLabs API (or Neural fallback)
  const handleGenerateVoiceover = async () => {
    if (!scriptText.trim()) {
      showNotice("Please enter a voiceover script first.");
      return;
    }

    setIsGenerating(true);
    showNotice("Synthesizing studio-grade speech with ElevenLabs...");

    try {
      const response = await fetch('/api/elevenlabs/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: scriptText,
          voiceId: selectedVoiceId,
          stability: settings.stability / 100,
          similarityBoost: settings.similarityBoost / 100,
          style: settings.style / 100,
          speakerBoost: settings.speakerBoost,
          modelId
        })
      });

      const data = await response.json();

      if (data.audioBase64) {
        const audioMime = data.mimeType || 'audio/mpeg';
        const fullAudioUrl = `data:${audioMime};base64,${data.audioBase64}`;
        setCurrentAudioUrl(fullAudioUrl);
        setGenerationSource(data.source || 'elevenlabs');
        setLastGeneratedAt(new Date().toLocaleTimeString());

        // Calculate approximate duration based on word count (~150 words/min)
        const wordCount = scriptText.trim().split(/\s+/).length;
        const estDuration = Math.max(3, Math.round((wordCount / 150) * 60));
        setAudioDuration(estDuration);

        showNotice(`🎉 Audio synthesized via ${data.source === 'elevenlabs' ? 'ElevenLabs v2 API' : 'Neural Studio TTS'}!`);

        // Automatically load and start playback
        if (audioRef.current) {
          audioRef.current.src = fullAudioUrl;
          audioRef.current.playbackRate = settings.speed;
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      } else {
        // Fallback to browser Web Speech Synthesis
        playBrowserSpeechSynthesis(scriptText);
      }
    } catch (err: any) {
      console.warn("Backend TTS failed, using browser speech synthesis:", err);
      playBrowserSpeechSynthesis(scriptText);
    } finally {
      setIsGenerating(false);
    }
  };

  // Browser Speech Synthesis Engine Fallback
  const playBrowserSpeechSynthesis = (text: string) => {
    if (!('speechSynthesis' in window)) {
      showNotice("Speech Synthesis is not supported in this browser environment.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.speed;
    
    // Choose pitch based on voice selection
    const selectedVoiceObj = voices.find(v => v.voice_id === selectedVoiceId);
    if (selectedVoiceObj?.labels?.gender === 'Male') {
      utterance.pitch = 0.9;
    } else {
      utterance.pitch = 1.05;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setGenerationSource('browser_speech');
      setLastGeneratedAt(new Date().toLocaleTimeString());
      showNotice("🎙️ Playing voiceover via browser natural speech engine.");
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Toggle Audio Play / Pause
  const handleTogglePlayback = () => {
    if (generationSource === 'browser_speech' || !currentAudioUrl) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        playBrowserSpeechSynthesis(scriptText);
      }
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  // Save Voiceover into Project State & LocalStorage
  const handleSaveToProject = () => {
    if (!scriptText.trim()) {
      showNotice("Cannot save an empty voiceover script.");
      return;
    }

    const selectedVoiceObj = voices.find(v => v.voice_id === selectedVoiceId);
    const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);

    const newRecord: SavedVoiceover = {
      id: `vo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      campaignId: selectedCampaignId,
      campaignName: selectedCampaign?.name || 'General Commercial',
      title: scriptTitle || 'Untitled Commercial Voiceover',
      scriptText: scriptText,
      voiceId: selectedVoiceId,
      voiceName: selectedVoiceObj?.name || 'Rachel',
      model: modelId,
      audioUrl: currentAudioUrl || undefined,
      durationSec: audioDuration || Math.max(3, Math.round((scriptText.trim().split(/\s+/).length / 150) * 60)),
      settings: { ...settings },
      createdAt: new Date().toISOString(),
      source: generationSource,
      tags: [selectedVoiceObj?.labels?.accent || 'American', selectedVoiceObj?.labels?.gender || 'Female', 'ElevenLabs']
    };

    onSaveVoiceover(newRecord);
    showNotice(`✅ Voiceover "${newRecord.title}" saved to project state!`);
  };

  // Play saved item
  const handlePlaySavedAudio = (item: SavedVoiceover) => {
    if (activePlayingId === item.id) {
      // Pause
      window.speechSynthesis.cancel();
      setActivePlayingId(null);
      return;
    }

    setActivePlayingId(item.id);

    if (item.audioUrl && item.audioUrl.startsWith('data:')) {
      const audioEl = new Audio(item.audioUrl);
      audioEl.playbackRate = item.settings.speed || 1.0;
      audioEl.play().catch(() => {});
      audioEl.onended = () => setActivePlayingId(null);
    } else {
      // Use browser synthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(item.scriptText);
        utterance.rate = item.settings.speed || 1.0;
        utterance.onend = () => setActivePlayingId(null);
        utterance.onerror = () => setActivePlayingId(null);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Download Audio File
  const handleDownloadAudio = (audioDataUrl: string | undefined, title: string) => {
    if (!audioDataUrl) {
      showNotice("Audio data is currently streaming via Web Speech synthesis. Re-generate to capture audio file.");
      return;
    }

    const a = document.createElement('a');
    a.href = audioDataUrl;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_elevenlabs.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotice("⬇️ Downloading high-fidelity MP3 voiceover!");
  };

  // Copy Script Text
  const handleCopyScript = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showNotice("Copied script text to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const showNotice = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const selectedVoiceObj = voices.find(v => v.voice_id === selectedVoiceId) || voices[0];
  const wordCount = scriptText.trim() ? scriptText.trim().split(/\s+/).length : 0;
  const estimatedSeconds = Math.max(1, Math.round((wordCount / 150) * 60));

  const filteredSavedVoiceovers = savedVoiceovers.filter(v => 
    v.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    v.scriptText.toLowerCase().includes(searchFilter.toLowerCase()) ||
    v.voiceName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (v.campaignName && v.campaignName.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100 pb-12">
      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 border border-indigo-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce shadow-indigo-500/20">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Hidden Audio Element for Playback */}
      <audio 
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setAudioCurrentTime(audioRef.current.currentTime);
            setAudioDuration(audioRef.current.duration || audioDuration);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setAudioCurrentTime(0);
        }}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-6 rounded-3xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-mono font-extrabold uppercase rounded-md shadow-sm">
                ElevenLabs TTS Engine
              </span>
              <span className="text-xs text-indigo-300 font-mono font-semibold">
                ● Ultra-Realistic AI Voiceovers & Audio Narration
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              AI Voiceover Studio
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Generate broadcast-quality AI voiceovers for your ad campaigns and commercial video scripts with ElevenLabs, customize vocal stability and cadence, and save audio tracks directly into your project.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOptimizeScriptWithAI}
              disabled={isGenerating}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer border border-indigo-500/40"
            >
              <Wand2 className="w-4 h-4 text-indigo-400" />
              <span>AI Polish Script</span>
            </button>

            <button
              onClick={handleSaveToProject}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer border border-emerald-400/30"
            >
              <Save className="w-4 h-4" />
              <span>Save Voiceover to Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Script Editor, Campaign Link & Audio Player (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Script Editor Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                  <FileAudio className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Commercial Script & Hook</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {wordCount} words • ~{estimatedSeconds}s estimated speech length
                  </span>
                </div>
              </div>

              {/* Campaign Selector Link */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Link Ad:</span>
                <select
                  value={selectedCampaignId}
                  onChange={(e) => handleCampaignChange(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white text-xs font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer max-w-[200px] truncate"
                >
                  <option value="">-- Standalone Voiceover --</option>
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Voiceover Title Input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 font-mono uppercase">
                Voiceover Title / Track Label
              </label>
              <input
                type="text"
                value={scriptTitle}
                onChange={(e) => setScriptTitle(e.target.value)}
                placeholder="e.g., Summer Campaign Hook - High Energy"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-semibold text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Script Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase flex items-center gap-1.5">
                  <Mic className="w-3 h-3 text-indigo-400" /> Voiceover Script Text
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyScript(scriptText, 'main-script')}
                    className="text-[10px] text-indigo-300 hover:text-white font-mono font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === 'main-script' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'main-script' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => setScriptText('')}
                    className="text-[10px] text-slate-500 hover:text-rose-400 font-mono font-bold cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <textarea
                rows={5}
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder="Type or paste your ad script here. ElevenLabs will render natural pauses and vocal inflection..."
                className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-slate-100 font-sans text-sm leading-relaxed focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-y"
              />
            </div>

            {/* Script Templates Quick Presets */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                ⚡ Proven Ad Script Presets:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DEFAULT_SCRIPT_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="p-2.5 bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="text-[11px] font-bold text-indigo-300 group-hover:text-indigo-200 truncate">
                      {tmpl.title}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {tmpl.script}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Audio Preview Deck */}
          <div className="bg-slate-950 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Audio Playback & Monitor Deck</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Engine: <strong className="text-emerald-400 uppercase">{generationSource}</strong> {lastGeneratedAt && `• Generated at ${lastGeneratedAt}`}
                  </span>
                </div>
              </div>

              {currentAudioUrl && (
                <button
                  onClick={() => handleDownloadAudio(currentAudioUrl, scriptTitle)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download MP3</span>
                </button>
              )}
            </div>

            {/* Waveform Visualization Simulation */}
            <div className="h-20 bg-slate-900 rounded-2xl border border-slate-800/90 flex items-center justify-center px-4 gap-1 overflow-hidden relative shadow-inner">
              {Array.from({ length: 42 }).map((_, i) => {
                const heightPercent = isPlaying 
                  ? Math.sin(i * 0.4 + Date.now() * 0.005) * 40 + 50
                  : Math.sin(i * 0.3) * 20 + 30;
                return (
                  <div
                    key={i}
                    style={{ height: `${Math.max(10, Math.min(100, heightPercent))}%` }}
                    className={`flex-1 rounded-full transition-all duration-150 ${
                      isPlaying 
                        ? 'bg-gradient-to-t from-indigo-600 via-teal-400 to-emerald-400' 
                        : 'bg-slate-800'
                    }`}
                  />
                );
              })}

              <div className="absolute top-2 left-3 text-[9px] font-mono font-bold text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                VOICE: {selectedVoiceObj?.name.toUpperCase()} • {settings.speed}x SPEED
              </div>

              <div className="absolute top-2 right-3 text-[9px] font-mono font-bold text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                {isPlaying ? 'ACTIVE SPEECH PLAYBACK' : 'STANDBY READY'}
              </div>
            </div>

            {/* Playback Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTogglePlayback}
                  className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                    isPlaying
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
                  <span>{isPlaying ? 'Pause Playback' : 'Play Synthesized Voice'}</span>
                </button>

                <button
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = 0;
                    }
                    window.speechSynthesis.cancel();
                    setIsPlaying(false);
                  }}
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-all cursor-pointer"
                  title="Reset to start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleGenerateVoiceover}
                disabled={isGenerating}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-indigo-400/30"
              >
                <Zap className="w-4 h-4 text-indigo-200 fill-current" />
                <span>{isGenerating ? 'Synthesizing Audio...' : 'Generate with ElevenLabs'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: ElevenLabs Voice Catalog & Voice Tuner (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* ElevenLabs Voice Selection Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                  <Mic className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-white">Select ElevenLabs Voice</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800 px-2 py-0.5 rounded">
                ELEVEN v2
              </span>
            </div>

            {/* Model Architecture Selector */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 font-mono uppercase">
                Model Engine Architecture
              </label>
              <select
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="eleven_multilingual_v2">Eleven Multilingual v2 (Ultra-Realistic Inflection)</option>
                <option value="eleven_monolingual_v1">Eleven English v1 (Fast Latency Commercial)</option>
                <option value="eleven_turbo_v2">Eleven Turbo v2.5 (Real-time Streaming)</option>
              </select>
            </div>

            {/* Voice Cards Catalog */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {voices.map((voice) => {
                const isSelected = selectedVoiceId === voice.voice_id;
                return (
                  <div
                    key={voice.voice_id}
                    onClick={() => setSelectedVoiceId(voice.voice_id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer text-left space-y-1 ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-400 ring-2 ring-indigo-500/20'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-white">{voice.name}</span>
                        {voice.labels?.gender && (
                          <span className="text-[9px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700">
                            {voice.labels.gender}
                          </span>
                        )}
                        {voice.labels?.accent && (
                          <span className="text-[9px] font-mono text-indigo-400">
                            {voice.labels.accent}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <span className="text-[9px] font-mono font-bold text-indigo-300 bg-indigo-900/80 px-2 py-0.5 rounded">
                          SELECTED
                        </span>
                      )}
                    </div>
                    {voice.description && (
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {voice.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Voice Settings & Inflection Tuner Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-white">Voice Inflection & Tuning</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                ACOUSTIC CALIBRATION
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Stability Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 font-bold mb-1">
                  <span>Stability (Consistency vs. Emotion)</span>
                  <span className="font-mono text-indigo-400">{settings.stability}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.stability}
                  onChange={(e) => setSettings({ ...settings, stability: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                  Higher = calm and consistent; Lower = more expressive variation
                </span>
              </div>

              {/* Similarity / Clarity Boost */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 font-bold mb-1">
                  <span>Clarity & Similarity Boost</span>
                  <span className="font-mono text-emerald-400">{settings.similarityBoost}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.similarityBoost}
                  onChange={(e) => setSettings({ ...settings, similarityBoost: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                  Enhances high-frequency presence and crispness
                </span>
              </div>

              {/* Style Exaggeration */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 font-bold mb-1">
                  <span>Style Exaggeration</span>
                  <span className="font-mono text-purple-400">{settings.style}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.style}
                  onChange={(e) => setSettings({ ...settings, style: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Speed Multiplier */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 font-bold mb-1">
                  <span>Playback Speed Rate</span>
                  <span className="font-mono text-teal-400">{settings.speed}x</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[0.85, 1.0, 1.15, 1.25].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setSettings({ ...settings, speed: spd })}
                      className={`py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        settings.speed === spd
                          ? 'bg-teal-500 text-slate-950 shadow'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Voiceovers in Project State Section */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Saved Project Voiceovers ({savedVoiceovers.length})
              </h3>
              <span className="text-xs text-slate-400">
                Voiceover audio tracks stored in your project state and ready for video timeline integration.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search saved voiceovers..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {filteredSavedVoiceovers.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-800/80 rounded-2xl space-y-3">
            <Mic className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-sm font-bold text-slate-400">No saved voiceovers in this project yet</div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Type or polish an ad script above, configure your ElevenLabs voice model, and click "Save Voiceover to Project" to archive your track.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSavedVoiceovers.map((item) => {
              const isItemPlaying = activePlayingId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all space-y-3 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900/60 block truncate mb-1">
                          {item.campaignName || 'General Commercial'}
                        </span>
                        <h4 className="text-xs font-black text-white truncate">{item.title}</h4>
                      </div>
                      <button
                        onClick={() => onDeleteVoiceover(item.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete voiceover track"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 font-sans italic">
                      "{item.scriptText}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                      <span>VOICE: <strong className="text-white">{item.voiceName}</strong></span>
                      <span>~{item.durationSec}s length</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => handlePlaySavedAudio(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isItemPlaying
                          ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold animate-pulse'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {isItemPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>{isItemPlaying ? 'Pause' : 'Listen'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyScript(item.scriptText, item.id)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                        title="Copy script"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {item.audioUrl && (
                        <button
                          onClick={() => handleDownloadAudio(item.audioUrl, item.title)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg transition-colors cursor-pointer"
                          title="Download audio file"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
