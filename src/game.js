/**
 * Game: Core GeoGuesser game logic and state management
 */

import { getRandomLandmark, calculateDistance, calculateScore } from './kingstonData.js';
import { StreetView } from './streetView.js';

const PB_KEY = 'queens_geoguesser_pb';

export const Game = {
  // Game state
  isPlaying: false,
  isGameOver: false,
  currentRound: 0,
  totalRounds: 5,
  score: 0,
  totalDistance: 0,
  currentLandmark: null,
  selectedLocation: null,
  usedHints: 0,
  hintPenalty: 0,
  
  // Game settings
  difficulty: 'medium',
  playerName: '',
  
  // Round results
  roundResults: [],
  
  // UI callbacks
  uiCallbacks: {},

  /**
   * Initialize game
   */
  init(uiCallbacks = {}) {
    this.uiCallbacks = uiCallbacks;
    console.log('🎮 GeoGuesser game initialized');
  },

  /**
   * Start a new game
   */
  startGame(settings) {
    this.difficulty = settings.difficulty || 'medium';
    this.playerName = settings.playerName || '';
    
    // Set total rounds based on difficulty
    switch (this.difficulty) {
      case 'easy':
        this.totalRounds = 5;
        break;
      case 'medium':
        this.totalRounds = 10;
        break;
      case 'hard':
        this.totalRounds = 15;
        break;
    }
    
    this.resetGame();
    this.nextRound();
    
    this.isPlaying = true;
    this.isGameOver = false;
    
    console.log(`🎯 Started ${this.difficulty} game with ${this.totalRounds} rounds`);
  },

  /**
   * Reset game state
   */
  resetGame() {
    this.currentRound = 0;
    this.score = 0;
    this.totalDistance = 0;
    this.currentLandmark = null;
    this.selectedLocation = null;
    this.usedHints = 0;
    this.hintPenalty = 0;
    this.roundResults = [];
  },

  /**
   * Start next round
   */
  async nextRound() {
    if (this.currentRound >= this.totalRounds) {
      this.endGame();
      return;
    }
    
    this.currentRound++;
    this.selectedLocation = null;
    this.usedHints = 0;
    this.hintPenalty = 0;
    
    // Get random landmark
    this.currentLandmark = getRandomLandmark(this.difficulty);
    
    // Load Street View image
    const imageUrl = await StreetView.loadStreetViewImage(this.currentLandmark);
    
    // Update UI via callbacks
    if (this.uiCallbacks.showRound) {
      this.uiCallbacks.showRound(this.currentRound, this.totalRounds, this.score);
    }
    if (this.uiCallbacks.showPhoto) {
      this.uiCallbacks.showPhoto(imageUrl, this.currentLandmark);
    }
    if (this.uiCallbacks.enableGuess) {
      this.uiCallbacks.enableGuess();
    }
    if (this.uiCallbacks.resetHint) {
      this.uiCallbacks.resetHint();
    }
    
    console.log(`📍 Round ${this.currentRound}: ${this.currentLandmark.name}`);
  },

  /**
   * Make a guess
   */
  makeGuess(lat, lon) {
    if (!this.currentLandmark || !this.isPlaying) return;
    
    this.selectedLocation = { lat, lon };
    
    // Calculate distance and score
    const distance = calculateDistance(
      lat, lon,
      this.currentLandmark.lat,
      this.currentLandmark.lon
    );
    
    const roundScore = Math.max(0, calculateScore(distance) - this.hintPenalty);
    
    // Store round result
    this.roundResults.push({
      landmark: this.currentLandmark,
      guess: this.selectedLocation,
      distance,
      score: roundScore,
      hints: this.usedHints,
    });
    
    // Update totals
    this.score += roundScore;
    this.totalDistance += distance;
    
    // Show result
    if (this.uiCallbacks.showGuessResult) {
      this.uiCallbacks.showGuessResult(distance, roundScore, this.currentLandmark);
    }
    
    // Wait a bit then continue to next round
    setTimeout(() => {
      this.nextRound();
    }, 3000);
    
    console.log(`🎯 Guess: ${Math.round(distance)}m away, scored ${roundScore} points`);
  },

  /**
   * Use a hint
   */
  useHint() {
    if (!this.currentLandmark || this.usedHints >= this.currentLandmark.hints.length) return;
    
    const hint = this.currentLandmark.hints[this.usedHints];
    this.usedHints++;
    this.hintPenalty += 100; // -100 points per hint
    
    if (this.uiCallbacks.showHint) {
      this.uiCallbacks.showHint(hint, this.usedHints, this.currentLandmark.hints.length);
    }
    
    console.log(`💡 Hint ${this.usedHints}: ${hint}`);
  },

  /**
   * Skip current round
   */
  skipRound() {
    if (!this.currentLandmark || !this.isPlaying) return;
    
    // No points for skipped rounds
    this.roundResults.push({
      landmark: this.currentLandmark,
      guess: null,
      distance: null,
      score: 0,
      hints: this.usedHints,
      skipped: true,
    });
    
    if (this.uiCallbacks.showSkipResult) {
      this.uiCallbacks.showSkipResult(this.currentLandmark);
    }
    
    setTimeout(() => {
      this.nextRound();
    }, 2000);
    
    console.log(`⏭️ Skipped round: ${this.currentLandmark.name}`);
  },

  /**
   * End game
   */
  async endGame() {
    this.isPlaying = false;
    this.isGameOver = true;
    
    const accuracy = this.calculateAccuracy();
    const avgDistance = this.totalDistance / this.roundResults.length;
    
    // Check for new personal best
    const isNewPB = this.score > this.getPB();
    if (isNewPB) {
      this.savePB(this.score);
    }
    
    // Update personal best display
    if (this.uiCallbacks.updatePersonalBest) {
      this.uiCallbacks.updatePersonalBest(this.getPB());
    }
    
    // Show final results
    if (this.uiCallbacks.showGameResults) {
      this.uiCallbacks.showGameResults({
        score: this.score,
        accuracy,
        avgDistance,
        totalRounds: this.totalRounds,
        isNewPB,
      });
    }
    
    console.log(`🏁 Game over! Final score: ${this.score}, Accuracy: ${accuracy}%`);
  },

  /**
   * Calculate accuracy percentage
   */
  calculateAccuracy() {
    if (this.roundResults.length === 0) return 0;
    
    const goodGuesses = this.roundResults.filter(result => 
      !result.skipped && result.distance <= 100
    ).length;
    
    return Math.round((goodGuesses / this.roundResults.length) * 100);
  },

  /**
   * Get current game state
   */
  getCurrentState() {
    return {
      isPlaying: this.isPlaying,
      currentRound: this.currentRound,
      totalRounds: this.totalRounds,
      score: this.score,
      currentLandmark: this.currentLandmark,
      selectedLocation: this.selectedLocation,
      usedHints: this.usedHints,
    };
  },

  /**
   * Get personal best
   */
  getPB() {
    try {
      return parseInt(localStorage.getItem(PB_KEY) || '0', 10);
    } catch {
      return 0;
    }
  },

  /**
   * Save personal best
   */
  savePB(score) {
    try {
      localStorage.setItem(PB_KEY, score.toString());
    } catch (err) {
      console.warn('Failed to save PB:', err);
    }
  },

  /**
   * Reset to main menu
   */
  resetToMenu() {
    this.isPlaying = false;
    this.isGameOver = false;
    this.currentLandmark = null;
    this.selectedLocation = null;
  },
};