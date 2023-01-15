import {
  streamtabReadConfigFile,
  streamtabReadMacrosFile,
  streamtabReadPagesFile,
  streamtabWriteConfigFile,
  streamtabWriteMacrosFile,
  streamtabWritePagesFile,
} from '../fileManager';

import { Button, Page, ConfigFile, RequestMessage } from '../types';

// TODO: Move to types.d.ts

const GENERAL_ERROR = JSON.stringify({ type: 'general_error' });
const CONNECTION_CONFIRMED = JSON.stringify({ type: 'connection_confirmed' });
const AUTH_REQUIRED = JSON.stringify({ type: 'authentication_required' });

export const handleInitialConnection = (config: ConfigFile) => {
  if (config.passwordRequired) {
    return AUTH_REQUIRED;
  }
  return CONNECTION_CONFIRMED;
};

export const handleAuth = (message: string) => {
  return 'something';
};

// '{"type":"request","request_type":"page_info","page_id":"home","date":1673494955742}'
export const handleRequest = (
  message: RequestMessage,
  config: ConfigFile,
  pages: Page[]
) => {
  if (!message) {
    return GENERAL_ERROR;
  }

  if (!message.request_type) {
    return GENERAL_ERROR;
  }

  // Handle page info request
  if (message.request_type === 'page_info') {
    const page = pages.find((p) => p.id === message.page_id);
    if (page) {
      return JSON.stringify({
        type: 'pageData',
        data: page,
      });
    }
  }

  // Future request types go here
  return GENERAL_ERROR;
};

export const handleMacro = (message: string) => {
  return 'something';
};
