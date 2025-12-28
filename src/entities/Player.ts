import { Entity, Vector2 } from './types';
import { World } from './World';
import { GRAVITY, MAX_FALL_SPEED, TILE_SIZE, PLAYER_SPEED, JUMP_FORCE, TILE_PROPERTIES } from './constants';

export class Player implements Entity {
  id: string = 'player';
  pos: Vector2;
  vel: Vector2;
  size: Vector2;
  grounded: boolean = false;

  constructor(x: number, y: number) {
    this.pos = { x, y };
    this.vel = { x: 0, y: 0 };
    this.size = { x: 0.8, y: 1.8 }; // In tiles
  }

  update(dt: number, world: World, input: { left: boolean, right: boolean, jump: boolean }) {
    // Horizontal Movement
    if (input.left) {
      this.vel.x = -PLAYER_SPEED;
    } else if (input.right) {
      this.vel.x = PLAYER_SPEED;
    } else {
      this.vel.x = 0;
    }

    // Apply Gravity
    this.vel.y += GRAVITY;
    if (this.vel.y > MAX_FALL_SPEED) this.vel.y = MAX_FALL_SPEED;

    // Jumping
    if (input.jump && this.grounded) {
      this.vel.y = -JUMP_FORCE;
      this.grounded = false;
    }

    // Collision Detection & Resolution
    this.handleCollisions(world);

    // Apply Velocity
    // Note: handleCollisions modifies position directly or adjusts velocity?
    // Usually better to move on one axis, check collision, move on other, check.
  }

  handleCollisions(world: World) {
    this.grounded = false;

    // X Axis
    this.pos.x += this.vel.x * (1/60); // Assuming fixed step 60fps roughly
    // Check collision
    if (this.checkCollision(world)) {
       this.pos.x -= this.vel.x * (1/60);
       this.vel.x = 0;
    }

    // Y Axis
    this.pos.y += this.vel.y * (1/60);
    if (this.checkCollision(world)) {
       this.pos.y -= this.vel.y * (1/60);

       if (this.vel.y > 0) {
         this.grounded = true;
       }
       this.vel.y = 0;
    }
  }

  checkCollision(world: World): boolean {
    const minX = Math.floor(this.pos.x);
    const maxX = Math.floor(this.pos.x + this.size.x);
    const minY = Math.floor(this.pos.y);
    const maxY = Math.floor(this.pos.y + this.size.y);

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const tile = world.chunkManager.getTile(x, y);
        if (TILE_PROPERTIES[tile.type].solid) {
          return true;
        }
      }
    }
    return false;
  }
}
