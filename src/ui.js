/**
 * UI: Manages all user interface elements and interactions
 */

import { MapRenderer } from './mapRenderer.js';
import { StaticMap } from './staticMap.js';

export const UI = {
  // DOM elements
  elements: {},
  
  // Game components
  mapRenderer: null,
  
  // Callbacks
  callbacks: {},
  
  // Map state
  isMapVisible: false,
  currentMapUrl: null,
  currentLandmark: null,
  mapCenter: null,
  mapZoom: 15,

  /**
   * Initialize UI and wire up event handlers
   */
  init(callbacks = {}) {
    this.callbacks = callbacks;
    this.cacheElements();
    this.setupEventHandlers();
    this.setupMap();
    this.showGameSetup();
    
    // Load saved inputs
    this.loadSavedInputs();
    
    // Hide loading screen after a short delay
    setTimeout(() => {
      this.hideLoadingScreen();
    }, 2000);
  },

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      // Game setup
      gameSetup: document.getElementById('gameSetup'),
      playerName: document.getElementById('playerName'),
      difficulty: document.getElementById('difficulty'),
      startGameBtn: document.getElementById('startGameBtn'),
      
      // Game results
      gameResults: document.getElementById('gameResults'),
      finalScore: document.getElementById('finalScore'),
      accuracy: document.getElementById('accuracy'),
      avgDistance: document.getElementById('avgDistance'),
      playAgainBtn: document.getElementById('playAgainBtn'),
      shareScoreBtn: document.getElementById('shareScoreBtn'),
      
      // Photo display
      photoContainer: document.getElementById('photoContainer'),
      campusPhoto: document.getElementById('campusPhoto'),
      photoOverlay: document.getElementById('photoOverlay'),
      roundDisplay: document.getElementById('roundDisplay'),
      scoreDisplay: document.getElementById('scoreDisplay'),
      
      // Controls
      readyToGuessBtn: document.getElementById('readyToGuessBtn'),
      skipBtn: document.getElementById('skipBtn'),
      hintBtn: document.getElementById('hintBtn'),
      hintText: document.getElementById('hintText'),
      
      // Map elements
      mapContainer: document.getElementById('mapContainer'),
      kingstonMap: document.getElementById('kingstonMap'),
      cancelGuessBtn: document.getElementById('cancelGuessBtn'),
      
      // Personal best (now in header)
      personalBest: document.getElementById('personalBest'),
      
      // Loading screen
      loadingScreen: document.getElementById('loadingScreen'),
      app: document.getElementById('app'),
    };
  },

  /**
   * Setup event handlers
   */
  setupEventHandlers() {
    // Game setup
    this.elements.startGameBtn.addEventListener('click', () => {
      this.startGame();
    });

    // Game controls
    this.elements.readyToGuessBtn.addEventListener('click', () => {
      this.showDetailedMap();
    });

    this.elements.skipBtn.addEventListener('click', () => {
      if (this.callbacks.onSkip) this.callbacks.onSkip();
    });
    
    this.elements.cancelGuessBtn.addEventListener('click', () => {
      this.hideDetailedMap();
    });

    this.elements.hintBtn.addEventListener('click', () => {
      if (this.callbacks.onHint) this.callbacks.onHint();
    });

    // Game results
    this.elements.playAgainBtn.addEventListener('click', () => {
      this.showGameSetup();
    });

    this.elements.shareScoreBtn.addEventListener('click', () => {
      this.shareScore();
    });

    // Save inputs on change
    this.elements.playerName.addEventListener('input', () => {
      this.saveInputs();
    });

    // Enter key to start
    this.elements.playerName.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.startGame();
    });
  },

  /**
   * Setup Kingston map
   */
  setupMap() {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    canvas.style.width = '100%';
    canvas.style.height = '400px';
    canvas.style.borderRadius = '8px';
    
    this.elements.kingstonMap.appendChild(canvas);
    
    this.mapRenderer = MapRenderer;
    this.mapRenderer.init(canvas, (lat, lon) => {
      this.handleMapGuess(lat, lon);
    });
  },

  /**
   * Load saved inputs from localStorage
   */
  loadSavedInputs() {
    try {
      const savedName = localStorage.getItem('kingston_name');
      if (savedName) this.elements.playerName.value = savedName;
    } catch (err) {
      console.warn('Failed to load saved inputs:', err);
    }
  },

  /**
   * Save inputs to localStorage
   */
  saveInputs() {
    try {
      localStorage.setItem('kingston_name', this.elements.playerName.value);
    } catch (err) {
      console.warn('Failed to save inputs:', err);
    }
  },

  /**
   * Start new game
   */
  startGame() {
    const name = this.elements.playerName.value.trim();
    const difficulty = this.elements.difficulty.value;

    if (!name) {
      alert('Please enter your name!');
      return;
    }

    // Start game via callback
    if (this.callbacks.onStartGame) {
      this.callbacks.onStartGame({
        playerName: name,
        difficulty,
      });
    }
  },

  /**
   * Show game setup screen
   */
  showGameSetup() {
    this.elements.gameSetup.classList.remove('hidden');
    this.elements.gameResults.classList.add('hidden');
    this.hidePhoto();
    if (this.callbacks.onResetToMenu) {
      this.callbacks.onResetToMenu();
    }
  },

  /**
   * Show round info
   */
  showRound(round, total, score) {
    this.elements.roundDisplay.textContent = `Round ${round} of ${total}`;
    this.elements.scoreDisplay.textContent = `Score: ${score.toLocaleString()}`;
  },

  /**
   * Show campus photo
   */
  showPhoto(imageUrl, landmark) {
    this.elements.photoContainer.classList.remove('hidden');
    this.elements.campusPhoto.src = imageUrl;
    this.elements.campusPhoto.alt = 'Kingston location';
    this.elements.photoOverlay.classList.add('hidden');
    
    // Store current landmark for map centering
    this.currentLandmark = landmark;
  },

  /**
   * Hide photo
   */
  hidePhoto() {
    this.elements.photoContainer.classList.add('hidden');
    this.elements.campusPhoto.src = '';
    this.elements.photoOverlay.classList.remove('hidden');
  },

  /**
   * Enable guess button
   */
  enableGuess() {
    this.elements.makeGuessBtn.disabled = false;
    this.elements.makeGuessBtn.textContent = 'Make Your Guess';
    this.elements.hintBtn.disabled = false;
    this.elements.skipBtn.disabled = false;
  },

  /**
   * Enable map guessing
   */
  enableMapGuessing() {
    this.elements.makeGuessBtn.disabled = true;
    this.elements.makeGuessBtn.textContent = 'Click on the map below';
    this.elements.hintBtn.disabled = true;
    this.elements.skipBtn.disabled = true;
  },

  /**
   * Handle map guess
   */
  handleMapGuess(lat, lon) {
    if (this.callbacks.onMakeGuess) {
      this.callbacks.onMakeGuess(lat, lon);
    }
  },

  /**
   * Reset hint button
   */
  resetHint() {
    this.elements.hintBtn.disabled = false;
    this.elements.hintBtn.textContent = '💡 Get Hint (-100 pts)';
    this.elements.hintText.classList.add('hidden');
  },

  /**
   * Show hint
   */
  showHint(hint, hintNumber, totalHints) {
    this.elements.hintText.innerHTML = `<strong>Hint ${hintNumber}/${totalHints}:</strong> ${hint}`;
    this.elements.hintText.classList.remove('hidden');
    
    if (hintNumber >= totalHints) {
      this.elements.hintBtn.disabled = true;
      this.elements.hintBtn.textContent = 'No more hints';
    } else {
      this.elements.hintBtn.textContent = `💡 Get Hint ${hintNumber + 1} (-100 pts)`;
    }
  },

  /**
   * Show guess result
   */
  showGuessResult(distance, score, landmark) {
    const distanceText = distance < 1000 ? `${Math.round(distance)}m` : `${(distance/1000).toFixed(1)}km`;
    
    // Show result overlay
    const overlay = document.createElement('div');
    overlay.className = 'result-overlay';
    overlay.innerHTML = `
      <div class="result-card">
        <p>Distance: <strong>${distanceText}</strong></p>
        <p>Points: <strong>${score.toLocaleString()}</strong></p>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 3000);
  },

  /**
   * Show skip result
   */
  showSkipResult(landmark) {
    const overlay = document.createElement('div');
    overlay.className = 'result-overlay';
    overlay.innerHTML = `
      <div class="result-card">
        <p><strong>Skipped</strong></p>
        <p>0 points</p>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 2000);
  },

  /**
   * Show game results
   */
  showGameResults({ score, accuracy, avgDistance, totalRounds, isNewPB }) {
    this.elements.finalScore.textContent = score.toLocaleString();
    this.elements.accuracy.textContent = `${accuracy}%`;
    this.elements.avgDistance.textContent = avgDistance < 1000 ? 
      `${Math.round(avgDistance)}m` : 
      `${(avgDistance/1000).toFixed(1)}km`;
    
    this.elements.gameSetup.classList.add('hidden');
    this.elements.gameResults.classList.remove('hidden');
    
    // Show new PB message
    if (isNewPB) {
      const pbMessage = document.createElement('div');
      pbMessage.className = 'new-pb-message';
      pbMessage.innerHTML = '🎉 New Personal Best! 🎉';
      this.elements.gameResults.insertBefore(pbMessage, this.elements.gameResults.firstChild);
    }
  },

  /**
   * Update personal best display
   */
  updatePersonalBest(pb) {
    if (this.elements.personalBest) {
      this.elements.personalBest.textContent = `🏆 Best: ${pb.toLocaleString()}`;
    }
  },

  /**
   * Share score
   */
  shareScore() {
    if (this.callbacks.onShareScore) {
      this.callbacks.onShareScore();
    }
  },

  /**
   * Show detailed map for guessing
   */
  async showDetailedMap() {
    console.log('🗺️ Showing detailed map for guessing...');
    
    if (!this.currentLandmark) {
      console.error('No current landmark set!');
      return;
    }
    
    // Hide the ready button and show map
    this.elements.readyToGuessBtn.style.display = 'none';
    this.elements.mapContainer.classList.remove('hidden');
    
    // Center map around the general Kingston area (not the exact landmark location)
    // Use a central point between campus and downtown
    const centerLat = 44.231;
    const centerLon = -76.498;
    const mapUrl = StaticMap.getDetailedMapUrl(centerLat, centerLon, 15, 800, 600);
    
    // Store the center and zoom for coordinate conversion
    this.mapCenter = { lat: centerLat, lon: centerLon };
    this.mapZoom = 15;
    
    // Create map image
    const mapImg = document.createElement('img');
    mapImg.src = mapUrl;
    mapImg.style.width = '100%';
    mapImg.style.height = '100%';
    mapImg.style.objectFit = 'contain';
    mapImg.style.cursor = 'crosshair';
    
    // Clear existing content
    this.elements.kingstonMap.innerHTML = '';
    this.elements.kingstonMap.appendChild(mapImg);
    
    // Add click handler
    mapImg.addEventListener('click', (e) => {
      const rect = mapImg.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      // Convert screen coordinates to lat/lon
      const { lat, lon } = StaticMap.screenToLatLon(
        clickX, clickY, 800, 600, this.mapCenter.lat, this.mapCenter.lon, this.mapZoom
      );
      
      console.log('🎯 Map clicked at:', lat, lon);
      
      // Make the guess
      this.handleMapGuess(lat, lon);
      
      // Hide the map
      this.hideDetailedMap();
    });
    
    this.isMapVisible = true;
  },

  /**
   * Hide detailed map
   */
  hideDetailedMap() {
    console.log('🗺️ Hiding detailed map...');
    
    this.elements.mapContainer.classList.add('hidden');
    this.elements.readyToGuessBtn.style.display = 'block';
    this.isMapVisible = false;
  },

  /**
   * Initialize static map with API key
   */
  initStaticMap(apiKey) {
    StaticMap.init(apiKey);
  },

  /**
   * Hide loading screen and show app
   */
  hideLoadingScreen() {
    if (this.elements.loadingScreen && this.elements.app) {
      this.elements.loadingScreen.style.transition = 'opacity 0.5s ease';
      this.elements.loadingScreen.style.opacity = '0';
      
      setTimeout(() => {
        this.elements.loadingScreen.style.display = 'none';
        this.elements.app.classList.remove('app-hidden');
      }, 500);
    }
  },
};