let isShiny = false;
let secondTypeName;

// Functions for handling the overlay (open and close)
async function openOverlay(id) {
  await renderDialogCard(id);
  document.getElementById("overlay").classList.remove("d-none");
  disableScrollingBody();
}

function closeOverlay() {
  document.getElementById("overlay").classList.add("d-none");
  enableScrollingBody();
}

// renders the dialog for the detailed card of the selected Pokemon
async function renderDialogCard(id) {
  let container = document.getElementById("dialog-container");
  currentPokemon = await getPokemonData(id);
  const backgroundColor = typeColors[currentPokemon.types[0].type.name] || "#66aed7";
  container.innerHTML = renderDialogCardTemplate(currentPokemon, backgroundColor);
  renderTypes("dialog-types-container");
  renderStats();
}

// Renders the about tab of the dialog card
function renderAbout() {
  let container = getElementHelper("detail-info-container");
  container.innerHTML = renderAboutTemplate(currentPokemon);
  renderAboutAbilities(currentPokemon["abilities"]);
}

// Sub-function to render the abilities for the about tab
function renderAboutAbilities(abilities) {
  let container = getElementHelper("abilities-container");

  for (let i = 0; i < abilities.length; i++) {
    const abilityName = abilities[i].ability.name;
    container.innerHTML += renderAboutAbilitiesTemplate(abilityName);
  }
}

// Renders the stats tab
function renderStats() {
  let container = getElementHelper("detail-info-container");
  secondTypeColor = typeColors[getSecondTypeName()];
  container.innerHTML = "";
  container.innerHTML += renderStatsTemplate();
}

// Renders the moves tab
function renderMoves() {
  let container = getElementHelper("detail-info-container");
  container.innerHTML = ``;

  for (let i = 0; i < currentPokemon.moves.length; i++) {
    container.innerHTML += renderMovesTemplate(i);
  }
}

// Assigns the class active to the last clicked nav-details-btn
function setActiveDetailsTab(buttonId) {
  document.querySelectorAll(".nav-details-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  getElementHelper(buttonId).classList.add("active");
}

// Prevent scrolling while overlay is open
function disableScrollingBody() {
  document.body.classList.add("overflow-hidden");
}

function enableScrollingBody() {
  document.body.classList.remove("overflow-hidden");
}

/* changes the ID of the Pokemon to be rendered to navigate with the next and prev buttons
also switches from the highest ID to the lowest ID and vice versa */
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

// Toggling default and shiny gif
function toggleShinyGif() {
  let container = getElementHelper("dialog-gif-container");
  checkIfShiny(container);
  isShiny = !isShiny;
  container.classList.add("glow");
  setTimeout(() => container.classList.remove("glow"), 500);
}

// check if current gif is shiny or not
function checkIfShiny(container){
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

// Getting name of adjacent Pokemon
function getNameOfAdjacentPokemon(modificator) {
  let indexAdjacentPokemon = currentPokemon.id + modificator;

  switch (indexAdjacentPokemon) {
    case 152:
      indexAdjacentPokemon = 1;
      break;

    case 0:
      indexAdjacentPokemon = 151;
      break;
  }

  let nameRef = capitalizeFirstLetter(searchPool[indexAdjacentPokemon].name);
  return nameRef;
}

// Getting name of second type with fallback
function getSecondTypeName() {
  try {
    secondTypeName = currentPokemon.types[1].type.name;
  } catch (error) {
    secondTypeName = "unknown";
  }

  return secondTypeName;
}