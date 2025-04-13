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

// Template für den Dialog
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
                    <div class="dialog-pic-wrapper">
                      <img class="dialog-pic" src="${
                        currentPokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"]
                      }" alt="picture of ${capitalizeFirstLetter(currentPokemon.name)}">
                    </div>
                </div>
            </div>
            <div class="detail-info type-color-${currentPokemon.types[0].type.name}">
                <nav class="nav-details" aria-label="Navigation through detail info">
                    <button id="about-btn" class="nav-details-btn active" onclick="renderAbout(), setActiveDetailsTab('about-btn')">About</button>
                    <button id="stats-btn" class="nav-details-btn" onclick="renderStats(), setActiveDetailsTab('stats-btn')">Stats</button>
                    <button id="moves-btn" class="nav-details-btn" onclick="renderMoves(), setActiveDetailsTab('moves-btn')">Moves</button>
                </nav>
                <div class="detail-info-wrapper outlined-text">
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
    <div class="info-row">
      <span class="info-label">Species</span>
      <span class="info-value">${capitalizeFirstLetter(currentPokemon["species"]["name"])}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Height</span>
      <span class="info-value">${currentPokemon["height"] * 10}cm</span>
    </div>
    <div class="info-row">
      <span class="info-label">Weight</span>
      <span class="info-value">${currentPokemon["height"]}kg</span>
    </div>
    <div class="info-row">
      <span class="info-label">Abilities</span>
      <span class="info-value">
        <ul id="abilities-container" class="ability-list">
        </ul>
      </span>
    </div>
  `;
}

// Unterfunktion um die Abilities für den About Reiter zu rendern
function renderAboutAbilities(abilities) {
  let container = getElementHelper("abilities-container");

  for (let i = 0; i < abilities.length; i++) {
    const abilityName = abilities[i].ability.name;
    container.innerHTML += /*html*/ `
      <li>${capitalizeFirstLetter(abilityName)}</li>
    `;
  }
}

// rendert den Stats Reiter
function renderStats() {
  let container = getElementHelper("detail-info-container");
  container.innerHTML = "";

  for (let i = 0; i < currentPokemon.stats.length; i++) {
    container.innerHTML += /*html*/ `
      <div class="info-row">
        <span class="info-label">${capitalizeFirstLetter(currentPokemon["stats"][i]["stat"]["name"])}</span>
        <span class="info-value">${currentPokemon["stats"][i]["base_stat"]}</span>
      </div>
    `;
  }
}

// rendert den Moves Reiter
function renderMoves() {
  let container = getElementHelper("detail-info-container");
  container.innerHTML = ``;

  for (let i = 0; i < currentPokemon.moves.length; i++) {
    container.innerHTML += /*html*/ `
      <p class="move-name">${capitalizeFirstLetter(currentPokemon["moves"][i]["move"]["name"])}</p>
    `;
  }
}

// weist die Class active dem zuletzt geklickten nav-details-btn zu
function setActiveDetailsTab(buttonId) {
  document.querySelectorAll(".nav-details-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  getElementHelper(buttonId).classList.add("active");
}

// Scrollen unterbinden, während Overlay geöffnet ist
function disableScrollingBody() {
  document.body.classList.add("overflow-hidden");
}

function enableScrollingBody() {
  document.body.classList.remove("overflow-hidden");
}

// ändert die ID des zu rendernden Pokemon um mit den Vor- und Zurückbuttons zu navigieren
function switchPokemon(modificator) {
  let newPokemonId = currentPokemon.id + modificator;

  // wechselt von der höchsten zur niedrigsten ID und umgekährt
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
