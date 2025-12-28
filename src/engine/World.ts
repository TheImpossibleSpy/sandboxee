import { ChunkManager } from './ChunkManager';
import { TileType, TILE_PROPERTIES, CHUNK_SIZE } from './constants';

export class World {
  chunkManager: ChunkManager;
  activeChunks: Set<string> = new Set();

  constructor() {
    this.chunkManager = new ChunkManager();
  }

  update(dt: number) {
    // Simple Cellular Automata for Physics
    // We will iterate over loaded chunks and update a random subset of blocks or use a bottom-up approach for gravity.
    // For a smoother simulation, we often double-buffer or use a checkerboard pattern,
    // but for this sandbox, let's try a direct bottom-up scan of active chunks.

    // To prevent everything happening instantly, we can update chunks.
    // Ideally we iterate active chunks.

    this.chunkManager.chunks.forEach((chunk) => {
        // We scan from bottom to top, left to right
        for (let y = CHUNK_SIZE - 1; y >= 0; y--) {
            // Randomize x direction to prevent bias?
            // Or just iterate standard for performance.
             for (let x = 0; x < CHUNK_SIZE; x++) {
                 // Convert to world coordinates
                 const worldX = chunk.x * CHUNK_SIZE + x;
                 const worldY = chunk.y * CHUNK_SIZE + y;

                 this.updateTile(worldX, worldY);
             }
        }
    });
  }

  updateTile(x: number, y: number) {
      const tile = this.chunkManager.getTile(x, y);
      const props = TILE_PROPERTIES[tile.type];

      // Fire Logic
      if (tile.type === TileType.FIRE) {
          // Chance to burn out
          if (Math.random() < 0.05) {
              this.chunkManager.setTile(x, y, TileType.AIR);
              return;
          }

          // Spread to neighbors
          const neighbors = [
              { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
              { dx: -1, dy: 0 }, { dx: 1, dy: 0 }
          ];

          for (const n of neighbors) {
              const nx = x + n.dx;
              const ny = y + n.dy;
              const neighborTile = this.chunkManager.getTile(nx, ny);
              if (TILE_PROPERTIES[neighborTile.type].flammable) {
                  // Ignite neighbor with some probability
                  if (Math.random() < 0.1) {
                      this.chunkManager.setTile(nx, ny, TileType.FIRE);
                  }
              } else if (neighborTile.type === TileType.WATER) {
                  // Extinguish self
                  this.chunkManager.setTile(x, y, TileType.AIR);
                  return;
              }
          }
          return;
      }

      // Gravity (Sand, Liquids)
      if (props.gravity) {
          const below = this.chunkManager.getTile(x, y + 1);
          const belowProps = TILE_PROPERTIES[below.type];

          // If empty below, fall
          if (!belowProps.solid && !belowProps.liquid) {
              // Move down
              this.chunkManager.setTile(x, y + 1, tile.type);
              this.chunkManager.setTile(x, y, TileType.AIR);
              return;
          }

          // Liquid spread or Sand piling
          if (props.liquid) {
             // Try move side
             const left = this.chunkManager.getTile(x - 1, y);
             const right = this.chunkManager.getTile(x + 1, y);

             // Simple flow
             const canLeft = !TILE_PROPERTIES[left.type].solid && !TILE_PROPERTIES[left.type].liquid;
             const canRight = !TILE_PROPERTIES[right.type].solid && !TILE_PROPERTIES[right.type].liquid;

             if (canLeft && canRight) {
                 const dir = Math.random() > 0.5 ? -1 : 1;
                 this.chunkManager.setTile(x + dir, y, tile.type);
                 this.chunkManager.setTile(x, y, TileType.AIR);
             } else if (canLeft) {
                 this.chunkManager.setTile(x - 1, y, tile.type);
                 this.chunkManager.setTile(x, y, TileType.AIR);
             } else if (canRight) {
                 this.chunkManager.setTile(x + 1, y, tile.type);
                 this.chunkManager.setTile(x, y, TileType.AIR);
             }
          } else {
              // Sand piling (diagonal fall)
               const belowLeft = this.chunkManager.getTile(x - 1, y + 1);
               const belowRight = this.chunkManager.getTile(x + 1, y + 1);

               const canBL = !TILE_PROPERTIES[belowLeft.type].solid && !TILE_PROPERTIES[belowLeft.type].liquid;
               const canBR = !TILE_PROPERTIES[belowRight.type].solid && !TILE_PROPERTIES[belowRight.type].liquid;

               if (canBL && canBR) {
                   const dir = Math.random() > 0.5 ? -1 : 1;
                   this.chunkManager.setTile(x + dir, y + 1, tile.type);
                   this.chunkManager.setTile(x, y, TileType.AIR);
               } else if (canBL) {
                   this.chunkManager.setTile(x - 1, y + 1, tile.type);
                   this.chunkManager.setTile(x, y, TileType.AIR);
               } else if (canBR) {
                   this.chunkManager.setTile(x + 1, y + 1, tile.type);
                   this.chunkManager.setTile(x, y, TileType.AIR);
               }
          }
      }
  }

  // Helper for physics
  isSolid(x: number, y: number): boolean {
    const tile = this.chunkManager.getTile(x, y);
    return TILE_PROPERTIES[tile.type].solid;
  }
}
