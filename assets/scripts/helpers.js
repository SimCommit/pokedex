// helpers.js

/**
 * @fileoverview Utility functions for DOM interaction and UI behavior in the Pokédex web app.
 *
 * This file includes small, reusable helpers such as element selection, input clearing,
 * button visibility toggling, scroll control, and event propagation handling.
 */

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

/**
 * Disables the search button.
 */
function disableSearchBtn() {
  getElementHelper("search-btn").disabled = true;
}

/**
 * Enables the search button.
 */
function enableSearchBtn() {
  getElementHelper("search-btn").disabled = false;
}

/**
 * Hides the load button.
 */
function hideLoadBtn() {
  getElementHelper("load-btn").classList.add("d-none");
}

/**
 * Shows the load button.
 */
function showLoadButton() {
  getElementHelper("load-btn").classList.remove("d-none");
}

/**
 * Shows the back button.
 */
function showBackBtn() {
  getElementHelper("back-btn").classList.remove("d-none");
}

/**
 * Hides the back button.
 */
function hideBackBtn() {
  getElementHelper("back-btn").classList.add("d-none");
}

/**
 * Shows the loading screen and disables body scrolling.
 */
function showLoadingScreen() {
  getElementHelper("loading-container").classList.remove("d-none");
  disableScrollingBody();
}

/**
 * Hides the loading screen and enables body scrolling.
 */
function hideLoadingScreen() {
  getElementHelper("loading-container").classList.add("d-none");
  enableScrollingBody();
}

/**
 * Closes the dropdown list of search suggestions.
 *
 * This function clears the content of the suggestion container.
 * It is used when the input field loses focus or when the user selects a suggestion.
 */
function closeSuggestions() {
  getElementHelper("dropdown-suggestions").innerHTML = "";
}

/**
 * Clears the value of the search input field.
 */
function emptySearchInput() {
  getElementHelper("search-input").value = "";
}

/**
 * Clears the array of search matches.
 *
 * Resets the `matches` array to an empty state before a new search.
 */
function emptyMatches() {
  matches = [];
}

/**
 * Disables scrolling on the body element while the overlay is open.
 */
function disableScrollingBody() {
  document.body.classList.add("overflow-hidden");
}

/**
 * Enables scrolling on the body element after the overlay is closed.
 */
function enableScrollingBody() {
  document.body.classList.remove("overflow-hidden");
}