/**
 * Street View: Google Street View integration for campus photos
 */

export const StreetView = {
  apiKey: null,
  enabled: false,
  fallbackImages: new Map(),

  /**
   * Initialize Street View with API key
   */
  init(apiKey) {
    this.apiKey = apiKey;
    this.enabled = !!apiKey;
    
    if (!this.enabled) {
      console.warn('⚠️ No Google Street View API key provided, using fallback images');
    } else {
      console.log('✅ Google Street View enabled with key:', apiKey.substring(0, 10) + '...');
    }
  },

  /**
   * Load Street View image for a landmark
   */
  async loadStreetViewImage(landmark) {
    if (!this.enabled) {
      console.log('🖼️ Using fallback image for', landmark.name, '(Street View disabled)');
      return this.getFallbackImage(landmark);
    }

    try {
      const { lat, lon, heading, pitch } = landmark.streetView;
      const size = '800x600';
      const fov = 90;
      
      // Use Street View Static API for static images only
      const url = `https://maps.googleapis.com/maps/api/streetview?` +
        `size=${size}&` +
        `location=${lat},${lon}&` +
        `heading=${heading}&` +
        `pitch=${pitch}&` +
        `fov=${fov}&` +
        `key=${this.apiKey}`;

      console.log('🌍 Loading Street View for', landmark.name, 'at', lat, lon);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Street View API error:', response.status, errorText);
        throw new Error(`Street View API error: ${response.status} - ${errorText}`);
      }

      console.log('✅ Street View loaded successfully for', landmark.name);
      return url;
    } catch (error) {
      console.warn('❌ Failed to load Street View image for', landmark.name, ':', error);
      return this.getFallbackImage(landmark);
    }
  },

  /**
   * Get fallback image for landmark
   */
  getFallbackImage(landmark) {
    // Create a beautiful fallback image with landmark info
    const isCampus = landmark.category === 'campus';
    const bgColor = isCampus ? '#c8102e' : '#0064c8';
    const categoryText = isCampus ? 'Queen\'s Campus' : 'Downtown Kingston';
    
    const svg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#2a3a4f;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1a2332;stop-opacity:1" />
          </linearGradient>
          <pattern id="building" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect x="0" y="60" width="80" height="20" fill="${bgColor}" opacity="0.6"/>
            <rect x="10" y="40" width="60" height="40" fill="${bgColor}" opacity="0.4"/>
            <rect x="20" y="20" width="40" height="60" fill="${bgColor}" opacity="0.3"/>
          </pattern>
        </defs>
        
        <!-- Background -->
        <rect width="100%" height="100%" fill="url(#grad)"/>
        
        <!-- Building pattern -->
        <rect x="0" y="200" width="100%" height="200" fill="url(#building)"/>
        
        <!-- Main building silhouette -->
        <rect x="200" y="150" width="400" height="300" fill="${bgColor}" opacity="0.2"/>
        <rect x="250" y="100" width="300" height="350" fill="${bgColor}" opacity="0.15"/>
        <rect x="300" y="50" width="200" height="400" fill="${bgColor}" opacity="0.1"/>
        
        <!-- Landmark name -->
        <text x="400" y="280" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="bold">${landmark.name}</text>
        
        <!-- Category -->
        <text x="400" y="320" text-anchor="middle" fill="#8a9ab0" font-family="Arial, sans-serif" font-size="18">${categoryText}</text>
        
        <!-- Description -->
        <text x="400" y="350" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" opacity="0.8">${landmark.description}</text>
        
        <!-- Instructions -->
        <text x="400" y="500" text-anchor="middle" fill="#8a9ab0" font-family="Arial, sans-serif" font-size="16">Click on the map below to guess the location</text>
        
        <!-- Coordinates hint -->
        <text x="400" y="530" text-anchor="middle" fill="#8a9ab0" font-family="Arial, sans-serif" font-size="12">📍 ${landmark.lat.toFixed(3)}, ${landmark.lon.toFixed(3)}</text>
      </svg>
    `;
    
    try {
      return `data:image/svg+xml;base64,${btoa(svg)}`;
    } catch (error) {
      console.warn('Failed to create SVG fallback:', error);
      // Return a simple colored rectangle as ultimate fallback
      return `data:image/svg+xml;base64,${btoa(`
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#1a2332"/>
          <text x="400" y="300" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="20">${landmark.name}</text>
        </svg>
      `)}`;
    }
  },

  /**
   * Preload images for better performance
   */
  async preloadImages(landmarks) {
    const promises = landmarks.map(async (landmark) => {
      try {
        const imageUrl = await this.loadStreetViewImage(landmark);
        
        // Preload the image
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(landmark.id);
          img.onerror = () => resolve(landmark.id);
          img.src = imageUrl;
        });
      } catch (error) {
        console.warn(`Failed to preload image for ${landmark.name}:`, error);
        return landmark.id;
      }
    });

    await Promise.all(promises);
    console.log('✅ Street View images preloaded');
  },
};
