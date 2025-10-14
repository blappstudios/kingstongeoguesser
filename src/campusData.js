/**
 * Campus Data: Queen's University landmarks and locations
 * Real coordinates and descriptions for campus GeoGuesser
 */

export const CAMPUS_BOUNDS = {
  north: 44.235,
  south: 44.225,
  east: -76.490,
  west: -76.505,
};

export const CAMPUS_LANDMARKS = [
  {
    id: 'grant-hall',
    name: 'Grant Hall',
    description: 'Historic building with clock tower, home to the Queen\'s University Archives',
    lat: 44.231,
    lon: -76.498,
    streetView: {
      lat: 44.231,
      lon: -76.498,
      heading: 180,
      pitch: 0,
    },
    hints: [
      'This building has a distinctive clock tower',
      'It houses the university archives',
      'Named after a former principal',
      'Built in the 19th century',
    ],
    difficulty: 'easy',
  },
  {
    id: 'summerhill',
    name: 'Summerhill',
    description: 'Principal\'s residence with beautiful gardens',
    lat: 44.232,
    lon: -76.500,
    streetView: {
      lat: 44.232,
      lon: -76.500,
      heading: 90,
      pitch: 0,
    },
    hints: [
      'This is the principal\'s residence',
      'Features beautiful gardens',
      'Historic stone building',
      'Overlooks the campus',
    ],
    difficulty: 'easy',
  },
  {
    id: 'richardson-stadium',
    name: 'Richardson Stadium',
    description: 'Home of Queen\'s Gaels football team',
    lat: 44.228,
    lon: -76.495,
    streetView: {
      lat: 44.228,
      lon: -76.495,
      heading: 0,
      pitch: 10,
    },
    hints: [
      'This is where the Gaels play football',
      'Named after a major donor',
      'Has a distinctive red and gold color scheme',
      'Part of the athletics complex',
    ],
    difficulty: 'easy',
  },
  {
    id: 'douglas-library',
    name: 'Douglas Library',
    description: 'Main university library with distinctive architecture',
    lat: 44.230,
    lon: -76.493,
    streetView: {
      lat: 44.230,
      lon: -76.493,
      heading: 270,
      pitch: 0,
    },
    hints: [
      'This is the main university library',
      'Features modern architecture',
      'Has multiple floors and study spaces',
      'Named after a former chancellor',
    ],
    difficulty: 'easy',
  },
  {
    id: 'stauffer-library',
    name: 'Stauffer Library',
    description: 'Science and engineering library with unique design',
    lat: 44.228,
    lon: -76.491,
    streetView: {
      lat: 44.228,
      lon: -76.491,
      heading: 45,
      pitch: 0,
    },
    hints: [
      'This library serves science and engineering',
      'Has a distinctive modern design',
      'Features a unique architectural style',
      'Named after a major benefactor',
    ],
    difficulty: 'medium',
  },
  {
    id: 'goodes-hall',
    name: 'Goodes Hall',
    description: 'Business school building with glass facade',
    lat: 44.227,
    lon: -76.492,
    streetView: {
      lat: 44.227,
      lon: -76.492,
      heading: 135,
      pitch: 0,
    },
    hints: [
      'This is the business school building',
      'Features a prominent glass facade',
      'Named after a business leader',
      'Modern architectural design',
    ],
    difficulty: 'medium',
  },
  {
    id: 'botterell-hall',
    name: 'Botterell Hall',
    description: 'Health sciences building with medical facilities',
    lat: 44.226,
    lon: -76.494,
    streetView: {
      lat: 44.226,
      lon: -76.494,
      heading: 90,
      pitch: 0,
    },
    hints: [
      'This building houses health sciences',
      'Named after a medical pioneer',
      'Features medical facilities',
      'Part of the health sciences complex',
    ],
    difficulty: 'medium',
  },
  {
    id: 'miller-hall',
    name: 'Miller Hall',
    description: 'Chemistry building with distinctive brick facade',
    lat: 44.229,
    lon: -76.496,
    streetView: {
      lat: 44.229,
      lon: -76.496,
      heading: 225,
      pitch: 0,
    },
    hints: [
      'This building houses chemistry programs',
      'Features a distinctive brick facade',
      'Named after a chemistry professor',
      'Has laboratory facilities',
    ],
    difficulty: 'medium',
  },
  {
    id: 'kingston-hall',
    name: 'Kingston Hall',
    description: 'Historic residence hall with traditional architecture',
    lat: 44.233,
    lon: -76.497,
    streetView: {
      lat: 44.233,
      lon: -76.497,
      heading: 180,
      pitch: 0,
    },
    hints: [
      'This is a historic residence hall',
      'Features traditional Queen\'s architecture',
      'Named after the city of Kingston',
      'One of the oldest residence buildings',
    ],
      difficulty: 'hard',
  },
  {
    id: 'jeffery-hall',
    name: 'Jeffery Hall',
    description: 'Arts and science building with modern design',
    lat: 44.231,
    lon: -76.492,
    streetView: {
      lat: 44.231,
      lon: -76.492,
      heading: 315,
      pitch: 0,
    },
    hints: [
      'This building houses arts and sciences',
      'Features modern architectural design',
      'Named after a former professor',
      'Has multiple academic departments',
    ],
    difficulty: 'hard',
  },
  {
    id: 'queens-centre',
    name: 'Queen\'s Centre',
    description: 'Student center with gym, pool, and recreational facilities',
    lat: 44.227,
    lon: -76.493,
    streetView: {
      lat: 44.227,
      lon: -76.493,
      heading: 0,
      pitch: 5,
    },
    hints: [
      'This is the main student center',
      'Houses gym and recreational facilities',
      'Has a swimming pool',
      'Modern glass and steel design',
    ],
    difficulty: 'hard',
  },
  {
    id: 'ban-righ-hall',
    name: 'Ban Righ Hall',
    description: 'Historic women\'s residence with beautiful stone facade',
    lat: 44.234,
    lon: -76.499,
    streetView: {
      lat: 44.234,
      lon: -76.499,
      heading: 270,
      pitch: 0,
    },
    hints: [
      'This is a historic women\'s residence',
      'Features beautiful stone architecture',
      'Named in Gaelic',
      'One of the most picturesque buildings on campus',
    ],
    difficulty: 'hard',
  },
];

