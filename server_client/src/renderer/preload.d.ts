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
      writeConfigFile: (config: string) => Promise<boolean | null>;
      writeMacrosFile: (macros: string) => Promise<boolean | null>;
      writePagesFile: (pages: string) => Promise<boolean | null>;
    };
  }
}

export {};
