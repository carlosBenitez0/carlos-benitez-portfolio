import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTerminal, FaChevronRight, FaChevronDown } from "react-icons/fa";

type TerminalCommand = {
  prompt: string;
  response: string;
  language: string;
};

export const AITerminal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  const commands: TerminalCommand[] = [
    {
      prompt: `[Uso de useEffect con API]

        Ejemplo de consumo de PokeAPI en React con TypeScript:
        - Fetch con useEffect
        - Manejo de estados de carga y error
        - Tipado estricto
        - Búsqueda con debounce
        - Interfaz de usuario reactiva`,
      response:
        "```typescript\ninterface Pokemon {\n  id: number;\n  name: string;\n  sprites: { front_default: string };\n  types: { type: { name: string } }[];\n}\n\nexport function PokeDex() {\n  const [pokemon, setPokemon] = useState<Pokemon | null>(null);\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState<string | null>(null);\n  const [search, setSearch] = useState('pikachu');\n\n  useEffect(() => {\n    const fetchPokemon = async () => {\n      if (!search.trim()) return;\n      \n      setLoading(true);\n      setError(null);\n      \n      try {\n        const response = await fetch(\n          `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`\n        );\n        \n        if (!response.ok) throw new Error('Pokémon no encontrado');\n        \n        const data = await response.json();\n        setPokemon(data);\n      } catch (err) {\n        setError(err instanceof Error ? err.message : 'Error al buscar el Pokémon');\n        setPokemon(null);\n      } finally {\n        setLoading(false);\n      }\n    };\n\n    const debounceTimer = setTimeout(fetchPokemon, 500);\n    return () => clearTimeout(debounceTimer);\n  }, [search]);\n\n  if (loading) return <div>Cargando...</div>;\n  if (error) return <div>Error: {error}</div>;\n\n  return (\n    <div>\n      <input\n        type=\"text\"\n        value={search}\n        onChange={(e) => setSearch(e.target.value)}\n        placeholder=\"Buscar Pokémon...\"\n      />\n      {pokemon && (\n        <div>\n          <h2>{pokemon.name.toUpperCase()}</h2>\n          <img src={pokemon.sprites.front_default} alt={pokemon.name} />\n          <p>Tipo: {pokemon.types.map(t => t.type.name).join(', ')}</p>\n        </div>\n      )}\n    </div>\n  );\n}\n```",
      language: "typescript",
    },
    {
      prompt: `[Estructura de Proyecto Next.js]

Estoy comenzando un proyecto profesional con Next.js y necesito una estructura de carpetas escalable que incluya:
- Enrutamiento con App Router
- Manejo de estados globales
- Estilos y temas
- Configuración de API
- Autenticación
- Testing
- Configuración de despliegue

Proporciona una estructura detallada con explicaciones.`,
      response:
        "```\nmy-next-app/\n├── app/\n│   ├── (auth)/                  # Rutas de autenticación\n│   │   ├── login/\n│   │   └── register/\n│   ├── (dashboard)/            # Rutas protegidas\n│   │   ├── page.tsx\n│   │   └── layout.tsx\n│   ├── api/                    # API Routes\n│   │   └── [...route.ts]       # API handlers\n│   ├── globals.css\n│   └── layout.tsx\n│\n├── components/                 # Componentes reutilizables\n│   ├── ui/                     # Componentes de UI (shadcn/ui)\n│   └── shared/                 # Componentes compartidos\n│\n├── lib/                       # Utilidades y configuraciones\n│   ├── api/                   # Clientes API\n│   ├── auth.ts                # Configuración de autenticación\n│   └── utils.ts               # Funciones de utilidad\n│\n├── store/                     # Estado global (Zustand/Redux)\n│   └── useStore.ts\n│\n├── styles/                    # Estilos globales\n│   ├── theme/\n│   └── globals.css\n│\n├── public/                    # Assets estáticos\n│   ├── images/\n│   └── favicon.ico\n│\n├── tests/                     # Pruebas\n│   ├── unit/\n│   └── e2e/\n│\n├── .github/                   # GitHub workflows\n│   └── workflows/\n│\n├── .env.local                 # Variables de entorno\n├── next.config.js\n├── package.json\n└── tsconfig.json\n```",
      language: "markdown",
    },
    {
      prompt: `[IA para Desarrolladores Web 2025]

Como desarrollador web, ¿cómo puedo aprovechar la IA en mi flujo de trabajo actual? Incluye:
- Herramientas de IA para desarrollo
- Automatización de tareas
- Mejores prácticas de prompts
- Tendencias actuales
- Código más eficiente con IA\n\nProporciona ejemplos prácticos.`,
      response:
        '```markdown\n# IA para Desarrolladores Web en 2025\n\n## 🔧 Herramientas Esenciales\n- **GitHub Copilot X**: Asistente de código en tiempo real\n- **ChatGPT-4o**: Generación de código y resolución de problemas\n- **Windsurf**: Asistente de desarrollo integrado\n- **Tabnine**: Autocompletado de código con IA\n\n## 🚀 Automatización Efectiva\n\n### Ejemplo 1: Generación de componentes\n"Crea un componente React TypeScript para un carrito de compras con:\n- Estado global con Zustand\n- Animaciones con Framer Motion\n- Diseño responsive\n- Accesibilidad WCAG"\n\n## 💡 Mejores Prácticas de Prompts\n\n1. **Sé específico**: \n   ❌ "Haz un formulario"\n   ✅ "Crea un formulario de registro con validación que incluya: email, contraseña y confirmación."\n\n2. **Proporciona contexto**:\n   "Estoy trabajando en una aplicación de comercio electrónico con Next.js 14..."\n\n## 🚀 Tendencias 2025\n- **AI-enhanced development**\n- **No-code/Low-code con IA**\n- **AI-powered debugging**\n- **Documentación automática**\n```',
      language: "markdown",
    },
  ];

  useEffect(() => {
    // Reset scroll position to top when changing tabs
    if (terminalRef.current) {
      terminalRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const activeCommand = commands[activeTab];

  return (
    <div className="overflow-hidden rounded-lg border border-cbpgray-700/50 bg-cbpgray-800/50">
      {/* Terminal header */}
      <div
        className="flex cursor-pointer items-center justify-between bg-cbpgray-800/80 px-4 py-2.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <FaTerminal className="text-cbpviolet-400" />
          <span className="text-sm font-medium text-cbpgray-200">
            AI Terminal
          </span>
          <div className="ml-2 flex gap-1">
            {commands.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab(index);
                }}
                className={`h-2 w-2 rounded-full transition-colors ${activeTab === index ? "bg-cbpviolet-400" : "bg-cbpgray-600"}`}
                aria-label={`View example ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-cbpgray-400">
            {activeTab + 1}/{commands.length}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <FaChevronDown className="text-cbpgray-400" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              ref={terminalRef}
              // Región con scroll: alcanzable y desplazable con el teclado
              tabIndex={0}
              role="region"
              aria-label="Ejemplo de prompt y respuesta de IA"
              className="max-h-96 overflow-y-auto p-4 font-mono text-sm"
            >
              {/* Input */}
              <div className="mb-4">
                <div className="flex items-start">
                  <div className="mt-2">
                    <div className="mb-1 text-xs font-medium text-cbpgray-400">
                      <span className="mr-2 text-cbpviolet-400">$</span>Ejemplo
                      de prompt profesional:
                    </div>
                    <div className="rounded bg-cbpgray-800/50 p-4 font-mono text-sm text-cbpgray-300">
                      {activeCommand.prompt}
                    </div>
                  </div>
                </div>
              </div>

              {/* Output */}
              <div className="relative mt-6">
                <div className="mb-2 text-xs font-medium text-cbpgray-400">
                  Ejemplo de respuesta de IA:
                </div>
                <pre
                  tabIndex={0}
                  role="region"
                  aria-label="Código de la respuesta de IA"
                  className="mt-2 overflow-x-auto rounded bg-cbpgray-900/50 p-4 text-cbpgray-100"
                >
                  <code>
                    {activeCommand.response
                      .replace(/```[\w]*\n?|```$/g, "")
                      .trim()}
                  </code>
                </pre>
              </div>

              <div className="mt-4 flex items-center text-xs text-cbpgray-400">
                <FaChevronRight className="mr-1.5 inline-block h-3 w-3 text-cbpviolet-400" />
                <span>
                  Prueba estos ejemplos en tu asistente de IA preferido
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
