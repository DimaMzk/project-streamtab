import styled from 'styled-components';

const ToggleWrapper = styled.div<{
  on: boolean;
  disabled: boolean;
}>`
  width: 42px;
  height: 24px;
  border-radius: 12px;
  background-color: ${(props) =>
    // eslint-disable-next-line no-nested-ternary
    props.disabled
      ? props.on
        ? 'darkgreen'
        : 'darkred'
      : props.on
      ? 'green'
      : 'red'};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) => (props.on ? 'flex-end' : 'flex-start')};
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

const Toggle = (props: {
  disabled: boolean;
  isOn: boolean;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  tabIndex: number;
}) => {
  const { disabled, isOn, onClick, onKeyDown, tabIndex } = props;
  return (
    <ToggleWrapper
      disabled={disabled}
      on={isOn}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="switch"
      aria-checked={isOn}
      tabIndex={tabIndex}
    >
      <ToggleSwitchThing />
    </ToggleWrapper>
  );
};

export default Toggle;
