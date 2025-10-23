/**
 * Working Google Maps Implementation
 * Simple, reliable Google Maps with zoom and click functionality
 */

export const WorkingGoogleMaps = {
  map: null,
  container: null,
  onMapClick: null,
  
  /**
   * Initialize working Google Maps
   */
  init(container, onMapClick) {
    this.container = container;
    this.onMapClick = onMapClick;
    
    // Clear container
    this.container.innerHTML = '';
    
    // Create map div
    const mapDiv = document.createElement('div');
    mapDiv.id = 'working-google-map';
    mapDiv.style.width = '100%';
    mapDiv.style.height = '100%';
    mapDiv.style.borderRadius = '8px';
    
    this.container.appendChild(mapDiv);
    
    // Initialize map when Google Maps is available
    this.initMap();
    
    console.log('🗺️ Working Google Maps initialized');
  },
  
  /**
   * Initialize the Google Map
   */
  initMap() {
    // Wait for Google Maps to be available
    if (typeof google === 'undefined' || !google.maps) {
      console.log('⏳ Waiting for Google Maps API...');
      setTimeout(() => this.initMap(), 100);
      return;
    }
    
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
    
    // Create the map
    this.map = new google.maps.Map(document.getElementById('working-google-map'), mapOptions);
    
    // Add click listener
    this.map.addListener('click', (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      console.log('🎯 Google Maps clicked at:', lat, lng);
      
      if (this.onMapClick) {
        this.onMapClick(lat, lng);
      }
    });
    
    // Add some key Kingston landmarks as reference
    this.addLandmarks();
    
    console.log('✅ Google Maps map created successfully');
  },
  
  /**
   * Add key Kingston landmarks
   */
  addLandmarks() {
    const landmarks = [
      {
        position: { lat: 44.225, lng: -76.495 },
        title: 'Queen\'s University Campus',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#c8102e" stroke="#fff" stroke-width="2"/>
              <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">Q</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24),
          anchor: new google.maps.Point(12, 12)
        }
      },
      {
        position: { lat: 44.2309, lng: -76.4865 },
        title: 'Kingston City Hall',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#0066CC" stroke="#fff" stroke-width="2"/>
              <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">C</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24),
          anchor: new google.maps.Point(12, 12)
        }
      }
    ];
    
    landmarks.forEach(landmark => {
      new google.maps.Marker({
        position: landmark.position,
        map: this.map,
        title: landmark.title,
        icon: landmark.icon
      });
    });
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
