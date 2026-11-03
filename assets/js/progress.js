import { showToast } from './utils.js';

const STORAGE_KEY = 'buho-help-v1';

/** Mantiene el formato de progreso de la maqueta original. */
export function createProgress(lessons) {
  const validIds = new Set(lessons.map((lesson) => lesson.id));
  let completed = new Set();

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(saved)) {
      completed = new Set(saved.map(Number).filter((id) => validIds.has(id)));
    }
  } catch {
    // Sigue disponible en memoria cuando el navegador bloquea localStorage.
  }

  function setCompleted(id, value) {
    if (!validIds.has(id)) return;
    if (value) completed.add(id);
    else completed.delete(id);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
    } catch {
      showToast('Progreso guardado solo durante esta sesión.');
    }
  }

  return {
    get count() {
      return completed.size;
    },
    has: (id) => completed.has(id),
    setCompleted,
  };
}
