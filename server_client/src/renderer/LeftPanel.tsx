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
  colWidth: number;
  rowHeight: number;
}>`
  position: absolute;
  top: 4px;
  left: 4px;
  bottom: 58px;
  right: 4px;
  display: grid;
  grid-template-columns: repeat(
    ${(props) => props.colCount},
    ${(props) => props.colWidth}px
  );
  grid-template-rows: repeat(
    ${(props) => props.rowCount},
    ${(props) => props.rowHeight}px
  );
  grid-auto-rows: 1fr;
  grid-gap: 4px;
  background-color: ${(props) => props.backgroundColor || '#FDFDFE'};
  background-image: ${(props) => props.backgroundImage || 'none'};
  color: #444;
  align-items: stretch;
  padding: 5px;
  align-content: center;
  justify-items: stretch;
  justify-content: center;
  ratio: 1/1;
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
  const [colWidth, setColWidth] = useState(150);
  const [rowHeight, setRowHeight] = useState(150);
  const [page, setPage] = useState(pages[0]);

  useEffect(() => {
    const setSize = () => {
      // I truly hate doing this this way, but every way I've seen of doing this in
      //    CSS looks equally bad in my mind, and this is more readable.
      let w = window.innerWidth;
      let h = window.innerHeight;

      w -= 300; // Sidebar
      w -= 8; // padding
      h -= 8; // padding
      h -= 50; // bottom bar
      h -= 20; // margin of error
      w -= 20; // margin of errorkk

      let col = h / page.height;
      const row = w / page.width;

      if (col > row) {
        col = row;
      }

      let size = col;
      if (size > 150) {
        size = 150;
      }

      setColWidth(size);
      setRowHeight(size);
    };

    setSize);
    window.addEventListener('resize', setSize);
    return () => {
      window.removeEventListener('resize', setSize);
    };
  }, [page.height, page.width]);

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
          colWidth={colWidth}
          rowHeight={rowHeight}
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
