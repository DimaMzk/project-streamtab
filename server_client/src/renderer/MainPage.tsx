/* eslint-disable jsx-a11y/label-has-associated-control */
// ^^^ These are being followed, the linter just requires manual
// configuration to understand that the label is associated with :/
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import styled from 'styled-components';
import { useDebounce } from 'use-debounce';
import { AdvancedEditor } from './AdvancedEditor';
import { ShortSecondaryButton } from './components/buttons';
import {
  ServerStartingButton,
  StopServerButton,
  StartServerButton,
  PageWrapper,
  LeftPanel,
  RightPanelWrapper,
  RightPanelControlsWrapper,
  QRCodeWrapper,
  SettingWrapper,
  ToggleWrapper,
  ToggleSwitchThing,
  InputLabel,
  InputBox,
  RightPanelStartStopWrapper,
  RightPanelStartStopWrappedWrapper,
} from './MainPage_Components';

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
      <LeftPanel>Hello World</LeftPanel>
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
