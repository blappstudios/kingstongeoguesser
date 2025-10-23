/**
 * Enhanced Static Map with zoom, pan, and click functionality
 * Combines static map images with interactive features
 */

export const EnhancedStaticMap = {
  container: null,
  canvas: null,
  ctx: null,
  onMapClick: null,
  
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
  dragThreshold: 5,
  
  // Map bounds for Kingston area
  bounds: {
    north: 44.28,
    south: 44.18,
    east: -76.45,
    west: -76.55
  },
  
  // Static map URLs cache
  mapImages: new Map(),
  
  /**
   * Initialize the enhanced static map
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
    this.canvas.style.border = '1px solid var(--geoguessr-border)';
    
    this.ctx = this.canvas.getContext('2d');
    
    // Add to container
    this.container.innerHTML = '';
    this.container.appendChild(this.canvas);
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Initial render
    this.render();
    
    console.log('🗺️ Enhanced Static Map initialized');
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
    const latRange = this.getLatRange();
    const lonRange = this.getLonRange();
    
    const latDelta = (deltaY / this.height) * latRange;
    const lonDelta = (deltaX / this.width) * lonRange;
    
    this.centerLat -= latDelta;
    this.centerLon -= lonDelta;
    
    // Constrain to Kingston bounds
    this.centerLat = Math.max(this.bounds.south, Math.min(this.bounds.north, this.centerLat));
    this.centerLon = Math.max(this.bounds.west, Math.min(this.bounds.east, this.centerLon));
    
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
   * Handle click (only if not dragged much)
   */
  handleClick(e) {
    const dragDistance = Math.sqrt(
      Math.pow(e.clientX - this.dragStartX, 2) + 
      Math.pow(e.clientY - this.dragStartY, 2)
    );
    
    // Only trigger click if drag distance is small
    if (dragDistance < this.dragThreshold) {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const coords = this.screenToLatLon(x, y);
      console.log('🎯 Map clicked at:', coords.lat, coords.lon);
      
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
    
    const latRange = this.getLatRange();
    const lonRange = this.getLonRange();
    
    const lat = this.centerLat + (0.5 - normalizedY) * latRange;
    const lon = this.centerLon + (normalizedX - 0.5) * lonRange;
    
    return { lat, lon };
  },
  
  /**
   * Convert lat/lon to screen coordinates
   */
  latLonToScreen(lat, lon) {
    const latRange = this.getLatRange();
    const lonRange = this.getLonRange();
    
    const normalizedY = 0.5 - (lat - this.centerLat) / latRange;
    const normalizedX = 0.5 + (lon - this.centerLon) / lonRange;
    
    return {
      x: normalizedX * this.width,
      y: normalizedY * this.height
    };
  },
  
  /**
   * Get latitude range at current zoom
   */
  getLatRange() {
    return (this.bounds.north - this.bounds.south) / Math.pow(2, this.zoom - 12);
  },
  
  /**
   * Get longitude range at current zoom
   */
  getLonRange() {
    return (this.bounds.east - this.bounds.west) / Math.pow(2, this.zoom - 12);
  },
  
  /**
   * Render the map
   */
  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw background
    this.drawBackground();
    
    // Draw map content
    this.drawMapContent();
    
    // Draw landmarks
    this.drawLandmarks();
    
    // Draw zoom indicator
    this.drawZoomIndicator();
  },
  
  /**
   * Draw background with gradient
   */
  drawBackground() {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#e8f4f8');
    gradient.addColorStop(0.3, '#f0f8ff');
    gradient.addColorStop(0.7, '#f0f8ff');
    gradient.addColorStop(1, '#e8f4f8');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  },
  
  /**
   * Draw map content (roads, water, etc.)
   */
  drawMapContent() {
    // Draw Lake Ontario
    this.ctx.fillStyle = '#4a90e2';
    this.ctx.fillRect(0, this.height * 0.75, this.width, this.height * 0.25);
    
    // Draw main roads
    this.ctx.strokeStyle = '#666666';
    this.ctx.lineWidth = 2;
    
    // Princess Street (main east-west road)
    const princessY = this.latLonToScreen(44.230, -76.490).y;
    this.ctx.beginPath();
    this.ctx.moveTo(0, princessY);
    this.ctx.lineTo(this.width, princessY);
    this.ctx.stroke();
    
    // Division Street (main north-south road)
    const divisionX = this.latLonToScreen(44.230, -76.490).x;
    this.ctx.beginPath();
    this.ctx.moveTo(divisionX, 0);
    this.ctx.lineTo(divisionX, this.height);
    this.ctx.stroke();
    
    // Draw secondary roads
    this.ctx.strokeStyle = '#999999';
    this.ctx.lineWidth = 1;
    
    // Draw grid of secondary roads
    for (let i = 1; i < 5; i++) {
      const y = (this.height / 5) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
      
      const x = (this.width / 5) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    
    // Draw Queen's Campus area
    this.ctx.fillStyle = 'rgba(200, 16, 46, 0.1)';
    this.ctx.strokeStyle = 'rgba(200, 16, 46, 0.3)';
    this.ctx.lineWidth = 2;
    
    const campusArea = this.latLonToScreen(44.225, -76.495);
    this.ctx.beginPath();
    this.ctx.arc(campusArea.x, campusArea.y, 60, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    
    // Draw downtown area
    this.ctx.fillStyle = 'rgba(0, 100, 200, 0.1)';
    this.ctx.strokeStyle = 'rgba(0, 100, 200, 0.3)';
    
    const downtownArea = this.latLonToScreen(44.230, -76.485);
    this.ctx.beginPath();
    this.ctx.arc(downtownArea.x, downtownArea.y, 40, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
  },
  
  /**
   * Draw key landmarks
   */
  drawLandmarks() {
    const landmarks = [
      { name: 'Queen\'s Campus', lat: 44.225, lon: -76.495, color: '#c8102e' },
      { name: 'Downtown', lat: 44.230, lon: -76.485, color: '#0064c8' },
      { name: 'City Hall', lat: 44.2309, lon: -76.4865, color: '#8B4513' },
      { name: 'Fort Henry', lat: 44.2366, lon: -76.4583, color: '#228B22' }
    ];
    
    landmarks.forEach(landmark => {
      const screen = this.latLonToScreen(landmark.lat, landmark.lon);
      
      if (screen.x < 0 || screen.x > this.width || screen.y < 0 || screen.y > this.height) {
        return; // Off screen
      }
      
      // Draw landmark circle
      this.ctx.fillStyle = landmark.color;
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
        this.ctx.fillText(landmark.name, screen.x, screen.y - 10);
      }
    });
  },
  
  /**
   * Draw zoom indicator
   */
  drawZoomIndicator() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(10, 10, 120, 30);
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Zoom: ${this.zoom.toFixed(1)}`, 15, 28);
    
    this.ctx.font = '10px Arial';
    this.ctx.fillText('🖱️ Drag to pan • 🔍 Scroll to zoom', 15, 45);
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
    this.centerLat = Math.max(this.bounds.south, Math.min(this.bounds.north, lat));
    this.centerLon = Math.max(this.bounds.west, Math.min(this.bounds.east, lon));
    this.render();
  },
  
  /**
   * Get current zoom level
   */
  getZoom() {
    return this.zoom;
  },
  
  /**
   * Reset to default Kingston view
   */
  resetView() {
    this.setCenter(44.231, -76.498);
    this.setZoom(12);
  },
  
  /**
   * Destroy the map
   */
  destroy() {
    if (this.canvas && this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx = null;
  }
};
