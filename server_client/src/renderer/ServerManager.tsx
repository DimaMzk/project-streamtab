import { useState } from 'react';
import QRCode from 'react-qr-code';

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
    <div
      style={{
        display: 'flex',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'blue',
        }}
      >
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
          <QRCode
            value={`http://streamtab.dmaizik.ca/webclient/?ip=${serverIp}&port=${serverPort}`}
            size={256}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="Q"
          />
        )}
        {serverError && <div>Server error: {serverError}</div>}
      </div>
      <div
        style={{
          width: '274px',
          height: '100%',
          backgroundColor: 'red',
          textAlign: 'center',
          flexBasis: '274px',
        }}
      >
        <div
          style={{
            width: '100%',
            padding: '8px',
          }}
        >
          {serverRunning && (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '0',
                width: '258px',
              }}
            >
              <QRCode
                value={`http://streamtab.dmaizik.ca/webclient/?ip=${serverIp}&port=${serverPort}`}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="Q"
                size={250}
                style={{
                  margin: '4px 4px 0 4px',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServerManager;
