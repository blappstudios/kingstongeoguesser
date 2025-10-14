/**
 * Google Static Maps API integration for detailed Kingston map
 */

export const StaticMap = {
  apiKey: null,
  enabled: false,

  init(apiKey) {
    this.apiKey = apiKey;
    this.enabled = !!apiKey;
    
    if (!this.enabled) {
      console.warn('⚠️ No Google Static Maps API key provided, using fallback map');
    } else {
      console.log('✅ Google Static Maps enabled with key:', apiKey.substring(0, 10) + '...');
    }
  },

  /**
   * Generate detailed Kingston map URL using Google Static Maps API
   * @param {number} centerLat - Center latitude
   * @param {number} centerLon - Center longitude
   * @param {number} zoom - Zoom level (higher = more detailed)
   * @param {number} width - Map width in pixels
   * @param {number} height - Map height in pixels
   * @returns {string} Map image URL
   */
  getDetailedMapUrl(centerLat, centerLon, zoom = 15, width = 800, height = 600) {
    if (!this.enabled) {
      return this.getFallbackMapUrl(centerLat, centerLon, zoom, width, height);
    }

    try {
      // Kingston center coordinates (covers both campus and downtown)
      const center = `${centerLat},${centerLon}`;
      
      // Style parameters to remove labels and make it more game-like
      const styles = [
        // Remove all labels
        {
          featureType: 'all',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        // Keep roads but make them subtle
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#666666' }, { weight: 1 }]
        },
        // Make buildings more visible
        {
          featureType: 'poi.business',
          elementType: 'geometry',
          stylers: [{ color: '#888888' }]
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
        }
      ];

      // Convert styles to URL parameter
      const styleParam = styles.map(style => 
        `style=${encodeURIComponent(JSON.stringify(style))}`
      ).join('&');

      const url = `https://maps.googleapis.com/maps/api/staticmap?` +
        `center=${center}&` +
        `zoom=${zoom}&` +
        `size=${width}x${height}&` +
        `maptype=roadmap&` +
        `format=png&` +
        `${styleParam}&` +
        `key=${this.apiKey}`;

      console.log('🗺️ Generated detailed map URL for Kingston');
      return url;
    } catch (error) {
      console.warn('❌ Failed to generate detailed map URL:', error);
      return this.getFallbackMapUrl(centerLat, centerLon, zoom, width, height);
    }
  },

  /**
   * Fallback map using SVG when API is not available
   */
  getFallbackMapUrl(centerLat, centerLon, zoom = 15, width = 800, height = 600) {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#e8f4f8;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#d1e7dd;stop-opacity:1" />
          </linearGradient>
          <pattern id="roads" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect x="0" y="45" width="100" height="10" fill="#666666" opacity="0.3"/>
            <rect x="45" y="0" width="10" height="100" fill="#666666" opacity="0.3"/>
          </pattern>
          <pattern id="buildings" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect x="10" y="50" width="60" height="30" fill="#888888" opacity="0.4"/>
            <rect x="20" y="30" width="40" height="50" fill="#888888" opacity="0.3"/>
            <rect x="30" y="10" width="20" height="70" fill="#888888" opacity="0.2"/>
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#mapGrad)"/>
        <rect width="100%" height="100%" fill="url(#roads)"/>
        
        <!-- Queen's Campus area -->
        <rect x="200" y="100" width="300" height="200" fill="url(#buildings)" opacity="0.6"/>
        <rect x="150" y="150" width="200" height="150" fill="url(#buildings)" opacity="0.5"/>
        <rect x="350" y="120" width="180" height="180" fill="url(#buildings)" opacity="0.4"/>
        
        <!-- Downtown area -->
        <rect x="100" y="350" width="250" height="150" fill="url(#buildings)" opacity="0.7"/>
        <rect x="400" y="380" width="200" height="120" fill="url(#buildings)" opacity="0.6"/>
        <rect x="650" y="320" width="120" height="180" fill="url(#buildings)" opacity="0.5"/>
        
        <!-- Lake Ontario -->
        <rect x="0" y="500" width="800" height="100" fill="#4a90e2" opacity="0.8"/>
        
        <!-- Parks -->
        <circle cx="150" cy="250" r="50" fill="#90ee90" opacity="0.6"/>
        <circle cx="600" cy="400" r="40" fill="#90ee90" opacity="0.6"/>
        
        <text x="${width/2}" y="${height/2}" text-anchor="middle" fill="#333333" font-family="Arial, sans-serif" font-size="24" font-weight="bold">Kingston Map</text>
        <text x="${width/2}" y="${height/2 + 30}" text-anchor="middle" fill="#666666" font-family="Arial, sans-serif" font-size="16">Click to make your guess</text>
      </svg>
    `;
    
    try {
      return `data:image/svg+xml;base64,${btoa(svg)}`;
    } catch (error) {
      console.warn('Failed to create SVG fallback map:', error);
      return `data:image/svg+xml;base64,${btoa(`
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#e8f4f8"/>
          <text x="${width/2}" y="${height/2}" text-anchor="middle" fill="#333333" font-family="Arial" font-size="20">Kingston Map</text>
        </svg>
      `)}`;
    }
  },

  /**
   * Convert screen coordinates to lat/lon for map clicks
   * Uses Web Mercator projection (EPSG:3857) which is what Google Maps uses
   * @param {number} clickX - X coordinate of click
   * @param {number} clickY - Y coordinate of click
   * @param {number} mapWidth - Map image width
   * @param {number} mapHeight - Map image height
   * @param {number} centerLat - Map center latitude
   * @param {number} centerLon - Map center longitude
   * @param {number} zoom - Map zoom level
   * @returns {Object} {lat, lon} coordinates
   */
  screenToLatLon(clickX, clickY, mapWidth, mapHeight, centerLat, centerLon, zoom) {
    // Google Maps zoom levels: pixels per degree = 256 * 2^zoom / 360
    const scale = Math.pow(2, zoom);
    const pixelsPerLonDegree = (256 * scale) / 360;
    
    // Longitude is straightforward
    const lonOffset = (clickX - mapWidth / 2) / pixelsPerLonDegree;
    const lon = centerLon + lonOffset;
    
    // Latitude requires Web Mercator transformation
    // First convert center lat to Web Mercator y
    const centerLatRad = centerLat * Math.PI / 180;
    const centerMercatorY = Math.log(Math.tan(Math.PI / 4 + centerLatRad / 2));
    
    // Calculate pixels per mercator unit at this zoom level
    const pixelsPerMercatorUnit = (256 * scale) / (2 * Math.PI);
    
    // Calculate mercator offset
    const mercatorOffset = -(clickY - mapHeight / 2) / pixelsPerMercatorUnit;
    const clickMercatorY = centerMercatorY + mercatorOffset;
    
    // Convert back to latitude
    const lat = (2 * Math.atan(Math.exp(clickMercatorY)) - Math.PI / 2) * 180 / Math.PI;
    
    return { lat, lon };
  }
};
