/* eslint-disable jsx-a11y/label-has-associated-control */
// ^^^ These are being followed, the linter just requires manual
// configuration to understand that the label is associated with :/
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import styled from 'styled-components';
import { useDebounce } from 'use-debounce';
import { AdvancedEditor } from './AdvancedEditor';
import { ShortSecondaryButton } from './components/buttons';
import { LeftPanel } from './LeftPanel';

const defaultPage = {
  id: 'home',
  height: 2,
  width: 3,
  background_color: null,
  background_image: null,
  buttons: [
    {
      x: 0,
      y: 0,
      name: 'Configure StreamTab from Desktop App',
    },
    {
      x: 1,
      y: 0,
      name: 'Oh Sure Buddy',
    },
    {
      x: 1,
      y: 1,
      name: 'Gettiy up',
    },
    {
      x: 0,
      y: 1,
      name: 'Poppy Doppy',
    },
    {
      x: 2,
      y: 1,
      name: 'Poppy Doppy 123',
    },
    {
      x: 2,
      y: 0,
      name: 'Poppy Doppy 1324',
    },
  ],
  name: 'Home',
};

const PageWrapper = styled.div`
  display: flex;
`;

const LeftPanelWrapper = styled.div`
  position: absolute;
  right: 308px;
  top: 0;
  bottom: 0;
  left: 0;
`;

const RightPanelWrapper = styled.div`
  width: 300px;
  background-color: #ebecf0;
  position: absolute;
  bottom: 8px;
  right: 8px;
  top: 8px;
  border-radius: 8px;
  padding-top: 8px;
`;

const RightPanelControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const QRCodeWrapper = styled.div`
  background-color: #fdfdfe;
  border-radius: 4px;
`;

const RightPanelStartStopWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const RightPanelStartStopWrappedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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

const InputLabel = styled.label`
  margin: 2px 12px 2px 12px;
  font-size: 12px;
  align-self: stretch;
`;

const InputBox = styled.input`
  margin: 2px 12px 8px 12px;
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

const ToggleWrapper = styled.div<{
  useCustomPort: boolean;
  disabled: boolean;
}>`
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
  background-color: #fdfdfe;
`;

const SettingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;
  padding: 0 12px;
  margin-bottom: 6px;
`;

const StartStopButton = (props: {
  serverStarting: boolean;
  serverRunning: boolean;
  stopServer: () => Promise<void>;
  startServer: () => Promise<void>;
}) => {
  const { serverStarting, serverRunning, stopServer, startServer } = props;
  if (serverStarting) {
    return <ServerStartingButton>Starting Server</ServerStartingButton>;
  }

  if (serverRunning) {
    return (
      <StopServerButton type="button" onClick={stopServer}>
        Stop Server
      </StopServerButton>
    );
  }

  return (
    <StartServerButton type="button" onClick={startServer}>
      Start Server
    </StartServerButton>
  );
};

