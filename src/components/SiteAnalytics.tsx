import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

interface SiteAnalyticsProps {
  // Vercel define VITE_VERCEL_ENV al compilar ("production" o "preview").
  // Fuera de Vercel (local, tests) no existe y no se carga nada.
  vercelEnv?: string;
}

// Vercel Web Analytics (visitas, sin cookies ni datos personales) y Speed
// Insights (Core Web Vitals de visitantes reales). Los scripts se sirven
// desde el mismo dominio (/_vercel/insights y /_vercel/speed-insights), así
// que entran en la CSP sin cambios.
export const SiteAnalytics = ({
  vercelEnv = import.meta.env.VITE_VERCEL_ENV,
}: SiteAnalyticsProps) =>
  vercelEnv ? (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  ) : null;
