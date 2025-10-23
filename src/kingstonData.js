/**
 * Kingston Data: Queen's University and downtown Kingston landmarks
 * Real coordinates and descriptions for Kingston GeoGuesser
 */

export const KINGSTON_BOUNDS = {
  north: 44.245,
  south: 44.215,
  east: -76.475,
  west: -76.515,
};

export const KINGSTON_LANDMARKS = [
  // Queen's Campus - Main Buildings
  { id: 'grant-hall-1', name: 'Grant Hall', description: 'Historic clock tower', lat: 44.2315, lon: -76.4959, streetView: { lat: 44.2315, lon: -76.4959, heading: 180, pitch: 0 }, hints: ['Clock tower'], difficulty: 'easy', category: 'campus' },
  { id: 'grant-hall-2', name: 'Grant Hall', description: 'Historic clock tower', lat: 44.2315, lon: -76.4959, streetView: { lat: 44.2315, lon: -76.4959, heading: 90, pitch: 0 }, hints: ['Clock tower'], difficulty: 'easy', category: 'campus' },
  { id: 'douglas-library-1', name: 'Douglas Library', description: 'Main library', lat: 44.2298, lon: -76.4931, streetView: { lat: 44.2298, lon: -76.4931, heading: 270, pitch: 0 }, hints: ['Library'], difficulty: 'easy', category: 'campus' },
  { id: 'douglas-library-2', name: 'Douglas Library', description: 'Main library', lat: 44.2298, lon: -76.4931, streetView: { lat: 44.2298, lon: -76.4931, heading: 0, pitch: 0 }, hints: ['Library'], difficulty: 'easy', category: 'campus' },
  { id: 'stauffer-library', name: 'Stauffer Library', description: 'Library building', lat: 44.2287, lon: -76.4947, streetView: { lat: 44.2287, lon: -76.4947, heading: 90, pitch: 0 }, hints: ['Study space'], difficulty: 'medium', category: 'campus' },
  { id: 'goodes-hall-1', name: 'Goodes Hall', description: 'Business school', lat: 44.2265, lon: -76.4926, streetView: { lat: 44.2265, lon: -76.4926, heading: 135, pitch: 0 }, hints: ['Glass facade'], difficulty: 'medium', category: 'campus' },
  { id: 'goodes-hall-2', name: 'Goodes Hall', description: 'Business school', lat: 44.2265, lon: -76.4926, streetView: { lat: 44.2265, lon: -76.4926, heading: 315, pitch: 0 }, hints: ['Glass facade'], difficulty: 'medium', category: 'campus' },
  { id: 'queens-centre', name: 'Queen\'s Centre', description: 'Athletic center', lat: 44.2272, lon: -76.4935, streetView: { lat: 44.2272, lon: -76.4935, heading: 0, pitch: 5 }, hints: ['Gym'], difficulty: 'medium', category: 'campus' },
  { id: 'richardson-stadium', name: 'Richardson Stadium', description: 'Football stadium', lat: 44.2278, lon: -76.4954, streetView: { lat: 44.2278, lon: -76.4954, heading: 0, pitch: 10 }, hints: ['Athletics'], difficulty: 'easy', category: 'campus' },
  { id: 'summerhill', name: 'Summerhill', description: 'Principal residence', lat: 44.2328, lon: -76.5008, streetView: { lat: 44.2328, lon: -76.5008, heading: 90, pitch: 0 }, hints: ['Gardens'], difficulty: 'easy', category: 'campus' },
  
  // Queen's Campus - Academic Buildings
  { id: 'kingston-hall', name: 'Kingston Hall', description: 'Academic building', lat: 44.2293, lon: -76.4965, streetView: { lat: 44.2293, lon: -76.4965, heading: 180, pitch: 0 }, hints: ['Classrooms'], difficulty: 'medium', category: 'campus' },
  { id: 'miller-hall', name: 'Miller Hall', description: 'Music building', lat: 44.2308, lon: -76.4982, streetView: { lat: 44.2308, lon: -76.4982, heading: 90, pitch: 0 }, hints: ['Music'], difficulty: 'medium', category: 'campus' },
  { id: 'theological-hall', name: 'Theological Hall', description: 'Historic building', lat: 44.2319, lon: -76.4972, streetView: { lat: 44.2319, lon: -76.4972, heading: 270, pitch: 0 }, hints: ['Religious studies'], difficulty: 'hard', category: 'campus' },
  { id: 'watson-hall', name: 'Watson Hall', description: 'Academic building', lat: 44.2305, lon: -76.4953, streetView: { lat: 44.2305, lon: -76.4953, heading: 0, pitch: 0 }, hints: ['Sciences'], difficulty: 'medium', category: 'campus' },
  { id: 'chernoff-hall', name: 'Chernoff Hall', description: 'Math building', lat: 44.2283, lon: -76.4957, streetView: { lat: 44.2283, lon: -76.4957, heading: 180, pitch: 0 }, hints: ['Mathematics'], difficulty: 'hard', category: 'campus' },
  { id: 'stirling-hall', name: 'Stirling Hall', description: 'Physics building', lat: 44.2276, lon: -76.4964, streetView: { lat: 44.2276, lon: -76.4964, heading: 90, pitch: 0 }, hints: ['Physics'], difficulty: 'hard', category: 'campus' },
  { id: 'miller-museum', name: 'Miller Museum', description: 'Geology museum', lat: 44.2279, lon: -76.4970, streetView: { lat: 44.2279, lon: -76.4970, heading: 270, pitch: 0 }, hints: ['Rocks'], difficulty: 'hard', category: 'campus' },
  { id: 'biosciences', name: 'Biosciences Complex', description: 'Life sciences', lat: 44.2259, lon: -76.4945, streetView: { lat: 44.2259, lon: -76.4945, heading: 0, pitch: 0 }, hints: ['Biology'], difficulty: 'medium', category: 'campus' },
  { id: 'mac-corry-hall', name: 'Mac-Corry Hall', description: 'Humanities building', lat: 44.2299, lon: -76.4945, streetView: { lat: 44.2299, lon: -76.4945, heading: 90, pitch: 0 }, hints: ['Arts'], difficulty: 'medium', category: 'campus' },
  { id: 'dunning-hall', name: 'Dunning Hall', description: 'Engineering', lat: 44.2295, lon: -76.4987, streetView: { lat: 44.2295, lon: -76.4987, heading: 180, pitch: 0 }, hints: ['Engineering'], difficulty: 'medium', category: 'campus' },
  
  // Queen's Campus - Residences
  { id: 'victoria-hall', name: 'Victoria Hall', description: 'Residence', lat: 44.2318, lon: -76.4942, streetView: { lat: 44.2318, lon: -76.4942, heading: 270, pitch: 0 }, hints: ['Students live here'], difficulty: 'medium', category: 'campus' },
  { id: 'ban-righ-hall', name: 'Ban Righ Hall', description: 'Residence', lat: 44.2337, lon: -76.4953, streetView: { lat: 44.2337, lon: -76.4953, heading: 180, pitch: 0 }, hints: ['Housing'], difficulty: 'hard', category: 'campus' },
  { id: 'john-deutsch', name: 'John Deutsch Centre', description: 'University centre', lat: 44.2288, lon: -76.4958, streetView: { lat: 44.2288, lon: -76.4958, heading: 90, pitch: 0 }, hints: ['Events'], difficulty: 'medium', category: 'campus' },
  { id: 'agnes-etherington', name: 'Agnes Etherington Art Centre', description: 'Art gallery', lat: 44.2334, lon: -76.4968, streetView: { lat: 44.2334, lon: -76.4968, heading: 0, pitch: 0 }, hints: ['Art'], difficulty: 'hard', category: 'campus' },
  
  // Princess Street - West of Division
  { id: 'princess-division', name: 'Princess & Division', description: 'Intersection', lat: 44.2308, lon: -76.4898, streetView: { lat: 44.2308, lon: -76.4898, heading: 90, pitch: 0 }, hints: ['Main street'], difficulty: 'medium', category: 'downtown' },
  { id: 'princess-bagot', name: 'Princess & Bagot', description: 'Intersection', lat: 44.2305, lon: -76.4882, streetView: { lat: 44.2305, lon: -76.4882, heading: 90, pitch: 0 }, hints: ['Shopping'], difficulty: 'medium', category: 'downtown' },
  { id: 'princess-clergy', name: 'Princess & Clergy', description: 'Intersection', lat: 44.2302, lon: -76.4865, streetView: { lat: 44.2302, lon: -76.4865, heading: 90, pitch: 0 }, hints: ['Stores'], difficulty: 'medium', category: 'downtown' },
  { id: 'princess-brock', name: 'Princess & Brock', description: 'Intersection', lat: 44.2299, lon: -76.4849, streetView: { lat: 44.2299, lon: -76.4849, heading: 90, pitch: 0 }, hints: ['Downtown'], difficulty: 'medium', category: 'downtown' },
  { id: 'princess-william', name: 'Princess & William', description: 'Intersection', lat: 44.2296, lon: -76.4832, streetView: { lat: 44.2296, lon: -76.4832, heading: 90, pitch: 0 }, hints: ['Restaurants'], difficulty: 'medium', category: 'downtown' },
  { id: 'princess-wellington', name: 'Princess & Wellington', description: 'Intersection', lat: 44.2293, lon: -76.4815, streetView: { lat: 44.2293, lon: -76.4815, heading: 90, pitch: 0 }, hints: ['Cafes'], difficulty: 'medium', category: 'downtown' },
  { id: 'princess-montreal', name: 'Princess & Montreal', description: 'Intersection', lat: 44.2290, lon: -76.4799, streetView: { lat: 44.2290, lon: -76.4799, heading: 90, pitch: 0 }, hints: ['Shopping'], difficulty: 'hard', category: 'downtown' },
  { id: 'princess-queen', name: 'Princess & Queen', description: 'Intersection', lat: 44.2287, lon: -76.4782, streetView: { lat: 44.2287, lon: -76.4782, heading: 90, pitch: 0 }, hints: ['Shops'], difficulty: 'hard', category: 'downtown' },
  { id: 'princess-king', name: 'Princess & King', description: 'Intersection', lat: 44.2284, lon: -76.4765, streetView: { lat: 44.2284, lon: -76.4765, heading: 90, pitch: 0 }, hints: ['Downtown'], difficulty: 'hard', category: 'downtown' },
  
  // Princess Street - Multiple Views
  { id: 'princess-west-1', name: 'Princess Street West', description: 'Shopping district', lat: 44.2305, lon: -76.4888, streetView: { lat: 44.2305, lon: -76.4888, heading: 270, pitch: 0 }, hints: ['Main street'], difficulty: 'medium', category: 'downtown' },
  { id: 'princess-west-2', name: 'Princess Street West', description: 'Shopping district', lat: 44.2302, lon: -76.4870, streetView: { lat: 44.2302, lon: -76.4870, heading: 270, pitch: 0 }, hints: ['Stores'], difficulty: 'medium', category: 'downtown' },
  { id: 'princess-west-3', name: 'Princess Street West', description: 'Shopping district', lat: 44.2299, lon: -76.4852, streetView: { lat: 44.2299, lon: -76.4852, heading: 270, pitch: 0 }, hints: ['Shopping'], difficulty: 'medium', category: 'downtown' },
  { id: 'princess-east-1', name: 'Princess Street East', description: 'Shopping district', lat: 44.2296, lon: -76.4835, streetView: { lat: 44.2296, lon: -76.4835, heading: 90, pitch: 0 }, hints: ['Restaurants'], difficulty: 'medium', category: 'downtown' },
  { id: 'princess-east-2', name: 'Princess Street East', description: 'Shopping district', lat: 44.2293, lon: -76.4818, streetView: { lat: 44.2293, lon: -76.4818, heading: 90, pitch: 0 }, hints: ['Dining'], difficulty: 'medium', category: 'downtown' },
  { id: 'princess-east-3', name: 'Princess Street East', description: 'Shopping district', lat: 44.2290, lon: -76.4800, streetView: { lat: 44.2290, lon: -76.4800, heading: 90, pitch: 0 }, hints: ['Shops'], difficulty: 'hard', category: 'downtown' },
  
  // Downtown Kingston - Market Square Area
  { id: 'city-hall-1', name: 'Kingston City Hall', description: 'Historic city hall', lat: 44.2309, lon: -76.4865, streetView: { lat: 44.2309, lon: -76.4865, heading: 180, pitch: 0 }, hints: ['Dome'], difficulty: 'easy', category: 'downtown' },
  { id: 'city-hall-2', name: 'Kingston City Hall', description: 'Historic city hall', lat: 44.2309, lon: -76.4865, streetView: { lat: 44.2309, lon: -76.4865, heading: 90, pitch: 0 }, hints: ['Government'], difficulty: 'easy', category: 'downtown' },
  { id: 'market-square-1', name: 'Market Square', description: 'Public square', lat: 44.2305, lon: -76.4870, streetView: { lat: 44.2305, lon: -76.4870, heading: 270, pitch: 0 }, hints: ['Square'], difficulty: 'medium', category: 'downtown' },
  { id: 'market-square-2', name: 'Market Square', description: 'Public square', lat: 44.2305, lon: -76.4870, streetView: { lat: 44.2305, lon: -76.4870, heading: 0, pitch: 0 }, hints: ['Market'], difficulty: 'medium', category: 'downtown' },
  { id: 'confederation-park', name: 'Confederation Park', description: 'Waterfront park', lat: 44.2292, lon: -76.4825, streetView: { lat: 44.2292, lon: -76.4825, heading: 180, pitch: 0 }, hints: ['Lake'], difficulty: 'medium', category: 'downtown' },
  
  // Downtown - Other Landmarks
  { id: 'grand-theatre', name: 'Grand Theatre', description: 'Performance venue', lat: 44.2304, lon: -76.4862, streetView: { lat: 44.2304, lon: -76.4862, heading: 90, pitch: 0 }, hints: ['Shows'], difficulty: 'medium', category: 'downtown' },
  { id: 'kingston-library', name: 'Kingston Public Library', description: 'Public library', lat: 44.2301, lon: -76.4858, streetView: { lat: 44.2301, lon: -76.4858, heading: 180, pitch: 0 }, hints: ['Books'], difficulty: 'medium', category: 'downtown' },
  { id: 'pump-house', name: 'Pump House Museum', description: 'Steam museum', lat: 44.2288, lon: -76.4815, streetView: { lat: 44.2288, lon: -76.4815, heading: 0, pitch: 0 }, hints: ['Museum'], difficulty: 'hard', category: 'downtown' },
  { id: 'confederation-basin', name: 'Confederation Basin', description: 'Harbor basin', lat: 44.2295, lon: -76.4820, streetView: { lat: 44.2295, lon: -76.4820, heading: 0, pitch: -10 }, hints: ['Water'], difficulty: 'hard', category: 'downtown' },
  { id: 'fort-henry', name: 'Fort Henry', description: 'Historic fort', lat: 44.2366, lon: -76.4583, streetView: { lat: 44.2366, lon: -76.4583, heading: 270, pitch: 0 }, hints: ['Military'], difficulty: 'hard', category: 'downtown' },
  { id: 'kingston-pen', name: 'Kingston Penitentiary', description: 'Historic prison', lat: 44.2383, lon: -76.5022, streetView: { lat: 44.2383, lon: -76.5022, heading: 180, pitch: 0 }, hints: ['Prison'], difficulty: 'hard', category: 'downtown' },
  
  // Bars and Nightlife Area
  { id: 'tir-nan-og', name: 'Tir Nan Og', description: 'Irish pub', lat: 44.2305, lon: -76.4885, streetView: { lat: 44.2305, lon: -76.4885, heading: 90, pitch: 0 }, hints: ['Irish pub'], difficulty: 'medium', category: 'bars' },
  { id: 'red-house', name: 'Red House', description: 'Bar and restaurant', lat: 44.2302, lon: -76.4870, streetView: { lat: 44.2302, lon: -76.4870, heading: 180, pitch: 0 }, hints: ['Red building'], difficulty: 'medium', category: 'bars' },
  { id: 'the-brooklyn', name: 'The Brooklyn', description: 'Bar and grill', lat: 44.2299, lon: -76.4855, streetView: { lat: 44.2299, lon: -76.4855, heading: 270, pitch: 0 }, hints: ['Sports bar'], difficulty: 'medium', category: 'bars' },
  { id: 'the-brew-pub', name: 'The Brew Pub', description: 'Brewery and restaurant', lat: 44.2296, lon: -76.4840, streetView: { lat: 44.2296, lon: -76.4840, heading: 0, pitch: 0 }, hints: ['Brewery'], difficulty: 'medium', category: 'bars' },
  { id: 'the-keystone', name: 'The Keystone', description: 'Bar and restaurant', lat: 44.2293, lon: -76.4825, streetView: { lat: 44.2293, lon: -76.4825, heading: 90, pitch: 0 }, hints: ['Bar'], difficulty: 'medium', category: 'bars' },
  { id: 'the-kingston-brewing', name: 'Kingston Brewing Company', description: 'Brewery and restaurant', lat: 44.2290, lon: -76.4810, streetView: { lat: 44.2290, lon: -76.4810, heading: 180, pitch: 0 }, hints: ['Brewery'], difficulty: 'medium', category: 'bars' },
  { id: 'the-kingston-brewing-2', name: 'Kingston Brewing Company', description: 'Brewery and restaurant', lat: 44.2290, lon: -76.4810, streetView: { lat: 44.2290, lon: -76.4810, heading: 270, pitch: 0 }, hints: ['Brewery'], difficulty: 'medium', category: 'bars' },
  { id: 'the-kingston-brewing-3', name: 'Kingston Brewing Company', description: 'Brewery and restaurant', lat: 44.2290, lon: -76.4810, streetView: { lat: 44.2290, lon: -76.4810, heading: 0, pitch: 0 }, hints: ['Brewery'], difficulty: 'medium', category: 'bars' },
  { id: 'the-kingston-brewing-4', name: 'Kingston Brewing Company', description: 'Brewery and restaurant', lat: 44.2290, lon: -76.4810, streetView: { lat: 44.2290, lon: -76.4810, heading: 90, pitch: 0 }, hints: ['Brewery'], difficulty: 'medium', category: 'bars' },
  { id: 'the-kingston-brewing-5', name: 'Kingston Brewing Company', description: 'Brewery and restaurant', lat: 44.2290, lon: -76.4810, streetView: { lat: 44.2290, lon: -76.4810, heading: 180, pitch: 0 }, hints: ['Brewery'], difficulty: 'medium', category: 'bars' },
  
  // Ontario Street & Brock Street
  { id: 'ontario-brock', name: 'Ontario & Brock', description: 'Intersection', lat: 44.2315, lon: -76.4848, streetView: { lat: 44.2315, lon: -76.4848, heading: 90, pitch: 0 }, hints: ['Corner'], difficulty: 'hard', category: 'downtown' },
  { id: 'brock-princess-1', name: 'Brock Street', description: 'Historic street', lat: 44.2307, lon: -76.4849, streetView: { lat: 44.2307, lon: -76.4849, heading: 0, pitch: 0 }, hints: ['North-south'], difficulty: 'hard', category: 'downtown' },
  { id: 'brock-princess-2', name: 'Brock Street', description: 'Historic street', lat: 44.2307, lon: -76.4849, streetView: { lat: 44.2307, lon: -76.4849, heading: 180, pitch: 0 }, hints: ['Limestone'], difficulty: 'hard', category: 'downtown' },
  
  // Wellington Street
  { id: 'wellington-princess', name: 'Wellington & Princess', description: 'Intersection', lat: 44.2293, lon: -76.4815, streetView: { lat: 44.2293, lon: -76.4815, heading: 0, pitch: 0 }, hints: ['Cross street'], difficulty: 'hard', category: 'downtown' },
  { id: 'wellington-north', name: 'Wellington Street', description: 'Side street', lat: 44.2300, lon: -76.4815, streetView: { lat: 44.2300, lon: -76.4815, heading: 180, pitch: 0 }, hints: ['Narrow'], difficulty: 'hard', category: 'downtown' },
];

