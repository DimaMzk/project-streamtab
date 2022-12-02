import { ChildProcess, spawn } from 'child_process';
import path from 'path';
import kill from 'tree-kill';
import { consoleLog, consoleError } from './logger';

export class ServerInstance {
  constructor(pid: number, server: ChildProcess | null) {
    this.pid = pid;
    this.server = server;
    this.restarting = false;
    this.stderr = '';
    this.stdout = '';
  }

  serverStart = () => {
    if (this.pid !== 0) {
      consoleLog('Server already running');
      return;
    }
    const serverPath = path.join(__dirname, 'server.exe');
    const server = spawn(serverPath);
    if (!server.pid) {
      consoleError(`No PID`);
      return;
    }
    this.pid = server.pid;
    this.server = server;
    server.on('exit', (code, signal) => {
      consoleLog(`Server exited with code ${code} and signal ${signal}`);
      this.pid = 0;
      this.server = null;
    });

    consoleLog(`Server started with PID ${this.pid}`);
  };

  serverStop = () => {
    // kill the process + all children
    if (this.pid === 0) {
      // no server running
      return;
    }
    consoleLog(`Stopping server with PID ${this.pid}`);
    kill(this.pid, 'SIGTERM', (err) => {
      if (err) {
        consoleError(`Failed to kill server with PID ${this.pid}`);
      }
    });
  };

  pid: number;

  server: ChildProcess | null;

  restarting: boolean;

  stdout: string;

  stderr: string;
}

export const server = new ServerInstance(0, null);
