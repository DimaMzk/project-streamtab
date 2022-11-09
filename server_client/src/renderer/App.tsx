import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { AdvancedEditor } from './AdvancedEditor';

const Hello = () => {
  const [config, setConfig] = useState<string | null>(null);

  return (
    <div>
      <AdvancedEditor />
      <div>
        <p>Config</p>
        <code>
          {config ? <pre>{JSON.stringify(config, null, 2)}</pre> : 'No Config'}
        </code>
        <br />
        <button
          type="button"
          onClick={async () => {
            const cnfg = await window.streamtabAPI.getConfigFile();
            // eslint-disable-next-line no-console
            console.log(cnfg);
            setConfig(cnfg);
          }}
        >
          Load config
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdvancedEditor />} />
      </Routes>
    </Router>
  );
}
