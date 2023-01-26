/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import styled from 'styled-components';

export interface Page {
  id: string;
  height: number;
  width: number;
  background_color: string | null;
  background_image: string | null;
  buttons: Button[];
  name: string;
}

interface Button {
  x: number;
  y: number;
  name: string;
  macro?: Macro;
  page_id?: string;
  value?: string; // TODO: Hmmmm
}

interface Macro {
  type: string;
  id: string;
}

const ButtonGrid = styled.div<{
  colCount: number;
  rowCount: number;
  backgroundColor: string | null;
  backgroundImage: string | null;
}>`
  height: 100vh;
  border-radius: 12px;
  display: grid;
  grid-template-columns: repeat(${(props) => props.colCount}, 1fr);
  grid-template-rows: repeat(${(props) => props.rowCount}, 1fr);
  grid-gap: 1px;
  background-color: ${(props) => props.backgroundColor || 'grey'};
  background-image: ${(props) => props.backgroundImage || 'none'};
  color: #444;
  // we want the grid to be centered
  justify-content: center;
  align-items: center;
  // we want to items in the grid to be the same size
  // and to fill the grid
  justify-items: stretch;
  align-items: stretch;
`;

const ButtonStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: #fff;
  // hover
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #ccc;
  }
`;

export const LeftPanel = (props: { page: Page }) => {
  const { page } = props;
  // make a grid colCount x rowCount
  return (
    <ButtonGrid
      colCount={page.width}
      rowCount={page.height}
      backgroundColor={page.background_color}
      backgroundImage={page.background_image}
    >
      {page.buttons.map((button) => (
        <ButtonStyled
          style={{
            gridColumn: button.x + 1,
            gridRow: button.y + 1,
          }}
        >
          {button.name}
        </ButtonStyled>
      ))}
    </ButtonGrid>
  );
};

export default LeftPanel;
