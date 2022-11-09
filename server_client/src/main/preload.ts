import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});

contextBridge.exposeInMainWorld('streamtabAPI', {
  getConfigFile: async () => {
    return ipcRenderer.invoke('streamtab-read-config-file');
  },
  writeConfigFile: (config: string) => {
    // console.log("writingConfigFile");
    // fs.writeFileSync("config.json", config);
  },
});

contextBridge.exposeInMainWorld('streamtabAPI', {
  getMacrosFile: async () => {
    return ipcRenderer.invoke('streamtab-read-macros-file');
  },
  writeMacrosFile: (config: string) => {
    // console.log("writingConfigFile");
    // fs.writeFileSync("config.json", config);
  },
});

contextBridge.exposeInMainWorld('streamtabAPI', {
  getMacrosFile: async () => {
    return ipcRenderer.invoke('streamtab-read-pagest-file');
  },
  writePagesFile: (config: string) => {
    // console.log("writingConfigFile");
    // fs.writeFileSync("config.json", config);
  },
});
