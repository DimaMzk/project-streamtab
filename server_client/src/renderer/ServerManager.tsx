import { useState } from 'react';

export const ServerManager = () => {
  const [serverRunning, setServerRunning] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverPort, setServerPort] = useState(0);
  const [serverIp, setServerIp] = useState('0.0.0.0');

  const startServer = async () => {
    await window.streamtabAPI.startServer();
    const ip = await window.streamtabAPI.getServerIp();
    if (ip) {
      setServerIp(ip);
    }
    const port = await window.streamtabAPI.getConfigFile();
    if (port) {
      setServerPort(port.PORT);
    }
  };

  const stopServer = async () => {
    await window.streamtabAPI.stopServer();
  };

  const getServerStatus = async () => {
    const status = await window.streamtabAPI.getServerStatus();
    if (status !== null) {
      setServerRunning(status.isRunning);
    }
  };
  setInterval(getServerStatus, 500);

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <button
          type="button"
          onClick={startServer}
          style={{
            marginRight: '8px',
          }}
        >
          Start Server
        </button>
        <button type="button" onClick={stopServer}>
          Stop Server
        </button>
      </div>
      {serverRunning && (
        <div>
          Server is running <br /> navigate to
          http://streamtab.dmaizik.ca/webclient/?ip={serverIp}&port={serverPort}{' '}
          <br />
          On another device on the same network to use StreamTab
        </div>
      )}
      {serverError && <div>Server error: {serverError}</div>}
    </div>
  );
};

export default ServerManager;
