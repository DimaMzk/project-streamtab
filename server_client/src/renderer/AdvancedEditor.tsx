import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import styled from 'styled-components';
import { json } from '@codemirror/lang-json';

const jsonExtensions = [json()];

// eslint-disable-next-line
export const AdvancedEditor = () => {
  // basic three tabbed view
  const [tab, setTab] = useState(0);
  const [config, setConfig] = useState<string>('hello config');
  const [macros, setMacros] = useState<string>('hello macro');
  const [pages, setPages] = useState<string>('hello pages');

  const [oldConfig, setOldConfig] = useState<string>('hello config');
  const [oldMacros, setOldMacros] = useState<string>('hello macro');
  const [oldPages, setOldPages] = useState<string>('hello pages');

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

  // Buttons that look like tabs
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
  `;

  const CodeError = styled.div`
    color: red;
    font-size: 14px;
    font-weight: bold;
    line-height: 34px;
    display: inline;
  `;

  // run useeffect once
  useEffect(() => {
    (async () => {
      await getConfigData();
      await getMacrosData();
      await getPagesData();
    })();
  }, []);

  // eslint-disable-next-line no-nested-ternary
  const CodeMirrorContent = tab === 0 ? config : tab === 1 ? macros : pages;

  const onCodeMirrorChange = (value: string) => {
    if (tab === 0) {
      setConfig(value);
    } else if (tab === 1) {
      setMacros(value);
    } else {
      setPages(value);
    }
  };

  const onFormatClick = () => {
    try {
      const parsed = JSON.parse(CodeMirrorContent);
      const formatted = JSON.stringify(parsed, null, 2);
      onCodeMirrorChange(formatted);
    } catch (e) {
      console.log(e);
    }
  };

  const isValidJson = () => {
    try {
      JSON.parse(CodeMirrorContent);
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
      <div>
        <CodeMirror
          value={CodeMirrorContent}
          className="codeMirrorJSON"
          extensions={jsonExtensions}
          height="calc(100vh - 78px)"
          style={{
            border: '1px solid #ccc',
            borderBottom: 'none',
            borderTop: 'none',
          }}
          onChange={onCodeMirrorChange}
        />
      </div>
      <div
        style={{
          height: '32px',
          border: '1px solid #ccc',
          borderBottomLeftRadius: '5px',
          borderBottomRightRadius: '5px',
          backgroundColor: '#f5f5f5',
        }}
      >
        <SaveButton type="button">Save</SaveButton>
        <SaveButton onClick={onFormatClick} type="button">
          Format
        </SaveButton>
        <CodeError>{isValidJson() ? '' : 'Invalid JSON'}</CodeError>
      </div>
    </div>
  );
};
