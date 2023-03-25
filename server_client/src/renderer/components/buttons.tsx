import styled from 'styled-components';

export const ShortSecondaryButton = styled.button`
  margin: 2px 8px 0px 8px;
  height: 21px;
  font-size: 12px;
  border-radius: 4px;
  border: none;
  align-self: stretch;
  vertical-align: bottom;
  padding: 0 8px;
  background-color: #fff0;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #ddd;
  }
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

export const StartStopButton = (props: {
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
