/**
 * Main entry point for Queen's Campus GeoGuesser
 * Bootstraps all modules and initializes the game
 */

import { Game } from './game.js';
import { UI } from './ui.js';
import { StreetView } from './streetView.js';

// Read environment variables
const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  googleMapsKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
};

// Debug: Check if environment variables are loaded
console.log('🔧 Environment check:');
console.log('Google Maps Key present:', !!config.googleMapsKey);

/**
 * Initialize all modules
 */
async function init() {
  console.log('🏛️ Initializing Queen\'s Campus GeoGuesser...');

  // Initialize game with UI callbacks
  Game.init({
    showRound: (round, total, score) => UI.showRound(round, total, score),
    showPhoto: (imageUrl, landmark) => UI.showPhoto(imageUrl, landmark),
    enableGuess: () => UI.enableGuess(),
    resetHint: () => UI.resetHint(),
    showGuessResult: (distance, score, landmark) => UI.showGuessResult(distance, score, landmark),
    showHint: (hint, hintNumber, totalHints) => UI.showHint(hint, hintNumber, totalHints),
    showSkipResult: (landmark) => UI.showSkipResult(landmark),
    showGameResults: (results) => UI.showGameResults(results),
    updatePersonalBest: (pb) => UI.updatePersonalBest(pb),
  });
  console.log('✅ Game initialized');

  // Initialize Street View
  StreetView.init(config.googleMapsKey);
  console.log('✅ Street View initialized');

  // Initialize UI with callbacks and Static Map
  UI.init({
    onStartGame: (settings) => Game.startGame(settings),
    onMakeGuess: (lat, lon) => Game.makeGuess(lat, lon),
    onSkip: () => Game.skipRound(),
    onHint: () => Game.useHint(),
    onResetToMenu: () => Game.resetToMenu(),
    onShareScore: () => {
      const score = Game.score;
      const text = `I scored ${score.toLocaleString()} points on Kingston GeoGuesser! Can you beat my score?`;
      const url = window.location.href;
      
      if (navigator.share) {
        navigator.share({ title: "Kingston GeoGuesser", text, url });
      } else {
        navigator.clipboard.writeText(`${text} ${url}`).then(() => {
          alert('Score copied to clipboard!');
        });
      }
    },
  });
  console.log('✅ UI initialized');

  // Initialize Static Map
  UI.initStaticMap(config.googleMapsKey);
  console.log('✅ Static Map initialized');

  console.log('✅ Game ready! Start guessing Kingston locations!');
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    init().catch((err) => {
      console.error('Failed to initialize game:', err);
      alert('Failed to load game. Please refresh the page.');
    });
  });
} else {
  init().catch((err) => {
    console.error('Failed to initialize game:', err);
    alert('Failed to load game. Please refresh the page.');
  });
}