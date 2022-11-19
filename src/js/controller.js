import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);
    const recipe = model.state.recipe;

    recipeView.render(recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return resultsView.renderError();

    await model.loadSearchResults(query);
    const results = model.state.search.results;
    const resultsPerPage = model.getSearchResultsPage(model.state.search.page);
    resultsView.render(resultsPerPage);

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (page) {
  const resultsPerPage = model.getSearchResultsPage(page);
  resultsView.render(resultsPerPage);
  paginationView.render(model.state.search);
  console.log(model.state.search);
};

const controlServings = function (num) {
  model.updateServings(num);

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe);
  }
  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);
  const bookmarks = model.state.bookmarks;
  if (bookmarks === [])
    return bookmarksView.renderError(
      'No bookmarks yet. Find a nice recipe and bookmark it :)'
    );
  bookmarksView.render(bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    bookmarksView.render(model.state.bookmarks);
    setTimeout(function () {
      addRecipeView.toggleWindow();
      addRecipeView.reset();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('Welcome to the application!');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.renderMessage();
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();
