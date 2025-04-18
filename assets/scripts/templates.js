// templates.js

/**
 * @fileoverview HTML template functions for rendering UI elements in the Pokédex web app.
 *
 * This file provides reusable template strings for rendering Pokémon overview cards,
 * detail views (about, stats, moves), type icons, abilities, and the MissingNo fallback.
 */

/**
 * Returns the HTML template string for a single Pokémon overview card.
 *
 * The card displays the Pokémon's name, ID, image, and includes a type container
 * for dynamic content. The background color is determined by the primary type.
 *
 * @param {object} currentPokemon - The Pokémon object to render.
 * @param {string} backgroundColor - The background color based on the Pokémon's type.
 * @returns {string} The HTML markup for the overview card.
 */
function renderOverviewTemplate(currentPokemon, backgroundColor) {
  return /*html*/ `
      <div class="card" style="background-color: ${backgroundColor};" onclick="openOverlay(${currentPokemon.id})">
          <div class="card-header">
            <span>${capitalizeFirstLetter(currentPokemon.name)}</span>
              <span>#${currentPokemon.id}</span>
          </div>
          <div class="card-main">
              <img src="${currentPokemon["sprites"]["other"]["official-artwork"]["front_default"]}" alt="picture of ${
                currentPokemon.name
              }">
          </div>
          <div class="card-footer">
              <div id="types-container-${currentPokemon.id}" class="types">
              </div>
          </div>
      </div>
      `;
}

/**
 * Returns the HTML template for a single type icon of the current Pokémon.
 *
 * Used for rendering one of possibly multiple type icons inside a card or detail view.
 *
 * @param {number} i - The index of the type in the current Pokémon's types array.
 * @returns {string} The HTML markup for the type icon.
 */
function renderTypesTemplate(i) {
  return /*html*/ `
    <div class="type-${currentPokemon.types[i].type.name} type-all"></div>
  `;
}

/**
 * Returns the HTML template for the Pokémon detail dialog overlay.
 *
 * The dialog includes:
 * - Navigation buttons to switch between adjacent Pokémon
 * - A shiny toggle GIF image
 * - Type icons
 * - A tabbed section for About, Stats, and Moves
 *
 * The background color for the detail section is based on the Pokémon's primary type.
 *
 * @param {object} currentPokemon - The Pokémon object containing all necessary data.
 * @param {string} backgroundColor - The color used as background for the lower detail section.
 * @returns {string} The complete HTML markup for the dialog overlay.
 */
