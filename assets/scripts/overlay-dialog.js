// Funktionen zum Steuern des Overlays
async function openOverlay(id) {
  await renderDialogCard(id);
  document.getElementById("overlay").classList.remove("d-none");
  disableScrollingBody();
}

function closeOverlay() {
  document.getElementById("overlay").classList.add("d-none");
  enableScrollingBody();
}

// rendert den Dialog für die Detailkarte des ausgewählten Pokemons
async function renderDialogCard(id) {
  currentPokemon = await getPokemonData(id);
  let container = document.getElementById("dialog-container");
  // console.log(currentPokemon['sprites']['other']['official-artwork']['front_default']);
  container.innerHTML = renderDialogCardTemplate(currentPokemon);
  renderTypes("dialog-types-container");
  renderAbout(currentPokemon);
}

function renderDialogCardTemplate(currentPokemon) {
  return /*html*/ `
   <div class="dialog" style="background-color: ;"  onclick="prevent(event)">
        <nav class="nav-pokemons" aria-label="Navigation through Pokemons">
            <button class="nav-btn" onclick="switchPokemon(-1)">
              <div class="btn-prev">
                <div class="btn-icon-a"></div>
                <div class="btn-icon-b"></div>
              </div>
            </button>
            <span>#${currentPokemon.id}</span>
            <button class="nav-btn" onclick="switchPokemon(1)">
              <div class="btn-next">
                <div class="btn-icon-b"></div>
                <div class="btn-icon-a"></div>
              </div>
            </button>
        </nav>
        <div class="dialog-main">
            <div class="basic-info">
                <div class="identity">
                  <span>${capitalizeFirstLetter(currentPokemon.name)}</span>
                </div>
                <div class="dialoge-images">
                  <div id="dialog-types-container" class="types-dialog"></div>
                  <img class="dialog-pic" src="${
                    currentPokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"]
                  }" alt="picture of ${capitalizeFirstLetter(currentPokemon.name)}">
                </div>
            </div>
            <div class="detail-info type-color-${currentPokemon.types[0].type.name}">
                <nav class="nav-details" aria-label="Navigation through detail info">
                    <button class="nav-details-btn" onclick="renderAbout()">ABOUT</button>
                    <button class="nav-details-btn" onclick="renderStats()">STATS</button>
                    <button class="nav-details-btn" onclick="renderMoves()">MOVES</button>
                </nav>
                <div class="detail-info-wrapper">
                  <div id="detail-info-container"></div> 
                </div>
            </div>
        </div>
    </div>
    `;
}

// rendert den About Reiter
function renderAbout() {
  let container = getElementHelper("detail-info-container");
  container.innerHTML = renderAboutTemplate(currentPokemon);
  renderAboutAbilities(currentPokemon["abilities"]);
}

function renderAboutTemplate(currentPokemon) {
  return /*html*/ `
    <p>Species ${capitalizeFirstLetter(currentPokemon["species"]["name"])}</p>
    <p>Height ${currentPokemon["height"] * 10}cm</p>
    <p>Weight ${currentPokemon["height"]}kg</p>
    <div class="abilities">
      <span>Abilities</span>
      <div id="abilities-container"></div>
    </div>
  `;
}

// Unterfunktion um die Abilities für den About Reiter zu rendern
function renderAboutAbilities(abilities) {
  let container = getElementHelper("abilities-container");

  for (let i = 0; i < abilities.length; i++) {
    const abilityName = abilities[i].ability.name;
    container.innerHTML += /*html*/ `
      <p>${capitalizeFirstLetter(abilityName)}</p>
    `;
  }
}

// rendert den Stats Reiter
function renderStats() {
  let container = getElementHelper("detail-info-container");
  container.innerHTML = "";

  for (let i = 0; i < currentPokemon.stats.length; i++) {
    container.innerHTML += /*html*/ `
      <p>
        <span>${capitalizeFirstLetter(currentPokemon["stats"][i]["stat"]["name"])}</span>
        <span>${currentPokemon["stats"][i]["base_stat"]}</span>
      </p>
    `;
  }
}

// rendert den Moves Reiter
function renderMoves() {
  let container = getElementHelper("detail-info-container");
  container.innerHTML = ``;

  for (let i = 0; i < currentPokemon.moves.length; i++) {
    container.innerHTML += /*html*/ `
      <p>${capitalizeFirstLetter(currentPokemon["moves"][i]["move"]["name"])}</p>
    `;
  }
}

function disableScrollingBody() {
  document.body.classList.add("overflow-hidden");
}

function enableScrollingBody() {
  document.body.classList.remove("overflow-hidden");
}

// ändert die ID des zu rendernden Pokemon um vom ersten zum letzten zu springen und umgekehrt
function switchPokemon(modificator) {
  let newPokemonId = currentPokemon.id + modificator;

  switch (newPokemonId) {
    case 0:
      newPokemonId = 151;
      break;
    case 152:
      newPokemonId = 1;
      break;
  }

  renderDialogCard(newPokemonId);
}