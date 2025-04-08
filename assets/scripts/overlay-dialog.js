// open overlay
function openOverlay() {
  document.getElementById("overlay").classList.remove("d-none");
  renderDialogCard();
  disableScrollingBody();
}

function closeOverlay() {
  document.getElementById("overlay").classList.add("d-none");
  enableScrollingBody();
}

async function getPokemonData(params) {}

// render dialog for detail view of one pokemon
function renderDialogCard() {
  let currentPokemonData = 1;
  let container = document.getElementById("dialog-container");
  container.innerHTML = renderDialogCardTemplate();
}

function renderDialogCardTemplate() {
  return /*html*/ `
   <div class="" style="background-color: ;">
        <div class="card-header">
            <span>index</span>
            <span>name</span>
        </div>
        <div class="card-main">
            <img src="url" alt="picture of name">
        </div>
        <div class="card-footer">
            <div id="types-container" class="types">
            </div>
        </div>
    </div>
    `;
}

function disableScrollingBody() {
  document.body.classList.add("overflow-hidden");
}

function enableScrollingBody() {
  document.body.classList.remove("overflow-hidden");
}