function renderDialogCardTemplate(currentPokemon, backgroundColor) {
  return /*html*/ `
    <div class="dialog" style="background-color: ;"  onclick="prevent(event)">
        <nav class="nav-pokemons" aria-label="Navigation through Pokemons">
            <button class="nav-btn" onclick="switchPokemon(-1)" title="${getNameOfAdjacentPokemon(-1)}">
              <div class="btn-prev">
                <div class="btn-icon-a"></div>
                <div class="btn-icon-b"></div>
              </div>
            </button>
            <span>#${currentPokemon.id}</span>
            <button class="nav-btn" onclick="switchPokemon(1)" title="${getNameOfAdjacentPokemon(1)}">
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
                      <img id="dialog-gif-container" class="dialog-gif" onclick="toggleShinyGif(currentPokemon.id)" title="Let me shine!" src="${
                        currentPokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"]
                      }" alt="picture of ${capitalizeFirstLetter(currentPokemon.name)}">
                    </div>
                </div>
            </div>
            <div class="detail-info" style="background-color: ${backgroundColor};">
                <nav class="nav-details" aria-label="Navigation through detail info">
                    <button id="about-btn" class="nav-details-btn" onclick="renderAbout(), setActiveDetailsTab('about-btn')">About</button>
                    <button id="stats-btn" class="nav-details-btn active" onclick="renderStats(), setActiveDetailsTab('stats-btn')">Stats</button>
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

/**
 * Returns the HTML template for the "About" tab in the Pokémon detail dialog.
 *
 * Displays basic information such as species, height, weight, and an empty container
 * for the abilities list, which is rendered separately.
 *
 * @param {object} currentPokemon - The Pokémon object containing species, height, and weight data.
 * @returns {string} The HTML markup for the About tab.
 */
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

/**
 * Returns the HTML template for a single ability in the "About" tab.
 *
 * Formats the ability name as a list item with a capitalized label.
 *
 * @param {string} abilityName - The name of the ability to display.
 * @returns {string} The HTML markup for a single ability list item.
 */
function renderAboutAbilitiesTemplate(abilityName) {
  return /*html*/ `
      <li>${capitalizeFirstLetter(abilityName)}</li>
    `;
}

/**
 * Returns the HTML template for the "Stats" tab in the Pokémon detail dialog.
 *
 * Displays all six base stats (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed)
 * as styled range bars using dynamic inline CSS variables and values.
 * The bar color is determined by the secondary type of the current Pokémon.
 *
 * @returns {string} The HTML markup for the stats tab with range visualizations.
 */
function renderStatsTemplate() {
  return /*html*/ `
    <div class="info-row">
      <span class="info-label">HP</span>
      <div class="range" style="--p:${currentPokemon["stats"][0]["base_stat"]}; --factor: 0.338%; --bar-color: ${secondTypeColor};">
        <div class="range-value">${currentPokemon["stats"][0]["base_stat"]}</div>  
        <div class="range__label"></div>
      </div>
    </div>
    <div class="info-row">
      <span class="info-label">Attack</span>
      <div class="range" style="--p:${currentPokemon["stats"][1]["base_stat"]}; --factor: 0.47%; --bar-color: ${secondTypeColor};">
        <div class="range-value">${currentPokemon["stats"][1]["base_stat"]}</div>  
        <div class="range__label"></div>
      </div>
    </div>
    <div class="info-row">
      <span class="info-label">Defense</span>
      <div class="range" style="--p:${currentPokemon["stats"][2]["base_stat"]}; --factor: 0.47%; --bar-color: ${secondTypeColor};">
        <div class="range-value">${currentPokemon["stats"][2]["base_stat"]}</div>  
        <div class="range__label"></div>
      </div>
    </div>
    <div class="info-row">
      <span class="info-label">Sp. Atk</span>
      <div class="range" style="--p:${currentPokemon["stats"][3]["base_stat"]}; --factor: 0.528%; --bar-color: ${secondTypeColor};">
        <div class="range-value">${currentPokemon["stats"][3]["base_stat"]}</div>  
        <div class="range__label"></div>
      </div>
    </div>
    <div class="info-row">
      <span class="info-label">Sp. Def</span>
      <div class="range" style="--p:${currentPokemon["stats"][4]["base_stat"]}; --factor: 0.528%; --bar-color: ${secondTypeColor};">
        <div class="range-value">${currentPokemon["stats"][4]["base_stat"]}</div>  
        <div class="range__label"></div>
      </div>
    </div>
    <div class="info-row">
      <span class="info-label">Speed</span>
      <div class="range" style="--p:${currentPokemon["stats"][5]["base_stat"]}; --factor: 0.528%; --bar-color: ${secondTypeColor};">
        <div class="range-value">${currentPokemon["stats"][5]["base_stat"]}</div>  
        <div class="range__label"></div>
      </div>
    </div>
  `;
}

/**
 * Returns the HTML template for a single move in the "Moves" tab.
 *
 * Capitalizes the move name and wraps it in a paragraph element for display.
 *
 * @param {number} i - The index of the move in the current Pokémon's moves array.
 * @returns {string} The HTML markup for a single move entry.
 */
function renderMovesTemplate(i) {
  return /*html*/ `
        <p class="move-name">${capitalizeFirstLetter(currentPokemon["moves"][i]["move"]["name"])}</p>
      `;
}

/**
 * Returns the HTML template for the MissingNo. fallback card.
 *
 * Displayed when a Pokémon cannot be found or loaded properly.
 * Includes a glitch-style design and a link to the Wikipedia article for MissingNo.
 *
 * @returns {string} The HTML markup for the MissingNo. fallback card.
 */
function renderMissingNoTemplate() {
  return /*html*/ `
    <div class="card type-color-unknown" title="Some glitch appeared">
      <div class="card-header">
        <span>missingNo.</span>
        <span>???</span>
      </div>
      <div class="card-main unknown-main">
        <img src="./assets/img/missingNo.png" alt="picture of missingNo.">
      </div>
      <div class="card-footer">
        <div id="types-container-unknown" class="types">
          <a href="https://en.wikipedia.org/wiki/MissingNo." title="https://en.wikipedia.org/wiki/MissingNo.">
            <div class="type-unknown type-all"></div>
          </a>
        </div>
      </div>
    </div>
  `;
}