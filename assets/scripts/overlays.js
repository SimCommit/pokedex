// overlays.js

/**
 * @fileoverview Manages all overlay-related UI behavior in the Pokédex web app.
 *
 * Includes logic for the loading overlay and the Pokémon detail overlay (dialog),
 * including rendering, toggling, navigation, and scroll locking.
 */

let isShiny = false;
let secondTypeName;

/**
 * Opens the Pokémon detail overlay.
 *
 * Renders the detail card for the given Pokémon ID,
 * makes the overlay visible, and disables body scrolling.
 *
 * @param {number} id - The ID of the Pokémon to display in the overlay.
 * @returns {Promise<void>}
 */
async function openOverlay(id) {
  await renderDialogCard(id);
  document.getElementById("overlay").classList.remove("d-none");
  disableScrollingBody();
}

/**
 * Closes the Pokémon detail overlay and enables body scrolling again.
 */
function closeOverlay() {
  document.getElementById("overlay").classList.add("d-none");
  enableScrollingBody();
}

/**
 * Renders the detailed dialog card for the selected Pokémon.
 *
 * Fetches the Pokémon data by ID, prepares the HTML structure,
 * resets the shiny toggle, and renders type icons and stats.
 *
 * @param {number} id - The ID of the selected Pokémon.
 * @returns {Promise<void>}
 */
async function renderDialogCard(id) {
  let container = document.getElementById("dialog-container");
  currentPokemon = await getPokemonData(id);
  const backgroundColor = typeColors[currentPokemon.types[0].type.name] || "#66aed7";
  isShiny = false;
  container.innerHTML = renderDialogCardTemplate(currentPokemon, backgroundColor);
  renderTypes("dialog-types-container");
  renderStats();
}

/**
 * Renders the "About" tab of the dialog card.
 *
 * Inserts the general information and abilities of the current Pokémon
 * into the detail info container.
 */
function renderAbout() {
  let container = getElementHelper("detail-info-container");
  container.innerHTML = renderAboutTemplate(currentPokemon);
  renderAboutAbilities(currentPokemon["abilities"]);
}

/**
 * Renders the abilities of the current Pokémon in the "About" tab.
 *
 * Iterates through the abilities array and appends each ability to the abilities container.
 *
 * @param {Array} abilities - The array of ability objects to render.
 */
function renderAboutAbilities(abilities) {
  let container = getElementHelper("abilities-container");

  for (let i = 0; i < abilities.length; i++) {
    const abilityName = abilities[i].ability.name;
    container.innerHTML += renderAboutAbilitiesTemplate(abilityName);
  }
}

/**
 * Renders the "Stats" tab of the dialog card.
 *
 * Clears the detail info container and inserts the stats template.
 * Also sets the second type color used for the stat bars.
 */
function renderStats() {
  let container = getElementHelper("detail-info-container");
  secondTypeColor = typeColors[getSecondTypeName()];
  container.innerHTML = "";
  container.innerHTML += renderStatsTemplate();
}

/**
 * Renders the "Moves" tab of the dialog card.
 *
 * Clears the detail info container and iterates through all available moves
 * of the current Pokémon, rendering each one individually.
 */
function renderMoves() {
  let container = getElementHelper("detail-info-container");
  container.innerHTML = ``;

  for (let i = 0; i < currentPokemon.moves.length; i++) {
    container.innerHTML += renderMovesTemplate(i);
  }
}

/**
 * Sets the active state for the selected detail tab button.
 *
 * Removes the "active" class from all navigation buttons
 * and applies it to the clicked button.
 *
 * @param {string} buttonId - The ID of the button to activate.
 */
function setActiveDetailsTab(buttonId) {
  document.querySelectorAll(".nav-details-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  getElementHelper(buttonId).classList.add("active");
}

/**
 * Switches to the next or previous Pokémon in the Pokédex.
 *
 * Calculates the new ID based on the given modifier and uses wrapping logic
 * to cycle from 151 to 1 and from 1 to 151 for seamless navigation.
 *
 * @param {number} modifier - The offset to apply to the current Pokémon ID (e.g. -1 or +1).
 */
function switchPokemon(modifier) {
  let newPokemonId = currentPokemon.id + modifier;
  newPokemonId = getWrappedId(newPokemonId);
  renderDialogCard(newPokemonId);
}

/**
 * Wraps the Pokémon ID within the valid Pokédex range (1–151).
 *
 * Used to ensure that navigation beyond the first or last Pokémon
 * correctly loops to the other end of the Pokédex.
 *
 * @param {number} id - The raw Pokémon ID (can be out of bounds).
 * @returns {number} The wrapped ID within the valid range.
 */
function getWrappedId(id) {
  if (id < 1) return 151;
  if (id > 151) return 1;
  return id;
}

/**
 * Toggles between the default and shiny version of the Pokémon GIF.
 *
 * Updates the image source based on the current shiny state,
 * adds a temporary glow animation, and flips the `isShiny` flag.
 */
function toggleShinyGif() {
  let container = getElementHelper("dialog-gif-container");
  checkIfShiny(container);
  isShiny = !isShiny;
  container.classList.add("glow");
  setTimeout(() => container.classList.remove("glow"), 500);
}

/**
 * Updates the Pokémon GIF source based on the current shiny state.
 *
 * Sets the image to either the shiny or default animated sprite,
 * depending on the value of `isShiny`.
 *
 * @param {HTMLImageElement} container - The image element whose source should be updated.
 */
function checkIfShiny(container) {
  if (!isShiny) {
    setTimeout(
      () => (container.src = `${currentPokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_shiny"]}`),
      100
    );
  } else {
    setTimeout(
      () => (container.src = `${currentPokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"]}`),
      100
    );
  }
}

/**
 * Returns the name of the adjacent Pokémon in the Pokédex.
 *
 * Calculates the next or previous Pokémon ID using a modifier,
 * applies wrapping logic at the edges (1 ↔ 151),
 * and returns the capitalized name from the search pool.
 *
 * @param {number} modifier - Offset to apply to the current Pokémon ID (e.g. -1 or +1).
 * @returns {string} The capitalized name of the adjacent Pokémon.
 */
function getNameOfAdjacentPokemon(modifier) {
  let indexAdjacentPokemon = currentPokemon.id + modifier;
  indexAdjacentPokemon = getWrappedId(indexAdjacentPokemon);
  let nameRef = capitalizeFirstLetter(searchPool[indexAdjacentPokemon].name);
  return nameRef;
}

/**
 * Returns the name of the second Pokémon type, if available.
 *
 * If the Pokémon has only one type, returns "unknown" as a fallback.
 *
 * @returns {string} The name of the second type or "unknown" if not present.
 */
function getSecondTypeName() {
  try {
    secondTypeName = currentPokemon.types[1].type.name;
  } catch (error) {
    secondTypeName = "unknown";
  }

  return secondTypeName;
}