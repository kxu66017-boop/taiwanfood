/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TAIWANFOOD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly taiwanfood: string
  }
}
