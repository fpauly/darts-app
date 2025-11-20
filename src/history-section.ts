import { gameState, type TurnRecord } from "./game-setting";

 
export let turns:TurnRecord[] = [];
export function historySection(turns: TurnRecord[]) {
  const rows = turns
    .map(
      (t) => `
      <tr>
        <td>${t.player===1? gameState.player1.name:gameState.player2.name}</td>
        <td>${t.points}</td>
        <td>${t.remaining}</td>
        <td hidden>
          <button class="delete-turn-btn" data-id="${t.id}">
            ✖
          </button>
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <section class="card-fan" id="history-section">
      <h2 class="card-title-fan">Turn history</h2>

      <table class="history-table">
        <thead>
          <tr>
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
    </section>
  `;
}


export function historyEvents(onDeleteTurn: (turnId: number) => void) {
  document.querySelectorAll(".delete-turn-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number((btn as HTMLElement).getAttribute("data-id"));
      onDeleteTurn(id);
    });
  });
}
 

 
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
export function clearTurns(){
  turns = [];
}