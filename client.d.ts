/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_GITHUB_TOKEN: string;
  // სხვა ცვლადები თუ საჭიროა
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
