/**
 * -------------------------------------------------------
 * File: setup-section.ts
 * Description:
 *   Game Setup UI, event handling.
 *
 * Author: Fan Yin
 * Created: 2025-11-19
 * Version: 1.0.0
 * -------------------------------------------------------
 */
import './gamesetupstyle.css';
import type { GameSettings, GameType, LegCount } from "./game-setting";

// -------------------------------------------------------
// Render the Game Setup
// -------------------------------------------------------
export function setupSection() {
  return `
   <section class="card-fan" id="game_setting_section">
      <h2 class="card-title-fan">Select Game setup</h2>

      <form id="game-settings-form" class="setup-grid">

       <div class="form-group">
          <label></label>
          <select class="selectbuttons" name="gameType" multiple>
            <option value="301">301 up</option>
            <option value="501">501 up</option>
          </select>
        </div>

     

        <div class="form-group">
          <label class="playerfont"><img src="./images/iconplayer1.png" class="player-icon">Player 1:</img></label>
          <input name="player1" class="playerform" required placeholder="Enter name" />
        </div>

        <div class="form-group">
          <label class="playerfont"><img src="./images/iconplayer1.png" class="player-icon">Player 2:</img></label>
          <input name="player2" class="playerform" required placeholder="Enter name" />
        </div>

       

        <div class="form-group">
          <label><h2 class="card-title-fan">Set size (legs):</h2></label>
          <select class="selectset" name="maxLegs" multiple>
            <option value="3">Best of 3</option>
            <option value="5">Best of 5</option>
            <option value="7">Best of 7</option>
          </select>
        </div>

        <div class="form-buttons">
          <button type="submit" class="startgame-button">Start game</button>
        </div>

      </form>
    </section>
  `;
}

// -------------------------------------------------------
// Bind events
// -------------------------------------------------------
export function setupEvents(onStart: (settings: GameSettings) => void) {
  const form = document.querySelector("#game-settings-form") as HTMLFormElement;
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);

    
    const settings: GameSettings = {
      player1Name: data.get("player1") as string,
      player2Name: data.get("player2") as string,
      gameType: Number(data.get("gameType")) as GameType,
      maxLegs: Number(data.get("maxLegs")) as LegCount,
    };

    // Hand result back to main.ts
    onStart(settings);
  });
}

export function resetGame()
{
  
}

 