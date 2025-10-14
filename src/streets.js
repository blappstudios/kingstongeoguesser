/**
 * Streets: Manages Kingston street data from OpenStreetMap
 * Fetches from Overpass API with localStorage caching and fallback
 */

const BBOX = {
  minLat: 44.216,
  minLon: -76.513,
  maxLat: 44.243,
  maxLon: -76.475,
};

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const CACHE_KEY = 'kingston_streets_v1';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Fallback GeoJSON for major Kingston streets
const FALLBACK_STREETS = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Princess Street' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-76.500, 44.230],
          [-76.495, 44.230],
          [-76.490, 44.230],
          [-76.485, 44.230],
          [-76.480, 44.231],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Union Street' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-76.485, 44.225],
          [-76.485, 44.228],
          [-76.485, 44.231],
          [-76.485, 44.234],
          [-76.485, 44.237],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'University Avenue' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-76.495, 44.225],
          [-76.493, 44.227],
          [-76.490, 44.229],
          [-76.488, 44.231],
          [-76.485, 44.233],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'King Street West' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-76.505, 44.228],
          [-76.500, 44.228],
          [-76.495, 44.228],
          [-76.490, 44.228],
          [-76.485, 44.228],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Division Street' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-76.480, 44.220],
          [-76.480, 44.224],
          [-76.480, 44.228],
          [-76.480, 44.232],
          [-76.480, 44.236],
        ],
      },
    },
  ],
};

export const Streets = {
  streets: null,
  allSegments: [],

  /**
   * Initialize and load street data
   */
  async init() {
    console.log('📍 Loading Kingston street data...');

    // Try to load from cache first
    const cached = this.loadFromCache();
    if (cached) {
      this.streets = cached;
      this.processStreets();
      console.log('✅ Loaded streets from cache');
      return;
    }

    // Try to fetch from Overpass
    try {
      const data = await this.fetchFromOverpass();
      this.streets = data;
      this.saveToCache(data);
      this.processStreets();
      console.log('✅ Loaded streets from Overpass API');
    } catch (err) {
      console.warn('⚠️ Failed to fetch from Overpass, using fallback:', err);
      this.streets = FALLBACK_STREETS;
      this.processStreets();
    }
  },

  /**
   * Fetch street data from Overpass API
   */
  async fetchFromOverpass() {
    const query = `
      [out:json][timeout:25];
      (
        way["highway"~"primary|secondary|tertiary|residential"](${BBOX.minLat},${BBOX.minLon},${BBOX.maxLat},${BBOX.maxLon});
      );
      out geom;
    `;

    const response = await fetch(OVERPASS_URL, {
      method: 'POST',
      body: query,
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    return this.convertOverpassToGeoJSON(data);
  },

  /**
   * Convert Overpass JSON to GeoJSON
   */
  convertOverpassToGeoJSON(overpassData) {
    const features = overpassData.elements
      .filter((el) => el.type === 'way' && el.geometry)
      .map((way) => ({
        type: 'Feature',
        properties: {
          name: way.tags?.name || 'Unnamed',
          highway: way.tags?.highway,
        },
        geometry: {
          type: 'LineString',
          coordinates: way.geometry.map((node) => [node.lon, node.lat]),
        },
      }));

    return {
      type: 'FeatureCollection',
      features,
    };
  },

  /**
   * Load from localStorage cache
   */
  loadFromCache() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      if (age > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return data;
    } catch (err) {
      console.warn('Failed to load from cache:', err);
      return null;
    }
  },

  /**
   * Save to localStorage cache
   */
  saveToCache(data) {
    try {
      const cached = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    } catch (err) {
      console.warn('Failed to save to cache:', err);
    }
  },

  /**
   * Process streets into segments for spawning
   */
  processStreets() {
    this.allSegments = [];

    for (const feature of this.streets.features) {
      if (feature.geometry.type !== 'LineString') continue;

      const coords = feature.geometry.coordinates;
      for (let i = 0; i < coords.length - 1; i++) {
        const [lon1, lat1] = coords[i];
        const [lon2, lat2] = coords[i + 1];

        this.allSegments.push({
          start: { lat: lat1, lon: lon1 },
          end: { lat: lat2, lon: lon2 },
          name: feature.properties.name,
        });
      }
    }

    console.log(`📊 Processed ${this.allSegments.length} street segments`);
  },

  /**
   * Get a random street segment
   */
  getRandomSegment() {
    if (this.allSegments.length === 0) return null;
    return this.allSegments[Math.floor(Math.random() * this.allSegments.length)];
  },

  /**
   * Sample a point along a segment at distance t (0-1)
   */
  samplePoint(segment, t) {
    const { start, end } = segment;
    const lat = start.lat + (end.lat - start.lat) * t;
    const lon = start.lon + (end.lon - start.lon) * t;

    // Calculate tangent angle
    const dx = end.lon - start.lon;
    const dy = end.lat - start.lat;
    const tangentAngle = Math.atan2(dy, dx);

    return { lat, lon, tangentAngle };
  },

  /**
   * Get a random point along streets for spawning
   */
  getRandomSpawnPoint() {
    const segment = this.getRandomSegment();
    if (!segment) {
      // Fallback to random point within bbox
      return {
        lat: BBOX.minLat + Math.random() * (BBOX.maxLat - BBOX.minLat),
        lon: BBOX.minLon + Math.random() * (BBOX.maxLon - BBOX.minLon),
        tangentAngle: 0,
      };
    }

    return this.samplePoint(segment, Math.random());
  },
};

