import { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import styled from 'styled-components';
import { json } from '@codemirror/lang-json';
import { defaultConfig, defaultPages, defaultMacros } from './defaultData';

const jsonExtensions = [json()];

const TabButton = styled.button`
  background-color: #fff;
  border: 1px solid #ccc;
  border-bottom: none;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 18px;
  outline: none;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #ddd;
  }
  &:focus {
    background-color: #ddd;
  }
`;

const BottomBar = styled.div`
  height: 32px;
  border: 1px solid #ccc;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: #f5f5f5;
`;

const SaveButton = styled.button`
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s ease;
  height: 24px;
  margin: 4px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 2px;
  font-size: 14px;
  line-height: 14px;
  &:hover {
    background-color: #ddd;
  }
  &:focus {
    background-color: #ddd;
  }
  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
    transition: background-color 0.3s ease;
  }
`;

const CodeError = styled.div`
  color: red;
  font-size: 14px;
  font-weight: bold;
  line-height: 34px;
  display: inline;
`;

export const AdvancedEditor = () => {
  const [tab, setTab] = useState(0);
  const [config, setConfig] = useState<string>(
    JSON.stringify(defaultConfig, null, 2)
  );
  const [macros, setMacros] = useState<string>(
    JSON.stringify(defaultMacros, null, 2)
  );
  const [pages, setPages] = useState<string>(
    JSON.stringify(defaultPages, null, 2)
  );

  const [oldConfig, setOldConfig] = useState<string>('');
  const [oldMacros, setOldMacros] = useState<string>('');
  const [oldPages, setOldPages] = useState<string>('');

  const getConfigData = async () => {
    const configData = await window.streamtabAPI.getConfigFile();
    if (configData) {
      setConfig(JSON.stringify(configData, null, 2));
      setOldConfig(JSON.stringify(configData, null, 2));
    }
  };
  const getMacrosData = async () => {
    const macrosData = await window.streamtabAPI.getMacrosFile();
    if (macrosData) {
      setMacros(JSON.stringify(macrosData, null, 2));
      setOldMacros(JSON.stringify(macrosData, null, 2));
    }
  };
  const getPagesData = async () => {
    const pagesData = await window.streamtabAPI.getPagesFile();
    if (pagesData) {
      setPages(JSON.stringify(pagesData, null, 2));
      setOldPages(JSON.stringify(pagesData, null, 2));
    }
  };

  const setConfigData = async () => {
    const result = await window.streamtabAPI.writeConfigFile(config);
    if (result) {
      setOldConfig(config);
    }
  };

  const setMacrosData = async () => {
    const result = await window.streamtabAPI.writeConfigFile(macros);
    if (result) {
      setOldMacros(macros);
    }
  };

  const setPagesData = async () => {
    const result = await window.streamtabAPI.writeConfigFile(pages);
    if (result) {
      setOldPages(pages);
    }
  };

  const setAllConfigs = async () => {
    const results = await Promise.all([
      window.streamtabAPI.writeConfigFile(config),
      window.streamtabAPI.writeMacrosFile(macros),
      window.streamtabAPI.writePagesFile(pages),
    ]);
    if (results.every((result) => result)) {
      setOldConfig(config);
      setOldMacros(macros);
      setOldPages(pages);
    }
  };

  useEffect(() => {
    (async () => {
      await getConfigData();
      await getMacrosData();
      await getPagesData();
    })();
  }, []);

  const getCurrentCodemirrorContent = () => {
    switch (tab) {
      case 0:
        return config;
      case 1:
        return macros;
      case 2:
        return pages;
      default:
        return '';
    }
  };

  const updateCurrentCodemirrorContent = (value: string) => {
    switch (tab) {
      case 0:
        setConfig(value);
        break;
      case 1:
        setMacros(value);
        break;
      case 2:
        setPages(value);
        break;
      default:
        throw new Error('Invalid tab');
    }
  };

  const onFormatClick = () => {
    try {
      const parsed = JSON.parse(getCurrentCodemirrorContent());
      const formatted = JSON.stringify(parsed, null, 2);
      updateCurrentCodemirrorContent(formatted);
    } catch (e) {
      console.error(e);
    }
  };

  const onSaveClick = () => {
    if (tab === 0) {
      setConfigData();
    } else if (tab === 1) {
      setMacrosData();
    } else {
      setPagesData();
    }
  };

  const isValidJson = () => {
    try {
      JSON.parse(getCurrentCodemirrorContent());
      return true;
    } catch (e) {
      return false;
    }
  };

  const FileChanges = () => {
    return (
      <svg height="12.5" width="12.5">
        <circle cx="6.25" cy="6.25" r="5" strokeWidth="3" fill="#ccc" />
      </svg>
    );
  };

  return (
    <div>
      <div>
        <TabButton
          type="button"
          style={{ borderBottom: tab === 0 ? 'none' : '1px solid #ccc' }}
          onClick={() => {
            setTab(0);
          }}
        >
          Config {config !== oldConfig && <FileChanges />}
        </TabButton>
        <TabButton
          type="button"
          style={{ borderBottom: tab === 1 ? 'none' : '1px solid #ccc' }}
          onClick={() => {
            setTab(1);
          }}
        >
          Macros {macros !== oldMacros && <FileChanges />}
        </TabButton>
        <TabButton
          type="button"
          style={{ borderBottom: tab === 2 ? 'none' : '1px solid #ccc' }}
          onClick={() => {
            setTab(2);
          }}
        >
          Pages {pages !== oldPages && <FileChanges />}
        </TabButton>
      </div>
      <div
        style={{
          height: 'calc(100vh - 78px)',
        }}
      >
        <CodeMirror
          value={config}
          className="codeMirrorJSON"
          extensions={jsonExtensions}
          height="100%"
          style={{
            border: '1px solid #ccc',
            borderBottom: 'none',
            borderTop: 'none',
            height: '100%',
          }}
          onChange={(value: string) => {
            setConfig(value);
          }}
          hidden={tab !== 0}
        />
        <CodeMirror
          value={macros}
          className="codeMirrorJSON"
          extensions={jsonExtensions}
          height="100%"
          style={{
            border: '1px solid #ccc',
            borderBottom: 'none',
            borderTop: 'none',
            height: '100%',
          }}
          onChange={(value: string) => {
            setMacros(value);
          }}
          hidden={tab !== 1}
        />
        <CodeMirror
          value={pages}
          className="codeMirrorJSON"
          extensions={jsonExtensions}
          height="100%"
          style={{
            border: '1px solid #ccc',
            borderBottom: 'none',
            borderTop: 'none',
            height: '100%',
          }}
          onChange={(value: string) => {
            setPages(value);
          }}
          hidden={tab !== 2}
        />
      </div>
      <BottomBar>
        <SaveButton
          type="button"
          disabled={!isValidJson()}
          onClick={onSaveClick}
        >
          Save File
        </SaveButton>
        <SaveButton
          type="button"
          disabled={!isValidJson()}
          onClick={setAllConfigs}
        >
          Save All Files
        </SaveButton>
        <SaveButton
          onClick={onFormatClick}
          disabled={!isValidJson()}
          type="button"
        >
          Format
        </SaveButton>
        <SaveButton
          onClick={() => {
            if (tab === 0) {
              setConfig(oldConfig);
            } else if (tab === 1) {
              setMacros(oldMacros);
            } else {
              setPages(oldPages);
            }
          }}
          type="button"
        >
          Reload File
        </SaveButton>
        <CodeError>{isValidJson() ? '' : 'Invalid JSON'}</CodeError>
      </BottomBar>
    </div>
  );
};

export default AdvancedEditor;
