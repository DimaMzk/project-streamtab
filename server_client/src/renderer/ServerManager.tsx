import { useState } from 'react';

export const ServerManager = () => {
  const [serverRunning, setServerRunning] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // TODO: In a proper implementation, we'll use Electron to manage the server
  // and use IPC to query it's status when this component loads.
  // We'll do this for now though.

  const startServer = async () => {
    // This is fake for npw lol
    setServerRunning(true);
    setServerError(null);
  };

  const stopServer = async () => {
    // This is fake for now lol
    setServerRunning(false);
    setServerError(null);
  };

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
      {serverRunning && <div>Server is running</div>}
      {serverError && <div>Server error: {serverError}</div>}
    </div>
  );
};

export default ServerManager;
