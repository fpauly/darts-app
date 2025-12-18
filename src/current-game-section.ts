import { gameState } from "./game-setting";
import { historyEvents, onDeleteTurn, renderHistory, setTurns, turns} from "./history-section";
import { confirmHUD, infoHUD, showHUD } from "./hud";
import { initAll } from "./main";

export function currentGameSection() {
  const state = gameState;
    
  return `
  <div class="div-flex-row-fan">
    <section class="card-fan"  id="current_game_section">
      <h2 class="card-title-fan">Current Game</h2>
      <div >
      <div>
        <p><strong>Game type:</strong> ${state.gameType} up</p>
        </div>
        <div>
        <p><strong>Set size:</strong> Best of ${state.maxLegs} legs (first to ${Math.floor(state.maxLegs/2)+1})</p>
        </div>
        <!--<p><strong>Current Player:</strong> ${state.currentPlayer===1?state.player1.name:state.player2.name}</p>-->
      </div>
      <div class="current-grid">
<hr>
        <!-- Player 1 -->
        <div name= "player1" >
          <div class="player-panel ${state.currentPlayer === 1 ? "active" : ""}">
            <h3><strong>Player 1: ${state.player1.name}</strong></h3>
            <div>
            <span class="legs-won">Legs won: ${state.player1.legs}</span>
              <span class="legs-won">Score: <strong>${state.player1.score}</strong></span>
              
            </div>
          </div>
          <!-- Score input -->
          
        </div>
        <div class="score-input-row">
            <label for="score-input1"><strong>&nbsp;&nbsp;Points:</strong></label>
            <input id="score-input1" class="points-input-fan" onclick="this.select()" type="number" min="0" max="180" value="0">
            <button id="add-score-btn1" class="btn-ctrl">Add</button>
          </div>
<hr>
        <!-- Player 2 -->
        <div name= "player2" >
          <div class="player-panel ${state.currentPlayer === 2 ? "active" : ""}">
            <h3><strong>Player 2: ${state.player2.name}</strong></h3>
            <div>
            <span class="legs-won">Legs won: ${state.player2.legs}</span>
              <span class="legs-won">Score: <strong>${state.player2.score}</strong></span>
              
            </div>
    
          </div>

        </div>

        <!-- Score input -->
        <div class="score-input-row">
          <label for="score-input2"><strong>&nbsp;&nbsp;Points:</strong></label>
          <input id="score-input2" class="points-input-fan" onclick="this.select()" type="number" min="0" max="180" value="0">
          <button id="add-score-btn2" class="btn-ctrl">Add</button>
        </div>
      </div>
      
      <hr>
      <br>
      <div class="btn-ctrl-row">
      <button id="clear-input" class="btn-ctrl">Clear Points</button>
      <button id="reset-turn" class="btn-ctrl">Reset Leg</button>
      <button id="new-match" class="btn-ctrl">New Match</button>
      </div>
    </section>
    </div>
  `;
}

/**
 * Bind click events for:
 * - Add score
 * - End leg
 */
export function currentGameEvents() {
  const input1 = document.querySelector<HTMLInputElement>("#score-input1");
  const addBtn1 = document.querySelector("#add-score-btn1");
 

  const input2 = document.querySelector<HTMLInputElement>("#score-input2");
  const addBtn2 = document.querySelector("#add-score-btn2");

  const clearBtn = document.querySelector("#clear-input");
  const resetTurnBtn = document.querySelector("#reset-turn");


  clearBtn?.addEventListener("click", clearInputs);
  resetTurnBtn?.addEventListener("click", onResetLeg);
  
 

  if (!input1 || !addBtn1 ||!input2 || !addBtn2 ) return;

  addBtn1.addEventListener("click", () => {
    
    const points = Number(input1.value);
    if (!Number.isFinite(points)) {
      // alert("Please enter a valid number!");
      showHUD("Please enter a valid number!", "bad");
      return;
    }
    if(points <1||points>180){
      // alert(`Points must between 1 and 180!`);
      showHUD("Points must between 1 and 180!", "bad");
      return;
    }
    if (!Number.isFinite(points) || points < 0 || points > 180) return;
    onAddScore(points,1);
  });

  addBtn2.addEventListener("click", () => {
    const points = Number(input2.value);
    if (!Number.isFinite(points)) {
      // alert("Please enter a valid number!");
      showHUD("Please enter a valid number!", "bad");
      return;
    }
    if(points <1||points>180){
      // alert(`Points must between 1 and 180!`);
      showHUD("Points must between 1 and 180!", "bad");
      return;
    }
    if (!Number.isFinite(points) || points < 0 || points > 180) return;
    onAddScore(points,2);
  });

  const newMatchBtn = document.querySelector("#new-match");
  if (newMatchBtn) {
      newMatchBtn.addEventListener("click", () => {
      startNewMatch();
    });
  }

  
}

