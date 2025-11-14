import './style.css'
 

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <section class="card-fan">
    <h2 class="card-title-fan">Game setup</h2>
    <p>Here we will later add: Player names, game type (301/501), legs.</p>
  </section>

  <section class="card-fan">
    <h2 class="card-title-fan">Current game</h2>
    <p>Here we will show: players' scores and legs won.</p>
  </section>

  <section class="card-fan">
    <h2 class="card-title-fan">Turns / history</h2>
    <p>Here we will list each turn's score in the future.</p>
  </section>
`;

 
