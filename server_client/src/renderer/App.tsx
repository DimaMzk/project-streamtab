import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import styled from 'styled-components';
import { AdvancedEditor } from './AdvancedEditor';
import { ServerManager } from './ServerManager';

const TabButton = styled.button`
  background-color: #fff;
  border: none;
  padding: 4px 18px;
  margin-right: 8px;
  font-size: 16px;
  cursor: pointer;
`;

const MainTabbedView = () => {
  const [tab, setTab] = useState(0);

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <TabButton
          onClick={() => {
            setTab(0);
          }}
          style={{
            borderBottom: tab === 0 ? '2px solid #ccc' : '1px solid #ccc',
          }}
        >
          Main
        </TabButton>
        <TabButton
          style={{
            borderBottom: tab === 1 ? '2px solid #ccc' : '1px solid #ccc',
          }}
          onClick={() => {
            setTab(1);
          }}
        >
          Edit Configuration
        </TabButton>
      </div>
      {tab === 0 && <ServerManager />}
      {tab === 1 && <AdvancedEditor />}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainTabbedView />} />
      </Routes>
    </Router>
  );
}
