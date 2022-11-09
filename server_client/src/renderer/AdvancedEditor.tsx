import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';

const jsonExtensions = [json()];

// eslint-disable-next-line
export const AdvancedEditor = () => {
  // basic three tabbed view
  const [tab, setTab] = useState(0);
  const [config, setConfig] = useState<string>('hello');

  const getConfigData = async () => {
    const configData = await window.streamtabAPI.getConfigFile();
    if (configData) {
      setConfig(JSON.stringify(configData, null, 2));
    }
  };
  const getMacrosData = async () => {
    const configData = await window.streamtabAPI.getConfigFile();
    if (configData) {
      setConfig(JSON.stringify(configData, null, 2));
    }
  };
  const getPagesData = async () => {
    const configData = await window.streamtabAPI.getConfigFile();
    if (configData) {
      setConfig(JSON.stringify(configData, null, 2));
    }
  };

  // run useeffect once
  useEffect(() => {
    (async () => {
      await getConfigData();
    })();
  }, []);

  return (
    <div>
      <div>
        <button
          type="button"
          onClick={() => {
            setTab(0);
          }}
        >
          Tab 1
        </button>
        <button
          type="button"
          onClick={() => {
            setTab(1);
          }}
        >
          Tab 2
        </button>
        <button
          type="button"
          onClick={() => {
            setTab(2);
          }}
        >
          Tab 3
        </button>
      </div>
      <div>
        {tab === 0 && (
          <CodeMirror
            value={config}
            className="codeMirrorJSON"
            height="500px"
          />
        )}
        {tab === 1 && <CodeMirror className="codeMirrorJSON" height="500px" />}
        {tab === 2 && <CodeMirror className="codeMirrorJSON" height="500px" />}
      </div>
    </div>
  );
};
