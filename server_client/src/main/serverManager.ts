import { WebSocketServer } from 'ws';
import { consoleLog, consoleError } from './logger';
import {
  handleInitialConnection,
  handleAuth,
  handleRequest,
  handleMacro,
} from './serverjs/message_handler';
import { Button, Page, ConfigFile } from './types';
import {
  streamtabReadConfigFile,
  streamtabReadMacrosFile,
  streamtabReadPagesFile,
  streamtabWriteConfigFile,
  streamtabWriteMacrosFile,
  streamtabWritePagesFile,
} from './fileManager';

export class ServerInstance {
  constructor() {
    this.server = null;
    this.port = null;
    this.config = null;
    this.pages = null;
  }

  serverStart = () => {
    // Get Config
    this.config = streamtabReadConfigFile();
    if (!this.config) {
      consoleError('Failed to read config file');
      return;
    }

    // Get Page Data
    this.pages = streamtabReadPagesFile();
    if (!this.pages) {
      consoleError('Failed to read pages file');
      return;
    }

    this.port = this.config.webSocketPort;
    this.server = new WebSocketServer({ port: this.port });

    this.server.on('connection', (ws) => {
      ws.on('message', (message) => {
        const decodedMessage = message.toString();
        let decodedMessageJson = null;
        try {
          decodedMessageJson = JSON.parse(decodedMessage);
        } catch (e) {
          consoleError('Invalid JSON object');
          return;
        }

        if (!decodedMessageJson.type) {
          consoleError('Invalid message type');
          return;
        }

        // Makes typescript happy
        if (!this.config || !this.pages) {
          consoleError('Server not initialized');
          return;
        }

        switch (decodedMessageJson.type) {
          case 'initial_connection':
            ws.send(handleInitialConnection(this.config));
            break;
          case 'auth': // TODO: Implement
            ws.send(handleAuth(decodedMessageJson));
            break;
          case 'request':
            ws.send(handleRequest(decodedMessageJson, this.config, this.pages));
            break;
          case 'macro':
            ws.send(handleMacro(decodedMessageJson));
            break;
          default:
            consoleError('Invalid message type');
            break;
        }

        consoleLog('message: ', message.toString());
      });
      ws.send('something');
    });
  };

  serverStop = () => {
    this.server?.close();
    this.server = null;
  };

  server: WebSocketServer | null;

  port: number | null;

  config: ConfigFile | null;

  pages: Page[] | null;
}

export const server = new ServerInstance();
