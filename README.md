# Felipe Linares Vargas — sitio oficial

Sitio bilingüe (español / inglés) de **Felipe Linares Vargas**, cartonero de la Ciudad de México, hijo de Felipe Linares Mendoza y nieto de Pedro Linares López, creador de los alebrijes.

El sitio sigue el lenguaje visual del sitio de Gorgonio Candelario: papel cálido y tinta, acentos bermellón, cempasúchil, turquesa y verde, Fraunces + Source Sans 3, secciones alternas claras y oscuras, galería como salas de museo. Portada narrativa, obras con fichas individuales, biografía, proceso, legado familiar con árbol y cronología, archivo documental con filtros, y contacto. Todo el contenido histórico está enlazado a fuentes verificables; lo que no está documentado se marca como «por confirmar».

Documentos de apoyo: **[CONTENT_CHECKLIST.md](./CONTENT_CHECKLIST.md)** (pendientes de la familia), **[ASSETS.md](./ASSETS.md)** (inventario fotográfico) e **[IMPLEMENTATION_REPORT.md](./IMPLEMENTATION_REPORT.md)** (qué se construyó y cómo se verificó).

## Sistema de diseño

Tokens en `site/src/styles/global.css`: `--papel #f6eedd`, `--papel-2 #efe3c9`, `--tinta #1c1612`, `--bermellon #b9321c`, `--cempasuchil #e8a01a`, `--turquesa #17807f`, `--verde #3b7a36`, `--morado #6b3fa0`. Tipografía Fraunces Variable (títulos) y Source Sans 3 Variable (texto), servidas desde el sitio. Clases principales: `.portada`, `.seccion` / `.seccion-crema` / `.seccion-oscura`, `.tarjetas`, `.datos`, `.pasos`, `.detalles`, `.piezas`, `.muro`, `.visor`, `.cronologia`, `.arbol`; `body.pagina-oscura` para galería y fichas.

## Estructura

```
site/                         Proyecto Astro (sitio estático)
  src/content/artworks/       Obras (una por archivo .yml, bilingüe) → /obras/<slug>/ y /en/works/<slug>/
  src/content/people/         Integrantes de la familia (árbol genealógico)
  src/content/archive/        Exposiciones, colecciones, prensa, reconocimientos → /archivo/<slug>/
  src/content/pages/{es,en}/  Textos editoriales de cada página (Markdown)
  src/data/site.json          Datos de contacto, frase de portada, endpoint del formulario
  src/assets/works/           Fotografías originales (se optimizan en el build)
  src/i18n/                   Rutas y textos de interfaz en ambos idiomas
  src/views/                  Plantillas de página (una por sección, compartidas por ambos idiomas)
  src/pages/                  Rutas: español en la raíz, inglés bajo /en/
  public/admin/               Panel de administración (Decap CMS)
  scripts/verify-links.mjs    Comprueba que no haya enlaces internos rotos
.github/workflows/deploy.yml  Despliegue a GitHub Pages
```

## Mapa del sitio

| Español | English |
|---|---|
| `/` Inicio | `/en/` Home |
| `/maestro/` Felipe | `/en/the-artist/` |
| `/obras/` Galería · `/obras/<slug>/` | `/en/works/` · `/en/works/<slug>/` |
| `/legado/` Legado | `/en/legacy/` |
| `/taller/` Proceso | `/en/workshop/` |
| `/archivo/` · `/archivo/<slug>/` | `/en/archive/` · `/en/archive/<slug>/` |
| `/contacto/` | `/en/contact/` |
| `/privacidad/` · `/creditos/` · `/accesibilidad/` | `/en/privacy/` · `/en/credits/` · `/en/accessibility/` |
| `/404.html` · `/en/404/` | |

Cada página enlaza a su equivalente en el otro idioma (`hreflang`), tiene metadatos propios, Open Graph, datos estructurados (Person, VisualArtwork, ExhibitionEvent, BreadcrumbList) y aparece en `sitemap-index.xml`.

## Desarrollo

Requiere Node 22.

```bash
cd site
npm install
npm run dev        # http://localhost:4321
npm run build      # genera site/dist
npm run verify     # comprueba enlaces internos en dist
npm run preview
```

Variables de entorno del build:

