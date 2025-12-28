import { World } from './World';
import { Player } from '../entities/Player';
import { TileType, TILE_COLORS, TILE_SIZE, CHUNK_SIZE } from './constants';

export class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number = 0;
  height: number = 0;
  camera: { x: number; y: number; zoom: number };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;
    this.resize();

    this.camera = { x: 0, y: 0, zoom: 1 };

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx.imageSmoothingEnabled = false; // Pixel art style
  }

  render(world: World, player: Player) {
    // Clear screen
    this.ctx.fillStyle = '#87CEEB'; // Sky blue
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Follow player
    // Center the player
    // Camera is top-left in world coordinates
    const viewportWidthInTiles = this.width / TILE_SIZE / this.camera.zoom;
    const viewportHeightInTiles = this.height / TILE_SIZE / this.camera.zoom;

    const targetCamX = player.pos.x - viewportWidthInTiles / 2 + player.size.x / 2;
    const targetCamY = player.pos.y - viewportHeightInTiles / 2 + player.size.y / 2;

    // Smooth camera could go here, for now instant
    this.camera.x = targetCamX;
    this.camera.y = targetCamY;

    this.ctx.save();
    this.ctx.scale(this.camera.zoom, this.camera.zoom);
    this.ctx.translate(-this.camera.x * TILE_SIZE, -this.camera.y * TILE_SIZE);

    // Calculate visible chunks
    const startCol = Math.floor(this.camera.x);
    const endCol = startCol + Math.ceil(viewportWidthInTiles) + 1;
    const startRow = Math.floor(this.camera.y);
    const endRow = startRow + Math.ceil(viewportHeightInTiles) + 1;

    // Render Tiles
    for (let y = startRow; y < endRow; y++) {
      for (let x = startCol; x < endCol; x++) {
        const tile = world.chunkManager.getTile(x, y);
        if (tile.type !== TileType.AIR) {
          this.ctx.fillStyle = TILE_COLORS[tile.type];
          this.ctx.fillRect(
            x * TILE_SIZE,
            y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
          );

          // Debug borders (optional, if grid enabled)
          // this.ctx.strokeStyle = 'rgba(0,0,0,0.1)';
          // this.ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }

    // Render Player
    this.ctx.fillStyle = '#FF0000'; // Player color
    this.ctx.fillRect(
        player.pos.x * TILE_SIZE,
        player.pos.y * TILE_SIZE,
        player.size.x * TILE_SIZE,
        player.size.y * TILE_SIZE
    );

    this.ctx.restore();
  }

  // Convert screen coordinates to world coordinates
  screenToWorld(screenX: number, screenY: number): { x: number, y: number } {
    const worldX = (screenX / this.camera.zoom) / TILE_SIZE + this.camera.x;
    const worldY = (screenY / this.camera.zoom) / TILE_SIZE + this.camera.y;
    return { x: worldX, y: worldY };
  }
}
