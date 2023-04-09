/* eslint-disable jsx-a11y/label-has-associated-control */
// ^^^ These are being followed, the linter just requires manual
// configuration to understand that the label is associated with :/
import { Page } from 'main/types';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import styled from 'styled-components';
import { useDebounce } from 'use-debounce';
import { AdvancedEditor } from './AdvancedEditor';
import { ShortSecondaryButton, StartStopButton } from './components/buttons';
import Input from './components/input';
import Toggle from './components/toggle';
import { LeftPanel } from './LeftPanel';

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

const SettingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;
  padding: 0 12px;
  margin-bottom: 6px;
`;

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
  const [pages, setPages] = useState<Page[] | null>(null);

  const [debouncedServerPort] = useDebounce(serverPort, 500);
  const [debouncedWebPort] = useDebounce(webPort, 500);
  const [debouncedUseEncryption] = useDebounce(useEncryption, 500);
  const [debouncedUsePassword] = useDebounce(requirePassword, 500);
  const [debouncedPassword] = useDebounce(password, 500);
  const [debouncedPages] = useDebounce(pages, 500);

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
    const getServerPages = async () => {
      const p = await window.streamtabAPI.getPagesFile();
      if (!p) {
        return;
      }
      setPages(p);
    };
    getServerConfig();
    getServerPages();
  }, [showAdvanced]);

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

    if (debouncedPages) {
      window.streamtabAPI.writePagesFile(
        JSON.stringify(debouncedPages, null, 2)
      );
    }
  }, [
    debouncedServerPort,
    debouncedWebPort,
    debouncedUseEncryption,
    debouncedUsePassword,
    debouncedPassword,
    debouncedPages,
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
        {pages !== null && <LeftPanel pages={pages} setPages={setPages} />}
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
            <Toggle
              disabled={serverRunning || serverStarting}
              isOn={useCustomPort}
              onClick={toggleCustomPortClickHandler}
              onKeyDown={toggleCustomPortKeyDownHandler}
              tabIndex={0}
            />
          </SettingWrapper>
          {useCustomPort && !serverRunning && (
            <>
              <Input
                id="serverPort"
                label="Web Socket Port"
                disabled={serverRunning || serverStarting}
                type="number"
                value={serverPort}
                onChange={(e) => setServerPort(parseInt(e.target.value, 10))}
              />
              <Input
                id="webPort"
                label="Web Server Port"
                disabled={serverRunning || serverStarting}
                type="number"
                value={webPort}
                onChange={(e) => setWebPort(parseInt(e.target.value, 10))}
              />
            </>
          )}
          <SettingWrapper>
            <div>Use Encryption</div>
            <Toggle
              disabled={serverRunning || serverStarting}
              isOn={useEncryption}
              onClick={toggleEncryptionClickHandler}
              onKeyDown={toggleEncryptionKeyDownHandler}
              tabIndex={0}
            />
          </SettingWrapper>
          <SettingWrapper>
            <div>Require Password</div>
            <Toggle
              disabled={!useEncryption || serverRunning || serverStarting}
              isOn={requirePassword}
              onClick={togglePasswordClickHandler}
              onKeyDown={togglePasswordKeyDownHandler}
              tabIndex={0}
            />
          </SettingWrapper>
          {requirePassword && !serverRunning && (
            <Input
              id="password"
              label="Password"
              disabled={!useEncryption || serverRunning || serverStarting}
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
