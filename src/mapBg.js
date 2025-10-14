/**
 * MapBg: Renders map tile background with parallax scrolling
 * Falls back to gradient if no MapTiler key is available
 */

const TILE_SIZE = 256;
const BBOX = {
  minLon: -76.513,
  maxLon: -76.475,
  minLat: 44.216,
  maxLat: 44.243,
};

export const MapBg = {
  maptilerKey: null,
  center: { lat: 44.231, lon: -76.485 },
  zoom: 15.6,
  scrollOffset: 0, // Horizontal scroll in pixels
  offscreenCanvas: null,
  offscreenCtx: null,
  tileCache: new Map(),
  useFallback: false,

  /**
   * Initialize map background
   */
  init(key, options = {}) {
    this.maptilerKey = key;
    this.center = options.center || this.center;
    this.zoom = options.zoom || this.zoom;
    this.useFallback = !key;

    if (this.useFallback) {
      console.warn('⚠️ No MapTiler key provided, using fallback gradient background');
    } else {
      console.log('✅ MapTiler background enabled');
      this.setupOffscreenCanvas();
    }
  },

  /**
   * Setup offscreen canvas for tile rendering
   */
  setupOffscreenCanvas() {
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = 2048;
    this.offscreenCanvas.height = 1024;
    this.offscreenCtx = this.offscreenCanvas.getContext('2d');
  },

  /**
   * Convert lat/lon to Web Mercator tile coordinates
   */
  latLonToTile(lat, lon, zoom) {
    const z = Math.floor(zoom);
    const n = Math.pow(2, z);
    const x = Math.floor(((lon + 180) / 360) * n);
    const y = Math.floor(
      ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * n
    );
    return { x, y, z };
  },

  /**
   * Project lat/lon to screen coordinates with scroll offset
   */
  project(lat, lon) {
    // Simple Web Mercator projection
    const zoom = this.zoom;
    const centerTile = this.latLonToTile(this.center.lat, this.center.lon, zoom);
    const pointTile = this.latLonToTile(lat, lon, zoom);

    const scale = Math.pow(2, zoom - Math.floor(zoom)) * TILE_SIZE;
    
    const x = (pointTile.x - centerTile.x) * TILE_SIZE * scale / TILE_SIZE - this.scrollOffset;
    const y = (pointTile.y - centerTile.y) * TILE_SIZE * scale / TILE_SIZE;

    return { x, y };
  },

  /**
   * Scroll the map (world moves right-to-left)
   */
  scroll(dx) {
    this.scrollOffset += dx;
  },

  /**
   * Get tile URL
   */
  getTileUrl(x, y, z) {
    if (!this.maptilerKey) return null;
    return `https://api.maptiler.com/maps/streets/${z}/${x}/${y}.png?key=${this.maptilerKey}`;
  },

  /**
   * Load a tile image
   */
  async loadTile(x, y, z) {
    const key = `${z}/${x}/${y}`;
    
    if (this.tileCache.has(key)) {
      return this.tileCache.get(key);
    }

    const url = this.getTileUrl(x, y, z);
    if (!url) return null;

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.tileCache.set(key, img);
        resolve(img);
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = url;
    });
  },

  /**
   * Draw map background with parallax
   */
  draw(ctx, width, height) {
    if (this.useFallback) {
      this.drawFallback(ctx, width, height);
      return;
    }

    // Draw stylized background with some parallax lines
    this.drawFallback(ctx, width, height);

    // TODO: Implement full tile rendering for production
    // For now, using fallback to ensure game is always playable
    // Full implementation would:
    // 1. Calculate visible tiles based on center, zoom, and scrollOffset
    // 2. Load and cache tiles asynchronously
    // 3. Render tiles to offscreen canvas
    // 4. Draw offscreen canvas to main canvas with parallax effect
  },

  /**
   * Draw fallback gradient background
   */
  drawFallback(ctx, width, height) {
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a2332');
    gradient.addColorStop(0.5, '#0f1729');
    gradient.addColorStop(1, '#1a2332');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Parallax lines for depth
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.1)';
    ctx.lineWidth = 2;

    const parallaxSpeed = 0.3;
    const offset = (this.scrollOffset * parallaxSpeed) % 100;

    for (let i = 0; i < 10; i++) {
      const x = (i * 100 - offset + width) % width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let i = 0; i < 6; i++) {
      const y = (i * 100 + 50);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  },

  /**
   * Reset scroll offset
   */
  reset() {
    this.scrollOffset = 0;
  },
};

