import './style.css'
import './hud.css'
import { setupSection, setupEvents } from './setup-section'
import { currentGameEvents, currentGameSection } from './current-game-section'
import {  clearTurns, historyEvents, historySection, onDeleteTurn } from "./history-section";
import { initGameState, type GameSettings } from './game-setting';
import { mountHUD, showHUD } from "./hud";
 

const app = document.querySelector<HTMLDivElement>('#app')!



export function initAll() {
  mountHUD();  
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
  historyEvents(onDeleteTurn ) ;
   
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

 
/* ---------- GLOBAL ERROR HANDLERS ---------- */

window.addEventListener("error", (e) => {
  console.error("Global error:", e.error);
  showHUD("A fatal error occurred. Check console for details.", "bad", 2200);
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason);
  showHUD("Unhandled promise rejection. Check console.", "bad", 2200);
});