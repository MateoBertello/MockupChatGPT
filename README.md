# Centro de ayuda · BuhoManager

Mockup responsive del centro de ayuda de **Caja POS** y **Sistema Web / Plan Nube**.
HTML, CSS, JavaScript vanilla con módulos ES y Tailwind CSS por CDN. Sin instalación
de dependencias, compilación ni backend.

## Ejecutar

Desde la raíz del repositorio, iniciá un servidor estático:

```sh
python3 -m http.server 8000
```

Abrí `http://localhost:8000` en un navegador moderno. También podés usar Live Server
o publicar esta carpeta en un hosting estático que sirva archivos JavaScript y MP4.
Usá HTTP en lugar de abrir `index.html` con doble clic: el navegador necesita un
servidor para cargar los módulos ES.

Tailwind se carga desde jsDelivr. Los estilos propios mantienen el diseño si el CDN
no está disponible. Los cuatro tutoriales MP4 de la ruta están incluidos y se
reproducen desde `assets/videos/`, sin servicios externos de video.

## Estructura

```text
index.html                Estructura y elementos accesibles
assets/
  css/styles.css          Marca, componentes, animaciones y responsive
  js/
    app.js                Inicialización, entorno y renderizado del catálogo
    data.js               Videos, capítulos, atajos y colecciones web
    icons.js              SVG inline reutilizables
    templates.js          Tarjetas, miniaturas y artículos orientativos
    search.js             Búsqueda y sugerencias con teclado
    player.js             Diálogo, reproducción, capítulos y carga local
    progress.js           Persistencia del progreso en localStorage
    utils.js              Búsqueda sin acentos, tiempos y notificaciones
  videos/                 Los cuatro tutoriales de Caja POS (02–05)
```

## Editar contenido

- Modificá los textos, etiquetas, palabras clave y tiempos en `assets/js/data.js`.
  Los tiempos de capítulo se expresan en segundos.
- `file` conserva el nombre original para la carga manual; `src` indica el MP4
  incluido. Si movés un video, actualizá `src` respecto de `index.html`.
- Ajustá colores y diseño en `assets/css/styles.css`. La paleta está al comienzo.
- Las colecciones web contienen guías **orientativas de la maqueta**, señaladas en
  el diálogo. Deben reemplazarse por documentación validada del producto.

## Interacciones

- Selector entre Caja POS y Sistema Web con sus propios contenidos.
- Búsqueda en vivo, tolerante a acentos. Probá `descuento`, `atajos`, `muzza`,
  `cancelar` o `precio`.
- `/` enfoca el buscador; las flechas recorren sugerencias; Enter abre una guía;
  Escape cierra las sugerencias o el diálogo.
- Los capítulos saltan al segundo correspondiente y sincronizan el paso a paso.
- El progreso se conserva en este navegador. Se puede marcar o desmarcar un video;
  llegar al final también lo completa. Si localStorage está bloqueado, funciona
  durante la sesión.
- La carga manual de videos es opcional: los archivos seleccionados permanecen en
  el navegador y no se suben a ningún servidor.

## Comprobación rápida

1. Cambiá de entorno y comprobá los 4 videos y las 12 colecciones.
2. Probá una búsqueda y una consulta sin coincidencias.
3. Reproducí un tutorial, saltá de capítulo y cerrá con Escape.
4. Marcá un video como visto y recargá para comprobar el progreso.
5. Revisá la advertencia sobre quitar primero el renglón de descuento.
6. Comprobá las vistas móvil y escritorio.
