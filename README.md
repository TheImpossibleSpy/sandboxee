# Pixel Sandbox
A 2D web-based sandbox game inspired by Minecraft and Terraria. Built with React, TypeScript, and Canvas API.

## Features
- **Procedural World Generation**: Infinite scrolling 2D world with caves and terrain.
- **Physics Simulation**: Gravity, falling sand, and flowing liquids (cellular automata).
- **Building System**: Place and remove blocks (Dirt, Stone, Wood, Water, Lava, etc.).
- **Player Controller**: Platformer-style movement with collision detection.
- **Save/Load**: Persist your world to LocalStorage.

## Controls
- **WASD / Arrows**: Move and Jump.
- **Mouse Left**: Break block.
- **Mouse Right**: Place block.
- **1-9**: Select hotbar tool.
- **P**: Pause / Resume.
- **Mouse Wheel**: Scroll hotbar (impl pending).

## Setup & Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173`.

## Architecture
- **Engine**: Custom game loop, physics update, and chunk management (`src/engine`).
- **Rendering**: Canvas 2D API based renderer (`src/engine/Renderer.ts`).
- **UI**: React overlay for Hotbar and Debug info (`src/ui`).
- **State**: Zustand for UI state management.

## Extending
- Add new tiles in `src/engine/constants.ts` and update `TILE_PROPERTIES`.
- Modify generation logic in `src/engine/ChunkManager.ts`.
- Adjust physics in `src/engine/World.ts`.
