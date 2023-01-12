import { useState } from 'react';
import QRCode from 'react-qr-code';
import styled from 'styled-components';
import { AdvancedEditor } from './AdvancedEditor';
import { ShortSecondaryButton } from './components/buttons';

const StopServerButton = styled.button`
  margin: 8px;
  height: 42px;
  background-color: red;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  border: none;
  align-self: stretch;
  vertical-align: bottom;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: darkred;
  }
`;

const StartServerButton = styled.button`
  margin: 8px;
  height: 42px;
  background-color: green;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  border: none;
  align-self: stretch;
  vertical-align: bottom;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: darkgreen;
  }
`;

const InputBox = styled.input`
  margin: 2px 8px 8px 8px;
  height: 42px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  border: none;
  align-self: stretch;
  vertical-align: bottom;
  padding: 0 8px;
  border: 1px solid #ccc;
`;

const ServerStartingButton = styled.button`
  margin: 8px;
  height: 42px;
  background-color: #014001;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  border: none;
  align-self: stretch;
  vertical-align: bottom;
`;

// styled.div that accepts a boolean prop
const ToggleWrapper = styled.div<{ useCustomPort: boolean; disabled: boolean }>`
  width: 42px;
  height: 24px;
  border-radius: 12px;
  background-color: ${(props) =>
    // eslint-disable-next-line no-nested-ternary
    props.disabled
      ? props.useCustomPort
        ? 'darkgreen'
        : 'darkred'
      : props.useCustomPort
      ? 'green'
      : 'red'};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) =>
    props.useCustomPort ? 'flex-end' : 'flex-start'};
  cursor: pointer;
  padding: 0 2px;
  transition: background-color 0.2s;
`;

const ToggleSwitchThing = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: white;
`;

const SettingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;
  padding: 0 12px;
  margin-bottom: 4px;
`;

export const MainPage = () => {
  const [serverRunning, setServerRunning] = useState(false);
  const [serverStarting, setServerStarting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverPort, setServerPort] = useState(0);
  const [serverIp, setServerIp] = useState('0.0.0.0');
  const [useCustomPort, setUseCustomPort] = useState(false);
  const [useEncryption, setUseEncryption] = useState(false);
  const [requirePassword, setRequirePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const startServer = async () => {
    setServerStarting(true);
    // wait 2 serconds to simulate server startup
    setTimeout(() => {
      setServerStarting(false);
      setServerRunning(true);
    }, 2000);
  };

  const stopServer = async () => {
    setServerRunning(false);
  };

  const toggleField = (
    field: boolean,
    setField: React.Dispatch<React.SetStateAction<boolean>>,
    skipToggle: boolean
  ) => {
    if (skipToggle) {
      return;
    }
    if (field) {
      setField(false);
    } else {
      setField(true);
    }
  };

  if (showAdvanced) {
    return (
      <AdvancedEditor
        serverRunning={serverRunning}
        setShowAdvanced={setShowAdvanced}
      />
    );
  }

  return (
    // Create a page with a right sidebar
    <div
      style={{
        display: 'flex',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: '308px',
          top: 0,
          bottom: 0,
          left: 0,
        }}
      >
        Hello World
      </div>
      <div
        style={{
          width: '300px',
          backgroundColor: '#F6F6F6',
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          top: '8px',
          borderRadius: '8px',
          paddingTop: '8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {serverRunning && (
            <>
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '4px',
                }}
              >
                <QRCode
                  value={`http://${serverIp}:${serverPort}`}
                  size={268}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="Q"
                  style={{
                    margin: '8px 8px 4px 8px',
                  }}
                />
              </div>
              <div>
                <i>
                  http://{serverIp}:{serverPort}
                </i>
              </div>
            </>
          )}
          <SettingWrapper>
            <div>Use Custom Port</div>
            <ToggleWrapper
              disabled={serverRunning || serverStarting}
              useCustomPort={useCustomPort}
              onClick={() => {
                toggleField(
                  useCustomPort,
                  setUseCustomPort,
                  serverRunning || serverStarting
                );
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter') {
                  toggleField(
                    useCustomPort,
                    setUseCustomPort,
                    serverRunning || serverStarting
                  );
                }
              }}
              role="switch"
              aria-checked={useCustomPort}
              tabIndex={0}
            >
              <ToggleSwitchThing />
            </ToggleWrapper>
          </SettingWrapper>
          {useCustomPort && (
            <InputBox
              placeholder="Port Number"
              disabled={serverRunning || serverStarting}
              type="number"
              value={serverPort || 8765}
              onChange={(e) => setServerPort(parseInt(e.target.value, 10))}
            />
          )}
          <SettingWrapper>
            <div>Use Encryption</div>
            <ToggleWrapper
              disabled={serverRunning || serverStarting}
              useCustomPort={useEncryption}
              onClick={() => {
                if (useEncryption) {
                  setRequirePassword(false);
                }
                toggleField(
                  useEncryption,
                  setUseEncryption,
                  serverRunning || serverStarting
                );
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter') {
                  if (useEncryption) {
                    setRequirePassword(false);
                  }
                  toggleField(
                    useEncryption,
                    setUseEncryption,
                    serverRunning || serverStarting
                  );
                }
              }}
              role="switch"
              aria-checked={useEncryption}
              tabIndex={0}
            >
              <ToggleSwitchThing />
            </ToggleWrapper>
          </SettingWrapper>
          <SettingWrapper>
            <div>Require Password</div>
            <ToggleWrapper
              disabled={!useEncryption || serverRunning || serverStarting}
              useCustomPort={requirePassword}
              onClick={() => {
                toggleField(
                  requirePassword,
                  setRequirePassword,
                  !useEncryption || serverRunning || serverStarting
                );
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                // check if keyboard event is enter
                if (e.key === 'Enter') {
                  toggleField(
                    requirePassword,
                    setRequirePassword,
                    !useEncryption || serverRunning || serverStarting
                  );
                }
              }}
              role="switch"
              aria-checked={requirePassword}
              tabIndex={0}
            >
              <ToggleSwitchThing />
            </ToggleWrapper>
          </SettingWrapper>
          {requirePassword && (
            <InputBox
              disabled={!useEncryption || serverRunning || serverStarting}
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <ShortSecondaryButton
              type="button"
              onClick={() => {
                setShowAdvanced(true);
              }}
            >
              Advanced Settings
            </ShortSecondaryButton>
            {/* TODO: Allow one level of nesting */}
            {/* eslint-disable-next-line no-nested-ternary */}
            {serverStarting ? (
              <ServerStartingButton>Starting Server</ServerStartingButton>
            ) : serverRunning ? (
              <StopServerButton type="button" onClick={stopServer}>
                Stop Server
              </StopServerButton>
            ) : (
              <StartServerButton type="button" onClick={startServer}>
                Start Server
              </StartServerButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
