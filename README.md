# Felipe Linares Vargas — sitio oficial

Sitio bilingüe (español / inglés) de **Felipe Linares Vargas**, cartonero de la Ciudad de México, hijo de Felipe Linares Mendoza y nieto de Pedro Linares López, creador de los alebrijes.

El sitio es una exposición digital de varias páginas bajo la dirección de arte **«Papel vivo»**: el entorno gráfico se comporta como papel (hojas que se despliegan, capas con sombra, bordes ligeramente irregulares) y las esculturas permanecen como fotografías auténticas. Portada narrativa en seis capítulos, obras con fichas individuales, biografía, proceso en cinco estaciones, legado familiar con árbol genealógico y cronología, archivo documental con filtros, y contacto. Todo el contenido histórico está enlazado a fuentes verificables; lo que no está documentado se marca como «por confirmar».

Documentos de apoyo: **[CONTENT_CHECKLIST.md](./CONTENT_CHECKLIST.md)** (pendientes de la familia), **[ASSETS.md](./ASSETS.md)** (inventario fotográfico) e **[IMPLEMENTATION_REPORT.md](./IMPLEMENTATION_REPORT.md)** (qué se construyó y cómo se verificó).

## Sistema de diseño

| Token | Color | Uso |
|---|---|---|
| `--color-paper` | `#F7F7F2` | superficies de lectura y galería |
| `--color-ink` | `#191B24` | tipografía y escena de portada |
| `--color-cobalt` | `#2946C7` | campos teatrales y proceso |
| `--color-lime` | `#D9ED69` | contraste tras las criaturas y acción principal |
| `--color-coral` | `#E9694C` | cierre y contacto |

Tipografía: Fraunces Variable (titulares) y Manrope Variable (texto y controles), servidas desde el sitio. Escenas (`.scene-paper`, `.scene-ink`, `.scene-cobalt`, `.scene-lime`, `.scene-coral`) fijan fondo, tinta y color de foco. Primitivas: `Paper.astro` (hoja con borde orgánico y esquina doblada), `.sheet` (sombra que sigue el recorte), `Marks.astro` (ala, cornamenta, manchas). Movimiento: tres gestos (`.unfold`, `.reveal-mask`, `.float`) y transiciones de imagen compartida entre galería y ficha (`transition:name`). Todo respeta `prefers-reduced-motion` y funciona sin JavaScript.

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
