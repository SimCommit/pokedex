/**
 * Returns an HTML element by its ID.
 *
 * Simplifies `document.getElementById` calls throughout the code.
 *
 * @param {string} id - The ID of the HTML element to retrieve.
 * @returns {HTMLElement} The matching HTML element.
 */
function getElementHelper(id) {
  let element = document.getElementById(id);
  return element;
}

/**
 * Capitalizes the first letter of a given string.
 *
 * @param {string} stringToChange - The string to be transformed.
 * @returns {string} The input string with the first letter in uppercase.
 */
function capitalizeFirstLetter(stringToChange) {
  return String(stringToChange).charAt(0).toUpperCase() + String(stringToChange).slice(1);
}

/**
 * Prevents the event from bubbling up to parent elements.
 *
 * Can be used in inline event handlers like `onclick` to stop parent elements from reacting to the same event.
 *
 * @param {Event} event - The event object to stop from propagating.
 */
function prevent(event) {
  event.stopPropagation();
}

// Functions for handling the search button usability
function disableSearchBtn() {
  getElementHelper("search-btn").disabled = true;
}

function enableSearchBtn() {
  getElementHelper("search-btn").disabled = false;
}

// Functions for handling the load button visibility
function hideLoadBtn() {
  getElementHelper("load-btn").classList.add("d-none");
}

function showLoadButton() {
  getElementHelper("load-btn").classList.remove("d-none");
}

// Functions for handling the back button visibility
function showBackBtn() {
  getElementHelper("back-btn").classList.remove("d-none");
}

function hideBackBtn() {
  getElementHelper("back-btn").classList.add("d-none");
}

// Functions for handling the back button visibility and scroll behavior
function showLoadingScreen() {
  getElementHelper("loading-container").classList.remove("d-none");
  disableScrollingBody();
}

function hideLoadingScreen() {
  getElementHelper("loading-container").classList.add("d-none");
  enableScrollingBody();
}

// closes the dropdown list of search suggestions
function closeSuggestions() {
  getElementHelper("dropdown-suggestions").innerHTML = "";
}

// Emptying the value of the input field
function emptySearchInput() {
  getElementHelper("search-input").value = "";
}

// Emptying the array of matches
function emptyMatches() {
  matches = [];
}
