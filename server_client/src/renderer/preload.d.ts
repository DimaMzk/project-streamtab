import { Channels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: Channels,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: Channels, func: (...args: unknown[]) => void): void;
      };
    };
    streamtabAPI: {
      getConfigFile: () => Promise<string | null>;
      getMacrosFile: () => Promise<string | null>;
      getPagesFile: () => Promise<string | null>;
      writeConfigFile: (config: string) => void;
      writeMacrosFile: (macros: string) => void;
      writePagesFile: (pages: string) => void;
    };
  }
}

export {};
