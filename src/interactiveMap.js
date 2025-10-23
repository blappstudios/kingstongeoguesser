/**
 * Interactive Map Component for Kingston GeoGuesser
 * Provides zoom, pan, and click functionality
 */

export const InteractiveMap = {
  container: null,
  canvas: null,
  ctx: null,
  
  // Map state
  centerLat: 44.231,
  centerLon: -76.498,
  zoom: 12,
  minZoom: 8,
  maxZoom: 18,
  
  // Canvas dimensions
  width: 800,
  height: 600,
  
  // Interaction state
  isDragging: false,
  lastMouseX: 0,
  lastMouseY: 0,
  dragStartX: 0,
  dragStartY: 0,
  
  // Callbacks
  onMapClick: null,
  
  /**
   * Initialize the interactive map
   */
  init(container, onMapClick) {
    this.container = container;
    this.onMapClick = onMapClick;
    
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.cursor = 'grab';
    this.canvas.style.borderRadius = '8px';
    
    this.ctx = this.canvas.getContext('2d');
    
    // Add to container
    this.container.innerHTML = '';
    this.container.appendChild(this.canvas);
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Initial render
    this.render();
  },
  
  /**
   * Setup event listeners for interaction
   */
  setupEventListeners() {
    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    
    // Touch events for mobile
    this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    
    // Wheel zoom
    this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
    
    // Prevent context menu
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  },
  
  /**
   * Handle mouse down for dragging
   */
  handleMouseDown(e) {
    this.isDragging = true;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.canvas.style.cursor = 'grabbing';
  },
  
  /**
   * Handle mouse move for dragging
   */
  handleMouseMove(e) {
    if (!this.isDragging) return;
    
    const deltaX = e.clientX - this.lastMouseX;
    const deltaY = e.clientY - this.lastMouseY;
    
    // Convert pixel movement to lat/lon movement
    const latDelta = (deltaY / this.height) * (180 / Math.pow(2, this.zoom));
    const lonDelta = (deltaX / this.width) * (360 / Math.pow(2, this.zoom));
    
    this.centerLat -= latDelta;
    this.centerLon -= lonDelta;
    
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
    
    this.render();
  },
  
  /**
   * Handle mouse up
   */
  handleMouseUp(e) {
    this.isDragging = false;
    this.canvas.style.cursor = 'grab';
  },
  
  /**
   * Handle click (only if not dragged)
   */
  handleClick(e) {
    const dragDistance = Math.sqrt(
      Math.pow(e.clientX - this.dragStartX, 2) + 
      Math.pow(e.clientY - this.dragStartY, 2)
    );
    
    // Only trigger click if drag distance is small
    if (dragDistance < 5) {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const coords = this.screenToLatLon(x, y);
      if (this.onMapClick) {
        this.onMapClick(coords.lat, coords.lon);
      }
    }
  },
  
  /**
   * Handle touch start
   */
  handleTouchStart(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
      this.handleMouseDown({
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY
      });
    }
  },
  
  /**
   * Handle touch move
   */
  handleTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
      this.handleMouseMove({
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY
      });
    }
  },
  
  /**
   * Handle touch end
   */
  handleTouchEnd(e) {
    e.preventDefault();
    this.handleMouseUp(e);
  },
  
  /**
   * Handle wheel zoom
   */
  handleWheel(e) {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -1 : 1;
    const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom + delta * 0.5));
    
    if (newZoom !== this.zoom) {
      this.zoom = newZoom;
      this.render();
    }
  },
  
  /**
   * Convert screen coordinates to lat/lon
   */
  screenToLatLon(x, y) {
    const normalizedX = x / this.width;
    const normalizedY = y / this.height;
    
    // Calculate the lat/lon bounds at current zoom
    const latRange = 180 / Math.pow(2, this.zoom);
    const lonRange = 360 / Math.pow(2, this.zoom);
    
    const lat = this.centerLat + (0.5 - normalizedY) * latRange;
    const lon = this.centerLon + (normalizedX - 0.5) * lonRange;
    
    return { lat, lon };
  },
  
  /**
   * Convert lat/lon to screen coordinates
   */
  latLonToScreen(lat, lon) {
    const latRange = 180 / Math.pow(2, this.zoom);
    const lonRange = 360 / Math.pow(2, this.zoom);
    
    const normalizedY = 0.5 - (lat - this.centerLat) / latRange;
    const normalizedX = 0.5 + (lon - this.centerLon) / lonRange;
    
    return {
      x: normalizedX * this.width,
      y: normalizedY * this.height
    };
  },
  
  /**
   * Render the map
   */
  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw background
    this.drawBackground();
    
    // Draw map tiles (simplified for now)
    this.drawMapTiles();
    
    // Draw landmarks
    this.drawLandmarks();
    
    // Draw grid (optional, for debugging)
    if (this.zoom >= 14) {
      this.drawGrid();
    }
  },
  
  /**
   * Draw background
   */
  drawBackground() {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#e8f4f8');
    gradient.addColorStop(1, '#d1e7dd');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  },
  
  /**
   * Draw map tiles (simplified representation)
   */
  drawMapTiles() {
    // Draw roads
    this.ctx.strokeStyle = '#666666';
    this.ctx.lineWidth = 1;
    
    // Main roads
    for (let i = 0; i < 5; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.height * (0.2 + i * 0.15));
      this.ctx.lineTo(this.width, this.height * (0.2 + i * 0.15));
      this.ctx.stroke();
      
      this.ctx.beginPath();
      this.ctx.moveTo(this.width * (0.2 + i * 0.15), 0);
      this.ctx.lineTo(this.width * (0.2 + i * 0.15), this.height);
      this.ctx.stroke();
    }
    
    // Draw water (Lake Ontario)
    this.ctx.fillStyle = '#4a90e2';
    this.ctx.fillRect(0, this.height * 0.8, this.width, this.height * 0.2);
    
    // Draw parks
    this.ctx.fillStyle = '#90ee90';
    this.ctx.beginPath();
    this.ctx.arc(this.width * 0.2, this.height * 0.3, 30, 0, 2 * Math.PI);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.arc(this.width * 0.7, this.height * 0.6, 25, 0, 2 * Math.PI);
    this.ctx.fill();
  },
  
  /**
   * Draw landmarks
   */
  drawLandmarks() {
    // Queen's University area
    this.drawLandmark(44.225, -76.495, 'Queen\'s University', '#8B0000');
    
    // Downtown Kingston
    this.drawLandmark(44.231, -76.485, 'Downtown', '#0066CC');
    
    // Fort Henry
    this.drawLandmark(44.229, -76.461, 'Fort Henry', '#8B4513');
    
    // City Hall
    this.drawLandmark(44.231, -76.485, 'City Hall', '#FF6B35');
    
    // Kingston Penitentiary
    this.drawLandmark(44.235, -76.470, 'Kingston Pen', '#2C3E50');
  },
  
  /**
   * Draw a single landmark
   */
  drawLandmark(lat, lon, name, color) {
    const screen = this.latLonToScreen(lat, lon);
    
    if (screen.x < 0 || screen.x > this.width || screen.y < 0 || screen.y > this.height) {
      return; // Off screen
    }
    
    // Draw landmark circle
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(screen.x, screen.y, 6, 0, 2 * Math.PI);
    this.ctx.fill();
    
    // Draw landmark border
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    // Draw landmark name (if zoomed in enough)
    if (this.zoom >= 14) {
      this.ctx.fillStyle = '#333333';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(name, screen.x, screen.y - 10);
    }
  },
  
  /**
   * Draw grid for debugging
   */
  drawGrid() {
    this.ctx.strokeStyle = '#cccccc';
    this.ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let i = 0; i <= 10; i++) {
      const x = (this.width / 10) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 0; i <= 10; i++) {
      const y = (this.height / 10) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
  },
  
  /**
   * Set zoom level
   */
  setZoom(zoom) {
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
    this.render();
  },
  
  /**
   * Set center coordinates
   */
  setCenter(lat, lon) {
    this.centerLat = lat;
    this.centerLon = lon;
    this.render();
  },
  
  /**
   * Get current view bounds
   */
  getBounds() {
    const latRange = 180 / Math.pow(2, this.zoom);
    const lonRange = 360 / Math.pow(2, this.zoom);
    
    return {
      north: this.centerLat + latRange / 2,
      south: this.centerLat - latRange / 2,
      east: this.centerLon + lonRange / 2,
      west: this.centerLon - lonRange / 2
    };
  }
};
