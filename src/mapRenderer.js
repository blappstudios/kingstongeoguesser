/**
 * Map Renderer: Renders Kingston map with clickable landmarks
 */

import { KINGSTON_LANDMARKS, KINGSTON_BOUNDS, calculateDistance } from './kingstonData.js';

export const MapRenderer = {
  canvas: null,
  ctx: null,
  selectedLocation: null,
  currentLandmark: null,
  clickCallback: null,

  /**
   * Initialize map renderer
   */
  init(canvas, clickCallback) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.clickCallback = clickCallback;
    
    this.setupEventListeners();
    this.draw();
  },

  /**
   * Setup click event listeners
   */
  setupEventListeners() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      this.handleMapClick(x, y);
    });
  },

  /**
   * Handle map click
   */
  handleMapClick(x, y) {
    if (!this.clickCallback) return;
    
    // Convert screen coordinates to lat/lon
    const coords = this.screenToLatLon(x, y);
    
    // Store selected location
    this.selectedLocation = coords;
    
    // Call the callback with coordinates
    this.clickCallback(coords.lat, coords.lon);
    
    // Redraw to show selection
    this.draw();
  },

  /**
   * Convert screen coordinates to lat/lon
   */
  screenToLatLon(x, y) {
    const lat = KINGSTON_BOUNDS.north - (y / this.canvas.height) * (KINGSTON_BOUNDS.north - KINGSTON_BOUNDS.south);
    const lon = KINGSTON_BOUNDS.west + (x / this.canvas.width) * (KINGSTON_BOUNDS.east - KINGSTON_BOUNDS.west);
    
    return { lat, lon };
  },

  /**
   * Convert lat/lon to screen coordinates
   */
  latLonToScreen(lat, lon) {
    const x = ((lon - KINGSTON_BOUNDS.west) / (KINGSTON_BOUNDS.east - KINGSTON_BOUNDS.west)) * this.canvas.width;
    const y = ((KINGSTON_BOUNDS.north - lat) / (KINGSTON_BOUNDS.north - KINGSTON_BOUNDS.south)) * this.canvas.height;
    
    return { x, y };
  },

  /**
   * Set current landmark for comparison
   */
  setCurrentLandmark(landmark) {
    this.currentLandmark = landmark;
    this.selectedLocation = null;
    this.draw();
  },

  /**
   * Draw the Kingston map
   */
  draw() {
    if (!this.ctx) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background
    this.drawBackground();
    
    // Draw Kingston areas
    this.drawKingstonAreas();
    
    // Draw landmarks
    this.drawLandmarks();
    
    // Draw selected location
    if (this.selectedLocation) {
      this.drawSelectedLocation();
    }
    
    // Draw correct location if game is over
    if (this.currentLandmark && this.selectedLocation) {
      this.drawCorrectLocation();
    }
  },

  /**
   * Draw background
   */
  drawBackground() {
    // Kingston background with water
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, '#2a3a4f');
    gradient.addColorStop(0.3, '#1a2332');
    gradient.addColorStop(0.7, '#1a2332');
    gradient.addColorStop(1, '#0f1729');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw water (Lake Ontario)
    this.ctx.fillStyle = 'rgba(0, 100, 200, 0.3)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height * 0.3);
    
    // Grid lines for reference
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x < this.canvas.width; x += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y < this.canvas.height; y += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  },

  /**
   * Draw Kingston areas
   */
  drawKingstonAreas() {
    // Queen's Campus area
    this.ctx.fillStyle = 'rgba(200, 16, 46, 0.2)';
    this.ctx.strokeStyle = 'rgba(200, 16, 46, 0.5)';
    this.ctx.lineWidth = 2;
    
    const campusArea = this.latLonToScreen(44.230, -76.495);
    this.ctx.beginPath();
    this.ctx.arc(campusArea.x, campusArea.y, 60, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    
    // Add campus label
    this.ctx.fillStyle = '#c8102e';
    this.ctx.font = 'bold 12px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Queen\'s Campus', campusArea.x, campusArea.y + 80);
    
    // Downtown area
    this.ctx.fillStyle = 'rgba(0, 100, 200, 0.2)';
    this.ctx.strokeStyle = 'rgba(0, 100, 200, 0.5)';
    
    const downtownArea = this.latLonToScreen(44.230, -76.485);
    this.ctx.beginPath();
    this.ctx.arc(downtownArea.x, downtownArea.y, 40, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    
    // Add downtown label
    this.ctx.fillStyle = '#0064c8';
    this.ctx.font = 'bold 12px sans-serif';
    this.ctx.fillText('Downtown', downtownArea.x, downtownArea.y + 55);
  },

  /**
   * Draw all landmarks
   */
  drawLandmarks() {
    KINGSTON_LANDMARKS.forEach(landmark => {
      const screen = this.latLonToScreen(landmark.lat, landmark.lon);
      
      // Skip current landmark if game is in progress
      if (this.currentLandmark && this.currentLandmark.id === landmark.id && !this.selectedLocation) {
        return;
      }
      
      // Different colors for campus vs downtown
      const isCampus = landmark.category === 'campus';
      this.ctx.fillStyle = isCampus ? '#c8102e' : '#0064c8';
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      
      this.ctx.beginPath();
      this.ctx.arc(screen.x, screen.y, 8, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
      
      // Draw landmark name (only if not too crowded)
      if (this.canvas.width > 600) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '10px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(landmark.name, screen.x, screen.y + 12);
      }
    });
  },

  /**
   * Draw selected location
   */
  drawSelectedLocation() {
    if (!this.selectedLocation) return;
    
    const screen = this.latLonToScreen(this.selectedLocation.lat, this.selectedLocation.lon);
    
    this.ctx.fillStyle = '#ffd700';
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 3;
    
    this.ctx.beginPath();
    this.ctx.arc(screen.x, screen.y, 12, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    
    // Draw crosshair
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(screen.x - 20, screen.y);
    this.ctx.lineTo(screen.x + 20, screen.y);
    this.ctx.moveTo(screen.x, screen.y - 20);
    this.ctx.lineTo(screen.x, screen.y + 20);
    this.ctx.stroke();
  },

  /**
   * Draw correct location
   */
  drawCorrectLocation() {
    if (!this.currentLandmark) return;
    
    const screen = this.latLonToScreen(this.currentLandmark.lat, this.currentLandmark.lon);
    
    // Draw correct location marker
    this.ctx.fillStyle = '#00ff88';
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 3;
    
    this.ctx.beginPath();
    this.ctx.arc(screen.x, screen.y, 15, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    
    // Draw line connecting guess to correct location
    if (this.selectedLocation) {
      const guessScreen = this.latLonToScreen(this.selectedLocation.lat, this.selectedLocation.lon);
      
      this.ctx.strokeStyle = '#ffd700';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([5, 5]);
      this.ctx.beginPath();
      this.ctx.moveTo(guessScreen.x, guessScreen.y);
      this.ctx.lineTo(screen.x, screen.y);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }
    
    // Draw distance text
    if (this.selectedLocation) {
      const distance = calculateDistance(
        this.selectedLocation.lat,
        this.selectedLocation.lon,
        this.currentLandmark.lat,
        this.currentLandmark.lon
      );
      
      const midX = (screen.x + this.latLonToScreen(this.selectedLocation.lat, this.selectedLocation.lon).x) / 2;
      const midY = (screen.y + this.latLonToScreen(this.selectedLocation.lat, this.selectedLocation.lon).y) / 2;
      
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 12px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(`${Math.round(distance)}m`, midX, midY);
    }
  },

  /**
   * Resize canvas to fit container
   */
  resize() {
    const container = this.canvas.parentElement;
    this.canvas.width = container.clientWidth;
    this.canvas.height = 400; // Fixed height
    this.draw();
  },
};