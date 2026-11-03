import { lessons, shortcuts, modules } from './data.js';
import { $, match, normalize } from './utils.js';
import { icon, mountIcons } from './icons.js';
import { videoCard, shortcutCard, moduleCard } from './templates.js';
import { createProgress } from './progress.js';
import { createSearch } from './search.js';
import { createPlayer } from './player.js';

mountIcons();

let environment = 'pos';
const progress = createProgress(lessons);
const player = createPlayer({
  lessons,
  progress,
  onProgressChange: render,
  getReturnFocus: () => (environment === 'pos' ? $('startRoute') : $('webSwitch')),
});
const search = createSearch({
  getSuggestions,
  onQueryChange: render,
  onSelect: (item) => {
    if (item.kind === 'lesson') player.openLesson(item.lesson, item.chapter);
    else player.openModule(modules[item.module]);
  },
});

function getSuggestions(query) {
  if (environment === 'web') {
    return modules.flatMap((module, index) =>
      match(`${module.name} ${module.keywords} ${module.guides.join(' ')}`, query)
        ? [{ kind: 'module', title: module.name, sub: 'Colección · Sistema Web', module: index }]
        : [],
    );
  }
  return lessons.flatMap((lesson) =>
    lesson.chapters.flatMap((chapter, index) =>
      match(`${lesson.title} ${lesson.keywords} ${chapter.title}`, query)
        ? [
            {
              kind: 'lesson',
              title: chapter.title,
              sub: lesson.title,
              lesson: lesson.id,
              chapter: index,
            },
          ]
        : [],
    ),
  );
}

function renderProgress() {
  const count = progress.count;
  $('progressCount').textContent = `${count} de ${lessons.length}`;
  $('progressFill').style.width = `${(count / lessons.length) * 100}%`;
  $('courseProgress').setAttribute('aria-valuenow', count);
  $('courseProgress').setAttribute('aria-valuemax', lessons.length);
  $('progressLabel').textContent = count === lessons.length ? '¡Ruta completada!' : 'Tu progreso';
  const label =
    count === lessons.length ? 'Repasar la ruta' : count ? 'Continuar la ruta' : 'Comenzar la ruta';
  $('startRoute').innerHTML = `${label} ${icon('arrow')}`;
}

function render() {
  const query = $('search').value.trim();
  const videoMatches = lessons.filter((lesson) =>
    match(
      [
        lesson.title,
        lesson.description,
        lesson.keywords,
        ...lesson.chapters.map((chapter) => chapter.title),
      ].join(' '),
      query,
    ),
  );
  const shortcutMatches = shortcuts.filter((shortcut) =>
    match(`${shortcut.title} ${shortcut.sub} ${shortcut.keywords}`, query),
  );
  const moduleMatches = modules.filter((module) =>
    match(`${module.name} ${module.desc} ${module.keywords} ${module.guides.join(' ')}`, query),
  );

  $('posSection').hidden = environment !== 'pos';
  $('webSection').hidden = environment !== 'web';
  $('learningRoute').hidden = !!query;
  $('posHeading').hidden = !!query;
  $('webBanner').hidden = !!query;
  $('videoGrid').innerHTML = videoMatches
    .map((lesson) => videoCard(lesson, progress.has(lesson.id)))
    .join('');
  $('videoGrid').hidden = !videoMatches.length;
  $('shortcutGrid').innerHTML = shortcutMatches.map(shortcutCard).join('');
  $('shortcutsSection').hidden = !shortcutMatches.length;
  $('moduleGrid').innerHTML = moduleMatches
    .map((module) => moduleCard(module, modules.indexOf(module)))
    .join('');

  const count =
    environment === 'pos' ? videoMatches.length + shortcutMatches.length : moduleMatches.length;
  $('searchSummary').hidden = !query;
  $('emptyState').hidden = !!count;
  $('resultCount').textContent = query
    ? `${count} ${count === 1 ? 'resultado' : 'resultados'} para “${query}”`
    : '';
  document.querySelectorAll('[data-query]').forEach((button) => {
    button.classList.toggle('active', normalize(button.dataset.query) === normalize(query));
  });
  $('clearSearch').hidden = !query;
  $('searchKey').hidden = !!query;
  renderProgress();
}

function setEnvironment(env) {
  if (!['pos', 'web'].includes(env)) return;
  environment = env;
  $('posSwitch').setAttribute('aria-pressed', env === 'pos');
  $('webSwitch').setAttribute('aria-pressed', env === 'web');
  $('heroTitle').innerHTML =
    env === 'pos'
      ? 'Menos dudas.<br><span>Más tiempo para tu comercio.</span>'
      : 'Tu gestión, más simple.<br><span>Tu negocio, más conectado.</span>';
  $('heroDescription').innerHTML =
    env === 'pos'
      ? 'Aprendé a usar tu Caja con videos cortos y respuestas simples.<br>Buscá lo que necesitás y seguí con tu día.'
      : 'Encontrá tu camino entre artículos, stock, ventas y clientes.<br>Una colección para cada módulo de tu Plan Nube.';
  const queries =
    env === 'pos'
      ? ['Atajos', 'Descuentos', 'Muzza', 'Cancelar']
      : ['Facturas', 'Artículos', 'Stock', 'Clientes'];
  $('quickSearch').innerHTML =
    '<span>Probá buscar</span>' +
    queries.map((query) => `<button class="chip" data-query="${query}">${query}</button>`).join('');
  search.setQuery('');
}

document.addEventListener('click', (event) => {
  const env = event.target.closest('[data-env]');
  if (env) {
    setEnvironment(env.dataset.env);
    return;
  }
  const query = event.target.closest('[data-query]');
  if (query) {
    search.setQuery(query.dataset.query);
    return;
  }
  const lesson = event.target.closest('[data-lesson]');
  if (lesson) {
    player.openLesson(lesson.dataset.lesson, Number(lesson.dataset.chapter || 0));
    return;
  }
  const module = event.target.closest('[data-module]');
  if (module) {
    player.openModule(modules[Number(module.dataset.module)]);
    return;
  }
  if (event.target.closest('[data-action="reset"]')) search.setQuery('', true);
});
$('startRoute').addEventListener('click', () => {
  player.openLesson((lessons.find((lesson) => !progress.has(lesson.id)) || lessons[0]).id);
});

setEnvironment('pos');
