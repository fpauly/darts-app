import { gameState } from "./game-setting";
import {
  historyEvents,
  onDeleteTurn,
  renderHistory,
  setTurns,
  turns,
} from "./history-section";
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
          <p><strong>Set size:</strong> Best of ${state.maxLegs} legs (first to ${
    Math.floor(state.maxLegs / 2) + 1
  })</p>
        </div>
        <!--<p><strong>Current Player:</strong> ${
          state.currentPlayer === 1 ? state.player1.name : state.player2.name
        }</p>-->
      </div>

      <div class="current-grid">
        <hr>

        <!-- Player 1 -->
        <div name="player1">
          <div class="player-panel ${state.currentPlayer === 1 ? "active" : ""}">
            <h3><strong>Player 1: ${state.player1.name}</strong></h3>
            <div>
              <span class="legs-won">Legs won: ${state.player1.legs}</span>
              <span class="legs-won">Score: <strong>${state.player1.score}</strong></span>
            </div>
          </div>
        </div>

        <!-- Score input (Player 1) -->
        <div class="score-input-row">
          <label for="score-input1-1"><strong>&nbsp;&nbsp;Points:</strong></label>
          <input id="score-input1-1" class="points-input-fan" type="number" min="0" max="60" value="0" onclick="this.select()">
          <input id="score-input1-2" class="points-input-fan" type="number" min="0" max="60" value="0" onclick="this.select()">
          <input id="score-input1-3" class="points-input-fan" type="number" min="0" max="60" value="0" onclick="this.select()">
          <button id="add-score-btn1" class="btn-ctrl" type="button">Add</button>
        </div>

        <hr>

        <!-- Player 2 -->
        <div name="player2">
          <div class="player-panel ${state.currentPlayer === 2 ? "active" : ""}">
            <h3><strong>Player 2: ${state.player2.name}</strong></h3>
            <div>
              <span class="legs-won">Legs won: ${state.player2.legs}</span>
              <span class="legs-won">Score: <strong>${state.player2.score}</strong></span>
            </div>
          </div>
        </div>

        <!-- Score input (Player 2) -->
        <div class="score-input-row">
          <label for="score-input2-1"><strong>&nbsp;&nbsp;Points:</strong></label>
          <input id="score-input2-1" class="points-input-fan" type="number" min="0" max="60" value="0" onclick="this.select()">
          <input id="score-input2-2" class="points-input-fan" type="number" min="0" max="60" value="0" onclick="this.select()">
          <input id="score-input2-3" class="points-input-fan" type="number" min="0" max="60" value="0" onclick="this.select()">
          <button id="add-score-btn2" class="btn-ctrl" type="button">Add</button>
        </div>
      </div>

      <hr>
      <br>

      <div class="btn-ctrl-row">
        <button id="clear-input" class="btn-ctrl" type="button">Clear Points</button>
        <button id="reset-turn" class="btn-ctrl" type="button">Reset Leg</button>
        <button id="new-match" class="btn-ctrl" type="button">New Match</button>
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
  const addBtn1 = document.querySelector("#add-score-btn1") as HTMLButtonElement | null;
  const addBtn2 = document.querySelector("#add-score-btn2") as HTMLButtonElement | null;

  const clearBtn = document.querySelector("#clear-input");
  const resetTurnBtn = document.querySelector("#reset-turn");

  clearBtn?.addEventListener("click", clearInputs);
  resetTurnBtn?.addEventListener("click", onResetLeg);

  if (!addBtn1 || !addBtn2) return;

  const getThreeInputs = (who: 1 | 2) => {
    const base = who === 1 ? "score-input1" : "score-input2";
    return [
      document.querySelector<HTMLInputElement>(`#${base}-1`),
      document.querySelector<HTMLInputElement>(`#${base}-2`),
      document.querySelector<HTMLInputElement>(`#${base}-3`),
    ];
  };

  const readAndValidateTotal = (who: 1 | 2) => {
    const inputs = getThreeInputs(who);
    if (inputs.some((i) => !i)) {
      showHUD("Inputs not found.", "bad");
      return { ok: false as const, total: 0 };
    }

    const nums = inputs.map((i) => Number(i!.value ?? "0"));

    if (nums.some((n) => !Number.isFinite(n))) {
      showHUD("Please enter a valid number!", "bad");
      return { ok: false as const, total: 0 };
    }

    // per dart: 0..60
    if (nums.some((n) => n < 0 || n > 60)) {
      showHUD("Each throw must be between 0 and 60!", "bad");
      return { ok: false as const, total: 0 };
    }

    const total = nums[0] + nums[1] + nums[2];

    // total: 1..180 (keep your original rule)
    if (total < 1 || total > 180) {
      showHUD("Points must between 1 and 180!", "bad");
      return { ok: false as const, total };
    }

    return { ok: true as const, total };
  };

  addBtn1.addEventListener("click", () => {
    const r = readAndValidateTotal(1);
    if (!r.ok) return;
    onAddScore(r.total, 1);
  });

  addBtn2.addEventListener("click", () => {
    const r = readAndValidateTotal(2);
    if (!r.ok) return;
    onAddScore(r.total, 2);
  });

  const newMatchBtn = document.querySelector("#new-match");
  newMatchBtn?.addEventListener("click", () => startNewMatch());
}

