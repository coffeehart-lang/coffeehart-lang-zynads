import { useState, useRef } from 'react';
import { AdCreativeAsset } from '../types';
import { INITIAL_CREATIVES } from '../data';
import { 
  Plus, Copy, Check, Sparkles, Video, ExternalLink, MousePointer, Target,
  Wand2, Sliders, Volume2, Film, Zap, Layers, Activity, Music, Eye, Radio, Sun, CheckCircle2,
  Scissors, Play, Pause, RotateCcw, Crop, Clock, VolumeX, Gauge, FastForward, Rewind, SlidersHorizontal,
  FolderKanban, Upload, Image as ImageIcon, Trash2, Download, Tag, FileUp, FileVideo, CheckCircle, RefreshCw
} from 'lucide-react';

interface TransitionEffect {
  id: string;
  name: string;
  category: string;
  duration: string;
  description: string;
}

interface VisualFilter {
  id: string;
  name: string;
  previewColor: string;
  description: string;
}

interface AudioDuckingSetting {
  id: string;
  name: string;
  level: string;
  description: string;
  enabled: boolean;
}

export interface UserAsset {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio';
  url: string;
  size: string;
  duration?: string;
  aspectRatio: string;
  uploadedAt: string;
  tags: string[];
  isProjectActive: boolean;
  tagSymbol?: string;
}

