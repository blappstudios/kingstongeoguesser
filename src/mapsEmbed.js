/**
 * Google Maps Embed API Integration for Kingston GeoGuesser
 * Uses iframe-based Google Maps for full interactivity
 */

export const MapsEmbed = {
  container: null,
  iframe: null,
  onMapClick: null,
  
  // Kingston center coordinates
  centerLat: 44.231,
  centerLon: -76.498,
  zoom: 12,
  
  /**
   * Initialize Google Maps Embed
   */
  init(container, onMapClick) {
    this.container = container;
    this.onMapClick = onMapClick;
    
    // Clear container
    this.container.innerHTML = '';
    
    // Create iframe with Google Maps Embed
    this.iframe = document.createElement('iframe');
    this.iframe.style.width = '100%';
    this.iframe.style.height = '100%';
    this.iframe.style.border = 'none';
    this.iframe.style.borderRadius = '8px';
    this.iframe.allowFullscreen = true;
    this.iframe.loading = 'lazy';
    
    // Set up the embed URL
    this.updateEmbedUrl();
    
    // Add to container
    this.container.appendChild(this.iframe);
    
    // Add click overlay for coordinate detection
    this.addClickOverlay();
    
    console.log('🗺️ Google Maps Embed initialized');
  },
  
  /**
   * Update the embed URL with current settings
   */
  updateEmbedUrl() {
    // Use a simple Google Maps embed URL for Kingston (no API key required)
    const embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d${this.zoom}!2d${this.centerLon}!3d${this.centerLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDEzJzUxLjYiTiA3NsKwMjknNTYuOCJX!5e0!3m2!1sen!2sca!4v1234567890123!5m2!1sen!2sca`;
    
    this.iframe.src = embedUrl;
    console.log('🗺️ Using public Google Maps embed (no API key required)');
  },
  
  /**
   * Add click overlay to detect coordinates
   */
  addClickOverlay() {
    // Create overlay div
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'auto';
    overlay.style.cursor = 'crosshair';
    overlay.style.zIndex = '10';
    overlay.style.backgroundColor = 'transparent';
    
    // Add click handler
    overlay.addEventListener('click', (e) => {
      const rect = overlay.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Convert screen coordinates to lat/lon
      const coords = this.screenToLatLon(x, y, rect.width, rect.height);
      
      console.log('🎯 Map clicked at:', coords.lat, coords.lon);
      
      if (this.onMapClick) {
        this.onMapClick(coords.lat, coords.lon);
      }
    });
    
    // Add to container
    this.container.appendChild(overlay);
  },
  
  /**
   * Convert screen coordinates to lat/lon
   * This is an approximation for the embed map
   */
  screenToLatLon(x, y, width, height) {
    // Get the current view bounds (approximation)
    const latRange = 180 / Math.pow(2, this.zoom);
    const lonRange = 360 / Math.pow(2, this.zoom);
    
    // Convert to normalized coordinates
    const normalizedX = x / width;
    const normalizedY = y / height;
    
    // Calculate lat/lon
    const lat = this.centerLat + (0.5 - normalizedY) * latRange;
    const lon = this.centerLon + (normalizedX - 0.5) * lonRange;
    
    return { lat, lon };
  },
  
  /**
   * Set map center
   */
  setCenter(lat, lon) {
    this.centerLat = lat;
    this.centerLon = lon;
    this.updateEmbedUrl();
  },
  
  /**
   * Set zoom level
   */
  setZoom(zoom) {
    this.zoom = Math.max(8, Math.min(18, zoom));
    this.updateEmbedUrl();
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
   * Fit to Kingston bounds
   */
  fitToBounds() {
    // Set a wider view to show all of Kingston
    this.setCenter(44.231, -76.498);
    this.setZoom(11);
  },
  
  /**
   * Destroy the map
   */
  destroy() {
    if (this.iframe) {
      this.iframe.remove();
      this.iframe = null;
    }
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
};
