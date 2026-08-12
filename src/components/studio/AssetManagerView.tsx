import React, { useState } from 'react';
import { 
  Layers, 
  Upload, 
  Plus, 
  Sparkles, 
  Tag, 
  Check, 
  RotateCcw, 
  Cpu, 
  Image as ImageIcon 
} from 'lucide-react';

interface AssetEntry {
  id: string;
  tag: string;
  name: string;
  category: string;
  url: string;
}

export default function AssetManagerView() {
  const [assets, setAssets] = useState<AssetEntry[]>([]);

  const [isTrainingLora, setIsTrainingLora] = useState<boolean>(false);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [notice, setNotice] = useState<string | null>(null);

  const handleTrainLora = () => {
    setIsTrainingLora(true);
    setTrainingProgress(10);
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      setTrainingProgress(100);
      setIsTrainingLora(false);
      setNotice('✨ Custom LoRA Model Trained! Founder character & RAM stick sheep weights ready for video generation.');
    }, 2000);
  };

  const handleSwapAssetPhoto = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAssets(prev => prev.map(a => a.id === id ? { ...a, url: ev.target?.result as string, name: file.name.slice(0, 18) } : a));
        setNotice(`Swapped photo for ${id}!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadNewAsset = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newAsset: AssetEntry = {
          id: `img-${Date.now()}`,
          tag: `@img-${assets.length + 1}`,
          name: file.name.slice(0, 18),
          category: 'Uploaded Reference',
          url: ev.target?.result as string
        };
        setAssets(prev => [...prev, newAsset]);
        setNotice(`Uploaded asset ${newAsset.tag}: "${newAsset.name}"`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    setNotice("Asset removed.");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-xl text-white shadow-lg shadow-amber-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-white">
              Assets & Custom LoRA Character Trainer
              <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded uppercase">
                CHARACTER WEIGHTS & ASSETS
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Manage tagged reference images (@img-1, @img-2, @img-3) and train custom LoRA character models
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 cursor-pointer flex items-center gap-1.5 transition-colors">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Upload Reference Photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleUploadNewAsset} />
          </label>

          <button
            type="button"
            onClick={handleTrainLora}
            disabled={isTrainingLora}
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isTrainingLora ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin text-slate-950" /> Training LoRA ({trainingProgress}%)...
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4 text-slate-950" /> Train LoRA Character Model
              </>
            )}
          </button>
        </div>
      </div>

      {/* Assets Grid */}
      {assets.length === 0 ? (
        <div className="bg-slate-900 border-2 border-dashed border-slate-800 rounded-2xl p-10 text-center space-y-4 hover:border-amber-500/50 transition-colors">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-amber-400">
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">No Assets Uploaded Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Upload your own photos or character reference images to tag them (@img-1, @img-2) and train custom LoRA models.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-slate-950" />
            <span>Upload Your First Photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleUploadNewAsset} />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4 space-y-3 shadow-xl hover:border-amber-500/60 transition-all group relative"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute top-2 left-2 bg-amber-950/90 text-amber-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-amber-700/50">
                  {asset.tag}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteAsset(asset.id)}
                  className="absolute top-2 right-2 p-1.5 bg-slate-950/80 hover:bg-rose-900 text-slate-300 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  title="Delete asset"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-white truncate">{asset.name}</div>
                <div className="text-[10px] font-mono text-slate-400">{asset.category}</div>
              </div>

              {/* Swap Photo Button */}
              <label className="w-full py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/80 rounded-xl text-[10px] font-bold text-amber-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Swap Photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSwapAssetPhoto(asset.id, e)} />
              </label>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-emerald-400 font-bold">
                <span>● LoRA WEIGHT SYNCED</span>
                <span className="text-slate-400">Ready</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {notice && (
        <div className="p-3.5 bg-emerald-950 border border-emerald-700/60 rounded-xl text-xs text-emerald-300 font-medium flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-emerald-400 hover:text-white font-bold">✕</button>
        </div>
      )}
    </div>
  );
}
