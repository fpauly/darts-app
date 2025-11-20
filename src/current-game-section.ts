import { gameState } from "./game-setting";
import { renderHistory, turns} from "./history-section";
import { initAll } from "./main";

export function currentGameSection() {
  const state = gameState;
    
  return `
    <section class="card-fan"  id="current_game_section">
      <h2 class="card-title-fan">Current Game</h2>
      <div class="game-meta">
        <p><strong>Game type:</strong> ${state.gameType} up</p>
        <p><strong>Set size:</strong> Best of ${state.maxLegs} legs (first to ${Math.floor(state.maxLegs/2)+1})</p>
        <!--<p><strong>Current Player:</strong> ${state.currentPlayer===1?state.player1.name:state.player2.name}</p>-->
      </div>
      <div class="current-grid">
<hr>
        <!-- Player 1 -->
        <div name= "player1">
          <div class="player-panel ${state.currentPlayer === 1 ? "active" : ""}">
            <h3>${state.player1.name}</h3>
            <p>Score: <strong>${state.player1.score}</strong></p>
            <p>Legs won: ${state.player1.legs}</p>
          </div>
          <!-- Score input -->
          <div class="score-input-row">
            <label for="score-input1">Points:</label>
            <input id="score-input1" onclick="this.select()" type="number" min="0" max="180" value="0">
            <button id="add-score-btn1" class="btn-primary">Add</button>
            <button id="end-leg-btn1" hidden class="btn-secondary">Give up</button>
          </div>
        </div>
<hr>
        <!-- Player 2 -->
        <div name= "player2">
          <div class="player-panel ${state.currentPlayer === 2 ? "active" : ""}">
            <h3>${state.player2.name}</h3>
            <p>Score: <strong>${state.player2.score}</strong></p>
            <p>Legs won: ${state.player2.legs}</p>
          </div>

        </div>

        <!-- Score input -->
        <div class="score-input-row">
          <label for="score-input2">Points:</label>
          <input id="score-input2" onclick="this.select()" type="number" min="0" max="180" value="0">
          <button id="add-score-btn2" class="btn-primary">Add</button>
          <button id="end-leg-btn2" hidden class="btn-secondary">Give up</button>
        </div>
      </div>
      
      <hr>
      <div>
      <button id="new-match" class="btn-secondary">New Match</button>
      </div>
    </section>
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
  const endLegBtn1 = document.querySelector("#end-leg-btn1");

  const input2 = document.querySelector<HTMLInputElement>("#score-input2");
  const addBtn2 = document.querySelector("#add-score-btn2");
  const endLegBtn2 = document.querySelector("#end-leg-btn2");

  if (!input1 || !addBtn1 || !endLegBtn1||!input2 || !addBtn2 || !endLegBtn2) return;

  addBtn1.addEventListener("click", () => {
    
    const points = Number(input1.value);
    if (!Number.isFinite(points)) {
      alert("Please enter a valid number!");
      return;
    }
    if(points <1||points>180){
      alert(`Points must between 1 and 180!`);
      return;
    }
    if (!Number.isFinite(points) || points < 0 || points > 180) return;
    onAddScore(points,1);
  });

  addBtn2.addEventListener("click", () => {
    const points = Number(input2.value);
    if (!Number.isFinite(points)) {
      alert("Please enter a valid number!");
      return;
    }
    if(points <1||points>180){
      alert(`Points must between 1 and 180!`);
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

  endLegBtn1.addEventListener("click", () => {
    onEndLeg();
  });
  endLegBtn2.addEventListener("click", () => {
    onEndLeg();
  });
}

export function renderCurrentGame() {
  const old = document.getElementById("current_game_section");
  if (!old) return;

  old.outerHTML = currentGameSection(); 
 

  currentGameEvents(); 
  
}

function onAddScore(points:number, whoIsPlaying:1|2){
  
  const p = whoIsPlaying === 1 ? gameState.player1 : gameState.player2;
  p.score-=points;
   turns.push({
    id: Date.now(),         
    player: whoIsPlaying as 1 | 2,
    points,
    remaining: p.score,
  });
  if (p.score === 0) {
   
      p.legs += 1;

      
      const legsToWin = Math.floor(gameState.maxLegs / 2) + 1;

      if (p.legs >= legsToWin) {
        alert(`${p.name} wins the match!`);

  
        startNewMatch();
        return;
      }
      else {
        renderHistory();
        alert(`${p.name} wins one leg!`);
        return startNextLeg(whoIsPlaying);
      }
    
  }
  renderCurrentGame();
  renderHistory();
}
export function startNewMatch(){
  // const form = document.querySelector<HTMLFormElement>("#game-settings-form");
  // if (form) {
  //   form.reset();
  // }

  
  // showSection("game_setting_section");
  // hideSection("current_game_section");
  // setupEvents(startGame);
  initAll();
}

export function startNextLeg(winner: 1 | 2) {
  const startScore = gameState.gameType;

  gameState.player1.score = startScore;
  gameState.player2.score = startScore;

 
  gameState.currentPlayer = winner;

  renderCurrentGame();
}
function onEndLeg(){

}
