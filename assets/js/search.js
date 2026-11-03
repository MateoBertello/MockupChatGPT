import { $ } from './utils.js';
import { icon } from './icons.js';

/** Combobox accesible. El catálogo y la navegación los proporciona app.js. */
export function createSearch({ getSuggestions, onQueryChange, onSelect }) {
  let items = [];
  let selected = -1;
  const input = $('search');
  const list = $('suggestions');

  function hide() {
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    selected = -1;
  }

  function renderSuggestions() {
    const query = input.value.trim();
    items = query ? getSuggestions(query).slice(0, 4) : [];
    selected = -1;
    input.removeAttribute('aria-activedescendant');
    if (!items.length) {
      hide();
      return;
    }

    list.innerHTML = items
      .map(
        (item, index) => `
      <button class="suggestion" role="option" aria-selected="false" tabindex="-1"
        id="suggestion-${index}" data-suggestion="${index}">
        ${icon(item.kind === 'lesson' ? 'play' : 'folder')}
        <span>${item.title}<small>${item.sub}</small></span>${icon('arrow')}
      </button>`,
      )
      .join('');
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  function setQuery(query, focus = false) {
    input.value = query;
    hide();
    onQueryChange();
    if (focus) input.focus();
  }

  input.addEventListener('input', () => {
    onQueryChange();
    renderSuggestions();
  });
  input.addEventListener('focus', renderSuggestions);
  $('clearSearch').addEventListener('click', () => setQuery('', true));

  list.addEventListener('click', (event) => {
    const option = event.target.closest('[data-suggestion]');
    if (!option) return;
    const item = items[Number(option.dataset.suggestion)];
    if (item) {
      hide();
      onSelect(item);
    }
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hide();
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      const item = !list.hidden && items[selected];
      hide();
      if (item) onSelect(item);
      else $('contenido').focus();
      return;
    }
    if (list.hidden) return;
    event.preventDefault();
    selected = (selected + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    [...list.children].forEach((option, index) => {
      option.setAttribute('aria-selected', String(index === selected));
    });
    input.setAttribute('aria-activedescendant', `suggestion-${selected}`);
  });

  document.addEventListener('keydown', (event) => {
    if (
      event.key === '/' &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      !$('helpDialog').open &&
      !event.target.closest('input,textarea,select,[contenteditable="true"]')
    ) {
      event.preventDefault();
      input.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-area')) hide();
  });
  document.addEventListener('focusin', (event) => {
    if (!event.target.closest('.search-area')) hide();
  });

  return { hide, setQuery };
}
