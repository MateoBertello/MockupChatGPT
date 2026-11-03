export const $ = (id) => document.getElementById(id);

export const normalize = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export const match = (text, query) =>
  normalize(query)
    .trim()
    .split(/\s+/)
    .every((word) => normalize(text).includes(word));

export const clock = (seconds) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

let toastTimer;

export function showToast(message) {
  clearTimeout(toastTimer);
  const host = $('helpDialog').open ? $('helpDialog') : document.body;
  host.append($('toast'));
  $('toast').textContent = message;
  $('toast').hidden = false;
  toastTimer = setTimeout(() => {
    $('toast').hidden = true;
  }, 3500);
}
