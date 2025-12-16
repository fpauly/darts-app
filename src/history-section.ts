// import { renderCurrentGame } from "./current-game-section";
import { renderCurrentGame } from "./current-game-section";
import { gameState, type TurnRecord } from "./game-setting";

 
export let turns:TurnRecord[] = [];
export function historySection(turns: TurnRecord[]) {
  
  const rows = [...turns].sort((a, b) => b.id - a.id)
    .map(
      (t) => `
      <tr>
      <td>${t.turnid}</td>
        <td>${t.player===1? gameState.player1.name:gameState.player2.name}</td>
        <td>${t.points}</td>
        <td>${t.remaining}</td>
        <td >
          ${
          gameState.currentTurn === t.turnid
            ? `<button class="delete-turn-btn" data-id="${t.id}">✖</button>`
            : ""
        }
        </td>
      </tr>
      <tr><td colspan="4"><hr></td></tr>
    `
    )
    .join("");

  return `
    <div class="div-flex-row-fan">
    <section class="card-fan"  id="history-section">
      <h2 class="card-title-fan">Turn history</h2>
        <div class="history-wrapper">
          <table class="history-table">
            <thead>
              <tr>
                <th>Turn</th>
                <th>Player</th>
                <th>Points</th>
                <th>Remaining</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${rows || `<tr><td colspan="4">No turns yet</td></tr>`}
            </tbody>
          </table>
        </div>
    </section>
    </div>
  `;
}


export function historyEvents(onDeleteTurn: (id: number) => void) {
  const table = document.querySelector(".history-table");

  table?.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest(".delete-turn-btn");
    if (!btn) return;

    const id = Number(btn.getAttribute("data-id"));
    onDeleteTurn(id);
  });
}
export const onDeleteTurn = (id: number) => {
  // console.log(id);
  const toDelete: TurnRecord | undefined = turns.find(t => t.id === id);

  if (!toDelete) return;
  
  if (toDelete.player===1){
    gameState.player1.score += toDelete.points;
  }
  else{
    gameState.player2.score += toDelete.points;
  }

  turns = turns
  .map(t => {
    if (t.id > id && t.player===toDelete.player) {
      return {
        ...t,
        remaining: t.remaining+toDelete.points
      };
    }
    return t;
  })
  turns = turns.filter(t => t.id !== id);

  // const stillHasCurrentTurn = turns.some(t => t.turnid === gameState.currentTurn);

  // if (!stillHasCurrentTurn && gameState.currentTurn > 1) {
  //   gameState.currentTurn--;
  // }

  renderHistory();
  renderCurrentGame();
  historyEvents(onDeleteTurn);
 
};

 
export function renderHistory() {
  
  const old = document.getElementById("history-section");
  if (old) {
    
    old.outerHTML = historySection(turns);
  } else {
  
    const app = document.getElementById("app");
    if (!app) return;
    app.innerHTML += historySection(turns);
  }


  // bindHistoryEvents();
}

export const setTurns = (newRecords:TurnRecord[])=>{
  turns = newRecords;
}
export function clearTurns(){
  turns = [];
}