/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Lo define Vercel en el build ("production" | "preview" | "development")
  readonly VITE_VERCEL_ENV?: string;
}
