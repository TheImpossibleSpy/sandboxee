export class InputManager {
  keys: Set<string> = new Set();
  mouse: { x: number; y: number; left: boolean; right: boolean } = { x: 0, y: 0, left: false, right: false };

  constructor() {
    window.addEventListener('keydown', (e) => this.keys.add(e.code));
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));

    window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    });

    window.addEventListener('mousedown', (e) => {
        if (e.button === 0) this.mouse.left = true;
        if (e.button === 2) this.mouse.right = true;
    });

    window.addEventListener('mouseup', (e) => {
        if (e.button === 0) this.mouse.left = false;
        if (e.button === 2) this.mouse.right = false;
    });

    // Prevent context menu
    window.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  isKeyDown(code: string): boolean {
    return this.keys.has(code);
  }
}
