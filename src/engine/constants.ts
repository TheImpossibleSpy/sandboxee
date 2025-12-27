export const TILE_SIZE = 32;
export const CHUNK_SIZE = 16;
export const WORLD_HEIGHT = 128; // Blocks
export const GRAVITY = 0.5;
export const MAX_FALL_SPEED = 10;
export const PLAYER_SPEED = 4;
export const JUMP_FORCE = 8;
export const TICK_RATE = 60;

export enum TileType {
  AIR = 0,
  DIRT = 1,
  GRASS = 2,
  STONE = 3,
  SAND = 4,
  WATER = 5,
  WOOD = 6,
  FIRE = 7,
  LAVA = 8,
  METAL = 9,
  BEDROCK = 10,
}

export const TILE_COLORS: Record<TileType, string> = {
  [TileType.AIR]: 'transparent',
  [TileType.DIRT]: '#5d4037',
  [TileType.GRASS]: '#388e3c',
  [TileType.STONE]: '#757575',
  [TileType.SAND]: '#fbc02d',
  [TileType.WATER]: '#0288d1',
  [TileType.WOOD]: '#795548',
  [TileType.FIRE]: '#e64a19',
  [TileType.LAVA]: '#d32f2f',
  [TileType.METAL]: '#607d8b',
  [TileType.BEDROCK]: '#212121',
};

export const TILE_PROPERTIES: Record<TileType, {
    solid: boolean;
    liquid: boolean;
    gravity: boolean;
    durability: number;
    flammable: boolean;
}> = {
  [TileType.AIR]: { solid: false, liquid: false, gravity: false, durability: 0, flammable: false },
  [TileType.DIRT]: { solid: true, liquid: false, gravity: false, durability: 10, flammable: false },
  [TileType.GRASS]: { solid: true, liquid: false, gravity: false, durability: 10, flammable: false },
  [TileType.STONE]: { solid: true, liquid: false, gravity: false, durability: 30, flammable: false },
  [TileType.SAND]: { solid: true, liquid: false, gravity: true, durability: 5, flammable: false },
  [TileType.WATER]: { solid: false, liquid: true, gravity: true, durability: 0, flammable: false },
  [TileType.WOOD]: { solid: true, liquid: false, gravity: false, durability: 15, flammable: true },
  [TileType.FIRE]: { solid: false, liquid: false, gravity: false, durability: 0, flammable: false },
  [TileType.LAVA]: { solid: false, liquid: true, gravity: true, durability: 0, flammable: false },
  [TileType.METAL]: { solid: true, liquid: false, gravity: false, durability: 100, flammable: false },
  [TileType.BEDROCK]: { solid: true, liquid: false, gravity: false, durability: Infinity, flammable: false },
};
