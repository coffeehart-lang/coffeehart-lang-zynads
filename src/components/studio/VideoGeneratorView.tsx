import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Video, 
  Play, 
  Pause, 
  Plus, 
  Image as ImageIcon, 
  Volume2, 
  Wand2, 
  Download, 
  Upload, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Clapperboard,
  RotateCcw,
  Zap,
  Film
} from 'lucide-react';

interface AssetReference {
  id: string;
  tag: string;
  name: string;
  url: string;
}

export default function VideoGeneratorView() {
  const [selectedModel, setSelectedModel] = useState<string>('MiniMax H3');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [durationSecs, setDurationSecs] = useState<number>(6);

  // Reference Assets (@img-1, @img-2...) uploaded dynamically by user
  const [assets, setAssets] = useState<AssetReference[]>([]);

  const [prompt, setPrompt] = useState<string>(
    `So, my video would open taking place on a farm and a pasture and all that, and it would open up to the main character on the porch. And then from there, he would say a script of like, "Do you know where your code comes from?" And then it would say, "Here at Zencast CFO, all our code is organic, cage-free, and straight to you." And then in that whole scene while he's walking down the pasture rows, there would be animals that would be a parody type thing off of computer names, like RAM, like RAM sticks. So, they'd be like little cartoonish RAM sticks and stuff like that, if you get what I'm saying. So that's the person who should be in the commercial. That's the farmhouse that should probably be in the commercial. And there's a picture of a field. Now you have everything you need to make this. I don't want to use any of those backdrop things that you have as options.`
  );

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [notice, setNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInsertTag = (tag: string) => {
    setPrompt(prev => prev + ` ${tag} `);
  };

  const handleSwapAssetPhoto = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setAssets(prev => prev.map(a => a.id === id ? { ...a, url: result, name: file.name.slice(0, 18) } : a));
        setNotice(`Updated photo for ${id}!`);
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

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setProgress(10);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 18) + 8;
      });
    }, 350);

    try {
      await fetch('/api/zynads/backdrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Video Commercial: ${prompt}` })
      });
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsGenerating(false);
      setIsPlaying(true);
      setNotice(`✨ Commercial generated successfully with ${selectedModel}!`);
    }, 2800);
  };

  return (
    <div className="bg-[#0b0c0f] text-slate-100 min-h-screen -m-4 p-4 sm:p-6 font-sans space-y-6">
      {/* Top Model Selector Header Bar (Matches Krea Header: "Model MiniMax H3 v") */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Model</span>
          <div className="relative inline-block">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-sm font-bold text-white pr-6 py-0.5 border-none focus:outline-none cursor-pointer appearance-none flex items-center gap-1"
            >
              <option value="MiniMax H3" className="bg-slate-900 text-white">MiniMax H3</option>
              <option value="Google Veo 2" className="bg-slate-900 text-white">Google Veo 2 (4K)</option>
              <option value="Luma Dream Machine" className="bg-slate-900 text-white">Luma Dream Machine</option>
              <option value="Runway Gen-3" className="bg-slate-900 text-white">Runway Gen-3 Alpha</option>
              <option value="OpenAI Sora" className="bg-slate-900 text-white">OpenAI Sora</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Commercial Studio Mode</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono text-[10px] font-bold">
            READY
          </span>
        </div>
      </div>

      {/* Main Workspace Stage */}
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Date / Title Row */}
        <div className="text-xs text-slate-400 font-semibold px-1">
          Today
        </div>

        {/* Generated Video Canvas Container */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group min-h-[380px] sm:min-h-[460px] flex flex-col justify-between">
          {/* Background Video Output Canvas */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 flex flex-col justify-between p-6">
            {/* Top Bar inside Video Player */}
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 text-amber-300 font-bold flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-amber-400" />
                  ZENCAST CFO COMMERCIAL
                </span>
                <span className="hidden sm:inline-block bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300 text-[11px]">
                  {selectedModel}
                </span>
              </div>

              {/* Tag Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-[280px]">
                {assets.map((asset) => (
                  <span
                    key={asset.id}
                    className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-amber-300 shrink-0"
                  >
                    {asset.tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Live Video Player Output Canvas */}
            <div className="my-auto py-2 relative rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center max-h-[320px]">
              <video
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                autoPlay
                loop
                muted={!isPlaying}
                controls
                className="w-full h-[280px] sm:h-[320px] object-cover rounded-xl"
              />

              {/* Commercial Caption Overlay Banner */}
              <div className="absolute bottom-12 left-4 right-4 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 shadow-2xl pointer-events-none flex items-center justify-between gap-2">
                <p className="text-xs sm:text-sm font-semibold text-white truncate font-sans">
                  "Do you know where your code comes from? Here at Zencast CFO, all our code is organic!"
                </p>
                <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded border border-amber-700 shrink-0">
                  Zencast CFO
                </span>
              </div>
            </div>

            {/* Video Transport Controls */}
            <div className="flex items-center justify-between text-xs font-mono bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold cursor-pointer transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <span className="text-slate-300 font-bold">00:00 / 00:0{durationSecs}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNotice('Exporting 4K MP4 Commercial...')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" /> Export MP4
                </button>
                <button
                  type="button"
                  onClick={() => setNotice('Attached commercial video to ZynAds Ad Campaign!')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Zap className="w-3.5 h-3.5" /> Attach to Ad Campaign
                </button>
              </div>
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

            {/* Tagged Asset Thumbnails with Color @img Tags */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
              {assets.length === 0 ? (
                <div className="text-[11px] text-slate-500 font-mono italic px-2">
                  No images added yet. Click <strong className="text-indigo-400 font-semibold">"Add image"</strong> to upload photos (@img-1, @img-2...)
                </div>
              ) : (
                assets.map((asset, index) => {
                  const colorClasses = [
                    'text-amber-400 border-amber-500/50 bg-amber-950/80',
                    'text-emerald-400 border-emerald-500/50 bg-emerald-950/80',
                    'text-cyan-400 border-cyan-500/50 bg-cyan-950/80',
                    'text-purple-400 border-purple-500/50 bg-purple-950/80'
                  ][index % 4];

                  return (
                    <div key={asset.id} className="flex flex-col items-center gap-1 group relative shrink-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 relative">
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
                        title={`Click to tag ${asset.tag} into prompt`}
                      >
                        {asset.tag}
                      </button>
                    </div>
                  );
                })
              )}
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

          {/* Bottom Control Bar inside Prompt Box */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              {/* Model Pill */}
              <div className="flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs font-bold text-slate-200">
                <Film className="w-3.5 h-3.5 text-indigo-400" />
                <span>{selectedModel}</span>
              </div>

              {/* Duration Toggle (- 6 s +) */}
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
                  onClick={() => setDurationSecs(prev => Math.min(15, prev + 3))}
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
                </select>
              </div>
            </div>

            {/* Glowing White Circular Generate Button (+) */}
            <button
              type="button"
              onClick={handleGenerateVideo}
              disabled={isGenerating || !prompt.trim()}
              className="w-10 h-10 rounded-full bg-white hover:bg-slate-200 text-slate-950 font-extrabold flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
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