export function clearInputs() {
  const input1 = document.querySelector<HTMLInputElement>("#score-input1");
  const input2 = document.querySelector<HTMLInputElement>("#score-input2");

  input1 && (input1.value = "0");
  input2 && (input2.value = "0");
  showHUD("Inputs cleared.", "good", 1200);
}

export function resetLeg() {
  clearInputs();
  // gameState.currentTurn--;

  if (!turns.some(t => t.turnid === gameState.currentTurn)) {
    return;
  } 

  setTurns(turns.filter(t=>t.turnid !== gameState.currentTurn));
  gameState.player1.score=gameState.gameType;
  gameState.player2.score=gameState.gameType;
  renderCurrentGame();
  reRenderHistory();
}

async function onResetLeg() {
  const ok = await confirmHUD({
    title: "Reset leg?",
    message: "This will clear current leg scores and turn history.",
    okText: "Yes, reset",
    cancelText: "Cancel",
  });

  if (!ok) {
    showHUD("Cancelled.", "warn");
    return;
  }

  resetLeg(); // your existing logic
  showHUD("Leg reset.", "good");
}

export function renderCurrentGame() {
  const old = document.getElementById("current_game_section");
  if (!old) return;

  old.outerHTML = currentGameSection(); 
 

  currentGameEvents(); 
  
}

function onAddScore(points:number, whoIsPlaying:1|2){
  
  const p = whoIsPlaying === 1 ? gameState.player1 : gameState.player2;

  if (p.score - points < 0) {
    // return alert("Score bust! You cannot go below zero.");
    showHUD("Score bust! You cannot go below zero.", "bad");
    return;
  }
  if (p.score - points === 1) {
     //return alert("Score bust! Cannot finish on 1.");
    showHUD("Score bust! Cannot finish on 1.", "bad");
    return;
  }

  const otherSelector = whoIsPlaying === 1 ? "#score-input2" : "#score-input1";
  const otherInput = document.querySelector<HTMLInputElement>(otherSelector);
  const otherValue = otherInput ? otherInput.value : "";

  p.score -= points;

   turns.push({
    turnid:gameState.currentTurn,
    id: Date.now(),         
    player: whoIsPlaying as 1 | 2,
    points,
    remaining: p.score,
  });

  if (p.score === 0) {
   
      p.legs += 1;

      
      const legsToWin = Math.floor(gameState.maxLegs / 2) + 1;

      if (p.legs >= legsToWin) {
        reRenderHistory();
        // alert(`${p.name} wins the match!`);
        showHUD(`${p.name} wins the match!`, "good");
  
        winTheMatch(p.name);
        return;
      }
      else {
        gameState.currentTurn++;
        // renderHistory();
        reRenderHistory();
        // alert(`${p.name} wins one leg!`);
        showHUD(`${p.name} wins one leg!`, "good");
        return startNextLeg(whoIsPlaying);
      }
    
  }

  // re-render UI
  renderCurrentGame();

  const clickedSelector = whoIsPlaying === 1 ? "#score-input1" : "#score-input2";
  const clickedInputAfter = document.querySelector<HTMLInputElement>(clickedSelector);
  if (clickedInputAfter) clickedInputAfter.value = "";

  const otherInputAfter = document.querySelector<HTMLInputElement>(otherSelector);
  if (otherInputAfter) otherInputAfter.value = otherValue ?? "";

  // renderHistory();
  reRenderHistory();
}

function reRenderHistory() {
  renderHistory();
  historyEvents(onDeleteTurn);
}
export async function startNewMatch(){
  const ok = await confirmHUD({
    title: "Start new match?",
    message: "This will reset the current match and clear the turn history.",
    okText: "Yes, start",
    cancelText: "Cancel",
  });

  if (!ok) {
    showHUD("Cancelled.", "warn", 1200);
    return;
  }

  initAll();
  showHUD("New match started.", "good", 1400);
}

export async function winTheMatch(uName:string) {
  
  // console.log(uName);

  const ok = await infoHUD({
    title: `${uName} wins the match!`,
    message: "Do you want to start a new match?",
    okText: "New match",
    // cancelText: "Cancel",
  });

  // if (!ok) {
  //   const input1 = document.querySelector<HTMLInputElement>("#score-input1");
  //   const input2 = document.querySelector<HTMLInputElement>("#score-input2");

  //   input1 && (input1.value = "0");
  //   input2 && (input2.value = "0");

  //   gameState.currentTurn--;

  //   renderCurrentGame();
    
  //   return;

  // }
    

  initAll(); // or initAll()
}

export function startNextLeg(winner: 1 | 2) {
  const startScore = gameState.gameType;

  gameState.player1.score = startScore;
  gameState.player2.score = startScore;

 
  gameState.currentPlayer = winner;

  renderCurrentGame();
}
 
