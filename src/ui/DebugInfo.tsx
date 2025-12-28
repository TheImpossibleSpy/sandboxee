import React from 'react';
import { useStore } from './store';
import { SquareCode, MonitorPlay } from 'lucide-react';

const DebugInfo: React.FC = () => {
  const { debug, setDebug, paused, setPaused } = useStore();

  return (
    <div className="flex flex-col gap-2 items-end">
        <div className="flex gap-2">
            <button
                onClick={() => setPaused(!paused)}
                className="bg-black/50 p-2 rounded text-white hover:bg-black/70"
            >
                {paused ? 'RESUME' : 'PAUSE'}
            </button>
             <button
                onClick={() => setDebug(!debug)}
                className="bg-black/50 p-2 rounded text-white hover:bg-black/70"
                title="Toggle Debug"
            >
                <SquareCode size={20} />
            </button>
        </div>

      {debug && (
        <div className="bg-black/70 p-4 rounded text-white text-xs font-mono">
           <p>FPS: --</p>
           <p>Entities: 1</p>
           <p>Chunks: --</p>
        </div>
      )}
      <div className="flex gap-2">
         <button onClick={() => window.dispatchEvent(new CustomEvent('save-world'))} className="bg-green-600 p-2 rounded text-white text-xs hover:bg-green-500">Save</button>
         <button onClick={() => window.dispatchEvent(new CustomEvent('load-world'))} className="bg-blue-600 p-2 rounded text-white text-xs hover:bg-blue-500">Load</button>
      </div>
    </div>
  );
};

export default DebugInfo;
