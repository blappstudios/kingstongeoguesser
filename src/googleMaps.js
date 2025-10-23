/**
 * Google Maps Integration for Kingston GeoGuesser
 * Provides full interactive Google Maps functionality
 */

export const GoogleMaps = {
  map: null,
  container: null,
  onMapClick: null,
  
  // Kingston bounds
  bounds: {
    north: 44.28,
    south: 44.18,
    east: -76.45,
    west: -76.55
  },
  
  /**
   * Initialize Google Maps
   */
  init(container, onMapClick) {
    this.container = container;
    this.onMapClick = onMapClick;
    
    // Clear container
    this.container.innerHTML = '';
    
    // Create map element
    const mapElement = document.createElement('div');
    mapElement.id = 'google-map';
    mapElement.style.width = '100%';
    mapElement.style.height = '100%';
    mapElement.style.borderRadius = '8px';
    this.container.appendChild(mapElement);
    
    // Initialize map when Google Maps API is loaded
    if (window.google && window.google.maps) {
      this.createMap();
    } else {
      // Wait for Google Maps API to load
      window.initGoogleMaps = () => this.createMap();
    }
  },
  
  /**
   * Create the Google Map
   */
  createMap() {
    const mapOptions = {
      center: { lat: 44.231, lng: -76.498 }, // Kingston center
      zoom: 12,
      minZoom: 8,
      maxZoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
      gestureHandling: 'greedy', // Allow zoom with mouse wheel
      restriction: {
        latLngBounds: {
          north: this.bounds.north,
          south: this.bounds.south,
          east: this.bounds.east,
          west: this.bounds.west
        },
        strictBounds: false
      },
      styles: [
        // Hide labels for cleaner look
        {
          featureType: 'all',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        // Keep roads visible
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#666666' }, { weight: 1 }]
        },
        // Highlight important roads
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ color: '#333333' }, { weight: 2 }]
        },
        // Water features
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#4a90e2' }]
        },
        // Parks and green spaces
        {
          featureType: 'park',
          elementType: 'geometry',
          stylers: [{ color: '#90ee90' }]
        },
        // Buildings
        {
          featureType: 'poi.business',
          elementType: 'geometry',
          stylers: [{ color: '#888888' }]
        }
      ]
    };
    
    // Create the map
    this.map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
    
    // Add click listener
    this.map.addListener('click', (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      console.log('🎯 Google Map clicked at:', lat, lng);
      
      if (this.onMapClick) {
        this.onMapClick(lat, lng);
      }
    });
    
    // Add some key Kingston landmarks
    this.addLandmarks();
    
    console.log('🗺️ Google Maps initialized');
  },
  
  /**
   * Add key Kingston landmarks
   */
  addLandmarks() {
    const landmarks = [
      {
        position: { lat: 44.225, lng: -76.495 },
        title: 'Queen\'s University',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#8B0000" stroke="#fff" stroke-width="2"/>
              <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">Q</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24),
          anchor: new google.maps.Point(12, 12)
        }
      },
      {
        position: { lat: 44.231, lng: -76.485 },
        title: 'Downtown Kingston',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#0066CC" stroke="#fff" stroke-width="2"/>
              <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">D</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24),
          anchor: new google.maps.Point(12, 12)
        }
      },
      {
        position: { lat: 44.229, lng: -76.461 },
        title: 'Fort Henry',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#8B4513" stroke="#fff" stroke-width="2"/>
              <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">F</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24),
          anchor: new google.maps.Point(12, 12)
        }
      },
      {
        position: { lat: 44.235, lng: -76.470 },
        title: 'Kingston Penitentiary',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#2C3E50" stroke="#fff" stroke-width="2"/>
              <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">K</text>
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
   * Set map center and zoom
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
   * Fit map to Kingston bounds
   */
  fitToBounds() {
    if (this.map) {
      const bounds = new google.maps.LatLngBounds(
        { lat: this.bounds.south, lng: this.bounds.west },
        { lat: this.bounds.north, lng: this.bounds.east }
      );
      this.map.fitBounds(bounds);
    }
  },
  
  /**
   * Reset map to default view
   */
  resetView() {
    this.setCenter(44.231, -76.498);
    this.setZoom(12);
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

// Global callback for Google Maps API
window.initGoogleMaps = () => {
  console.log('🗺️ Google Maps API loaded');
};