/**
 * Get landmarks by difficulty level
 */
export function getLandmarksByDifficulty(difficulty) {
  return CAMPUS_LANDMARKS.filter(landmark => landmark.difficulty === difficulty);
}

/**
 * Get random landmark for game
 */
export function getRandomLandmark(difficulty = null) {
  let landmarks = CAMPUS_LANDMARKS;
  
  if (difficulty) {
    landmarks = getLandmarksByDifficulty(difficulty);
  }
  
  if (landmarks.length === 0) {
    landmarks = CAMPUS_LANDMARKS; // Fallback to all landmarks
  }
  
  return landmarks[Math.floor(Math.random() * landmarks.length)];
}

/**
 * Calculate distance between two points in meters
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

/**
 * Calculate score based on distance
 */
export function calculateScore(distance) {
  // Perfect guess (within 10m)
  if (distance <= 10) return 5000;
  
  // Excellent guess (within 50m)
  if (distance <= 50) return Math.max(4000, 5000 - distance * 10);
  
  // Good guess (within 100m)
  if (distance <= 100) return Math.max(3000, 4000 - distance * 5);
  
  // Fair guess (within 200m)
  if (distance <= 200) return Math.max(2000, 3000 - distance * 2.5);
  
  // Poor guess (within 500m)
  if (distance <= 500) return Math.max(1000, 2000 - distance);
  
  // Very poor guess
  return Math.max(100, 1000 - distance * 0.5);
}
