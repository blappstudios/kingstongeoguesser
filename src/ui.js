/**
 * UI: Manages all user interface elements and interactions
 */

import { MapRenderer } from './mapRenderer.js';
import { StaticMap } from './staticMap.js';
import { SimpleGoogleMaps } from './simpleGoogleMaps.js';

export const UI = {
  // DOM elements
  elements: {},
  
  // Game components
  mapRenderer: null,
  simpleGoogleMaps: null,
  
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
      playerEmail: document.getElementById('playerEmail'),
      startGameBtn: document.getElementById('startGameBtn'),
      
      // Game results
      gameResults: document.getElementById('gameResults'),
      finalScore: document.getElementById('finalScore'),
      accuracy: document.getElementById('accuracy'),
      avgDistance: document.getElementById('avgDistance'),
      playAgainBtn: document.getElementById('playAgainBtn'),
      shareScoreBtn: document.getElementById('shareScoreBtn'),
      viewLeaderboardBtn: document.getElementById('viewLeaderboardBtn'),
      
      // Leaderboard
      leaderboardContainer: document.getElementById('leaderboardContainer'),
      leaderboardList: document.getElementById('leaderboardList'),
      closeLeaderboardBtn: document.getElementById('closeLeaderboardBtn'),
      
      // Street view display
      streetViewContainer: document.getElementById('streetViewContainer'),
      streetViewPhoto: document.getElementById('streetViewPhoto'),
      photoOverlay: document.getElementById('photoOverlay'),
      
      // Header elements
      currentScore: document.getElementById('currentScore'),
      currentRound: document.getElementById('currentRound'),
      totalRounds: document.getElementById('totalRounds'),
      
      // Controls
      makeGuessBtn: document.getElementById('makeGuessBtn'),
      skipBtn: document.getElementById('skipBtn'),
      hintBtn: document.getElementById('hintBtn'),
      hintText: document.getElementById('hintText'),
      hintDisplay: document.getElementById('hintDisplay'),
      
      // Map elements
      mapContainer: document.getElementById('mapContainer'),
      kingstonMap: document.getElementById('kingstonMap'),
      cancelGuessBtn: document.getElementById('cancelGuessBtn'),
      zoomInBtn: document.getElementById('zoomInBtn'),
      zoomOutBtn: document.getElementById('zoomOutBtn'),
      resetViewBtn: document.getElementById('resetViewBtn'),
      
      // Loading screen
      loadingScreen: document.getElementById('loadingScreen'),
      app: document.getElementById('app'),
      
      // Header buttons
      settingsBtn: document.getElementById('settingsBtn'),
      exitBtn: document.getElementById('exitBtn'),
      
      // Modals
      settingsModal: document.getElementById('settingsModal'),
      exitModal: document.getElementById('exitModal'),
      closeSettingsBtn: document.getElementById('closeSettingsBtn'),
      saveSettingsBtn: document.getElementById('saveSettingsBtn'),
      confirmExitBtn: document.getElementById('confirmExitBtn'),
      cancelExitBtn: document.getElementById('cancelExitBtn'),
      
      // Settings
      soundToggle: document.getElementById('soundToggle'),
      hintsToggle: document.getElementById('hintsToggle'),
      autoSubmitToggle: document.getElementById('autoSubmitToggle'),
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
    this.elements.makeGuessBtn.addEventListener('click', () => {
      this.showDetailedMap();
    });

    this.elements.skipBtn.addEventListener('click', () => {
      if (this.callbacks.onSkip) this.callbacks.onSkip();
    });
    
    this.elements.cancelGuessBtn.addEventListener('click', () => {
      this.hideDetailedMap();
    });

    // Map controls
    this.elements.zoomInBtn.addEventListener('click', () => {
      if (this.simpleGoogleMaps) {
        this.simpleGoogleMaps.setZoom(this.simpleGoogleMaps.getZoom() + 1);
      }
    });

    this.elements.zoomOutBtn.addEventListener('click', () => {
      if (this.simpleGoogleMaps) {
        this.simpleGoogleMaps.setZoom(this.simpleGoogleMaps.getZoom() - 1);
      }
    });

    this.elements.resetViewBtn.addEventListener('click', () => {
      if (this.simpleGoogleMaps) {
        this.simpleGoogleMaps.resetView();
      }
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

    // Email validation
    this.elements.playerEmail.addEventListener('input', () => {
      this.validateEmail();
    });

    // Leaderboard
    this.elements.viewLeaderboardBtn.addEventListener('click', () => {
      this.showLeaderboard();
    });

    this.elements.closeLeaderboardBtn.addEventListener('click', () => {
      this.hideLeaderboard();
    });

    // Close leaderboard on backdrop click
    this.elements.leaderboardContainer.addEventListener('click', (e) => {
      if (e.target === this.elements.leaderboardContainer) {
        this.hideLeaderboard();
      }
    });

    // Header buttons
    this.elements.settingsBtn.addEventListener('click', () => {
      this.showSettings();
    });

    this.elements.exitBtn.addEventListener('click', () => {
      this.showExitConfirmation();
    });

    // Modal handlers
    this.elements.closeSettingsBtn.addEventListener('click', () => {
      this.hideSettings();
    });

    this.elements.saveSettingsBtn.addEventListener('click', () => {
      this.saveSettings();
    });

    this.elements.confirmExitBtn.addEventListener('click', () => {
      this.confirmExit();
    });

    this.elements.cancelExitBtn.addEventListener('click', () => {
      this.hideExitConfirmation();
    });

    // Close modals on backdrop click
    this.elements.settingsModal.addEventListener('click', (e) => {
      if (e.target === this.elements.settingsModal) {
        this.hideSettings();
      }
    });

    this.elements.exitModal.addEventListener('click', (e) => {
      if (e.target === this.elements.exitModal) {
        this.hideExitConfirmation();
      }
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
      const savedEmail = localStorage.getItem('kingston_email');
      if (savedName) this.elements.playerName.value = savedName;
      if (savedEmail) this.elements.playerEmail.value = savedEmail;
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
      localStorage.setItem('kingston_email', this.elements.playerEmail.value);
    } catch (err) {
      console.warn('Failed to save inputs:', err);
    }
  },

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate email input
   */
  validateEmail() {
    const email = this.elements.playerEmail.value.trim();
    const isValid = this.isValidEmail(email);
    
    if (email && !isValid) {
      this.elements.playerEmail.style.borderColor = '#dc3545';
    } else {
      this.elements.playerEmail.style.borderColor = '';
    }
  },

  /**
   * Start new game
   */
  startGame() {
    const name = this.elements.playerName.value.trim();
    const email = this.elements.playerEmail.value.trim();

    if (!name) {
      alert('Please enter your name!');
      return;
    }

    if (!email || !this.isValidEmail(email)) {
      alert('Please enter a valid email address!');
      return;
    }

    // Hide setup and show game
    this.elements.gameSetup.classList.add('hidden');
    this.elements.streetViewContainer.classList.remove('hidden');

    // Start game via callback
    if (this.callbacks.onStartGame) {
      this.callbacks.onStartGame({
        playerName: name,
        playerEmail: email,
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
    this.elements.currentRound.textContent = round;
    this.elements.totalRounds.textContent = total;
    this.elements.currentScore.textContent = score.toLocaleString();
  },

  /**
   * Show street view photo
   */
  showPhoto(imageUrl, landmark) {
    this.elements.streetViewContainer.classList.remove('hidden');
    this.elements.streetViewPhoto.src = imageUrl;
    this.elements.streetViewPhoto.alt = 'Kingston location';
    this.elements.photoOverlay.classList.add('hidden');
    
    // Store current landmark for map centering
    this.currentLandmark = landmark;
  },

  /**
   * Hide photo
   */
  hidePhoto() {
    this.elements.streetViewContainer.classList.add('hidden');
    this.elements.streetViewPhoto.src = '';
    this.elements.photoOverlay.classList.remove('hidden');
  },

  /**
   * Enable guess button
   */
  enableGuess() {
    this.elements.makeGuessBtn.disabled = false;
    this.elements.makeGuessBtn.textContent = 'Make a guess';
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
    this.elements.hintBtn.textContent = '💡';
    this.elements.hintDisplay.classList.add('hidden');
  },

  /**
   * Show hint
   */
  showHint(hint, hintNumber, totalHints) {
    this.elements.hintText.textContent = hint;
    this.elements.hintDisplay.classList.remove('hidden');
    
    if (hintNumber >= totalHints) {
      this.elements.hintBtn.disabled = true;
      this.elements.hintBtn.textContent = '💡';
    } else {
      this.elements.hintBtn.textContent = '💡';
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
    console.log('🗺️ Showing Simple Google Maps for guessing...');
    
    if (!this.currentLandmark) {
      console.error('No current landmark set!');
      return;
    }
    
    // Initialize the simple Google Maps immediately
    this.initializeMap();
  },

  /**
   * Initialize the simple Google Maps
   */
  initializeMap() {
    // Hide the street view and show map
    this.elements.streetViewContainer.classList.add('hidden');
    this.elements.mapContainer.classList.remove('hidden');
    
    // Initialize Simple Google Maps with proper callback
    this.simpleGoogleMaps = SimpleGoogleMaps;
    this.simpleGoogleMaps.init(this.elements.kingstonMap, (lat, lon) => {
      console.log('🎯 Simple Google Maps clicked at:', lat, lon);
      
      // Make the guess
      this.handleMapGuess(lat, lon);
      
      // Hide the map after a short delay
      setTimeout(() => {
        this.hideDetailedMap();
      }, 1000);
    });
    
    this.isMapVisible = true;
  },

  /**
   * Hide detailed map
   */
  hideDetailedMap() {
    console.log('🗺️ Hiding Simple Google Maps...');
    
    // Clean up Simple Google Maps
    if (this.simpleGoogleMaps) {
      this.simpleGoogleMaps.destroy();
      this.simpleGoogleMaps = null;
    }
    
    this.elements.mapContainer.classList.add('hidden');
    this.elements.streetViewContainer.classList.remove('hidden');
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

  /**
   * Show settings modal
   */
  showSettings() {
    this.elements.settingsModal.classList.remove('hidden');
    this.loadSettings();
  },

  /**
   * Hide settings modal
   */
  hideSettings() {
    this.elements.settingsModal.classList.add('hidden');
  },

  /**
   * Show exit confirmation
   */
  showExitConfirmation() {
    this.elements.exitModal.classList.remove('hidden');
  },

  /**
   * Hide exit confirmation
   */
  hideExitConfirmation() {
    this.elements.exitModal.classList.add('hidden');
  },

  /**
   * Load settings from localStorage
   */
  loadSettings() {
    const settings = JSON.parse(localStorage.getItem('kingstonGeoguesserSettings') || '{}');
    this.elements.soundToggle.checked = settings.sound !== false;
    this.elements.hintsToggle.checked = settings.hints !== false;
    this.elements.autoSubmitToggle.checked = settings.autoSubmit !== false;
  },

  /**
   * Save settings to localStorage
   */
  saveSettings() {
    const settings = {
      sound: this.elements.soundToggle.checked,
      hints: this.elements.hintsToggle.checked,
      autoSubmit: this.elements.autoSubmitToggle.checked,
    };
    localStorage.setItem('kingstonGeoguesserSettings', JSON.stringify(settings));
    this.hideSettings();
  },

  /**
   * Confirm exit and reset to menu
   */
  confirmExit() {
    this.hideExitConfirmation();
    this.resetToMenu();
  },

  /**
   * Reset to menu
   */
  resetToMenu() {
    // Hide all game elements
    this.elements.streetViewContainer.classList.add('hidden');
    this.elements.mapContainer.classList.add('hidden');
    this.elements.gameResults.classList.add('hidden');
    
    // Show setup
    this.elements.gameSetup.classList.remove('hidden');
    
    // Reset form
    this.elements.playerName.value = '';
    this.elements.playerEmail.value = '';
    
    // Reset score display
    this.elements.currentScore.textContent = '0';
    this.elements.currentRound.textContent = '1';
    this.elements.totalRounds.textContent = '5';
    
    // Reset hint
    this.resetHint();
    
    // Reset to menu via callback
    if (this.callbacks.onResetToMenu) {
      this.callbacks.onResetToMenu();
    }
  },


  /**
   * Show leaderboard
   */
  showLeaderboard() {
    this.elements.leaderboardContainer.classList.remove('hidden');
    this.loadLeaderboard();
  },

  /**
   * Hide leaderboard
   */
  hideLeaderboard() {
    this.elements.leaderboardContainer.classList.add('hidden');
  },

  /**
   * Load and display leaderboard
   */
  async loadLeaderboard() {
    try {
      // Get leaderboard data from Supabase
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(50);

      if (error) throw error;

      this.displayLeaderboard(data || []);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      this.displayLeaderboard([]);
    }
  },

  /**
   * Display leaderboard entries
   */
  displayLeaderboard(entries) {
    this.elements.leaderboardList.innerHTML = '';

    if (entries.length === 0) {
      this.elements.leaderboardList.innerHTML = '<p style="text-align: center; color: var(--geoguessr-gray); padding: 2rem;">No scores yet. Be the first to play!</p>';
      return;
    }

    entries.forEach((entry, index) => {
      const entryEl = document.createElement('div');
      entryEl.className = 'leaderboard-entry';
      
      const rank = index + 1;
      const rankClass = rank <= 3 ? 'top-3' : '';
      
      entryEl.innerHTML = `
        <div class="leaderboard-rank ${rankClass}">${rank}</div>
        <div class="leaderboard-email">${entry.player_email || 'No email'}</div>
        <div class="leaderboard-info">
          <div class="leaderboard-name">${entry.player_name}</div>
          <div class="leaderboard-score">${entry.score.toLocaleString()} points</div>
          <div class="leaderboard-date">${new Date(entry.created_at).toLocaleDateString()}</div>
        </div>
      `;
      
      this.elements.leaderboardList.appendChild(entryEl);
    });
  },
};