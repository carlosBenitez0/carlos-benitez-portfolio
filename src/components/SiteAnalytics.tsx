import { Analytics } from "@vercel/analytics/react";

interface SiteAnalyticsProps {
  // Vercel define VITE_VERCEL_ENV al compilar ("production" o "preview").
  // Fuera de Vercel (local, tests) no existe y no se carga nada.
  vercelEnv?: string;
}

// Vercel Web Analytics: visitas sin cookies ni datos personales. El script
// se sirve desde el mismo dominio (/_vercel/insights), así que entra en la
// CSP sin cambios.
export const SiteAnalytics = ({
  vercelEnv = import.meta.env.VITE_VERCEL_ENV,
}: SiteAnalyticsProps) => (vercelEnv ? <Analytics /> : null);
