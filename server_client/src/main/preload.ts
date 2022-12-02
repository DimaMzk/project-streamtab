import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('streamtabAPI', {
  getConfigFile: async () => {
    return ipcRenderer.invoke('streamtab-read-config-file');
  },
  writeConfigFile: async (config: string) => {
    return ipcRenderer.invoke('streamtab-write-config-file', config);
  },
  getMacrosFile: async () => {
    return ipcRenderer.invoke('streamtab-read-macros-file');
  },
  writeMacrosFile: async (macros: string) => {
    return ipcRenderer.invoke('streamtab-write-macros-file', macros);
  },
  getPagesFile: async () => {
    return ipcRenderer.invoke('streamtab-read-pages-file');
  },
  writePagesFile: async (pages: string) => {
    return ipcRenderer.invoke('streamtab-write-pages-file', pages);
  },
  startServer: async () => {
    return ipcRenderer.invoke('streamtab-start-server');
  },
  stopServer: async () => {
    return ipcRenderer.invoke('streamtab-stop-server');
  },
  getServerStatus: async () => {
    return ipcRenderer.invoke('streamtab-get-server-status');
  },
  getServerIp: async () => {
    return ipcRenderer.invoke('streamtab-get-server-ip');
  },
});
