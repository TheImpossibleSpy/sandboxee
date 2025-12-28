import React from 'react';
import { useStore } from './store';
import { TileType, TILE_COLORS } from '../engine/constants';
import clsx from 'clsx';
import { Grid } from 'lucide-react';

const TILES_IN_HOTBAR = [
  TileType.DIRT,
  TileType.GRASS,
  TileType.STONE,
  TileType.SAND,
  TileType.WOOD,
  TileType.METAL,
  TileType.WATER,
  TileType.LAVA,
  TileType.FIRE,
];

const Hotbar: React.FC = () => {
  const { selectedTile, setSelectedTile, setShowInventory, showInventory } = useStore();

  return (
    <div className="flex items-center gap-4">
        <button
            onClick={() => setShowInventory(!showInventory)}
            className={clsx(
                "bg-black/50 p-3 rounded-lg text-white hover:bg-black/70 transition-colors border-2",
                showInventory ? "border-white" : "border-transparent"
            )}
            title="Toggle Palette (E)"
        >
            <Grid size={24} />
        </button>

        <div className="flex gap-2 bg-black/50 p-2 rounded-lg backdrop-blur-sm">
        {TILES_IN_HOTBAR.map((tile) => (
            <button
            key={tile}
            onClick={() => setSelectedTile(tile)}
            className={clsx(
                "w-10 h-10 border-2 rounded transition-transform hover:scale-110 flex items-center justify-center",
                selectedTile === tile ? "border-white scale-110" : "border-transparent opacity-70 hover:opacity-100"
            )}
            style={{ backgroundColor: TILE_COLORS[tile] }}
            title={TileType[tile]}
            >
                <span className="text-[10px] text-white/50 drop-shadow-md font-bold">{TileType[tile][0]}</span>
            </button>
        ))}
        </div>
    </div>
  );
};

export default Hotbar;
