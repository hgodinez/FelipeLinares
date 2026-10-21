# Inventario fotográfico

Todas las imágenes del sitio son fotografías reales de obras de Felipe Linares Vargas o del taller familiar, proporcionadas para este proyecto. No se ha generado ni sintetizado ninguna imagen de obra. Los créditos fotográficos individuales están pendientes de confirmación (ver `CONTENT_CHECKLIST.md`).

Ruta base: `site/src/assets/works/`. El build genera variantes responsivas en WebP; los originales nunca se sirven directamente.

| Archivo | Sujeto | Píxeles | Orientación | Fondo visible | Obra completa | Aislable | Uso en el sitio |
|---|---|---|---|---|---|---|---|
| `alebrije-tigre-cenital.jpg` | Alebrije de tigre alado con cola de serpiente, vista cenital (recorte del par original) | 1900 × 2700 | vertical | piso de madera | sí | **no de forma fiel** (ver nota) | **Portada (hero, ventana fotográfica completa)**, galería, ficha, biografía |
| `alebrije-tigre-frente.jpg` | Mismo alebrije, vista frontal en ángulo (recorte) | 2050 × 2000 | cuadrada | piso de madera | sí (cola parcialmente fuera) | no | Galería (segunda perspectiva), ficha, obras relacionadas |
| `alebrije-rana-frente.jpg` | Alebrije de rana con pico, vista frontal (recorte) | 1900 × 1500 | horizontal | piso de madera | sí | no | Galería, ficha |
| `alebrije-rana-cenital.jpg` | Mismo alebrije, vista cenital (recorte) | 1800 × 2400 | vertical | piso de madera | sí | no | Ficha (vista secundaria) |
| `par-alebrijes-frente.jpg` | Fotografía original con el tigre y la rana juntos | 4080 × 3072 | horizontal | piso de madera | sí | — | Fuente de los recortes; no se muestra |
| `alebrije-astado-repisa.jpg` | Alebrije de jaguar con astas de venado, terminado, en repisa | 4080 × 3072 | horizontal | repisa y pared | sí | no (repisa) | Galería (obra principal), ficha, estación «Obra terminada», imagen social |
| `alebrije-astado-mano.jpg` | Mismo alebrije sostenido en una mano (escala) | 3072 × 4080 | vertical | pared, repisa | sí | no | Ficha (detalle de escala) |
| `alebrije-astado-frente-taller.jpg` | Alebrije del mismo diseño, en el taller, antes del acabado | 899 × 1599 | vertical | mesa y taller | parcial | no | Capítulo «Las manos», portada del proceso, ficha (foto de taller) |
| `alebrije-astado-cenital-taller.jpg` | Ídem, vista cenital | 899 × 1599 | vertical | mesa y taller | sí | no | Estación «Pintura», ficha |
| `alebrije-astado-perfil-taller.jpg` | Ídem, vista lateral | 1599 × 899 | horizontal | mesa y taller | sí | no | Biografía, legado, fotografías de taller, ficha |
| `jinete-calavera-mesa.jpg` | Calavera con alas de mariposa sobre alebrije, terminada, con riendas | 3072 × 4080 | vertical | mesa, comedor | sí | no | Galería (campo cobalto), ficha, estación «Obra terminada» del proceso |
| `jinete-calavera-taller.jpg` | Misma composición en el taller, sin riendas | 899 × 1599 | vertical | mesa y taller | sí | no | Estación «Pintura», ficha (foto de taller) |
| `catrina-emplumada-taller.jpg` | Catrina con tocado de plumas, en el taller | 899 × 1599 | vertical | taller | sí | no | Galería, ficha, legado, fotografías de taller |

Resolución baja (899 × 1599): las cinco fotografías de taller. Se usan a tamaños moderados y nunca se amplían artificialmente.

## Recortes macro (`site/src/assets/macro/`)

Catorce recortes de las fotografías anteriores, sin ampliación artificial, usados como entornos de página completa y como segundas vistas en la galería: `tigre-rugido`, `tigre-alas`, `tigre-serpiente`, `tigre-serpiente-ala`, `tigre-rostro`, `jaguar-rostro`, `jaguar-colmillos`, `jaguar-alas`, `jaguar-escamas`, `rana-ojo`, `rana-lomo`, `calavera-rostro`, `calavera-montura`, `catrina-rostro`. Cada uno procede de un archivo listado en la tabla y conserva su autoría.

## Nota sobre el aislamiento de la obra de portada

Se intentó aislar fielmente al tigre alado de su fondo con segmentación local (OpenCV GrabCut, cuatro pasadas). El cuerpo, las alas y la cola se separan bien, pero la zona entre la cabeza y el ala derecha conserva vetas de madera cuyo color coincide con el naranja del tigre; eliminarlas automáticamente recorta la oreja y la frente. Como ningún recorte resultó fiel al objeto, la portada utiliza la **fotografía completa a pantalla completa** (vista frontal en escritorio, vista cenital en móvil mediante `<picture>`). Un recorte manual sobre el archivo maestro, revisado por el artista, puede sustituirla más adelante sin cambiar la composición.

## Material que falta (ver CONTENT_CHECKLIST.md)

- Retrato de Felipe Linares Vargas en su taller.
- Fotografías de materiales, armadura y capas de papel (estaciones 01–03 del proceso).
- Secuencia completa de una sola pieza, si existe.
- Imagen autorizada de *Tzompantli* (Museo Nacional de Culturas Populares) y del alebrije de gallo (MOIFA).
- Archivos maestros de mayor resolución de las fotografías de taller.

## Motivos gráficos

`site/src/components/Marks.astro` contiene tres dibujos vectoriales originales (ala, cornamenta, manchas) trazados como esquemas abstractos a partir de rasgos visibles en las fotografías. No reproducen ninguna obra concreta y solo se usan como apoyo compositivo.
