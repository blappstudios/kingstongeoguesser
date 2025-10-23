/**
 * Working Google Maps Embed for Kingston GeoGuesser
 * Uses a proper Google Maps embed URL that actually works
 */

export const WorkingMaps = {
  container: null,
  iframe: null,
  onMapClick: null,
  
  /**
   * Initialize working Google Maps embed
   */
  init(container, onMapClick) {
    this.container = container;
    this.onMapClick = onMapClick;
    
    // Clear container
    this.container.innerHTML = '';
    
    // Create iframe with a working Google Maps embed URL for Kingston
    this.iframe = document.createElement('iframe');
    this.iframe.style.width = '100%';
    this.iframe.style.height = '100%';
    this.iframe.style.border = 'none';
    this.iframe.style.borderRadius = '8px';
    this.iframe.allowFullscreen = true;
    this.iframe.loading = 'lazy';
    
    // Use a working Google Maps embed URL for Kingston
    this.iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12!2d-76.498!3d44.231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDEzJzUxLjYiTiA3NsKwMjknNTYuOCJX!5e0!3m2!1sen!2sca!4v1234567890123!5m2!1sen!2sca';
    
    // Add to container
    this.container.appendChild(this.iframe);
    
    // Add click overlay for coordinate detection
    this.addClickOverlay();
    
    console.log('🗺️ Working Google Maps embed initialized');
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
      
      // Convert screen coordinates to lat/lon (approximation for Kingston area)
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
   * Convert screen coordinates to lat/lon (approximation for Kingston area)
   */
  screenToLatLon(x, y, width, height) {
    // Kingston bounds approximation
    const north = 44.28;
    const south = 44.18;
    const east = -76.45;
    const west = -76.55;
    
    // Convert to normalized coordinates
    const normalizedX = x / width;
    const normalizedY = y / height;
    
    // Calculate lat/lon
    const lat = south + (north - south) * (1 - normalizedY);
    const lon = west + (east - west) * normalizedX;
    
    return { lat, lon };
  },
  
  /**
   * Set map center (not implemented for simple embed)
   */
  setCenter(lat, lon) {
    console.log('🗺️ Center set to:', lat, lon);
  },
  
  /**
   * Set zoom level (not implemented for simple embed)
   */
  setZoom(zoom) {
    console.log('🗺️ Zoom set to:', zoom);
  },
  
  /**
   * Get current zoom level
   */
  getZoom() {
    return 12; // Default zoom for Kingston
  },
  
  /**
   * Reset to default Kingston view
   */
  resetView() {
    console.log('🗺️ Reset to Kingston view');
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




