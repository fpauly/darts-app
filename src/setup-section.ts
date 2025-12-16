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
  <div >
   <section class="card-fan" id="game_setting_section">
   <img class="corner-icon left" src="/images/dartred.png" />
  <img class="corner-icon right" src="/images/dartgreen.png" />
      <h2 class="card-title-fan">Select Game setup</h2>

      <form id="game-settings-form" class="setup-grid">

       <div class="form-group">
         <div class="game-type-fan">
          <div class="btn-wrap">
            <label class="btn-fan"  >
              <input type="radio" name="gameType" value="301" checked>
              <span>301 up</span>
            </label>
            </div>
          
            <div class="btn-wrap">
            <label class="btn-fan">
              <input type="radio" name="gameType" value="501">
              <span>501 up</span>
              
          </label>
          </div>
        </div>


        </div>

        <br/>

        <div class="form-group">
          <label class="playerfont"><img src="/images/iconplayer1.png" class="player-icon">Player 1:</img></label>
          <input name="player1" class="playerform" required placeholder="Enter name" />
        </div>

        <div class="form-group">
          <label class="playerfont"><img src="/images/iconplayer1.png" class="player-icon">Player 2:</img></label>
          <input name="player2" class="playerform" required placeholder="Enter name" />
        </div>
        <label><h2 class="card-title-fan">Set size (legs):</h2></label>

         <div class="form-group">
          <div class="game-type-fan">
            <div class="btn-wrap">
              <label class="btn-fan"  >
                <input type="radio" name="maxLegs" value="3" checked>
                <span>Best of 3</span>
              </label>
              </div>
            
              <div class="btn-wrap">
              <label class="btn-fan">
                <input type="radio" name="maxLegs" value="5">
                <span>Best of 5</span>
                
            </label>
            </div>
            <div class="btn-wrap">
              <label class="btn-fan">
                <input type="radio" name="maxLegs" value="7">
                <span>Best of 7</span>
                
            </label>
            </div>
          </div>
          </div>

        <div class="form-buttons">
          <button type="submit" class="startgame-button">Start game</button>
        </div>

      </form>
    </section>
    </div>
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

 