export default function CreativesView() {
  const [creatives, setCreatives] = useState<AdCreativeAsset[]>(INITIAL_CREATIVES);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formatFilter, setFormatFilter] = useState<string>('All');

  // New creative form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [headline, setHeadline] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [ctaText, setCtaText] = useState('Claim Free Trial');
  const [format, setFormat] = useState<AdCreativeAsset['format']>('Single Image');

  // Navigation & My Assets State
  const [activeTab, setActiveTab] = useState<'assets' | 'effects' | 'creatives'>('assets');
  const [assetFilter, setAssetFilter] = useState<'all' | 'video' | 'image' | 'audio' | 'active'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userAssets, setUserAssets] = useState<UserAsset[]>([
    {
      id: 'user-asset-1',
      name: 'Zen Ads Organic Code Farm Pasture Commercial',
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      size: '18.4 MB',
      duration: '0:30',
      aspectRatio: '16:9',
      uploadedAt: 'Just now',
      tags: ['commercial', 'main-character', 'farm'],
      isProjectActive: true,
      tagSymbol: '@img-1'
    },
    {
      id: 'user-asset-2',
      name: '3D Animated RAM Sticks in Pasture Rows',
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      size: '12.2 MB',
      duration: '0:18',
      aspectRatio: '16:9',
      uploadedAt: 'Today, 06:45 AM',
      tags: ['b-roll', '3d-ram', 'parody'],
      isProjectActive: false,
      tagSymbol: '@img-2'
    },
    {
      id: 'user-asset-3',
      name: 'Zyncast CFO News Broadcast Studio Backdrop',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1200&q=80',
      size: '3.1 MB',
      aspectRatio: '16:9',
      uploadedAt: 'Yesterday',
      tags: ['studio', 'backdrop', 'news'],
      isProjectActive: false,
      tagSymbol: '@img-3'
    },
    {
      id: 'user-asset-4',
      name: 'Founder Porch Keyframe Photo',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      size: '2.4 MB',
      aspectRatio: '1:1',
      uploadedAt: 'Yesterday',
      tags: ['character', 'porch', 'keyframe'],
      isProjectActive: false,
      tagSymbol: '@img-4'
    }
  ]);

  const [assetNotice, setAssetNotice] = useState<string | null>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newUploadedAssets: UserAsset[] = [];
    Array.from(files).forEach((file, idx) => {
      const fileType = file.type.startsWith('video/') ? 'video' : file.type.startsWith('audio/') ? 'audio' : 'image';
      const fileUrl = URL.createObjectURL(file);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      const count = userAssets.length + newUploadedAssets.length + 1;

      newUploadedAssets.push({
        id: `user-upload-${Date.now()}-${idx}`,
        name: file.name.replace(/\.[^/.]+$/, ""),
        type: fileType,
        url: fileUrl,
        size: sizeMB,
        duration: fileType === 'video' ? '0:15' : undefined,
        aspectRatio: '16:9',
        uploadedAt: 'Just now',
        tags: ['custom-upload', fileType],
        isProjectActive: idx === 0 && userAssets.filter(a => a.isProjectActive).length === 0,
        tagSymbol: `@img-${count}`
      });
    });

    setUserAssets(prev => [...newUploadedAssets, ...prev]);
    setAssetNotice(`✨ Successfully uploaded ${newUploadedAssets.length} asset(s) to My Assets library!`);
    setTimeout(() => setAssetNotice(null), 4000);
  };

  const handleSetActiveProjectAsset = (id: string) => {
    setUserAssets(prev => prev.map(a => ({
      ...a,
      isProjectActive: a.id === id
    })));
    const selected = userAssets.find(a => a.id === id);
    if (selected) {
      setAssetNotice(`🎯 "${selected.name}" set as active asset for commercial render! Replaced placeholders.`);
      setTimeout(() => setAssetNotice(null), 4000);
    }
  };

  const handleDeleteUserAsset = (id: string) => {
    setUserAssets(prev => prev.filter(a => a.id !== id));
    setAssetNotice('🗑️ Asset removed from library.');
    setTimeout(() => setAssetNotice(null), 2500);
  };

  const handlePreviewUserVideo = (asset: UserAsset) => {
    const adAdapter: AdCreativeAsset = {
      id: asset.id,
      campaignId: 'camp-101',
      title: asset.name,
      headline: asset.name,
      bodyText: `User uploaded ${asset.type} asset (${asset.size})`,
      ctaText: 'Use in Commercial',
      format: asset.type === 'video' ? 'Short Video' : 'Single Image',
      status: 'Active'
    };
    handleOpenPreviewModal(adAdapter);
  };

  const selectedActiveAsset = userAssets.find(a => a.isProjectActive) || userAssets[0];

  const selectedTransitionState = useState<string>('cross-dissolve');
  const [selectedTransition, setSelectedTransition] = selectedTransitionState;
  const [transitionSpeed, setTransitionSpeed] = useState<number>(0.8);
  const [selectedFilter, setSelectedFilter] = useState<string>('teal-orange');
  const [filterIntensity, setFilterIntensity] = useState<number>(85);
  
  const [audioDucking, setAudioDucking] = useState<AudioDuckingSetting[]>([
    { id: 'ducking-voice', name: 'Smart Voiceover Ducking', level: '-12 dB', description: 'Automatically lowers background music when voiceover speech is detected', enabled: true },
    { id: 'ducking-fade', name: 'Dialogue Auto-Fade', level: '0.4s Release', description: 'Smooth exponential volume ramp during dialogue breaks', enabled: true },
    { id: 'ducking-denoise', name: 'AI Noise Gate & Speech Isolation', level: 'High Quality', description: 'Eliminates room reverb and background hiss from recorded vocals', enabled: true },
    { id: 'ducking-spatial', name: '3D Spatial Audio Mastering', level: 'Stereo Expand', description: 'Enhances stereo depth for dynamic broadcast ad playback', enabled: false }
  ]);

  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // Dedicated Asset Preview & Trim Modal State
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [previewAsset, setPreviewAsset] = useState<AdCreativeAsset | null>(null);
  const [trimStart, setTrimStart] = useState<number>(0.5);
  const [trimEnd, setTrimEnd] = useState<number>(5.5);
  const [totalAssetDuration] = useState<number>(8.0);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [cropRatio, setCropRatio] = useState<'16:9' | '9:16' | '1:1' | '4:5'>('16:9');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [addedTimelineNotice, setAddedTimelineNotice] = useState<string | null>(null);

  const handlePlaybackSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (modalVideoRef.current) {
      modalVideoRef.current.playbackRate = speed;
    }
  };

  const handleNudgeTrim = (type: 'start' | 'end', delta: number) => {
    if (type === 'start') {
      setTrimStart(prev => Math.max(0, Math.min(trimEnd - 0.2, +(prev + delta).toFixed(1))));
    } else {
      setTrimEnd(prev => Math.min(totalAssetDuration, Math.max(trimStart + 0.2, +(prev + delta).toFixed(1))));
    }
  };

  const handleOpenPreviewModal = (asset: AdCreativeAsset) => {
    setPreviewAsset(asset);
    setTrimStart(0.5);
    setTrimEnd(5.5);
    setPlaybackSpeed(1.0);
    setIsPreviewPlaying(true);
  };

  const handleAddToTimeline = () => {
    if (!previewAsset) return;
    const trimmedDuration = (trimEnd - trimStart).toFixed(1);
    setAddedTimelineNotice(`🎬 Asset "${previewAsset.title}" trimmed (${trimStart.toFixed(1)}s - ${trimEnd.toFixed(1)}s = ${trimmedDuration}s) and added to Commercial Timeline!`);
    setTimeout(() => {
      setAddedTimelineNotice(null);
      setPreviewAsset(null);
    }, 2200);
  };

  const transitions: TransitionEffect[] = [
    { id: 'cross-dissolve', name: 'Cross Dissolve', category: 'Smooth', duration: '0.8s', description: 'Elegant cinematic fade between commercial scenes' },
    { id: 'whip-pan', name: 'Whip Pan Motion', category: 'Dynamic', duration: '0.4s', description: 'Fast directional motion blur transition for high-energy ads' },
    { id: 'fade-black', name: 'Fade to Black & Rise', category: 'Dramatic', duration: '1.0s', description: 'Classic broadcast pause before call-to-action scene' },
    { id: 'zoom-blur', name: 'Zoom Impact Blur', category: 'Action', duration: '0.5s', description: 'Inward camera pulse highlighting key product reveal' },
    { id: 'glitch-wipe', name: 'Digital Glitch Wipe', category: 'Modern Tech', duration: '0.3s', description: 'Cyberpunk stylized pixel shift for tech & SaaS commercials' }
  ];

  const visualFilters: VisualFilter[] = [
    { id: 'teal-orange', name: '4K Cinema Teal & Orange', previewColor: 'from-amber-500 via-teal-700 to-cyan-900', description: 'Hollywood blockbuster color grade with vibrant skin tones and cool shadow contrast' },
    { id: 'vintage-film', name: '16mm Vintage Grain', previewColor: 'from-orange-700 via-amber-800 to-yellow-900', description: 'Warm nostalgic film stock curve with organic micro-grain overlay' },
    { id: 'hdr-contrast', name: 'HDR High Dynamic Contrast', previewColor: 'from-slate-900 via-indigo-950 to-blue-900', description: 'Punchy blacks and ultra-bright highlights for crisp product showcase' },
    { id: 'golden-hour', name: 'Golden Hour Sunset', previewColor: 'from-yellow-500 via-orange-600 to-rose-700', description: 'Soft warm glow with enhanced amber light leaks' },
    { id: 'noir-mono', name: 'Noir Monochromatic', previewColor: 'from-slate-950 via-slate-700 to-slate-200', description: 'High-contrast monochrome for high-end luxury brand aesthetics' }
  ];

  const handleToggleDucking = (id: string) => {
    setAudioDucking(prev => prev.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));
  };

  const handleApplyMasterEffects = () => {
    setAppliedNotice('✨ Commercial Effects Preset Applied to Active Commercial Render!');
    setTimeout(() => setAppliedNotice(null), 3500);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) return;

    const newAsset: AdCreativeAsset = {
      id: `asset-${Date.now()}`,
      campaignId: 'camp-101',
      title: title.trim() || 'New Ad Variation',
      headline: headline.trim(),
      bodyText: bodyText.trim() || 'High-impact ad copy.',
      ctaText: ctaText.trim(),
      format,
      status: 'Active',
      ctr: 3.20,
      conversions: 45
    };

    setCreatives([newAsset, ...creatives]);
    setTitle('');
    setHeadline('');
    setBodyText('');
    setIsModalOpen(false);
  };

  const filteredCreatives = creatives.filter(c => formatFilter === 'All' || c.format === formatFilter);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Main Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Ad Copy & Commercial Production Hub</h2>
          <p className="text-xs text-slate-500">Configure post-production effects, transitions, audio ducking, and manage creative copy variations</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Hidden File Input for Custom Uploads */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
            multiple
            accept="image/*,video/*,audio/*"
            className="hidden"
          />

          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('assets')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'assets'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" /> My Assets ({userAssets.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('effects')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'effects'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" /> Commercial Effects Panel
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('creatives')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'creatives'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Copy Variations ({creatives.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" /> Upload Media
          </button>
        </div>
      </div>

      {/* AI Video Generator Integration Banner */}
      <div className="p-4 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-indigo-800/80 rounded-2xl text-white shadow-lg space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold font-sans flex items-center gap-2">
                Need Cinematic AI Video Ads (MP4)?
                <span className="text-[9px] bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded font-mono">
                  MiniMax H3 • Google Veo • Runway • Luma
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Transfer your script concepts into dedicated AI video generation tools directly inside our Commercial Studio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://deepmind.google/technologies/veo/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1"
            >
              Google Veo <ExternalLink className="w-3 h-3 text-indigo-400" />
            </a>
            <a
              href="https://runwayml.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1"
            >
              Runway Gen-3 <ExternalLink className="w-3 h-3 text-indigo-400" />
            </a>
          </div>
        </div>
      </div>

      {/* TAB 0: MY ASSETS & MEDIA LIBRARY PANEL */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          {/* Header Banner & Active Asset Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-tr from-emerald-500 to-indigo-600 rounded-2xl text-white shadow-lg">
                <FolderKanban className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  My Project Assets & Media Library
                  <span className="text-[10px] font-mono font-bold bg-emerald-400 text-slate-950 px-2 py-0.5 rounded uppercase">
                    {userAssets.length} Assets Stored
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Upload custom videos and images to replace default studio placeholders in commercial renders and AI studio prompts.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Upload Custom Images & Videos
              </button>
            </div>
          </div>

          {assetNotice && (
            <div className="p-3.5 bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-bold rounded-xl flex items-center justify-between shadow-lg animate-fadeIn">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {assetNotice}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700">
                UPDATED
              </span>
            </div>
          )}

          {/* Active Asset Spotlight Card */}
          {selectedActiveAsset && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/50 rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-16 bg-black rounded-xl border border-indigo-400/40 overflow-hidden shrink-0">
                  {selectedActiveAsset.type === 'video' ? (
                    <video src={selectedActiveAsset.url} className="w-full h-full object-cover" muted loop autoPlay />
                  ) : (
                    <img src={selectedActiveAsset.url} alt={selectedActiveAsset.name} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-1 left-1 bg-indigo-600 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded text-white shadow-xs">
                    {selectedActiveAsset.tagSymbol || '@active'}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded uppercase">
                      Active Primary Asset
                    </span>
                    <span className="text-xs text-indigo-300 font-medium">Replaces Studio Placeholders</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-tight">{selectedActiveAsset.name}</h4>
                  <p className="text-[11px] text-slate-300 font-mono">
                    Type: <strong className="text-indigo-300 capitalize">{selectedActiveAsset.type}</strong> • Size: {selectedActiveAsset.size} • Ratio: {selectedActiveAsset.aspectRatio}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-center">
                {selectedActiveAsset.type === 'video' && (
                  <button
                    type="button"
                    onClick={() => handlePreviewUserVideo(selectedActiveAsset)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Scissors className="w-3.5 h-3.5 text-cyan-400" /> Trim & Adjust Speed
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleCopy(selectedActiveAsset.url, 'active-url')}
                  className="px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'active-url' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Asset URL
                </button>
              </div>
            </div>
          )}

          {/* Drag & Drop File Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50/80 transition-all rounded-2xl p-6 text-center cursor-pointer space-y-2 group"
          >
            <div className="w-12 h-12 bg-white rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-center mx-auto text-indigo-600 group-hover:scale-110 transition-transform">
              <FileUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Click or Drag & Drop MP4, MOV, JPG, PNG files here to upload
              </p>
              <p className="text-xs text-slate-500">
                Uploaded files will immediately replace default video placeholders in commercial renders and AI keyframe generation
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'all', label: `All Assets (${userAssets.length})` },
                { id: 'video', label: `Videos (${userAssets.filter(a => a.type === 'video').length})` },
                { id: 'image', label: `Images (${userAssets.filter(a => a.type === 'image').length})` },
                { id: 'active', label: 'Active in Project' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAssetFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    assetFilter === tab.id
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs font-mono text-slate-500">
              Showing <strong className="text-slate-900">{userAssets.filter(a => {
                if (assetFilter === 'video') return a.type === 'video';
                if (assetFilter === 'image') return a.type === 'image';
                if (assetFilter === 'active') return a.isProjectActive;
                return true;
              }).length}</strong> items
            </div>
          </div>

          {/* Grid of My Assets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {userAssets
              .filter(a => {
                if (assetFilter === 'video') return a.type === 'video';
                if (assetFilter === 'image') return a.type === 'image';
                if (assetFilter === 'active') return a.isProjectActive;
                return true;
              })
              .map((asset) => {
                return (
                  <div
                    key={asset.id}
                    className={`bg-white rounded-2xl border transition-all p-4 space-y-3 flex flex-col justify-between shadow-xs hover:shadow-md ${
                      asset.isProjectActive ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Card Header Tag & Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 font-mono font-bold text-[10px] uppercase rounded border flex items-center gap-1 ${
                            asset.type === 'video'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                          }`}>
                            {asset.type === 'video' ? <FileVideo className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                            {asset.type}
                          </span>
                          {asset.tagSymbol && (
                            <span className="px-1.5 py-0.5 bg-slate-900 text-amber-300 font-mono text-[10px] font-bold rounded">
                              {asset.tagSymbol}
                            </span>
                          )}
                        </div>

                        {asset.isProjectActive ? (
                          <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded flex items-center gap-1">
                            <Check className="w-3 h-3" /> Active Project Media
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400">{asset.uploadedAt}</span>
                        )}
                      </div>

                      {/* Media Display Box */}
                      <div className="relative bg-black rounded-xl border border-slate-800 overflow-hidden h-40 flex items-center justify-center group">
                        {asset.type === 'video' ? (
                          <video
                            src={asset.url}
                            controls
                            muted
                            loop
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        )}

                        {asset.duration && (
                          <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-bold">
                            {asset.duration}
                          </span>
                        )}
                      </div>

                      {/* Asset Info */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{asset.name}</h4>
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                          <span>Size: {asset.size}</span>
                          <span>Ratio: {asset.aspectRatio}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {asset.tags.map(t => (
                          <span key={t} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-mono rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Toolbar */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <button
                        type="button"
                        onClick={() => handleSetActiveProjectAsset(asset.id)}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          asset.isProjectActive
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {asset.isProjectActive ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" /> Currently Selected Project Asset
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Replace Placeholder with This Asset
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-between gap-1">
                        {asset.type === 'video' && (
                          <button
                            type="button"
                            onClick={() => handlePreviewUserVideo(asset)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Scissors className="w-3 h-3 text-indigo-600" /> Trim / Speed
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleCopy(asset.tagSymbol || asset.url, asset.id)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === asset.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          Copy Tag
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteUserAsset(asset.id)}
                          className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                          title="Delete Asset"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 1: COMMERCIAL PRODUCTION POST-EFFECTS & MASTERING SELECTION PANEL */}
      {activeTab === 'effects' && (
        <div className="space-y-6">
          {/* Status Header Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-2xl text-white shadow-lg">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Commercial Post-Production Suite
                  <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded uppercase">
                    4K Broadcast Master
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Select transitions, color grade filters, and audio ducking thresholds for polished commercial output.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyMasterEffects}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" /> Apply Effects to Active Render
            </button>
          </div>

          {appliedNotice && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs font-bold rounded-xl flex items-center justify-between animate-fadeIn">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {appliedNotice}
              </span>
              <span className="text-[10px] font-mono text-emerald-400">SYNCED</span>
            </div>
          )}

          {/* 3-Column Grid: Transitions, Filters, Audio Ducking */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* COLUMN 1: TRANSITIONS PANEL */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-bold text-slate-900">Scene Transitions</h4>
                </div>
                <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                  {transitions.length} FX
                </span>
              </div>

              {/* Transition List */}
              <div className="space-y-2.5">
                {transitions.map((t) => {
                  const isSelected = selectedTransition === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTransition(t.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-500 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                          {t.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {t.duration}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{t.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Transition Speed Slider */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Transition Speed ({transitionSpeed}s)</span>
                  <span className="text-[10px] font-mono text-slate-400">0.2s - 2.0s</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.1"
                  value={transitionSpeed}
                  onChange={(e) => setTransitionSpeed(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* COLUMN 2: COLOR FILTERS & COLOR GRADING */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-bold text-slate-900">Color Grade Filters</h4>
                </div>
                <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold">
                  4K CINEMA
                </span>
              </div>

              {/* Color Filter Swatches */}
              <div className="space-y-2.5">
                {visualFilters.map((f) => {
                  const isSelected = selectedFilter === f.id;
                  return (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFilter(f.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                        isSelected
                          ? 'bg-amber-50/60 border-amber-500 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${f.previewColor} shrink-0 shadow-xs`} />
                          <span className="text-xs font-bold text-slate-900">{f.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{f.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Filter Intensity Slider */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Filter Grade Strength ({filterIntensity}%)</span>
                  <span className="text-[10px] font-mono text-slate-400">0% - 100%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={filterIntensity}
                  onChange={(e) => setFilterIntensity(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* COLUMN 3: AUDIO DUCKING & SOUND DESIGN */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-sm font-bold text-slate-900">Audio Ducking & Vocal Mix</h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  AUTO-MASTER
                </span>
              </div>

              {/* Audio Ducking Toggles */}
              <div className="space-y-3">
                {audioDucking.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5 text-emerald-600" />
                        {item.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleDucking(item.id)}
                        className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                          item.enabled ? 'bg-emerald-600' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-transform ${
                            item.enabled ? 'left-4.5' : 'left-0.75'
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-snug">{item.description}</p>
                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-600">
                      <span>Threshold / Profile:</span>
                      <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {item.level}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: CREATIVE AD COPY VARIATIONS GRID */}
      {activeTab === 'creatives' && (
        <div className="space-y-4">
          {/* Format Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['All', 'Single Image', 'Carousel', 'Short Video', 'Search Text'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormatFilter(fmt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  formatFilter === fmt
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* Grid of Creative Variations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCreatives.map((creative) => (
              <div
                key={creative.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-mono font-bold text-[10px] uppercase rounded-md border border-indigo-100">
                      {creative.format}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Active in Campaign
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{creative.title}</h3>
                    <p className="text-xs font-bold text-indigo-900 mt-1 flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      "{creative.headline}"
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                    <p className="leading-relaxed font-sans">{creative.bodyText}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono">Button CTA:</span>
                      <span className="font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-200">
                        {creative.ctaText}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Performance Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-[11px] flex items-center gap-1 font-mono">
                      <MousePointer className="w-3 h-3 text-indigo-500" /> CTR: <strong>{creative.ctr}%</strong>
                    </span>
                    <span className="text-slate-500 text-[11px] flex items-center gap-1 font-mono">
                      <Target className="w-3 h-3 text-emerald-500" /> Conv: <strong>{creative.conversions}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenPreviewModal(creative)}
                      className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                      title="Preview media and trim duration before adding to timeline"
                    >
                      <Scissors className="w-3.5 h-3.5" /> Preview & Trim
                    </button>

                    <button
                      onClick={() => handleCopy(`${creative.headline}\n${creative.bodyText}`, creative.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium"
                    >
                      {copiedId === creative.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Text
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DEDICATED PREVIEW & TRIM ASSET MODAL */}
      {previewAsset && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {previewAsset.title}
                    <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-bold uppercase">
                      {previewAsset.format}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Preview media asset and customize in/out trim points for the commercial timeline
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Notification Banner */}
            {addedTimelineNotice && (
              <div className="p-3 bg-emerald-950 border-b border-emerald-800 text-emerald-200 text-xs font-bold flex items-center justify-between animate-fadeIn">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {addedTimelineNotice}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">ADDED</span>
              </div>
            )}

            {/* Modal Body: Player Canvas + Trimmer */}
            <div className="p-5 space-y-5 overflow-y-auto">
              {/* Media Preview Player */}
              <div className="relative bg-black rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center min-h-[220px] sm:min-h-[260px] group">
                <video
                  ref={modalVideoRef}
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                  autoPlay={isPreviewPlaying}
                  loop
                  muted={isMuted}
                  className={`w-full object-cover transition-all ${
                    cropRatio === '9:16' ? 'max-w-[200px] h-[280px]' : cropRatio === '1:1' ? 'max-w-[260px] h-[260px]' : cropRatio === '4:5' ? 'max-w-[240px] h-[280px]' : 'h-[240px] sm:h-[280px]'
                  }`}
                />

                {/* Headline Overlay Badge */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 max-w-[80%] pointer-events-none">
                  <p className="text-xs font-bold text-amber-300 truncate">
                    "{previewAsset.headline}"
                  </p>
                </div>

                {/* Aspect Ratio Floating Tag */}
                <div className="absolute top-3 right-3 bg-indigo-950/90 text-indigo-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-700">
                  {cropRatio}
                </div>

                {/* On-Player Overlay Controls */}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md p-2 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPreviewPlaying(!isPreviewPlaying)}
                      className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      {isPreviewPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Trimmed Duration: <strong className="text-amber-400">{(trimEnd - trimStart).toFixed(1)}s</strong></span>
                    <span className="text-slate-500">|</span>
                    <span className="text-cyan-400 font-bold">{playbackSpeed}x Speed</span>
                  </div>
                </div>
              </div>

              {/* Crop & Aspect Ratio Controls */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Crop className="w-3.5 h-3.5 text-indigo-400" /> Crop / Aspect Ratio:
                </span>
                <div className="flex items-center gap-1.5">
                  {(['16:9', '9:16', '1:1', '4:5'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setCropRatio(ratio)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                        cropRatio === ratio
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Timeline Trimmer Bar */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-amber-400" /> Interactive Timeline Trimmer
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    In: <strong className="text-emerald-400">{trimStart.toFixed(1)}s</strong> | Out: <strong className="text-rose-400">{trimEnd.toFixed(1)}s</strong>
                  </span>
                </div>

                {/* Dual Scrubber Range Sliders with Fine Nudge Controls */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                    <span className="w-24 shrink-0 font-bold text-emerald-400">In-Point (Start)</span>
                    <button
                      type="button"
                      onClick={() => handleNudgeTrim('start', -0.1)}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-800 rounded font-bold cursor-pointer"
                      title="Nudge In-Point -0.1s"
                    >
                      -0.1s
                    </button>
                    <input
                      type="range"
                      min="0"
                      max={trimEnd - 0.5}
                      step="0.1"
                      value={trimStart}
                      onChange={(e) => setTrimStart(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => handleNudgeTrim('start', 0.1)}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-800 rounded font-bold cursor-pointer"
                      title="Nudge In-Point +0.1s"
                    >
                      +0.1s
                    </button>
                    <span className="w-12 text-right text-emerald-400 font-bold">{trimStart.toFixed(1)}s</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                    <span className="w-24 shrink-0 font-bold text-rose-400">Out-Point (End)</span>
                    <button
                      type="button"
                      onClick={() => handleNudgeTrim('end', -0.1)}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-rose-300 border border-slate-800 rounded font-bold cursor-pointer"
                      title="Nudge Out-Point -0.1s"
                    >
                      -0.1s
                    </button>
                    <input
                      type="range"
                      min={trimStart + 0.5}
                      max={totalAssetDuration}
                      step="0.1"
                      value={trimEnd}
                      onChange={(e) => setTrimEnd(parseFloat(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => handleNudgeTrim('end', 0.1)}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-rose-300 border border-slate-800 rounded font-bold cursor-pointer"
                      title="Nudge Out-Point +0.1s"
                    >
                      +0.1s
                    </button>
                    <span className="w-12 text-right text-rose-400 font-bold">{trimEnd.toFixed(1)}s</span>
                  </div>
                </div>

                {/* Scrubber Visual Representation Track */}
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden relative border border-slate-700">
                  <div
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-emerald-500 via-indigo-500 to-rose-500 rounded-full"
                    style={{
                      left: `${(trimStart / totalAssetDuration) * 100}%`,
                      width: `${((trimEnd - trimStart) / totalAssetDuration) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Bottom Commercial Editing Suite: Playback Speed Slider & Controls */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" /> Commercial Playback Speed Slider & Presets
                  </span>
                  <span className="font-mono text-[11px] text-cyan-300 font-bold">
                    {playbackSpeed.toFixed(2)}x Speed
                  </span>
                </div>

                {/* Speed Range Slider */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-400">0.25x</span>
                  <input
                    type="range"
                    min="0.25"
                    max="2.5"
                    step="0.05"
                    value={playbackSpeed}
                    onChange={(e) => handlePlaybackSpeedChange(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-slate-400">2.50x</span>
                </div>

                {/* Preset Speed Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-900">
                  <span className="text-[11px] text-slate-400 font-medium">Quick Speed Presets:</span>
                  <div className="flex items-center gap-1.5">
                    {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => handlePlaybackSpeedChange(spd)}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                          playbackSpeed === spd
                            ? 'bg-cyan-500 text-slate-950 shadow-sm'
                            : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {spd === 1.0 ? '1.0x Normal' : `${spd}x`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-5 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="px-4 py-2 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddToTimeline}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Trimmed Clip to Commercial Timeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Creative Variation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Ad Creative & Copy</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Asset Label / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Discount Variation B"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Turn Browsers into Buyers in 3 Steps"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Body Text</label>
                <textarea
                  rows={3}
                  placeholder="Ad body copy..."
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Format Type</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as AdCreativeAsset['format'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="Single Image">Single Image</option>
                    <option value="Carousel">Carousel</option>
                    <option value="Short Video">Short Video</option>
                    <option value="Search Text">Search Text</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

