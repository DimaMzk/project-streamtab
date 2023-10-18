import styled from 'styled-components';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CounterLabel = styled.label`
  margin: 2px 12px 2px 12px;
  font-size: 15px;
  align-self: center;
  color: #202020;
`;

const IncrementButton = styled.button`
  margin: 2px 0px 2px 0px;
  height: 42px;
  align-self: center;
  vertical-align: bottom;
  width: 30px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;
  border: 1px solid #0000002b;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 100ms;
  &:hover {
    background-color: #0000002b;
  }
`;

const DecrementButton = styled.button`
  margin: 2px 0px 2px 0px;
  height: 42px;
  align-self: center;
  vertical-align: bottom;
  width: 30px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;
  border: 1px solid #0000002b;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  background-color: white;
  color: #202020;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 100ms;
  &:hover {
    background-color: #0000002b;
  }
`;

const CounterInputBox = styled.input`
  margin: 2px 0px 2px 0px;
  height: 40px;
  font-size: 16px;
  font-family: Roboto, sans-serif;
  border-radius: 0px;
  border: 1px solid #0000002b;
  border-left: none;
  border-right: none;
  align-self: center;
  vertical-align: bottom;
  padding: 0 8px;
  appearance: textfield;
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
  value: number;
  setValue: (v: number) => void;
  step: number;
}) => {
  const { label, id, disabled, value, setValue, min, max, step } = props;

  return (
    <FlexWrapper>
      <CounterLabel htmlFor={id}>{label}</CounterLabel>
      <DecrementButton
        onClick={() => {
          setValue(value - 1);
        }}
        disabled={value <= min}
      >
        <MinusIcon />
      </DecrementButton>
      <CounterInputBox
        id={id}
        disabled={disabled}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          let input = parseInt(event.target.value, 10);
          if (Number.isNaN(input)) {
            return;
          }
          if (input < min) {
            input = min;
          } else if (input > max) {
            input = max;
          }

          setValue(input);
        }}
        step={step}
      />
      <IncrementButton
        onClick={() => {
          setValue(value + 1);
        }}
        disabled={value >= max}
      >
        <PlusIcon />
      </IncrementButton>
    </FlexWrapper>
  );
};

export default CounterInput;
