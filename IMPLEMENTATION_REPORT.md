# Informe de implementación — Rediseño «Papel vivo», versión a escala completa

Fecha: octubre de 2026. Rama: `ccr-70139cd9-eg4z8h` (y `main` tras autorización).

## Revisión: «Criaturas a escala completa»

Tras la revisión del cliente (demasiado contenido, demasiado plano), la dirección «Papel vivo» se llevó a escala completa: las esculturas llenan la pantalla de borde a borde, los primeros planos de ojos, escamas y colmillos funcionan como fondos (`Macro.astro`), la tipografía crece hasta 240 px y se superpone a las fotografías, cada capítulo de la portada ocupa casi una pantalla, y los campos de color sangran a todo el ancho. Las hojas de papel pasan a ser acentos (fichas de linaje, estaciones del proceso). Para móvil, la portada usa una fotografía vertical distinta mediante `<picture>` con `media`.

## Qué se construyó

**Sistema visual.** Tokens en `site/src/styles/global.css`: paleta obligatoria (`--color-paper #F7F7F2`, `--color-ink #191B24`, `--color-cobalt #2946C7`, `--color-lime #D9ED69`, `--color-coral #E9694C`) más derivados controlados para profundidad, hover y texto accesible (`--cobalt-ink`, `--coral-ink`, `--ink-muted`). Tipografía Fraunces Variable (titulares, peso 600–700, escala fluida 44 → 112 px) y Manrope Variable (texto y controles). Cinco «escenas» (`.scene-paper/ink/cobalt/lime/coral`) que redefinen fondo, tinta, líneas y color de foco para cada entorno. Primitivas de papel (`Paper.astro`): hojas con borde ligeramente irregular (`clip-path`), esquina doblada opcional y sombras que siguen el recorte (`.sheet`). Tres motivos vectoriales originales (`Marks.astro`): ala, cornamenta y manchas.

**Portada en seis capítulos** (`site/src/views/Home.astro`): 01 El encuentro (tinta; capas lima, cobalto y coral; ventana fotográfica con el tigre alado; nombre, categoría, intro y dos acciones). Línea de concepto «Lo extraordinario toma forma en papel.» como transición. 02 Las criaturas (papel; cinco obras en secuencia editorial con escalas distintas y un campo cobalto para la calavera alada). 03 Las manos que las crean (lima; fotografía documental del taller con nota explícita; sin retrato inventado). 04 De papel a imposible (cobalto; cinco estaciones; estaciones sin fotografía resueltas con hojas tipográficas y nota de pendiente; aviso de que no es la secuencia de una sola pieza). 05 Una historia que continúa (papel; tres hojas de archivo Pedro → Felipe Mendoza → Felipe Vargas, más *Tzompantli*). 06 El próximo encuentro (coral; hoja clara que se despliega; una sola acción).

**Páginas interiores**, todas en los dos idiomas: `/obras/` (catálogo con escalas variadas, filtros, búsqueda y bloque de obras documentadas sin foto), `/obras/<obra>/` (ficha con transición de imagen compartida desde la galería, visor con zoom real, cierre con Esc que devuelve el foco a la tarjeta de origen), `/maestro/`, `/taller/` (cinco estaciones), `/legado/` (capítulos en hojas de archivo, árbol interactivo, cronología ordenada), `/archivo/` (tratamiento discreto), `/contacto/` (coral + hoja con formulario), páginas legales y 404.

**Sistema de movimiento** (`motion.ts` + CSS): Desplegar (`.unfold`), Revelar (`.reveal-mask`), Flotar (`.float`). Las ocho interacciones del brief: aparición de portada (800 ms en cuatro fases, solo capas gráficas; la fotografía nunca se deforma), entrada de galería, respuesta de obra al hover/foco (4–6 px con sombra), apertura y cierre de ficha (View Transitions nativas con `transition:name` por obra; 650 ms escritorio, 400 ms móvil), revelado del proceso, filtrado (200 ms, resultados anunciados por `aria-live`) y despliegue de contacto. Con `prefers-reduced-motion` todo se muestra en su estado final de inmediato; sin JavaScript también.

## Decisiones de dirección de arte

- Obra de portada: alebrije de tigre alado, vista cenital. Se evaluó el recorte fiel y se descartó por las razones documentadas en `ASSETS.md`; se usa la fotografía completa en ventana editorial.
- Ninguna fotografía de obra se recorta de forma que elimine alas, astas, garras o cola; las tarjetas respetan la proporción original.
- No hay citas atribuidas a Felipe; los textos de capítulo son copy editorial.
- Sin referencias a tallas de madera ni a Oaxaca; alebrije = cartonería de la Ciudad de México.

## Verificación realizada

- `npm run build` sin errores; `npm run verify`: 63 páginas, 180 URL internas, 0 rotas.
- Capturas de pantalla reales con Chromium a 360, 390, 430, 768, 1024 y 1440 px de ancho; revisión visual de portada, galería, ficha, biografía, proceso, legado, archivo y contacto; corrección de tres defectos encontrados (revelado bloqueado por `clip-path` + IntersectionObserver; estilos con ámbito no transmitidos a componentes hijos; visor de imágenes).
- Pruebas funcionales automatizadas: filtros y búsqueda (con URL), transición compartida galería → ficha (`view-transition-name` coincidente), Esc en la ficha vuelve a la galería y restaura el foco, visor (abrir, flechas, zoom, Esc, ajuste al escenario), árbol genealógico, filtros de archivo, validación y prefill del formulario, menú móvil (abrir/cerrar con Esc), primer Tab llega al enlace «saltar al contenido», modo de movimiento reducido. Sin errores de consola.
- Contraste comprobado para las combinaciones de texto usadas (tinta sobre lima y coral ≥ 6:1; papel sobre cobalto ≥ 7:1; tonos «ink» de cobalto y coral sobre papel ≥ 5:1).

## Limitaciones conocidas

- No se midieron LCP/INP/CLS en producción; la portada prioriza la foto (`fetchpriority="high"`, dimensiones reservadas) y el resto carga en diferido.
- El formulario copia el mensaje al portapapeles hasta que exista `formEndpoint` o `contactEmail` (ver README).
- El panel `/admin/` requiere un proveedor OAuth (ver README).
