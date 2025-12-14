import './style.css'

import { setupSection, setupEvents } from './setup-section'
import { currentGameEvents, currentGameSection } from './current-game-section'
import {  clearTurns, historySection } from "./history-section";
import { initGameState, type GameSettings } from './game-setting';


const app = document.querySelector<HTMLDivElement>('#app')!



export function initAll() {
 
  // if(!gameState){
  //   return;
  // }
    
  app.innerHTML = setupSection();

  setupEvents(startGame);
  // historyEvents(deleteTurn);
}

export function startGame(settings:GameSettings) {

  initGameState(settings);
  clearTurns();
  app.innerHTML=currentGameSection()
  +historySection([]);

  // hideSection("game_setting_section");
  // showSection("current_game_section");
  currentGameEvents();
   
}

initAll();

/**
 * Code to catch global errors!
 */

window.addEventListener("error", (e) => {
  console.error("Global error:", e.error);
  alert("A fatal error occurred. Check console for details.");
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason);
});

 
