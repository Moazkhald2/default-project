interface ImportMetaEnv {
  MODE?: string;
  [key: string]: unknown;
}

interface ImportMeta {
  readonly env?: ImportMetaEnv;
}
