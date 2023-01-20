import styled from 'styled-components';

// NOTE: More buttons will be here soon
// eslint-disable-next-line import/prefer-default-export
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
  // hover
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #ddd;
  }
  // border: 1px solid #ccc;
`;