export function clearInputs() {
  const ids = [
    "score-input1-1",
    "score-input1-2",
    "score-input1-3",
    "score-input2-1",
    "score-input2-2",
    "score-input2-3",
  ];

  ids.forEach((id) => {
    const el = document.querySelector<HTMLInputElement>(`#${id}`);
    if (el) el.value = "0";
  });

  showHUD("Inputs cleared.", "good", 1200);
}

export function resetLeg() {
  clearInputs();

  if (!turns.some((t) => t.turnid === gameState.currentTurn)) {
    return;
  }

  setTurns(turns.filter((t) => t.turnid !== gameState.currentTurn));
  gameState.player1.score = gameState.gameType;
  gameState.player2.score = gameState.gameType;
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

  resetLeg();
  showHUD("Leg reset.", "good");
}

export function renderCurrentGame() {
  const old = document.getElementById("current_game_section");
  if (!old) return;

  old.outerHTML = currentGameSection();
  currentGameEvents();
}

function onAddScore(points: number, whoIsPlaying: 1 | 2) {
  const p = whoIsPlaying === 1 ? gameState.player1 : gameState.player2;

  if (p.score - points < 0) {
    showHUD("Score bust! You cannot go below zero.", "bad");
    return;
  }
  if (p.score - points === 1) {
    showHUD("Score bust! Cannot finish on 1.", "bad");
    return;
  }

  // Preserve other player's 3 inputs before re-render
  const otherBase = whoIsPlaying === 1 ? "score-input2" : "score-input1";
  const otherValues = [1, 2, 3].map((n) => {
    const el = document.querySelector<HTMLInputElement>(`#${otherBase}-${n}`);
    return el ? el.value : "0";
  });

  p.score -= points;

  turns.push({
    turnid: gameState.currentTurn,
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
      showHUD(`${p.name} wins the match!`, "good");
      winTheMatch(p.name);
      return;
    } else {
      gameState.currentTurn++;
      reRenderHistory();
      showHUD(`${p.name} wins one leg!`, "good");
      return startNextLeg(whoIsPlaying);
    }
  }

  // re-render UI
  renderCurrentGame();

  // Clear current player's 3 inputs after re-render
  const clickedBase = whoIsPlaying === 1 ? "score-input1" : "score-input2";
  [1, 2, 3].forEach((n) => {
    const el = document.querySelector<HTMLInputElement>(`#${clickedBase}-${n}`);
    if (el) el.value = "0";
  });

  // Restore other player's 3 inputs after re-render
  [1, 2, 3].forEach((n, idx) => {
    const el = document.querySelector<HTMLInputElement>(`#${otherBase}-${n}`);
    if (el) el.value = otherValues[idx] ?? "0";
  });

  reRenderHistory();
}

function reRenderHistory() {
  renderHistory();
  historyEvents(onDeleteTurn);
}

export async function startNewMatch() {
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

export async function winTheMatch(uName: string) {
  await infoHUD({
    title: `${uName} wins the match!`,
    message: "Do you want to start a new match?",
    okText: "New match",
  });

  initAll();
}

export function startNextLeg(winner: 1 | 2) {
  const startScore = gameState.gameType;

  gameState.player1.score = startScore;
  gameState.player2.score = startScore;

  gameState.currentPlayer = winner;

  renderCurrentGame();
}
