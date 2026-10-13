# Carlos Benítez · Portafolio

Portafolio personal de Carlos Benítez, desarrollador web: proyectos, tecnologías, uso de IA y formulario de contacto.

**Producción:** https://carlos-benitez-portfolio.vercel.app

## Stack

- React 19 + TypeScript, empaquetado con Vite
- Tailwind CSS v4
- Animaciones: GSAP, framer-motion y CSS (scroll-driven animations)
- Formulario de contacto: EmailJS
- Tests: Vitest + Testing Library (unitarios) y Playwright + axe (E2E y accesibilidad)
- Despliegue: Vercel
- Analítica: Vercel Web Analytics (visitas, sin cookies) y Speed Insights (Core Web Vitals reales). Solo se cargan en deploys de Vercel; hay que activar cada una una vez en el panel del proyecto → _Analytics_ y _Speed Insights_.

## Comandos

| Comando                           | Qué hace                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------ |
| `npm run dev`                     | Servidor de desarrollo, solo en `localhost`                                          |
| `npm run dev:lan`                 | Igual, pero accesible desde otros dispositivos de tu red (para probar en el celular) |
| `npm run build`                   | Chequeo de tipos y build de producción en `dist/`                                    |
| `npm run preview`                 | Sirve el build con las mismas cabeceras de seguridad que producción                  |
| `npm run lint`                    | ESLint                                                                               |
| `npm test`                        | Tests unitarios (Vitest)                                                             |
| `npm run test:watch`              | Tests unitarios en modo watch                                                        |
| `npm run test:e2e`                | Tests E2E contra el build de producción (escritorio y móvil)                         |
| `npm run format` / `format:check` | Prettier con orden de clases de Tailwind                                             |

La primera vez que vayas a correr los E2E, instala el navegador: `npx playwright install chromium`.

## Calidad: los tests corren siempre

- **Antes de cada commit** (hook local): `lint` y tests unitarios.
- **Antes de cada push** (hook local): `build` y tests E2E.
- **En cada PR y push a `main`** (GitHub Actions): `npm audit`, lint, unitarios, build y E2E.

Los hooks se instalan solos con `npm install` (`simple-git-hooks`). Para saltarlos en una emergencia: `SKIP_SIMPLE_GIT_HOOKS=1 git commit ...`.

Dependabot revisa las dependencias npm y las GitHub Actions cada semana.

## SEO y lectura por LLMs

Todo el contenido vive en `src/content/site.ts`. En el build, `vite-plugins/seoContent.ts` genera a partir de ese archivo:

- **HTML estático dentro de `#root`**, para buscadores y agentes que no ejecutan JavaScript. React lo reemplaza al montar. Mientras tanto queda oculto a la vista pero es accesible; sin JavaScript, `public/noscript.css` lo muestra.
- **JSON-LD** (`ProfilePage`, `Person`, `WebSite`) para resultados enriquecidos.
- **`/llms.txt`** ([llmstxt.org](https://llmstxt.org), v2) e **`/index.md`**, la página completa en Markdown. Se anuncian con `<link rel="describedby">`, con `<link rel="alternate" type="text/markdown">` y con la cabecera `Link`.
- **`/sitemap.xml`**, con la fecha del build.

Para cambiar textos, proyectos o enlaces, edita `src/content/site.ts`. El texto de "Sobre mí" también está en `components/ui/AboutText.tsx` con su formato; `AboutText.test.tsx` avisa si las dos versiones dejan de coincidir.

**Buscadores (una sola vez):**

1. En [Google Search Console](https://search.google.com/search-console), agrega la propiedad con prefijo de URL, elige _Etiqueta HTML_ y pega el código en el comentario preparado en `index.html`. Despliega, verifica y envía `sitemap.xml`.
2. En [Bing Webmaster Tools](https://www.bing.com/webmasters), usa _Import from Google Search Console_: importa el sitio ya verificado y su sitemap.

## Seguridad

- **Cabeceras** (`vercel.json`): CSP estricta (solo los orígenes en uso), HSTS, `nosniff`, bloqueo de iframes, `Referrer-Policy`, `Permissions-Policy` y COOP. `vite preview` sirve las mismas cabeceras, así que los E2E prueban la política real.
- **Si agregas un recurso externo** (imágenes de otro dominio, una API, un script), añade su origen a la directiva correspondiente de la CSP en `vercel.json`. Si no, el navegador lo bloquea y el test `security.spec.ts` falla.
- **Formulario de contacto**:
  - Validación en cliente.
  - Campo trampa (honeypot) para bots.
  - Un envío cada 60 s por navegador.
  - Longitudes máximas.
  - A EmailJS solo se envían los cuatro campos del formulario.
- **Panel de EmailJS (obligatorio):** la `publicKey` es pública por diseño, así que las protecciones del cliente no frenan a quien llame a la API directamente. En _Account → Security_:
  - Limita los dominios permitidos al dominio de producción.
  - Activa el rate limit.
- Los enlaces que abren otra pestaña llevan `rel="noopener noreferrer"`; ESLint lo exige.

## Estructura

```
src/
  components/
    shared/        Navbar, Header, Footer
    ui/            Secciones y componentes (proyectos, tecnologías, IA, contacto)
  hooks/           useIsMobile, usePauseOffscreenAnimations
  content/         Fuente única del contenido (app, HTML estático, llms.txt, index.md)
  utils/           Tecnologías, validación y envío del formulario,
                   visibilidad de secciones
  test/            Setup de Vitest y simulaciones de APIs del navegador
vite-plugins/      seoContent: genera HTML estático, JSON-LD, llms.txt, index.md y sitemap
e2e/               Tests de Playwright (portafolio, contacto, seguridad y accesibilidad)
vercel.json        Cabeceras de producción (seguridad, llms.txt, index.md)
```

## Rendimiento

Las animaciones de fondo (brillos, gradientes, manchas, olas) se pausan cuando su sección no está en pantalla (`utils/visibility.ts`). Donde se puede, se anima solo con `transform` y `opacity`. Con _reducir movimiento_ activado en el sistema operativo, los bucles decorativos se desactivan.
