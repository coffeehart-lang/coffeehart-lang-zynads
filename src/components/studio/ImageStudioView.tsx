import React, { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  RotateCcw, 
  Wand2, 
  Layers, 
  Sliders, 
  Copy, 
  Check, 
  Film, 
  Upload,
  Maximize2
} from 'lucide-react';
import { expandPrompt } from '../../utils/promptEnhancer';

const presetStyles = [
  { id: 'cinematic', label: '🎬 Commercial Cinematic', promptSuffix: 'cinematic commercial lighting, highly detailed 8k, photorealistic depth of field, studio broadcast grade' },
  { id: 'photorealistic', label: '📸 Photorealistic Studio', promptSuffix: 'photorealistic photography, 35mm lens, sharp focus, natural color grading, award winning studio render' },
  { id: '3d_render', label: '🎨 3D Product & Animation', promptSuffix: 'Octane 3D render, Pixar style cartoon, vibrant colors, raytraced ambient occlusion, clay animation' },
  { id: 'cyberpunk', label: '⚡ Cyberpunk & Tech', promptSuffix: 'neon glow, futuristic technology UI, cyberpunk aesthetic, dark background with vibrant accents' },
  { id: 'anime', label: '🌸 Modern Anime & Illustration', promptSuffix: 'Makoto Shinkai style, vibrant anime artwork, hand-drawn aesthetic, high quality keyframe artwork' },
];

