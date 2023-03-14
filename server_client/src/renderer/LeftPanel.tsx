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

const ToggleSwitchThing = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #fdfdfe;
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
          <ToggleWrapper
            disabled={false}
            useCustomPort={stretchButtons}
            onClick={toggleStretchButtons}
            onKeyDown={handleKeyDown}
            role="switch"
            aria-checked={stretchButtons}
            tabIndex={0}
          >
            <ToggleSwitchThing />
          </ToggleWrapper>
        </SettingWrapper>
      </div>
    </BottomBarWrapper>
  );
};

export const LeftPanel = (props: { page: Page }) => {
  const { page } = props;
  const [stretchButtons, setStretchButtons] = useState(false);

  return (
    <>
      {stretchButtons ? (
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
                gridColumnStart: button.x + 1,
                gridRowStart: button.y + 1,
                gridColumnEnd: button.x + 2,
                gridRowEnd: button.y + 2,
              }}
            >
              {button.name}
            </ButtonStyled>
          ))}
        </ButtonGrid>
      ) : (
        <ButtonGridButtonsForcedAsSquare
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
                gridColumnStart: button.x + 1,
                gridRowStart: button.y + 1,
                gridColumnEnd: button.x + 2,
                gridRowEnd: button.y + 2,
              }}
            >
              {button.name}
            </ButtonStyled>
          ))}
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
