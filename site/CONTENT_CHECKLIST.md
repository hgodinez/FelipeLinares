# Lista de contenido por confirmar antes de publicar

Todo lo marcado aquí aparece en el sitio como «por confirmar» o como marcador de diseño. Nada de esta lista se ha inventado; se incorporará con la confirmación de Felipe Linares Vargas o su familia.

## 1. Datos del artista (página «El maestro»)

- [ ] Año y lugar de nacimiento.
- [ ] Formación: edad a la que empezó, con quién aprendió (padre, abuelo, tíos).
- [ ] Especialidades y técnicas propias; qué animales prefiere combinar.
- [ ] Retrato fotográfico (sustituye el marcador «Retrato del artista»).
- [ ] Citas textuales del artista, si desea incluir alguna (el sitio no publica ninguna hoy).
- [ ] Hitos personales para la cronología (primeras exposiciones, encargos, viajes, premios), cada uno con fecha y, si es posible, documento o enlace.
- [ ] Confirmar que la frase de portada «El arte de dar vida a lo imposible.» le parece adecuada, o sustituirla. Es copy editorial propuesto, no una cita.

## 2. Obras (`site/src/content/artworks/`)

Para cada una de las cinco piezas fotografiadas:

| Pieza (título descriptivo actual) | Por confirmar |
|---|---|
| Alebrije de jaguar con astas de venado | título, año, dimensiones, materiales/barniz, disponibilidad, si las fotos de taller son la misma pieza u otra del mismo diseño, crédito fotográfico |
| Alebrije de tigre alado con cola de serpiente | título, año, dimensiones, materiales, disponibilidad, crédito fotográfico |
| Alebrije de rana con pico de ave | título, año, dimensiones, materiales, disponibilidad, crédito fotográfico |
| Calavera con alas de mariposa montada en alebrije | título, año, dimensiones, si la foto de taller es la misma pieza, disponibilidad, crédito |
| Catrina con tocado de plumas | título, año, dimensiones, disponibilidad, crédito |

Obras documentadas sin fotografía:

- [ ] **Tzompantli (2010)** — solicitar al Museo Nacional de Culturas Populares autorización para reproducir la imagen de su colección, o fotografía propia del artista.
- [ ] **Alebrije de gallo (MOIFA, 2026–2028)** — título, año, dimensiones, propietario; fotografía con autorización del Museum of International Folk Art o del artista.

Cuando se confirme un título, cambia `titleStatus: provisional` por `confirmed` en el archivo de la obra (o en el panel de administración) y desaparece el asterisco.

- [ ] Precios: el sitio no muestra precios. Si el artista desea indicar disponibilidad («en venta», «vendida», «colección particular») se actualiza el campo `availability`.
- [ ] Más obras: máscaras, judas, piñatas u otras categorías existen en el esquema pero no se muestran hasta que haya obras documentadas.

## 3. Familia (`site/src/content/people/`)

- [ ] Confirmar que Felipe Linares Vargas es hijo de Felipe Linares Mendoza (hermano de Leonardo y David). Fuentes públicas lo indican de forma indirecta.
- [ ] Año de nacimiento de Felipe Linares Mendoza (1936 según fuentes secundarias) y de David Linares Vargas (1963, ídem).
- [ ] Relación de Ricardo Linares García (¿hijo de Miguel Linares?). Marcada como «por confirmar» en el árbol.
- [ ] Línea de descendencia de Gerardo Linares Gómez.
- [ ] Nombres de generaciones anteriores a Pedro Linares López (padre, abuelo) si la familia desea incluirlos.
- [ ] Fotografías históricas familiares, con permiso, para la página «Legado».
- [ ] Numeración de generaciones: el sitio cuenta a Felipe Linares Vargas como cuarta generación a partir de los antepasados documentados y señala que la familia se describe como «quinta generación». Confirmar la numeración que la familia prefiere.

## 4. Taller

- [ ] Dirección o zona exacta que el taller desea publicar (hoy: «Colonia Merced Balbuena, Ciudad de México»).
- [ ] Confirmar los ocho pasos del proceso y añadir detalles propios: tipo de pinturas, tiempos de secado, herramientas, materiales de la estructura.
- [ ] Fotografía documental del taller de Felipe (manos, herramientas, pigmentos) — tres marcadores en la página.
- [ ] Video corto del proceso, si existe.

## 5. Archivo

- [ ] Exposiciones individuales o colectivas de Felipe Linares Vargas no documentadas en línea (fechas, institución, ciudad, catálogo o foto).
- [ ] Participación de Felipe en «En Calavera» (Fowler Museum, 1994) o en los desfiles del Museo de Arte Popular, si la hubo.
- [ ] Prensa, entrevistas, publicaciones y reconocimientos propios.
- [ ] Colecciones públicas o privadas que conserven obra suya, con autorización para mencionarlas.

## 6. Contacto (`site/src/data/site.json`)

- [ ] Correo electrónico público del taller → `contactEmail`.
- [ ] Número de WhatsApp (solo con autorización explícita) → `whatsappNumber`.
- [ ] Servicio de formularios (Formspree, Basin, Netlify Forms…) → `formEndpoint`. Sin él, el formulario copia el mensaje al portapapeles.
- [ ] Redes sociales, si las hay.

## 7. Publicación

- [ ] Dominio definitivo → variable `SITE_URL` (y `BASE_PATH=/`) en GitHub, y `site_url` / `display_url` en `site/public/admin/config.yml`.
- [ ] Proveedor OAuth para el panel de administración (ver README).
- [ ] Créditos fotográficos definitivos en `/creditos/` y en cada imagen (`credit`).
- [ ] Revisión final de los textos en inglés por el traductor o persona de confianza de la familia.