export default function ImageStudioView() {
  const [prompt, setPrompt] = useState<string>(
    'Commercial scene: Main character standing on a farm porch holding a computer chip, cartoonish RAM sticks grazing in pasture'
  );
  const [selectedStyle, setSelectedStyle] = useState<string>('cinematic');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:3'>('16:9');
  const [cfgScale, setCfgScale] = useState<number>(7.5);
  const [seed, setSeed] = useState<number>(428901);
  const [numOutputs, setNumOutputs] = useState<number>(2);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [generatedGallery, setGeneratedGallery] = useState<Array<{ id: string; url: string; prompt: string; style: string }>>([]);

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newItem = {
          id: `img-user-${Date.now()}`,
          url: ev.target?.result as string,
          prompt: `Uploaded image asset: ${file.name}`,
          style: 'User Upload'
        };
        setGeneratedGallery(prev => [newItem, ...prev]);
        setNotice(`Uploaded custom image "${file.name}" to studio gallery!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      const styleObj = presetStyles.find(s => s.id === selectedStyle);
      const newImages = [
        {
          id: `gen-${Date.now()}-1`,
          url: '/images/scene1.jpg',
          prompt: `${prompt} (${styleObj?.label || 'Custom'})`,
          style: styleObj?.label || 'Custom'
        },
        {
          id: `gen-${Date.now()}-2`,
          url: '/images/scene2.jpg',
          prompt: `${prompt} (Variation 2)`,
          style: styleObj?.label || 'Custom'
        }
      ];
      setGeneratedGallery(prev => [...newImages, ...prev]);
      setNotice('✨ AI Text-to-Image rendering generated successfully!');
    }, 1500);
  };

  const handleEnhancePrompt = () => {
    const expanded = expandPrompt(prompt);
    setPrompt(expanded);
    setNotice('Prompt expanded with Krea AI T2I prompt engineering rules!');
  };

  const handleCopyPrompt = (pText: string, id: string) => {
    navigator.clipboard.writeText(pText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 rounded-xl text-white shadow-lg shadow-cyan-500/20">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-white">
              AI Commercial Image Studio
              <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded uppercase">
                FLUX.1 & KREA T2I ENGINE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Generate ultra-crisp keyframe illustrations, ad photos, and campaign banners
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin text-cyan-300" /> Generating Images...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-300" /> Generate Commercial Photos
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Prompt & Style Engineering
            </h3>
          </div>

          {/* Prompt input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300">Prompt Description:</label>
              <button
                type="button"
                onClick={handleEnhancePrompt}
                className="text-[10px] font-mono font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <Wand2 className="w-3 h-3" /> Auto-Enhance
              </button>
            </div>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed resize-none font-medium"
              placeholder="Describe what you want to render..."
            />
          </div>

          {/* Style Presets */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Preset Aesthetic Style:</label>
            <div className="space-y-1.5">
              {presetStyles.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStyle(s.id)}
                  className={`w-full px-3 py-2 rounded-xl text-xs text-left font-medium transition-all cursor-pointer border flex items-center justify-between ${
                    selectedStyle === s.id
                      ? 'bg-cyan-950/90 border-cyan-500 text-cyan-200 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{s.label}</span>
                  {selectedStyle === s.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect ratio */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Aspect Ratio:</label>
            <div className="grid grid-cols-4 gap-2 font-mono text-xs">
              {(['16:9', '9:16', '1:1', '4:3'] as const).map(ar => (
                <button
                  key={ar}
                  type="button"
                  onClick={() => setAspectRatio(ar)}
                  className={`py-1.5 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                    aspectRatio === ar
                      ? 'bg-cyan-600 border-cyan-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {ar}
                </button>
              ))}
            </div>
          </div>

          {/* CFG Scale */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">CFG Guidance Scale:</span>
              <span className="text-cyan-400 font-bold">{cfgScale}</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={0.5}
              value={cfgScale}
              onChange={(e) => setCfgScale(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* FLUX Sampler Controls */}
          <div className="pt-2 border-t border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Sampler Seed:</span>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value))}
                className="w-24 px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-cyan-300 text-right font-bold"
              />
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Sampling Steps:</span>
              <span className="text-cyan-400 font-bold">28 steps</span>
            </div>
          </div>
        </div>

        {/* Gallery & Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold font-mono text-cyan-300 flex items-center gap-2 uppercase">
              <ImageIcon className="w-4 h-4 text-cyan-400" /> Generated Keyframes & Assets ({generatedGallery.length})
            </span>
            <label className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 hover:bg-cyan-900 px-2.5 py-1 rounded-lg border border-cyan-800 flex items-center gap-1 cursor-pointer transition-colors">
              <Upload className="w-3 h-3 text-cyan-400" />
              <span>Upload Image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} />
            </label>
          </div>

          {generatedGallery.length === 0 ? (
            <div className="bg-slate-900 border-2 border-dashed border-slate-800 rounded-2xl p-10 text-center space-y-4 hover:border-cyan-500/50 transition-colors">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-cyan-400">
                <ImageIcon className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Studio Canvas Ready</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Type a prompt above and click "Generate Image" or upload your own custom photo.
                </p>
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-slate-950" />
                <span>Upload Custom Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} />
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {generatedGallery.map(item => (
                <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between">
                  <div className="aspect-video relative overflow-hidden bg-slate-950">
                    <img src={item.url} alt={item.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 border border-slate-800">
                      {item.style}
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    <p className="text-xs text-slate-300 line-clamp-2 font-medium">{item.prompt}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(item.prompt, item.id)}
                        className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === item.id ? 'Copied' : 'Copy Prompt'}</span>
                      </button>
                      <a
                        href={item.url}
                        download="commercial-asset.jpg"
                        className="p-1.5 text-slate-400 hover:text-cyan-300 bg-slate-800 rounded-lg border border-slate-700 transition-colors"
                        title="Download image"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {notice && (
            <div className="p-3 bg-emerald-950 border border-emerald-700/60 rounded-xl text-xs text-emerald-300 font-medium flex items-center justify-between">
              <span>{notice}</span>
              <button onClick={() => setNotice(null)} className="text-emerald-400 hover:text-white font-bold">✕</button>
            </div>
          )}

          {/* FLUX-Krea-Dev Pipeline Specs */}
          <div className="bg-[#11131a] p-3 rounded-lg border border-slate-800/80 space-y-1.5">
            <div className="text-cyan-400 font-bold text-[11px] flex items-center justify-between">
              <span>FLUX.1 (flux-krea-dev) Direct Sampler Pipeline</span>
              <span className="text-[9px] bg-cyan-950 px-1.5 py-0.5 rounded text-cyan-300 font-mono">
                Guidance: {cfgScale} • Steps: 28 • Seed: {seed}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[10px] text-slate-300 font-mono">
              <div className="bg-[#0b0c12] p-2 rounded border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold">Encoders</div>
                <div>• <strong className="text-white">load_clip():</strong> OpenAI CLIP ViT-L/14</div>
                <div>• <strong className="text-white">load_t5():</strong> Google T5-XXL Text Model</div>
              </div>
              <div className="bg-[#0b0c12] p-2 rounded border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold">Flow Model</div>
                <div>• <strong className="text-white">Model:</strong> load_flow_model("flux-krea-dev")</div>
                <div>• <strong className="text-white">Precision:</strong> torch.bfloat16</div>
              </div>
              <div className="bg-[#0b0c12] p-2 rounded border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold">Autoencoder & Sampler</div>
                <div>• <strong className="text-white">load_ae():</strong> flux-krea-dev VAE</div>
                <div>• <strong className="text-white">Sampler:</strong> src.flux.pipeline.Sampler</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
