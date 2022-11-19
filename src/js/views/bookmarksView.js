import View from './View';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it :)`;

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return this._data
      .map(result => previewView.render(result, false))
      .join('\n');
  }
}

export default new BookmarksView();
