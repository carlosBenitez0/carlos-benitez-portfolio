// Escena sobre las olas del formulario de contacto: una canoa (cayuco) con
// un remero que rema y pájaros cruzando el cielo. Todo es decorativo y se
// anima solo con transform/opacity desde index.css (capas separadas para que
// la GPU las componga sin recalcular el layout del SVG).

// Las tres capas de la canoa comparten la misma caja y el mismo viewBox
// (120x40): el casco, el remero (se inclina desde la cadera) y, dentro del
// remero, brazos y remo (giran desde el hombro). El casco conserva la quilla
// en y=33, la medida con la que se calibró su altura sobre la ola.
const VIEWBOX = "0 0 120 40";

export const Canoe = () => (
  <div className="contact-canoe" aria-hidden="true">
    {/* Casco */}
    <svg viewBox={VIEWBOX} className="canoe-layer">
      <defs>
        <linearGradient id="canoe-hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c77dff" />
          <stop offset="55%" stopColor="#9d4edd" />
          <stop offset="100%" stopColor="#5a189a" />
        </linearGradient>
      </defs>
      <path
        d="M1 9 Q12 16 24 17 L96 17 Q108 16 119 9 Q108 32 60 33 Q12 32 1 9 Z"
        fill="url(#canoe-hull)"
      />
      {/* Interior del cayuco, visible por encima de la borda */}
      <path
        d="M7 11.5 Q18 15.6 30 16.2 L90 16.2 Q102 15.6 113 11.5 Q100 18.6 60 18.9 Q20 18.6 7 11.5 Z"
        fill="#3c096c"
      />
      {/* Veta de la madera */}
      <path
        d="M9 16 Q30 26.5 60 27.5 Q90 26.5 111 16"
        fill="none"
        stroke="#e0aaff"
        strokeOpacity=".35"
        strokeWidth=".9"
      />
      {/* Borda iluminada */}
      <path
        d="M1 9 Q12 16 24 17 L96 17 Q108 16 119 9"
        fill="none"
        stroke="#f2d9ff"
        strokeOpacity=".8"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>

    {/* Remero: cuerpo y sombrero; se inclina con cada palada */}
    <div className="canoe-layer canoe-rower">
      <svg viewBox={VIEWBOX} className="canoe-layer">
        <path
          d="M70 17.5 Q69.5 9 72 5 Q74.5 3.4 77 5 Q79.5 9 79 17.5 Z"
          fill="#e0aaff"
        />
        <circle cx="74.5" cy="-0.6" r="3.3" fill="#f2d9ff" />
        {/* Sombrero de pescador */}
        <ellipse cx="74.5" cy="-3.1" rx="6.4" ry="1.3" fill="#c77dff" />
        <path d="M71.4 -3.4 Q74.5 -8.4 77.6 -3.4 Z" fill="#c77dff" />
      </svg>

      {/* Brazos y remo: giran desde el hombro (75, 6) */}
      <div className="canoe-layer canoe-paddle">
        <svg viewBox={VIEWBOX} className="canoe-layer">
          <path
            d="M75 6 L80.7 1 M75 6 L73.8 12"
            stroke="#f2d9ff"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <path
            d="M84.5 -5 L60.5 33"
            stroke="#e0aaff"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M62.6 29.6 L56.6 39.2 Q55 41.4 56.4 38.4 L60.2 29.4 Z"
            fill="#c77dff"
            stroke="#e0aaff"
            strokeWidth=".8"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>

    {/* Salpicadura al sacar el remo del agua */}
    <svg viewBox={VIEWBOX} className="canoe-layer canoe-splash">
      <circle cx="50" cy="29" r="1.1" fill="#f2d9ff" />
      <circle cx="46.5" cy="26" r=".8" fill="#f2d9ff" />
      <circle cx="53" cy="25.5" r=".7" fill="#e0aaff" />
    </svg>
  </div>
);

// Pájaros con alas articuladas: cada ala tiene brazo y punta, que giran desde
// el hombro y el codo; la punta va con un pequeño retraso (efecto látigo) y
// el cuerpo sube en cada golpe hacia abajo. La capa exterior cruza el cielo.
const BIRDS = [
  { top: "9%", size: 40, duration: 19, delay: -3, flap: 0.62, opacity: 0.9 },
  { top: "18%", size: 30, duration: 24, delay: -14, flap: 0.52, opacity: 0.75 },
  { top: "5%", size: 24, duration: 29, delay: -22, flap: 0.46, opacity: 0.6 },
];

const Wing = ({ side }: { side: "left" | "right" }) => (
  <div className={`bird-wing bird-wing-${side}`}>
    <div className="bird-wing-inner">
      <svg viewBox="0 0 100 24" preserveAspectRatio="none">
        <path d="M100 5 Q50 -2 0 4 L0 13 Q50 14 100 19 Z" fill="#e0aaff" />
      </svg>
      <div className="bird-wing-outer">
        <svg viewBox="0 0 100 24" preserveAspectRatio="none">
          <path d="M100 4 Q55 -1 0 13 Q55 12 100 13 Z" fill="#e0aaff" />
        </svg>
      </div>
    </div>
  </div>
);

export const Birds = () => (
  <>
    {BIRDS.map((bird) => (
      <div
        key={bird.top}
        className="contact-bird"
        aria-hidden="true"
        style={
          {
            top: bird.top,
            opacity: bird.opacity,
            animationDuration: `${bird.duration}s`,
            animationDelay: `${bird.delay}s`,
            "--bird-size": `${bird.size}px`,
            "--bird-flap": `${bird.flap}s`,
          } as React.CSSProperties
        }
      >
        <div className="bird-bob">
          <Wing side="left" />
          <Wing side="right" />
          <span className="bird-body" />
        </div>
      </div>
    ))}
  </>
);