/**
 * Get landmarks by difficulty level
 */
export function getLandmarksByDifficulty(difficulty) {
  return KINGSTON_LANDMARKS.filter(landmark => landmark.difficulty === difficulty);
}

/**
 * Get landmarks by category
 */
export function getLandmarksByCategory(category) {
  return KINGSTON_LANDMARKS.filter(landmark => landmark.category === category);
}

/**
 * Get random landmark for game (ensures variety)
 */
let usedLandmarks = [];

export function getRandomLandmark(difficulty = null) {
  let landmarks = KINGSTON_LANDMARKS;
  
  if (difficulty) {
    landmarks = getLandmarksByDifficulty(difficulty);
  }
  
  if (landmarks.length === 0) {
    landmarks = KINGSTON_LANDMARKS;
  }
  
  // Filter out recently used landmarks
  let availableLandmarks = landmarks.filter(l => !usedLandmarks.includes(l.id));
  
  // Reset if we've used all landmarks
  if (availableLandmarks.length === 0) {
    usedLandmarks = [];
    availableLandmarks = landmarks;
  }
  
  // Get random landmark
  const landmark = availableLandmarks[Math.floor(Math.random() * availableLandmarks.length)];
  
  // Add to used list
  usedLandmarks.push(landmark.id);
  
  // Keep only last 20 used landmarks
  if (usedLandmarks.length > 20) {
    usedLandmarks.shift();
  }
  
  return landmark;
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
