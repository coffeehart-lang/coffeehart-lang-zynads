import React, { useState } from 'react';
import { 
  Workflow, 
  Plus, 
  Sparkles, 
  Play, 
  Layers, 
  FileText, 
  Film, 
  Volume2, 
  Check, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface NodeItem {
  id: string;
  title: string;
  type: 'script' | 'asset' | 'model' | 'audio' | 'output';
  status: 'ready' | 'processing' | 'completed';
  x: number;
  y: number;
  configText: string;
}

export default function NodeEditorView() {
  const [nodes, setNodes] = useState<NodeItem[]>([
    {
      id: 'node-1',
      title: 'Commercial Script Prompt',
      type: 'script',
      status: 'completed',
      x: 40,
      y: 60,
      configText: 'Zencast CFO Organic Code Pasture Commercial script'
    },
    {
      id: 'node-2',
      title: 'Character Reference Assets',
      type: 'asset',
      status: 'completed',
      x: 320,
      y: 60,
      configText: '@img-1 Founder on Porch, @img-3 RAM Stick Pasture'
    },
    {
      id: 'node-3',
      title: 'MiniMax H3 Video Model',
      type: 'model',
      status: 'completed',
      x: 600,
      y: 60,
      configText: 'MiniMax H3 6s • 16:9 • 4K Cinema Output'
    },
    {
      id: 'node-4',
      title: 'AI Voice & Speech Sync',
      type: 'audio',
      status: 'completed',
      x: 320,
      y: 240,
      configText: 'Natural founder voice tone • Studio Microphone'
    },
    {
      id: 'node-5',
      title: 'ZynAds 4K Ad Campaign Export',
      type: 'output',
      status: 'completed',
      x: 880,
      y: 150,
      configText: 'Exported MP4 Commercial attached to Ad Campaign'
    }
  ]);

  const [isRunningWorkflow, setIsRunningWorkflow] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleRunWorkflow = () => {
    setIsRunningWorkflow(true);
    setTimeout(() => {
      setIsRunningWorkflow(false);
      setNotice('✨ Krea Node Editor Workflow executed successfully across all nodes!');
    }, 2000);
  };

  const handleAddNode = () => {
    const newNode: NodeItem = {
      id: `node-${Date.now()}`,
      title: `Custom Node #${nodes.length + 1}`,
      type: 'model',
      status: 'ready',
      x: 100 + (nodes.length * 30),
      y: 100 + (nodes.length * 20),
      configText: 'Configured node parameters'
    };
    setNodes(prev => [...prev, newNode]);
    setNotice(`Added new node to workflow graph!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Workflow className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-white">
              Visual AI Node Workflow Editor
              <span className="text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded uppercase">
                GRAPH ENGINE & MCP NODES
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Connect script prompts, character reference images (@img), video models, and audio synthesis in a visual graph
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddNode}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4 text-indigo-400" /> Add Node
          </button>
          <button
            type="button"
            onClick={handleRunWorkflow}
            disabled={isRunningWorkflow}
            className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isRunningWorkflow ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin text-amber-300" /> Executing Workflow Graph...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-white" /> Run Node Workflow
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Canvas Graph Workspace */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white min-h-[480px] relative overflow-hidden shadow-2xl space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-3">
          <span>WORKFLOW GRAPH: ZENCAST COMMERCIAL SYNTHESIS</span>
          <span className="text-emerald-400 font-bold">● ALL 5 NODES SYNCED</span>
        </div>

        {/* Nodes Grid Canvas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500 rounded-2xl p-4 space-y-3 shadow-xl relative transition-all group"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold font-mono text-indigo-300 flex items-center gap-1.5">
                  {node.type === 'script' && <FileText className="w-4 h-4 text-amber-400" />}
                  {node.type === 'asset' && <Layers className="w-4 h-4 text-purple-400" />}
                  {node.type === 'model' && <Film className="w-4 h-4 text-indigo-400" />}
                  {node.type === 'audio' && <Volume2 className="w-4 h-4 text-emerald-400" />}
                  {node.type === 'output' && <Sparkles className="w-4 h-4 text-pink-400" />}
                  {node.title}
                </span>
                <span className="text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded">
                  ✓ READY
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {node.configText}
              </p>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/60">
                <span>Output Wire ➔</span>
                <span className="text-indigo-400 font-bold group-hover:underline cursor-pointer">Configure &rarr;</span>
              </div>
            </div>
          ))}
        </div>

        {notice && (
          <div className="p-3 bg-emerald-950 border border-emerald-700/60 rounded-xl text-xs text-emerald-300 font-medium flex items-center justify-between">
            <span>{notice}</span>
            <button onClick={() => setNotice(null)} className="text-emerald-400 hover:text-white font-bold">✕</button>
          </div>
        )}
      </div>
    </div>
  );
}
