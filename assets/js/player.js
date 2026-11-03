import { $, clock, showToast } from './utils.js';
import { icon } from './icons.js';
import { moduleArticles } from './templates.js';

/** Controla el diálogo, el reproductor nativo y las fuentes locales alternativas. */
export function createPlayer({ lessons, progress, onProgressChange, getReturnFocus }) {
  const dialog = $('helpDialog');
  const video = $('player');
  const sources = new Map();
  let currentLesson = null;
  let currentChapter = 0;
  let opener = null;
  let pendingSeek = null;

  function openDialog() {
    if (!dialog.open) {
      opener = document.activeElement;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
      $('closeDialog').focus();
    }
    dialog.scrollTop = 0;
  }

  function updateActions() {
    if (!currentLesson) return;
    const done = progress.has(currentLesson.id);
    $('completeLesson').setAttribute('aria-pressed', done);
    $('completeLesson').classList.toggle('is-complete', done);
    $('completeLesson').innerHTML =
      icon('check') + (done ? 'Visto · desmarcar' : 'Marcar como visto');
    const isLast = lessons.indexOf(currentLesson) === lessons.length - 1;
    $('nextLesson').innerHTML =
      `${isLast ? 'Volver a la ruta' : 'Siguiente video'} ${icon('arrow')}`;
  }

  function activateChapter(index, seek = false) {
    const chapter = currentLesson?.chapters[index];
    if (!chapter) return;
    currentChapter = index;
    $('videoTag').textContent = chapter.title;
    $('stepTitle').textContent = chapter.title;
    $('stepTime').textContent = clock(chapter.time);
    $('stepList').innerHTML = chapter.steps.map((step) => `<li>${step}</li>`).join('');
    [...$('chapterList').children].forEach((button, i) => {
      button.setAttribute('aria-current', String(i === index));
    });

    if (seek) {
      pendingSeek = chapter.time;
      if (video.readyState >= 1) {
        video.currentTime = Math.min(chapter.time, video.duration || chapter.time);
        pendingSeek = null;
      }
    }
  }

  function setVideoSource() {
    video.pause();
    video.hidden = false;
    $('videoFallback').hidden = true;
    $('sourceStatus').textContent = 'Video local · cargando…';
    video.src = sources.get(currentLesson.id) || new URL(currentLesson.src, document.baseURI).href;
    video.load();
  }

  function openLesson(id, chapter = 0) {
    const lesson = lessons.find((item) => item.id === Number(id));
    if (!lesson) return;
    currentLesson = lesson;
    const index = lesson.chapters[chapter] ? chapter : 0;
    const position = String(lessons.indexOf(lesson) + 1).padStart(2, '0');

    $('lessonView').hidden = false;
    $('articleView').hidden = true;
    $('modalEyebrow').textContent = `Video ${position} / 04 · Caja POS · ${lesson.duration}`;
    $('modalTitle').textContent = lesson.title;
    $('lessonTip').textContent = lesson.tip;
    $('removalWarning').hidden = lesson.id !== 5;
    $('chapterList').innerHTML = lesson.chapters
      .map(
        (item, i) => `
      <button class="chapter" data-chapter-index="${i}" aria-current="${i === index}">
        <span class="chapter-index">${i + 1}</span>
        <span><strong>${item.title}</strong><small>${clock(item.time)}</small></span>
      </button>`,
      )
      .join('');

    pendingSeek = lesson.chapters[index].time;
    activateChapter(index);
    updateActions();
    setVideoSource();
    openDialog();
  }

  function openModule(module) {
    if (!module) return;
    currentLesson = null;
    pendingSeek = null;
    video.pause();
    $('lessonView').hidden = true;
    $('articleView').hidden = false;
    $('modalEyebrow').textContent = 'Colección · Sistema Web · Plan Nube';
    $('modalTitle').textContent = module.name;
    $('articleView').innerHTML = moduleArticles(module);
    openDialog();
  }

  function markComplete() {
    if (!currentLesson || progress.has(currentLesson.id)) return;
    progress.setCompleted(currentLesson.id, true);
    onProgressChange();
    updateActions();
    showToast('¡Un paso más! Video marcado como visto.');
  }

  $('chapterList').addEventListener('click', (event) => {
    const button = event.target.closest('[data-chapter-index]');
    if (button) activateChapter(Number(button.dataset.chapterIndex), true);
  });
  $('completeLesson').addEventListener('click', () => {
    if (!currentLesson) return;
    if (!progress.has(currentLesson.id)) {
      markComplete();
      return;
    }
    progress.setCompleted(currentLesson.id, false);
    onProgressChange();
    updateActions();
  });
  $('nextLesson').addEventListener('click', () => {
    if (!currentLesson) return;
    const next = lessons[lessons.indexOf(currentLesson) + 1];
    if (next) openLesson(next.id);
    else dialog.close();
  });

  $('closeDialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const outside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;
    if (event.target === dialog && outside) dialog.close();
  });
  dialog.addEventListener('close', () => {
    video.pause();
    currentLesson = null;
    pendingSeek = null;
    $('toast').hidden = true;
    document.body.append($('toast'));
    document.body.style.overflow = '';
    (opener?.isConnected ? opener : getReturnFocus()).focus();
  });

  video.addEventListener('loadedmetadata', () => {
    if (!currentLesson) return;
    if (pendingSeek !== null) {
      video.currentTime = Math.min(pendingSeek, video.duration);
      pendingSeek = null;
    }
    video.hidden = false;
    $('videoFallback').hidden = true;
    $('sourceStatus').textContent = 'Video listo · sonido y controles disponibles';
  });
  video.addEventListener('error', () => {
    if (!currentLesson) return;
    video.hidden = true;
    $('videoFallback').hidden = false;
    $('fallbackMessage').textContent =
      `Elegí «${currentLesson.file}». Mientras tanto, podés recorrer los capítulos y el paso a paso.`;
    $('sourceStatus').textContent = 'Podés cambiar de capítulo sin cargar el video.';
  });
  video.addEventListener('timeupdate', () => {
    if (!currentLesson || pendingSeek !== null || $('lessonView').hidden) return;
    let index = 0;
    currentLesson.chapters.forEach((chapter, i) => {
      if (video.currentTime >= chapter.time) index = i;
    });
    if (index !== currentChapter) activateChapter(index);
  });
  video.addEventListener('ended', markComplete);

  function bindFile(id, file) {
    if (!file.type.startsWith('video/') && !/\.mp4$/i.test(file.name)) return false;
    if (sources.has(id)) URL.revokeObjectURL(sources.get(id));
    sources.set(id, URL.createObjectURL(file));
    return true;
  }

  function reloadCurrent() {
    pendingSeek = currentLesson.chapters[currentChapter].time;
    setVideoSource();
  }

  $('loadAll').addEventListener('click', () => $('allFiles').click());
  $('loadCurrent').addEventListener('click', () => $('singleFile').click());
  $('singleFile').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && currentLesson && bindFile(currentLesson.id, file)) {
      reloadCurrent();
      showToast('Video cargado. Presioná reproducir para comenzar.');
    } else if (file) showToast('Elegí un archivo de video compatible.');
    event.target.value = '';
  });
  $('allFiles').addEventListener('change', (event) => {
    let count = 0;
    for (const file of event.target.files) {
      const id = Number(file.name.match(/^0?([2-5])(?:\s|[-–_])/i)?.[1]);
      if (lessons.some((lesson) => lesson.id === id) && bindFile(id, file)) count++;
    }
    if (count && currentLesson && sources.has(currentLesson.id)) reloadCurrent();
    showToast(
      count
        ? `${count} ${count === 1 ? 'video cargado' : 'videos cargados'} para esta sesión.`
        : 'Usá los nombres originales: 02, 03, 04 y 05.',
    );
    event.target.value = '';
  });
  window.addEventListener('beforeunload', () => sources.forEach((url) => URL.revokeObjectURL(url)));

  return { openLesson, openModule };
}