export const MainPage = () => {
  const [serverRunning, setServerRunning] = useState(false);
  const [serverStarting, setServerStarting] = useState(false);
  const [serverPort, setServerPort] = useState(0);
  const [webPort, setWebPort] = useState(0);
  const [serverIp, setServerIp] = useState('0.0.0.0');
  const [useCustomPort, setUseCustomPort] = useState(false);
  const [useEncryption, setUseEncryption] = useState(false);
  const [requirePassword, setRequirePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [pages, setPages] = useState();

  const [debouncedServerPort] = useDebounce(serverPort, 500);
  const [debouncedWebPort] = useDebounce(webPort, 500);
  const [debouncedUseEncryption] = useDebounce(useEncryption, 500);
  const [debouncedUsePassword] = useDebounce(requirePassword, 500);
  const [debouncedPassword] = useDebounce(password, 500);

  const DEFAULT_WEBSOCKET_PORT = 8765;
  const DEFAULT_WEBSERVER_PORT = 8766;

  const startServer = async () => {
    setServerStarting(true);
    await window.streamtabAPI.startServer();
  };

  const getServerStatus = async () => {
    const status = await window.streamtabAPI.getServerStatus();
    if (!status) {
      return;
    }
    if (status.isRunning) {
      setServerRunning(status.isRunning);
      setServerPort(status.webSocketPort);
      setWebPort(status.webServerPort);
      setServerIp(status.ip);
      setServerStarting(false);
      return;
    }
    setServerRunning(false);
  };
  setInterval(getServerStatus, 500);

  useEffect(() => {
    const getServerConfig = async () => {
      const config = await window.streamtabAPI.getConfigFile();
      if (!config) {
        return;
      }
      setServerPort(config.webSocketPort);
      setWebPort(config.webServerPort);
      setUseEncryption(config.useSecureProtocol);
      setRequirePassword(config.passwordRequired);
      setPassword(config.password);
      setUseCustomPort(
        config.webSocketPort !== DEFAULT_WEBSOCKET_PORT ||
          config.webServerPort !== DEFAULT_WEBSERVER_PORT
      );
    };
    getServerConfig();
  }, []);

  const stopServer = async () => {
    setServerRunning(false);
    await window.streamtabAPI.stopServer();
  };

  useEffect(() => {
    const config = {
      webSocketPort: debouncedServerPort,
      webServerPort: debouncedWebPort,
      useSecureProtocol: debouncedUseEncryption,
      passwordRequired: debouncedUsePassword,
      password: debouncedUsePassword ? debouncedPassword : '',
    };

    window.streamtabAPI.writeConfigFile(JSON.stringify(config, null, 2));
  }, [
    debouncedServerPort,
    debouncedWebPort,
    debouncedUseEncryption,
    debouncedUsePassword,
    debouncedPassword,
  ]);

  if (showAdvanced) {
    return (
      <AdvancedEditor
        serverRunning={serverRunning}
        setShowAdvanced={setShowAdvanced}
      />
    );
  }

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

  const toggleCustomPortClickHandler = () => {
    if (useCustomPort && !(serverRunning || serverStarting)) {
      setServerPort(DEFAULT_WEBSOCKET_PORT);
      setWebPort(DEFAULT_WEBSERVER_PORT);
    }
    toggleField(
      useCustomPort,
      setUseCustomPort,
      serverRunning || serverStarting
    );
  };

  const toggleCustomPortKeyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (useCustomPort && !(serverRunning || serverStarting)) {
        setServerPort(DEFAULT_WEBSOCKET_PORT);
        setWebPort(DEFAULT_WEBSERVER_PORT);
      }
      toggleField(
        useCustomPort,
        setUseCustomPort,
        serverRunning || serverStarting
      );
    }
  };

  const toggleEncryptionClickHandler = () => {
    if (useEncryption) {
      setRequirePassword(false);
    }
    toggleField(
      useEncryption,
      setUseEncryption,
      serverRunning || serverStarting
    );
  };

  const toggleEncryptionKeyDownHandler = (e: React.KeyboardEvent) => {
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
  };

  const togglePasswordClickHandler = () => {
    toggleField(
      requirePassword,
      setRequirePassword,
      !useEncryption || serverRunning || serverStarting
    );
  };

  const togglePasswordKeyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      toggleField(
        requirePassword,
        setRequirePassword,
        !useEncryption || serverRunning || serverStarting
      );
    }
  };

  return (
    <PageWrapper>
      <LeftPanelWrapper>
        <LeftPanel page={defaultPage} />
      </LeftPanelWrapper>
      <RightPanelWrapper>
        <RightPanelControlsWrapper>
          {serverRunning && (
            <>
              <QRCodeWrapper>
                <QRCode
                  value={`http://${serverIp}:${webPort}/?ip=${serverIp}&port=${serverPort}`}
                  size={208}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="Q"
                  style={{
                    margin: '8px 8px 4px 8px',
                  }}
                />
              </QRCodeWrapper>
              <div>
                <i>
                  http://{serverIp}:{webPort}
                </i>
              </div>
            </>
          )}
          <SettingWrapper>
            <div>Use Custom Ports</div>
            <ToggleWrapper
              disabled={serverRunning || serverStarting}
              useCustomPort={useCustomPort}
              onClick={toggleCustomPortClickHandler}
              onKeyDown={toggleCustomPortKeyDownHandler}
              role="switch"
              aria-checked={useCustomPort}
              tabIndex={0}
            >
              <ToggleSwitchThing />
            </ToggleWrapper>
          </SettingWrapper>
          {useCustomPort && !serverRunning && (
            <>
              <InputLabel htmlFor="serverPort">Web Socket Port</InputLabel>
              <InputBox
                id="serverPort"
                disabled={serverRunning || serverStarting}
                type="number"
                value={serverPort}
                onChange={(e) => setServerPort(parseInt(e.target.value, 10))}
              />
              <InputLabel htmlFor="webPort">Web Server Port</InputLabel>
              <InputBox
                id="webPort"
                disabled={serverRunning || serverStarting}
                type="number"
                value={webPort}
                onChange={(e) => setWebPort(parseInt(e.target.value, 10))}
              />
            </>
          )}
          <SettingWrapper>
            <div>Use Encryption</div>
            <ToggleWrapper
              disabled={serverRunning || serverStarting}
              useCustomPort={useEncryption}
              onClick={toggleEncryptionClickHandler}
              onKeyDown={toggleEncryptionKeyDownHandler}
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
              onClick={togglePasswordClickHandler}
              onKeyDown={togglePasswordKeyDownHandler}
              role="switch"
              aria-checked={requirePassword}
              tabIndex={0}
            >
              <ToggleSwitchThing />
            </ToggleWrapper>
          </SettingWrapper>
          {requirePassword && !serverRunning && (
            <>
              <InputLabel htmlFor="password">Password</InputLabel>
              <InputBox
                id="password"
                disabled={!useEncryption || serverRunning || serverStarting}
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}
        </RightPanelControlsWrapper>
        <RightPanelStartStopWrapper>
          <RightPanelStartStopWrappedWrapper>
            <ShortSecondaryButton
              type="button"
              onClick={() => {
                setShowAdvanced(true);
              }}
            >
              Advanced Settings
            </ShortSecondaryButton>
            <StartStopButton
              serverStarting={serverStarting}
              serverRunning={serverRunning}
              stopServer={stopServer}
              startServer={startServer}
            />
          </RightPanelStartStopWrappedWrapper>
        </RightPanelStartStopWrapper>
      </RightPanelWrapper>
    </PageWrapper>
  );
};

export default MainPage;
