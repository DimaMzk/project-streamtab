declare global {
  interface Window {
    streamtabAPI: {
      getConfigFile: () => Promise<Config | null>;
      getMacrosFile: () => Promise<string | null>;
      getPagesFile: () => Promise<Page[] | null>;
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
  webSocketPort: number;
  webServerPort: number;
  ip: string;
}

export interface Config {
  password: string;
  passwordRequired: boolean;
  useSecureProtocol: boolean;
  webSocketPort: number;
  webServerPort: number;
}

export interface Page {
  id: string;
  height: number;
  width: number;
  background_color: string | null;
  background_image: string | null;
  buttons: Button[];
  name: string;
}

export interface Button {
  x: number;
  y: number;
  name: string;
  macro?: Macro;
  page_id?: string;
  value?: string; // TODO: Hmmmm
}

export interface Macro {
  type: string;
  id: string;
}

export {};
