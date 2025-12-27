import { TileType } from './constants';

export interface Tile {
  type: TileType;
  // Can add metadata here (e.g., variant, damage)
}

export type ChunkData = Tile[][]; // [x][y]

export interface Chunk {
  x: number;
  y: number; // For now assuming 1D chunks along X axis or full height chunks?
             // Requirement says infinite scrolling map, likely 2D chunks.
  data: ChunkData;
  dirty: boolean; // For re-rendering
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  pos: Vector2;
  vel: Vector2;
  size: Vector2;
  type: string;
}
