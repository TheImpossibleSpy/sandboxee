import React from 'react';
import { useStore } from './store';
import { TileType, TILE_COLORS } from '../engine/constants';
import clsx from 'clsx';
import { X } from 'lucide-react';

const BlockPalette: React.FC = () => {
    const { setSelectedTile, setShowInventory, showInventory } = useStore();

    if (!showInventory) return null;

    const allTiles = Object.values(TileType).filter(v => typeof v === 'number') as TileType[];

    return (
        <div className="absolute top-0 left-0 h-full w-64 bg-black/80 backdrop-blur-md p-4 text-white flex flex-col gap-4 overflow-y-auto pointer-events-auto border-r border-white/20 transition-transform">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Blocks</h2>
                <button onClick={() => setShowInventory(false)} className="hover:bg-white/20 p-1 rounded">
                    <X size={20} />
                </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
                {allTiles.map((tile) => (
                    tile !== TileType.AIR && (
                        <button
                            key={tile}
                            onClick={() => setSelectedTile(tile)}
                            className="group relative w-12 h-12 border border-white/30 rounded hover:border-white hover:scale-105 transition-all bg-black/40 flex items-center justify-center"
                            title={TileType[tile]}
                        >
                            <div
                                className="w-8 h-8 rounded-sm shadow-sm"
                                style={{ backgroundColor: TILE_COLORS[tile] }}
                            />
                            {/* Tooltip */}
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                                {TileType[tile]}
                            </span>
                        </button>
                    )
                ))}
            </div>

            <div className="mt-auto text-xs text-gray-400">
                <p>Scroll to view more...</p>
            </div>
        </div>
    );
};

export default BlockPalette;
