const paths = {
  monitor: '<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M8 21h8M12 16v5"/>',
  cloud: '<path d="M7 18a5 5 0 1 1 .5-9.97A6 6 0 0 1 19 10a4 4 0 0 1-1 8Z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  external:
    '<path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>',
  x: '<path d="m6 6 12 12M6 18 18 6"/>',
  play: '<path d="m9 5 11 7-11 7Z" fill="currentColor" stroke="none"/>',
  video: '<rect x="2" y="5" width="14" height="14" rx="3"/><path d="m16 10 6-4v12l-6-4Z"/>',
  route:
    '<circle cx="6" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><path d="M8 5h8a4 4 0 0 1 0 8H8a3 3 0 0 0 0 6h8"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  tag: '<path d="M20 13 13 20a2 2 0 0 1-3 0L2 12V3h9l9 8a2 2 0 0 1 0 2Z"/><circle cx="7" cy="8" r="1"/>',
  edit: '<path d="m16 3 5 5M3 21l5-1L21 7a2 2 0 0 0-5-5L3 15Z"/>',
  trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  keyboard:
    '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10"/>',
  folder: '<path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v2M2 9h20l-3 12H5Z"/>',
  warning: '<path d="m12 3 10 18H2Z"/><path d="M12 9v5m0 3v.1"/>',
  box: '<path d="m12 2 10 5v10l-10 5-10-5V7Zm0 10 10-5M12 12 2 7m10 5v10M7 4.5l10 5"/>',
  receipt: '<path d="M5 2h14v20l-3-2-4 2-4-2-3 2ZM8 7h8M8 11h8M8 15h5"/>',
  stock: '<path d="M3 21V8l9-5 9 5v13ZM7 21v-9h10v9M7 16h10"/>',
  users:
    '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v3"/>',
  truck:
    '<path d="M1 4h13v13H1ZM14 8h5l4 5v4h-9"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/>',
  badge:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M9 5V2h6v3M7 16h10"/><circle cx="12" cy="11" r="2"/>',
  wallet: '<path d="M20 7V4H5a3 3 0 0 0 0 6h16v11H5a3 3 0 0 1-3-3V7m14 7h6v4h-6Z"/>',
  chart: '<path d="M4 3v18h18M8 15l5-5 4 2 5-7M8 18v-2m5 2v-4m5 4v-3"/>',
  sliders: '<path d="M4 21v-7m0-7V3M12 21v-4m0-7V3M20 21V10m0-7V3M1 10h6m2 4h6m2-7h6"/>',
  cheque:
    '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M5 9h5M5 13h3m5 3 3-3 2 1 3-3"/>',
  shield: '<path d="M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6Zm-5 10 3 3 7-7"/>',
  heart:
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
};
export const icon = (name) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.box}</svg>`;

export function mountIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((element) => {
    element.outerHTML = icon(element.dataset.icon);
  });
}
