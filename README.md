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

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo, solo en `localhost` |
| `npm run dev:lan` | Igual, pero accesible desde otros dispositivos de tu red (para probar en el celular) |
| `npm run build` | Chequeo de tipos y build de producción en `dist/` |
| `npm run preview` | Sirve el build con las mismas cabeceras de seguridad que producción |
| `npm run lint` | ESLint |
| `npm test` | Tests unitarios (Vitest) |
| `npm run test:watch` | Tests unitarios en modo watch |
| `npm run test:e2e` | Tests E2E contra el build de producción (escritorio y móvil) |
| `npm run format` / `format:check` | Prettier con orden de clases de Tailwind |

La primera vez que vayas a correr los E2E, instala el navegador: `npx playwright install chromium`.

## Calidad: los tests corren siempre

- **Antes de cada commit** (hook local): `lint` y tests unitarios.
- **Antes de cada push** (hook local): `build` y tests E2E.
- **En cada PR y push a `main`** (GitHub Actions): `npm audit`, lint, unitarios, build y E2E.

Los hooks se instalan solos con `npm install` (`simple-git-hooks`). Para saltarlos en una emergencia: `SKIP_SIMPLE_GIT_HOOKS=1 git commit ...`.

Dependabot revisa las dependencias npm y las GitHub Actions cada semana.

## Seguridad

- **Cabeceras** (`vercel.json`): CSP estricta (solo los orígenes en uso), HSTS, `nosniff`, bloqueo de iframes, `Referrer-Policy`, `Permissions-Policy` y COOP. `vite preview` sirve las mismas cabeceras, así que los E2E prueban la política real.
- **Si agregas un recurso externo** (imágenes de otro dominio, una API, un script), añade su origen a la directiva correspondiente de la CSP en `vercel.json`. Si no, el navegador lo bloquea y el test `security.spec.ts` falla.
- **Formulario de contacto**:
  - Validación en cliente.
  - Campo trampa (honeypot) para bots.
  - Un envío cada 60 s por navegador.
  - Longitudes máximas.
  - A EmailJS solo se envían los cuatro campos del formulario.
- **Panel de EmailJS (obligatorio):** la `publicKey` es pública por diseño, así que las protecciones del cliente no frenan a quien llame a la API directamente. En *Account → Security*:
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
  utils/           Datos (proyectos, tecnologías), validación y envío del formulario,
                   visibilidad de secciones
  test/            Setup de Vitest y simulaciones de APIs del navegador
e2e/               Tests de Playwright (portafolio, contacto, seguridad y accesibilidad)
vercel.json        Cabeceras de seguridad de producción
```

## Rendimiento

Las animaciones de fondo (brillos, gradientes, manchas, olas) se pausan cuando su sección no está en pantalla (`utils/visibility.ts`). Donde se puede, se anima solo con `transform` y `opacity`. Con *reducir movimiento* activado en el sistema operativo, los bucles decorativos se desactivan.
