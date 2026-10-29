// jsdom no implementa matchMedia ni IntersectionObserver: estas versiones
// controlables permiten simular el ancho de pantalla, "reducir movimiento",
// el tema del sistema y qué elementos están visibles.

// --- matchMedia -----------------------------------------------------------

let viewportWidth = 1024;
let reducedMotion = false;
let systemColorScheme: "light" | "dark" = "dark";
const mediaLists = new Map<string, FakeMediaQueryList>();

const evaluate = (query: string) => {
  const maxWidth = query.match(/max-width:\s*(\d+)px/);
  if (maxWidth) return viewportWidth <= Number(maxWidth[1]);
  if (query.includes("prefers-reduced-motion: reduce")) return reducedMotion;
  const scheme = query.match(/prefers-color-scheme:\s*(light|dark)/);
  if (scheme) return systemColorScheme === scheme[1];
  return false;
};

class FakeMediaQueryList extends EventTarget {
  readonly media: string;
  matches: boolean;
  onchange = null;

  constructor(media: string) {
    super();
    this.media = media;
    this.matches = evaluate(media);
  }

  addListener(listener: () => void) {
    this.addEventListener("change", listener);
  }

  removeListener(listener: () => void) {
    this.removeEventListener("change", listener);
  }

  refresh() {
    const next = evaluate(this.media);
    if (next === this.matches) return;
    this.matches = next;
    this.dispatchEvent(new Event("change"));
  }
}

export const installMatchMedia = () => {
  window.matchMedia = (query: string) => {
    let list = mediaLists.get(query);
    if (!list) {
      list = new FakeMediaQueryList(query);
      mediaLists.set(query, list);
    }
    return list as unknown as MediaQueryList;
  };
};

export const setViewportWidth = (width: number) => {
  viewportWidth = width;
  mediaLists.forEach((list) => list.refresh());
};

export const setReducedMotion = (value: boolean) => {
  reducedMotion = value;
  mediaLists.forEach((list) => list.refresh());
};

export const setSystemColorScheme = (scheme: "light" | "dark") => {
  systemColorScheme = scheme;
  mediaLists.forEach((list) => list.refresh());
};

// --- IntersectionObserver -------------------------------------------------

export class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly observed = new Set<Element>();
  readonly callback: IntersectionObserverCallback;
  readonly options?: IntersectionObserverInit;

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.callback = callback;
    this.options = options;
    FakeIntersectionObserver.instances.push(this);
  }

  observe(element: Element) {
    this.observed.add(element);
  }

  unobserve(element: Element) {
    this.observed.delete(element);
  }

  disconnect() {
    this.observed.clear();
  }

  takeRecords() {
    return [];
  }
}

// Simula que `element` entra (true) o sale (false) del viewport.
export const setIntersecting = (element: Element, isIntersecting: boolean) => {
  FakeIntersectionObserver.instances
    .filter((observer) => observer.observed.has(element))
    .forEach((observer) =>
      observer.callback(
        [{ target: element, isIntersecting } as IntersectionObserverEntry],
        observer as unknown as IntersectionObserver,
      ),
    );
};

export const installIntersectionObserver = () => {
  window.IntersectionObserver =
    FakeIntersectionObserver as unknown as typeof IntersectionObserver;
};

export const resetBrowserMocks = () => {
  viewportWidth = 1024;
  reducedMotion = false;
  systemColorScheme = "dark";
  mediaLists.forEach((list) => list.refresh());
  // Los observers no se borran: utils/visibility guarda el suyo a nivel de
  // módulo y debe seguir recibiendo eventos entre tests.
};

// --- <dialog> ---------------------------------------------------------------
// jsdom no implementa showModal/close: bastan el atributo open y el evento
// close, que es lo que usan los componentes.
export const installDialog = () => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
};
