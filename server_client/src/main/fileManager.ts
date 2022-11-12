import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { defaultConfig, defaultMacros, defaultPages } from './defaultData';
import { consoleError } from './logger';

/*
  HELPERS START
*/

const doesConfigDirectoryExist = () => {
  const configDirectory = path.join(
    app.getPath('documents'),
    'streamtab-config'
  );
  return fs.existsSync(configDirectory);
};

const createConfigDirectory = () => {
  const configDirectory = path.join(
    app.getPath('documents'),
    'streamtab-config'
  );
  fs.mkdirSync(configDirectory);
};

const createConfigDirectoryIfNotExists = () => {
  if (!doesConfigDirectoryExist()) {
    createConfigDirectory();
  }
};

const doConfigFilesExist = () => {
  createConfigDirectoryIfNotExists();

  const configFiles = ['config.json', 'macros.json', 'pages.json'].map(
    (fileName) =>
      path.join(app.getPath('documents'), 'streamtab-config', fileName)
  );

  return configFiles.every((filePath) => fs.existsSync(filePath));
};

const createConfigFiles = () => {
  createConfigDirectoryIfNotExists();

  const configFiles = ['config.json', 'macros.json', 'pages.json'].map(
    (fileName) =>
      path.join(app.getPath('documents'), 'streamtab-config', fileName)
  );

  const configFilesContents = [defaultConfig, defaultMacros, defaultPages];

  configFiles.forEach((filePath, i) => {
    fs.writeFileSync(filePath, JSON.stringify(configFilesContents[i], null, 2));
  });
};

const createConfigFilesIfNotExists = () => {
  if (!doConfigFilesExist()) {
    createConfigFiles();
  }
};

/*
  HELPERS END
*/

export const streamtabReadConfigFile = () => {
  createConfigFilesIfNotExists();
  const configPath = path.join(
    app.getPath('documents'),
    'streamtab-config/config.json'
  );
  try {
    const file = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(file);
  } catch (error) {
    consoleError('[ERROR] Failed to read config file: ', error);
    return null;
  }
};

export const streamtabReadMacrosFile = () => {
  createConfigFilesIfNotExists();
  const configPath = path.join(
    app.getPath('documents'),
    'streamtab-config/macros.json'
  );
  try {
    const file = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(file);
  } catch (error) {
    consoleError('[ERROR] Failed to read config file: ', error);
    return null;
  }
};

export const streamtabReadPagesFile = () => {
  createConfigDirectoryIfNotExists();
  const configPath = path.join(
    app.getPath('documents'),
    'streamtab-config/pages.json'
  );
  try {
    const file = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(file);
  } catch (error) {
    consoleError('[ERROR] Failed to read config file: ', error);
    return null;
  }
};

export const streamtabWriteConfigFile = (config: string) => {
  createConfigDirectoryIfNotExists();
  const configPath = path.join(
    app.getPath('documents'),
    'streamtab-config/config.json'
  );
  try {
    fs.writeFileSync(configPath, config, { flag: 'w+', encoding: 'utf8' });
    return true;
  } catch (error) {
    consoleError('[ERROR] Failed to write config file: ', error);
    return null;
  }
};

export const streamtabWriteMacrosFile = (macros: string) => {
  createConfigDirectoryIfNotExists();

  const configPath = path.join(
    app.getPath('documents'),
    'streamtab-config/macros.json'
  );
  try {
    fs.writeFileSync(configPath, macros, { flag: 'w+', encoding: 'utf8' });
    return true;
  } catch (error) {
    consoleError('[ERROR] Failed to write macros file: ', error);
    return null;
  }
};

export const streamtabWritePagesFile = (pages: string) => {
  createConfigDirectoryIfNotExists();

  const configPath = path.join(
    app.getPath('documents'),
    'streamtab-config/pages.json'
  );
  try {
    fs.writeFileSync(configPath, pages, { flag: 'w+', encoding: 'utf8' });
    return true;
  } catch (error) {
    consoleError('[ERROR] Failed to write pages file: ', error);
    return null;
  }
};
