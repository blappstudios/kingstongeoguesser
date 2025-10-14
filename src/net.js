/**
 * Net: Supabase integration for leaderboard functionality
 */

import { createClient } from '@supabase/supabase-js';
import { UI } from './ui.js';

export const Net = {
  supabase: null,
  enabled: false,
  pollInterval: null,

  /**
   * Initialize Supabase client
   */
  init(url, anonKey) {
    if (!url || !anonKey) {
      console.warn('⚠️ Supabase credentials not provided, leaderboard disabled');
      this.enabled = false;
      UI.updateLeaderboardStatus('Leaderboard disabled (no Supabase config)', true);
      return;
    }

    try {
      this.supabase = createClient(url, anonKey);
      this.enabled = true;
      console.log('✅ Supabase client initialized');
      UI.updateLeaderboardStatus('Ready');
    } catch (err) {
      console.error('Failed to initialize Supabase:', err);
      this.enabled = false;
      UI.updateLeaderboardStatus('Leaderboard disabled (init error)', true);
    }
  },

  /**
   * Submit a score to the leaderboard
   */
  async submitScore(room, name, score) {
    if (!this.enabled) return;

    try {
      const { error } = await this.supabase.from('scores').insert({
        room: room.toLowerCase(),
        name: name.substring(0, 20), // Limit name length
        score: Math.floor(score),
      });

      if (error) {
        console.error('Failed to submit score:', error);
        return;
      }

      console.log('✅ Score submitted:', { room, name, score });
    } catch (err) {
      console.error('Error submitting score:', err);
    }
  },

  /**
   * Fetch top scores for a room (last 24 hours)
   */
  async fetchTop(room) {
    if (!this.enabled) return [];

    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data, error } = await this.supabase
        .from('scores')
        .select('*')
        .eq('room', room.toLowerCase())
        .gte('created_at', yesterday.toISOString())
        .order('score', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Failed to fetch leaderboard:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      return [];
    }
  },

  /**
   * Fetch and update leaderboard UI
   */
  async fetchAndUpdateLeaderboard(room) {
    if (!this.enabled) return;

    try {
      UI.updateLeaderboardStatus('Loading...');
      const scores = await this.fetchTop(room);
      UI.renderLeaderboard(scores);
      UI.updateLeaderboardStatus(`Last updated: ${new Date().toLocaleTimeString()}`);
    } catch (err) {
      console.error('Error updating leaderboard:', err);
      UI.updateLeaderboardStatus('Failed to load', true);
    }
  },

  /**
   * Start polling leaderboard
   */
  startPolling(room) {
    if (!this.enabled) return;

    // Initial fetch
    this.fetchAndUpdateLeaderboard(room);

    // Poll every 5 seconds
    this.pollInterval = setInterval(() => {
      this.fetchAndUpdateLeaderboard(room);
    }, 5000);
  },

  /**
   * Stop polling leaderboard
   */
  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  },
};