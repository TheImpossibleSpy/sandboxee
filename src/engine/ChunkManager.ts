import { TileType, CHUNK_SIZE, WORLD_HEIGHT, TILE_PROPERTIES } from './constants';
import { Chunk, ChunkData, Tile } from './types';
import { createNoise2D } from 'simplex-noise';

export class ChunkManager {
  chunks: Map<string, Chunk> = new Map();
  noise2D = createNoise2D();

  getChunkKey(cx: number, cy: number): string {
    return `${cx},${cy}`;
  }

  getChunk(cx: number, cy: number): Chunk | undefined {
    return this.chunks.get(this.getChunkKey(cx, cy));
  }

  generateChunk(cx: number, cy: number): Chunk {
    const data: ChunkData = [];

    for (let x = 0; x < CHUNK_SIZE; x++) {
      data[x] = [];
      for (let y = 0; y < CHUNK_SIZE; y++) {
        const worldX = cx * CHUNK_SIZE + x;
        const worldY = cy * CHUNK_SIZE + y;

        // Simple generation logic
        let type = TileType.AIR;

        // Base terrain height
        const heightNoise = this.noise2D(worldX * 0.05, 0);
        const surfaceLevel = Math.floor(WORLD_HEIGHT / 2 + heightNoise * 10);

        if (worldY > surfaceLevel) {
           if (worldY > surfaceLevel + 5) {
             type = TileType.STONE;
             // Caves
             const caveNoise = this.noise2D(worldX * 0.08, worldY * 0.08);
             if (caveNoise > 0.4) {
               type = TileType.AIR;
             }
           } else {
             type = TileType.DIRT;
           }
        } else if (worldY === surfaceLevel) {
          type = TileType.GRASS;
        }

        // Bedrock at bottom
        if (worldY >= WORLD_HEIGHT - 2) {
            type = TileType.BEDROCK;
        }

        data[x][y] = { type };
      }
    }

    const chunk: Chunk = { x: cx, y: cy, data, dirty: true };
    this.chunks.set(this.getChunkKey(cx, cy), chunk);
    return chunk;
  }

  getTile(x: number, y: number): Tile {
    // If out of bounds of vertical world limit
    if (y < 0 || y >= WORLD_HEIGHT) return { type: TileType.AIR };

    const cx = Math.floor(x / CHUNK_SIZE);
    const cy = Math.floor(y / CHUNK_SIZE);
    const localX = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const localY = ((y % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;

    let chunk = this.getChunk(cx, cy);
    if (!chunk) {
      chunk = this.generateChunk(cx, cy);
    }

    return chunk.data[localX][localY];
  }

  setTile(x: number, y: number, type: TileType): void {
    if (y < 0 || y >= WORLD_HEIGHT) return;

    const cx = Math.floor(x / CHUNK_SIZE);
    const cy = Math.floor(y / CHUNK_SIZE);
    const localX = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const localY = ((y % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;

    let chunk = this.getChunk(cx, cy);
    if (!chunk) {
      chunk = this.generateChunk(cx, cy);
    }

    chunk.data[localX][localY].type = type;
    chunk.dirty = true;
  }

  saveToLocalStorage(name: string) {
      const chunksData = Array.from(this.chunks.entries()).map(([key, chunk]) => {
         return {
             key,
             x: chunk.x,
             y: chunk.y,
             data: chunk.data
         };
      });
      localStorage.setItem(`world_${name}`, JSON.stringify(chunksData));
  }

  loadFromLocalStorage(name: string) {
      const json = localStorage.getItem(`world_${name}`);
      if (!json) return false;

      const chunksData = JSON.parse(json);
      this.chunks.clear();

      chunksData.forEach((c: any) => {
          this.chunks.set(c.key, {
              x: c.x,
              y: c.y,
              data: c.data,
              dirty: true
          });
      });
      return true;
  }
}
