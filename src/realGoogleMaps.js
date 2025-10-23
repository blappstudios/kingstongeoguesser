/**
 * Real Google Maps implementation for Kingston GeoGuesser
 * Uses Google Maps JavaScript API like the real GeoGuessr
 */

export const RealGoogleMaps = {
  map: null,
  container: null,
  onMapClick: null,
  
  /**
   * Initialize real Google Maps
   */
  init(container, onMapClick) {
    this.container = container;
    this.onMapClick = onMapClick;
    
    // Clear container
    this.container.innerHTML = '';
    
    // Create map div
    const mapDiv = document.createElement('div');
    mapDiv.id = 'real-google-map';
    mapDiv.style.width = '100%';
    mapDiv.style.height = '100%';
    mapDiv.style.borderRadius = '8px';
    
    this.container.appendChild(mapDiv);
    
    // Initialize Google Maps
    this.initMap();
    
    console.log('🗺️ Real Google Maps initialized');
  },
  
  /**
   * Initialize the Google Maps instance
   */
  initMap() {
    // Wait for Google Maps API to be available
    if (!window.google || !window.google.maps) {
      console.error('Google Maps API not loaded');
      return;
    }

    // Kingston center coordinates
    const kingstonCenter = { lat: 44.231, lng: -76.498 };
    
    // Create map options
    const mapOptions = {
      center: kingstonCenter,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
      gestureHandling: 'greedy'
    };
    
    // Create the map
    this.map = new google.maps.Map(document.getElementById('real-google-map'), mapOptions);
    
    // Add click listener
    this.map.addListener('click', (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      console.log('🎯 Map clicked at:', lat, lng);
      
      if (this.onMapClick) {
        this.onMapClick(lat, lng);
      }
    });
    
    // Add map bounds to focus on Kingston area
    const kingstonBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(44.18, -76.55), // Southwest corner
      new google.maps.LatLng(44.28, -76.45)  // Northeast corner
    );
    
    // Fit map to Kingston bounds
    this.map.fitBounds(kingstonBounds);
  },
  
  /**
   * Set map center
   */
  setCenter(lat, lng) {
    if (this.map) {
      this.map.setCenter({ lat, lng });
    }
  },
  
  /**
   * Set zoom level
   */
  setZoom(zoom) {
    if (this.map) {
      this.map.setZoom(zoom);
    }
  },
  
  /**
   * Get current zoom level
   */
  getZoom() {
    return this.map ? this.map.getZoom() : 12;
  },
  
  /**
   * Reset to default Kingston view
   */
  resetView() {
    if (this.map) {
      const kingstonCenter = { lat: 44.231, lng: -76.498 };
      this.map.setCenter(kingstonCenter);
      this.map.setZoom(12);
    }
  },
  
  /**
   * Destroy the map
   */
  destroy() {
    if (this.map) {
      // Clear the map
      this.map = null;
    }
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
};




