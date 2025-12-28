import React, { useEffect, useRef } from 'react';
import { Renderer } from './engine/Renderer';
import { World } from './engine/World';
import { Player } from './entities/Player';
import { InputManager } from './engine/InputManager';
import { WORLD_HEIGHT, TileType } from './engine/constants';
import { useStore } from './ui/store';

// UI Components
import Hotbar from './ui/Hotbar';
import DebugInfo from './ui/DebugInfo';
import BlockPalette from './ui/BlockPalette';

// Main Game Loop Component
function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<{
    renderer: Renderer;
    world: World;
    player: Player;
    input: InputManager;
    lastTime: number;
    worldAccumulator?: number;
    wasEPressed?: boolean;
  } | null>(null);

  const { selectedTile, paused } = useStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Engine
    const renderer = new Renderer(canvasRef.current);
    const world = new World();
    const player = new Player(0, WORLD_HEIGHT / 2 - 5); // Start mid-air
    const input = new InputManager();

    // Initial terrain generation around player
    // This happens automatically in getTile/render loop but good to warm up

    gameRef.current = {
      renderer,
      world,
      player,
      input,
      lastTime: performance.now()
    };

    const loop = (time: number) => {
      if (!gameRef.current) return;
      const { renderer, world, player, input, lastTime } = gameRef.current;

      const dt = Math.min((time - lastTime) / 1000, 0.1); // Cap dt
      gameRef.current.lastTime = time;

      if (!useStore.getState().paused) {
          // Update Logic
          const inputState = {
            left: input.isKeyDown('KeyA') || input.isKeyDown('ArrowLeft'),
            right: input.isKeyDown('KeyD') || input.isKeyDown('ArrowRight'),
            jump: input.isKeyDown('Space') || input.isKeyDown('ArrowUp')
          };

          // Toggle Inventory with E
          if (input.isKeyDown('KeyE') && !gameRef.current.wasEPressed) {
              useStore.getState().setShowInventory(!useStore.getState().showInventory);
              gameRef.current.wasEPressed = true;
          }
          if (!input.isKeyDown('KeyE')) {
              gameRef.current.wasEPressed = false;
          }

          // Physics Step
          // We can use a simpler accumulator if we want strict fixed timestep,
          // but for this scope, let's just ensure we don't spiral.
          // Player uses dt, World simulation is step-based.

          player.update(dt, world, inputState);

          // Fixed timestep for world simulation (e.g. 10 ticks per second for fluids)
          // Actually, we want smooth visuals, so maybe we update every frame but only process a fraction of blocks?
          // Or we use an accumulator.

          // Simple Accumulator for World Physics (10Hz)
          if (!gameRef.current.worldAccumulator) gameRef.current.worldAccumulator = 0;
          gameRef.current.worldAccumulator += dt;
          const PHYSICS_STEP = 1 / 10;

          while (gameRef.current.worldAccumulator >= PHYSICS_STEP) {
              world.update(PHYSICS_STEP);
              gameRef.current.worldAccumulator -= PHYSICS_STEP;
          }

          // Interaction
          if (input.mouse.left) {
             const worldPos = renderer.screenToWorld(input.mouse.x, input.mouse.y);
             world.chunkManager.setTile(Math.floor(worldPos.x), Math.floor(worldPos.y), TileType.AIR);
          }
          if (input.mouse.right) {
             const worldPos = renderer.screenToWorld(input.mouse.x, input.mouse.y);
             const targetX = Math.floor(worldPos.x);
             const targetY = Math.floor(worldPos.y);

             // Prevent placing inside player
             const playerRect = {
                 x: player.pos.x, y: player.pos.y, w: player.size.x, h: player.size.y
             };
             const tileRect = { x: targetX, y: targetY, w: 1, h: 1 };

             if (!rectIntersect(playerRect, tileRect)) {
                 world.chunkManager.setTile(targetX, targetY, useStore.getState().selectedTile);
             }
          }
      }

      // Render
      renderer.render(world, player);

      requestAnimationFrame(loop);
    };

    const animId = requestAnimationFrame(loop);

    // Save/Load Handlers
    const onSave = () => {
        if (gameRef.current) {
            console.log("Saving world...");
            gameRef.current.world.chunkManager.saveToLocalStorage('default');
            alert("World saved!");
        }
    };

    const onLoad = () => {
        if (gameRef.current) {
            console.log("Loading world...");
            if (gameRef.current.world.chunkManager.loadFromLocalStorage('default')) {
                alert("World loaded!");
            } else {
                alert("No save found.");
            }
        }
    };

    window.addEventListener('save-world', onSave);
    window.addEventListener('load-world', onLoad);

    return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('save-world', onSave);
        window.removeEventListener('load-world', onLoad);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <canvas ref={canvasRef} className="block w-full h-full" />

      <div className="absolute top-0 left-0 w-full p-4 pointer-events-none flex justify-center">
         <h1 className="text-white text-2xl font-bold drop-shadow-md bg-black/30 px-4 py-1 rounded-full backdrop-blur-sm">Pixel Sandbox</h1>
      </div>

      <BlockPalette />

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <Hotbar />
      </div>

      <div className="absolute top-4 right-4 pointer-events-auto">
         <DebugInfo />
      </div>
    </div>
  );
}

function rectIntersect(r1: any, r2: any) {
    return !(r2.x >= r1.x + r1.w ||
             r2.x + r2.w <= r1.x ||
             r2.y >= r1.y + r1.h ||
             r2.y + r2.h <= r1.y);
}

export default App;
