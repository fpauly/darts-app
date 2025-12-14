/**
 * -------------------------------------------------------
 * File: game-setting.ts
 * Description: Type definitions for game settings (players, game type, legs).
 *
 * Author: Fan Yin
 * Created: 2025-11-19
 * Version: 1.0.0
 * -------------------------------------------------------
 */

// import { turns } from "./history-section";

 
export const GAME_TYPES = [301, 501] as const;
export type GameType = typeof GAME_TYPES[number];

export const LEG_COUNTS = [3, 5, 7] as const;
export type LegCount = typeof LEG_COUNTS[number];

export const PLAYER_COUNTS = [1,2] as const;
export type PlayerCount = typeof PLAYER_COUNTS[number];

export let gameState: GameState;

export interface GameSettings {
  player1Name: string;
  player2Name: string;
  gameType: GameType;
  maxLegs: LegCount; // 3/5/7
}

/* ----------------------
   active game
   ---------------------- */

export interface PlayerState {
  name: string;
  score: number;   // remaining score (starts from 301 or 501)
  legs: number;    // legs won
}

export interface GameState {
  player1: PlayerState;
  player2: PlayerState;
  currentPlayer: PlayerCount;
  gameType: GameType;
  maxLegs: LegCount;
}

/* ----------------------
   turn history
   ---------------------- */

export interface TurnRecord {
  id: number;
  player: 1 | 2;
  points: number;
  remaining: number;   // score after this turn
}

export function createInitialGameState(settings: GameSettings): GameState {
  const startingScore = settings.gameType; 
  

  return {
    player1: {
      name: settings.player1Name,
      score: startingScore,
      legs: 0
    },
    player2: {
      name: settings.player2Name,
      score: startingScore,
      legs: 0
    },
    currentPlayer: 1,              //default player
    gameType: settings.gameType,  
    maxLegs: settings.maxLegs      
  };
}

export function hideSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.classList.add("hidden-fan");
}

export function showSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("hidden-fan");
}

export function initGameState(settings: GameSettings) {
  gameState = {
    player1: {
      name: settings.player1Name,
      score: settings.gameType,
      legs: 0
    },
    player2: {
      name: settings.player2Name,
      score: settings.gameType,
      legs: 0
    },
    currentPlayer: 1,
    gameType: settings.gameType,
    maxLegs: settings.maxLegs
  };
  
}