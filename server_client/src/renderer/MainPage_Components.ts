import styled from 'styled-components';

export const PageWrapper = styled.div`
  display: flex;
`;

export const LeftPanel = styled.div`
  position: absolute;
  right: 308pz;
  top: 0;
  bottom: 0;
  left: 0;
`;

export const RightPanelWrapper = styled.div`
  width: 300px;
  background-color: #f6f6f6;
  position: absolute;
  bottom: 8px;
  right: 8px;
  top: 8px;
  border-radius: 8px;
  padding-top: 8px;
`;

export const RightPanelControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const QRCodeWrapper = styled.div`
  background-color: white;
  border-radius: 4px;
`;

export const RightPanelStartStopWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

export const RightPanelStartStopWrappedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StopServerButton = styled.button`
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

export const StartServerButton = styled.button`
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

export const InputLabel = styled.label`
  margin: 2px 12px 2px 12px;
  font-size: 12px;
  align-self: stretch;
`;

export const InputBox = styled.input`
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

export const ServerStartingButton = styled.button`
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

export const ToggleWrapper = styled.div<{
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

export const ToggleSwitchThing = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: white;
`;

export const SettingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;
  padding: 0 12px;
  margin-bottom: 6px;
`;