- `SITE_URL` — origen público (p. ej. `https://felipelinares.art`). Se usa para canónicas, sitemap y Open Graph.
- `BASE_PATH` — sub-ruta cuando el sitio vive en `https://usuario.github.io/<repo>`. Con dominio propio, déjalo en `/`.

## Despliegue

`.github/workflows/deploy.yml` construye y publica en GitHub Pages en cada push a `main`. En *Settings → Pages* elige «GitHub Actions» como origen. Sin configuración adicional publica en `https://<usuario>.github.io/FelipeLinares/`. Para un dominio propio, define las variables de repositorio `SITE_URL` (tu dominio) y `BASE_PATH` (`/`).

## Administración de contenidos

El panel de **Decap CMS** está en `/admin/` y edita directamente los archivos del repositorio (cada cambio es un commit y el sitio se reconstruye solo). Permite actualizar obras (imágenes, títulos, materiales, disponibilidad, obras relacionadas), familia, archivo, textos de cada página en los dos idiomas y los datos de contacto.

Para activarlo hace falta un proveedor OAuth para GitHub:

1. Si el sitio se aloja en Netlify: registra una OAuth app de GitHub en Netlify y deja `base_url: https://api.netlify.com` en `site/public/admin/config.yml`.
2. Si se aloja en GitHub Pages: despliega un pequeño gateway OAuth (p. ej. `decap-oauth` en Cloudflare Workers o Vercel), registra una OAuth app en GitHub y cambia `base_url` en `config.yml` a la URL del gateway.
3. Ajusta `backend.branch` si la rama principal no es `main`, y `site_url` / `display_url` al dominio definitivo.

Las personas autorizadas inician sesión en `/admin/` con su cuenta de GitHub (deben tener permiso de escritura en el repositorio).

### Añadir una obra sin el panel

Crea `site/src/content/artworks/<slug>.yml` siguiendo cualquiera de los existentes, coloca las fotos en `site/src/assets/works/` y haz commit. La obra aparece automáticamente en la galería, en su propia página en ambos idiomas, en «obras relacionadas» y en el sitemap. Los valores permitidos de cada campo están en `site/src/content.config.ts`; el build falla con un mensaje claro si falta algo.

## Formulario de contacto

`site/src/data/site.json` controla el comportamiento:

- `formEndpoint` definido → el formulario envía por POST a ese servicio (compatible con Formspree, Basin, etc.).
- Solo `contactEmail` definido → abre el cliente de correo con el mensaje redactado.
- Ninguno → copia el mensaje redactado al portapapeles y lo indica. Es el estado actual, hasta que el taller autorice sus datos.

Incluye validación en el navegador, honeypot antispam, referencia a obra (prefijada desde cada ficha con `?obra=<slug>`) y casilla de consentimiento.

## Accesibilidad y rendimiento

Objetivo WCAG 2.2 AA: navegación por teclado, foco visible de 3 px (lima sobre escenas oscuras, tinta sobre claras), textos alternativos descriptivos, contraste verificado (variantes «ink» de cobalto y coral para texto), áreas táctiles ≥ 44 px, `prefers-reduced-motion` respetado, visor de imágenes con `<dialog>` y teclado, Esc en la ficha devuelve a la galería restaurando el foco. Las imágenes se generan en varios tamaños (WebP) y se cargan en diferido salvo la de portada; las fuentes (Fraunces, Manrope) se sirven desde el propio sitio. No hay rastreadores ni cookies.

## Fuentes documentales

Ver `/creditos/` en el sitio y los campos `sources` de cada entrada de contenido.

## Versiones del diseño

- **v3 «Noche de alebrijes»** (actual, en `main`): fondo violeta profundo, paneles de magenta, cempasúchil y turquesa, tipografía Bricolage Grotesque, papel picado, marquesina, revelados al hacer scroll, inclinación 3D en las tarjetas. Las paletas del selector siguen funcionando; la paleta «Papel» reproduce los colores de la v2 sobre esta estructura.
- **v2 «Papel»** (etiqueta `v2-papel`): diseño de papel crema y franjas, con tipografía Fraunces. Para volver a ella: `git checkout v2-papel -- site/` y confirmar, o `git revert` de los commits posteriores a la etiqueta.

Los colores viven en `site/src/data/paletas.json`; `npm run paletas` regenera `site/src/styles/paletas.css` (también se ejecuta en cada `npm run build`).
