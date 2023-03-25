/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Page } from '../main/types';
import Toggle from './components/toggle';

const ButtonGrid = styled.div<{
  colCount: number;
  rowCount: number;
  backgroundColor: string | null;
  backgroundImage: string | null;
}>`
  position: absolute;
  top: 4px;
  left: 4px;
  bottom: 58px;
  right: 4px;
  display: grid;
  grid-template-columns: repeat(${(props) => props.colCount}, 1fr);
  grid-template-rows: repeat(${(props) => props.rowCount}, 1fr);
  grid-gap: 4px;
  background-color: ${(props) => props.backgroundColor || '#FDFDFE'};
  background-image: ${(props) => props.backgroundImage || 'none'};
  color: #444;
  justify-content: center;
  align-items: center;
  justify-items: stretch;
  align-items: stretch;
  padding: 5px;
`;

const ButtonGridButtonsForcedAsSquare = styled.div<{
  colCount: number;
  rowCount: number;
  backgroundColor: string | null;
  backgroundImage: string | null;
}>`
  position: absolute;
  top: 4px;
  left: 4px;
  bottom: 58px;
  right: 4px;
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.colCount}, 200px)`};
  grid-template-rows: ${(props) => `repeat(${props.rowCount}, 200px)`};
  grid-gap: 4px;
  background-color: ${(props) => props.backgroundColor || '#FDFDFE'};
  background-image: ${(props) => props.backgroundImage || 'none'};
  color: #444;
  align-items: stretch;
  padding: 5px;
  align-content: center;
  justify-items: stretch;
  justify-content: center;
`;

const ButtonStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: #ebecf0;
  // hover
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #ccc;
  }
`;

const BottomBarWrapper = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  height: 50px;
  background-color: #ebecf0;
  display: flex;
  align-items: center;
  border-radius: 8px;
`;

const ToggleWrapper = styled.div<{
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

const SettingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;
  padding: 0 12px;
`;

const BottomBar = (props: {
  setStretchButtons: React.Dispatch<React.SetStateAction<boolean>>;
  stretchButtons: boolean;
}) => {
  const { setStretchButtons, stretchButtons } = props;

  const toggleStretchButtons = () => {
    setStretchButtons(!stretchButtons);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      toggleStretchButtons();
    }
  };

  return (
    <BottomBarWrapper>
      <div style={{ width: '215px' }}>
        <SettingWrapper>
          <div>Stretch Buttons</div>
          <Toggle
            disabled={false}
            isOn={stretchButtons}
            onClick={toggleStretchButtons}
            onKeyDown={handleKeyDown}
            aria-checked={stretchButtons}
            tabIndex={0}
          />
        </SettingWrapper>
      </div>
    </BottomBarWrapper>
  );
};

const Buttons = (props: {
  page: Page;
  onButtonClick: (button: Button) => void;
}) => {
  const { page, onButtonClick } = props;

  return (
    <>
      {Array.from(Array(page.height).keys()).map((y) =>
        Array.from(Array(page.width).keys()).map((x) => {
          const button = page.buttons.find((b) => b.x === x && b.y === y);
          if (button) {
            return (
              <ButtonStyled
                key={`${x}-${y}`}
                style={{
                  gridColumn: button.x + 1,
                  gridRow: button.y + 1,
                  gridColumnStart: button.x + 1,
                  gridRowStart: button.y + 1,
                  gridColumnEnd: button.x + 2,
                  gridRowEnd: button.y + 2,
                }}
                onClick={() => onButtonClick(button)}
              >
                {button.name}
              </ButtonStyled>
            );
          }
          return (
            <ButtonStyled
              key={`${x}-${y}`}
              style={{
                gridColumn: x + 1,
                gridRow: y + 1,
                gridColumnStart: x + 1,
                gridRowStart: y + 1,
                gridColumnEnd: x + 2,
                gridRowEnd: y + 2,
              }}
            >
              +
            </ButtonStyled>
          );
        })
      )}
    </>
  );
};

export const LeftPanel = (props: { pages: Page[] }) => {
  const { pages } = props;
  const [stretchButtons, setStretchButtons] = useState(false);
  const [page, setPage] = useState(pages[0]);

  const onButtonClick = (button: Button) => {
    if (button.page_id) {
      const newPage = pages.find((p) => p.id === button.page_id);
      if (newPage) {
        setPage(newPage);
      }
    }
  };

  return (
    <>
      {stretchButtons ? (
        <ButtonGrid
          colCount={page.width}
          rowCount={page.height}
          backgroundColor={page.background_color}
          backgroundImage={page.background_image}
        >
          <Buttons page={page} onButtonClick={onButtonClick} />
        </ButtonGrid>
      ) : (
        <ButtonGridButtonsForcedAsSquare
          colCount={page.width}
          rowCount={page.height}
          backgroundColor={page.background_color}
          backgroundImage={page.background_image}
        >
          <Buttons page={page} onButtonClick={onButtonClick} />
        </ButtonGridButtonsForcedAsSquare>
      )}

      <BottomBar
        setStretchButtons={setStretchButtons}
        stretchButtons={stretchButtons}
      />
    </>
  );
};

export default LeftPanel;
