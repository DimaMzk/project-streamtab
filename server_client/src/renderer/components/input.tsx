import { HTMLInputTypeAttribute } from 'react';
import styled from 'styled-components';

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

const Input = (props: {
  label: string;
  id: string;
  disabled: boolean;
  value: string | ReadonlyArray<string> | number;
  type: HTMLInputTypeAttribute;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { label, id, disabled, value, onChange, type } = props;

  return (
    <>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <InputBox
        id={id}
        disabled={disabled}
        type={type}
        value={value}
        onChange={onChange}
      />
    </>
  );
};

export default Input;
