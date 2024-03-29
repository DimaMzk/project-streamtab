/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { NetworkInterfaceInfo, networkInterfaces } from 'os';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import {
  streamtabReadConfigFile,
  streamtabReadMacrosFile,
  streamtabReadPagesFile,
  streamtabWriteConfigFile,
  streamtabWriteMacrosFile,
  streamtabWritePagesFile,
} from './fileManager';

import { server } from './serverManager';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.handle('streamtab-read-config-file', () => {
  return streamtabReadConfigFile();
});

ipcMain.handle('streamtab-read-macros-file', () => {
  return streamtabReadMacrosFile();
});

ipcMain.handle('streamtab-read-pages-file', () => {
  return streamtabReadPagesFile();
});

ipcMain.handle('streamtab-write-config-file', (_, config: string) => {
  return streamtabWriteConfigFile(config);
});

ipcMain.handle('streamtab-write-macros-file', (_, macros: string) => {
  return streamtabWriteMacrosFile(macros);
});

ipcMain.handle('streamtab-write-pages-file', (_, pages: string) => {
  return streamtabWritePagesFile(pages);
});

ipcMain.handle('streamtab-start-server', () => {
  return server.serverStart();
});

ipcMain.handle('streamtab-stop-server', () => {
  return server.serverStop();
});

ipcMain.handle('streamtab-get-server-status', () => {
  return {
    isRunning: server.server !== null,
    webSocketPort: server.port,
    webServerPort: 8081,
    ip: '192.168.1.159',
  };
});

ipcMain.handle('streamtab-get-server-ip', () => {
  const nets = networkInterfaces();

  if (!nets) {
    return null;
  }

  const results: NetworkInterfaceInfo[][] = [];
  const objectNets = Object.keys(nets);

  objectNets.forEach((name) => {
    const net = nets[name];
    if (net) {
      results.push(
        net.filter((details) => details.family === 'IPv4' && !details.internal)
      );
    }
  });

  if (results.length === 0) {
    return null;
  }
  return results[0][0].address;
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 778,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
