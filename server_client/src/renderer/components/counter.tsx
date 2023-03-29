import styled from 'styled-components';

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CounterLabel = styled.label`
  margin: 2px 12px 2px 12px;
  font-size: 16px;
  // Make text aligned vertically with the input box
  align-self: center;
`;

const IncrementButton = styled.button`
  margin: 2px 0px 2px 0px;
  height: 42px;
  font-size: 16px;
  font-weight: bold;
  align-self: center;
  vertical-align: bottom;
  padding: 0 8px;
  border: 1px solid #ccc;
  width: 30px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  &:hover {
    background-color: #ccc;
  }
`;

const DecrementButton = styled.button`
  margin: 2px 0px 2px 0px;
  height: 42px;
  font-size: 16px;
  font-weight: bold;
  align-self: center;
  vertical-align: bottom;
  padding: 0 8px;
  border: 1px solid #ccc;
  width: 30px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  &:hover {
    background-color: #ccc;
  }
`;

const CounterInputBox = styled.input`
  margin: 2px 0px 2px 0px;
  height: 40px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 0px;
  border: none;
  align-self: center;
  vertical-align: bottom;
  padding: 0 8px;
  appearance: textfield;
  border: 1px solid #ccc;
  width: 30px;
  text-align: center;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const CounterInput = (props: {
  label: string;
  id: string;
  min: number;
  max: number;
  disabled: boolean;
  value: string | ReadonlyArray<string> | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  step: number;
}) => {
  const { label, id, disabled, value, onChange, min, max, step } = props;

  return (
    <FlexWrapper>
      <CounterLabel htmlFor={id}>{label}</CounterLabel>
      <DecrementButton>-</DecrementButton>
      <CounterInputBox
        id={id}
        disabled={disabled}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        step={step}
      />
      <IncrementButton>+</IncrementButton>
    </FlexWrapper>
  );
};

export default CounterInput;
