// HTML template of overview card
function renderOverviewTemplate(currentPokemon) {
  return /*html*/ `
      <div class="card type-color-${currentPokemon.types[0].type.name}" onclick="openOverlay(${currentPokemon.id})">
          <div class="card-header">
            <span>${capitalizeFirstLetter(currentPokemon.name)}</span>
              <span>#${currentPokemon.id}</span>
          </div>
          <div class="card-main">
              <img src="${currentPokemon["sprites"]["other"]["official-artwork"]["front_default"]}" alt="picture of ${
                currentPokemon.types[0].type.name
              }">
          </div>
          <div class="card-footer">
              <div id="types-container-${currentPokemon.id}" class="types">
              </div>
          </div>
      </div>
      `;
}

// Template for rendering Types
function renderTypesTemplate(i) {
  return /*html*/ `
    <div class="type-${currentPokemon.types[i].type.name} type-all"></div>
  `;
}

// overlay-dialog
// Template for the dialog card
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
                    <div class="dialog-gif-wrapper">
                      <img id="dialog-gif-container" class="dialog-gif" onclick="toggleShinyGif(currentPokemon.id)" title="Click me!" src="${
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

// Template fot the about tab
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

// Template for abilities subcategory of about
function renderAboutAbilitiesTemplate(abilityName) {
  return /*html*/ `
      <li>${capitalizeFirstLetter(abilityName)}</li>
    `;
}

// Template for the stats tab
function renderStatsTemplate(i) {
  return /*html*/ `
    <div class="info-row">
      <span class="info-label">${capitalizeFirstLetter(currentPokemon["stats"][i]["stat"]["name"])}</span>
      <span class="info-value">${currentPokemon["stats"][i]["base_stat"]}</span>
    </div>
  `;
}

// Template for the moves tab
function renderMovesTemplate(i) {
  return /*html*/ `
        <p class="move-name">${capitalizeFirstLetter(currentPokemon["moves"][i]["move"]["name"])}</p>
      `;
}

// Template for the missingNo. card
function renderMissingNoTemplate() {
  return /*html*/ `
    <div class="card type-color-unknown" onclick="openOverlay(0)">
      <div class="card-header">
        <span>missingNo.</span>
        <span>???</span>
      </div>
      <div class="card-main unknown-main">
        <img src="./assets/img/missingNo.png" alt="picture of missingNo.">
      </div>
      <div class="card-footer">
        <div id="types-container-unknown" class="types">
          <a href="https://en.wikipedia.org/wiki/MissingNo.">
            <div class="type-unknown type-all"></div>
          </a>
        </div>
      </div>
    </div>
  `;
}
