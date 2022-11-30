declare global {
  interface Window {
    streamtabAPI: {
      getConfigFile: () => Promise<Config | null>;
      getMacrosFile: () => Promise<string | null>;
      getPagesFile: () => Promise<string | null>;
      writeConfigFile: (config: string) => Promise<boolean | null>;
      writeMacrosFile: (macros: string) => Promise<boolean | null>;
      writePagesFile: (pages: string) => Promise<boolean | null>;
      startServer: () => Promise<boolean | null>;
      stopServer: () => Promise<boolean | null>;
      getServerStatus: () => Promise<ServerStatus | null>;
      getServerIp: () => Promise<string | null>;
    };
  }
}

export interface ServerStatus {
  isRunning: boolean;
  pid: number;
}

export interface Config {
  PASSWORD: string;
  PASSWORD_REQUIRED: boolean;
  USE_SECURE_PROTOCOL: boolean;
  PORT: number;
}

export {};
