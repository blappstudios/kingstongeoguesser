/**
 * Simple Google Maps Implementation
 * Clean, reliable Google Maps without deprecated features
 */

export const SimpleGoogleMaps = {
  map: null,
  container: null,
  onMapClick: null,
  
  /**
   * Initialize simple Google Maps
   */
  init(container, onMapClick) {
    this.container = container;
    this.onMapClick = onMapClick;
    
    console.log('🗺️ Initializing Simple Google Maps...');
    
    // Clear container
    this.container.innerHTML = '';
    
    // Create map div
    const mapDiv = document.createElement('div');
    mapDiv.id = 'simple-google-map';
    mapDiv.style.width = '100%';
    mapDiv.style.height = '100%';
    mapDiv.style.borderRadius = '8px';
    mapDiv.style.minHeight = '400px';
    
    this.container.appendChild(mapDiv);
    
    // Initialize map when Google Maps is available
    this.initMap();
    
    console.log('🗺️ Simple Google Maps initialized');
  },
  
  /**
   * Initialize the Google Map
   */
  initMap() {
    // Wait for Google Maps to be available
    if (typeof google === 'undefined' || !google.maps) {
      console.log('⏳ Waiting for Google Maps API...');
      setTimeout(() => this.initMap(), 200);
      return;
    }
    
    console.log('✅ Google Maps API is available, creating map...');
    
    // Kingston center coordinates
    const kingstonCenter = { lat: 44.231, lng: -76.498 };
    
    // Create map options
    const mapOptions = {
      center: kingstonCenter,
      zoom: 13,
      minZoom: 10,
      maxZoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
      gestureHandling: 'greedy',
      restriction: {
        latLngBounds: {
          north: 44.28,
          south: 44.18,
          east: -76.45,
          west: -76.55
        },
        strictBounds: false
      }
    };
    
    try {
      // Create the map
      this.map = new google.maps.Map(document.getElementById('simple-google-map'), mapOptions);
      
      // Add click listener
      this.map.addListener('click', (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        
        console.log('🎯 Google Maps clicked at:', lat, lng);
        
        if (this.onMapClick) {
          this.onMapClick(lat, lng);
        }
      });
      
      console.log('✅ Google Maps map created successfully');
      
    } catch (error) {
      console.error('❌ Error creating Google Maps:', error);
    }
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
    return this.map ? this.map.getZoom() : 13;
  },
  
  /**
   * Reset to default Kingston view
   */
  resetView() {
    if (this.map) {
      this.map.setCenter({ lat: 44.231, lng: -76.498 });
      this.map.setZoom(13);
    }
  },
  
  /**
   * Destroy the map
   */
  destroy() {
    if (this.map) {
      this.map = null;
    }
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
};
