import { create } from 'zustand';
import { TileType } from '../engine/constants';

interface GameState {
  selectedTile: TileType;
  setSelectedTile: (tile: TileType) => void;
  paused: boolean;
  setPaused: (paused: boolean) => void;
  debug: boolean;
  setDebug: (debug: boolean) => void;
  showInventory: boolean;
  setShowInventory: (show: boolean) => void;
}

export const useStore = create<GameState>((set) => ({
  selectedTile: TileType.DIRT,
  setSelectedTile: (tile) => set({ selectedTile: tile }),
  paused: false,
  setPaused: (paused) => set({ paused }),
  debug: false,
  setDebug: (debug) => set({ debug }),
  showInventory: false,
  setShowInventory: (show) => set({ showInventory: show }),
}));
