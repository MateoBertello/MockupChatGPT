import { icon } from './icons.js';

function miniature(lesson) {
  const row = lesson.id === 4 ? 'discount' : lesson.id === 5 ? 'remove' : 'highlight';
  const discounted = lesson.id === 4;

  return `
    <div class="mini-pos" aria-hidden="true">
      <div class="mini-side">☰<br>+<br>−<br>✎<br>×<br>◇</div>
      <div class="mini-content">
        <div class="mini-head">BUHOMANAGER · CAJA</div>
        <div class="mini-search">${lesson.id === 3 ? '⌕ muzza' : 'Venta en curso'}</div>
        <div class="mini-body">
          <div class="mini-table">
            <div class="mini-row"><span>Cant.</span><span>Descripción</span><span>Total</span></div>
            <div class="mini-row ${row}"><span>1</span><span>1/4 Muzza</span><span>$ 6.200</span></div>
            <div class="mini-row ${discounted ? 'discount' : ''}">
              <span>${discounted ? '−' : ''}</span>
              <span>${discounted ? 'Descuento 10 %' : ''}</span>
              <span>${discounted ? '$ 620' : ''}</span>
            </div>
            <div class="mini-row"></div>
          </div>
          <div class="mini-pay"><span>⌕ Productos</span><span>× Cancelar</span><span>✓ Pagar</span></div>
        </div>
      </div>
    </div>`;
}

// Estas plantillas reciben únicamente contenido local de data.js.
// Las búsquedas y los nombres de archivos del usuario se muestran con textContent.
export function videoCard(lesson, completed) {
  return `
    <button class="video-card ${completed ? 'complete' : ''}" data-lesson="${lesson.id}"
      style="--tint:${lesson.tint};--accent:${lesson.accent}"
      aria-label="${lesson.title}, ${lesson.duration}${completed ? ', completado' : ''}">
      <div class="thumbnail">
        <div class="thumb-top">
          <span class="lesson-number">0${lesson.id - 1}</span>
          <span class="chapter-tag">${lesson.chapters.length} capítulos</span>
        </div>
        ${miniature(lesson)}
        <span class="floating-tool" aria-hidden="true">${icon(lesson.tool)}</span>
        <span class="duration">${lesson.duration}</span>
        <span class="play" aria-hidden="true">${icon('play')}</span>
      </div>
      <div class="card-content">
        <span class="category">${lesson.category}</span>
        <h3>${lesson.title}</h3>
        <p>${lesson.description}</p>
        <div class="card-bottom">
          <span>${completed ? 'Completado' : 'Ver guía'}</span>
          ${icon(completed ? 'check' : 'arrow')}
        </div>
      </div>
    </button>`;
}

export function shortcutCard(shortcut) {
  return `
    <button class="shortcut" data-lesson="${shortcut.lesson}" data-chapter="${shortcut.chapter}">
      <span class="tile-icon">${icon(shortcut.icon)}</span>
      <span><strong>${shortcut.title}</strong><small>${shortcut.sub}</small></span>
      ${icon('arrow')}
    </button>`;
}

export function moduleCard(module, index) {
  return `
    <button class="module" data-module="${index}" style="--tint:${module.tint};--accent:${module.accent}">
      <span class="module-icon">${icon(module.icon)}</span>
      <h3>${module.name}</h3><p>${module.desc}</p>
      <span class="module-bottom"><span>${module.guides.length} guías orientativas</span>${icon('arrow')}</span>
    </button>`;
}

export function moduleArticles(module) {
  return `
    <div class="article-intro">
      ${icon(module.icon)} <strong>${module.desc}</strong><br>
      Guías orientativas de esta maqueta. Los pasos detallados de cada módulo se incorporarán al centro de ayuda definitivo.
    </div>
    <div class="article-list">
      ${module.guides
        .map(
          (guide, index) => `
        <details ${index === 0 ? 'open' : ''}>
          <summary>${guide}</summary>
          <p>Desde el menú lateral de tu Sistema Web, ubicá <strong>${module.name}</strong>
            y buscá la opción relacionada con <strong>${guide.toLowerCase()}</strong>.
            La disponibilidad depende de los permisos de tu usuario.</p>
          <ol class="steps-list">
            <li>Identificá la tarea que necesitás resolver antes de realizar cambios.</li>
            <li>Revisá los datos y los filtros disponibles en la pantalla.</li>
            <li>Consultá con el administrador si no ves la opción o necesitás permisos.</li>
          </ol>
        </details>`,
        )
        .join('')}
    </div>`;
}
