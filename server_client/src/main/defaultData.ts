import { Button, Page, ConfigFile } from './types';

export const defaultConfig: ConfigFile = {
  password: '',
  passwordRequired: false,
  useSecureProtocol: false,
  webSocketPort: 8765,
  webServerPort: 8766,
};

export const defaultMacros = {};

export const defaultPages: [Page] = [
  {
    id: 'home',
    height: 1,
    width: 1,
    background_color: null,
    background_image: null,
    background_image_opacity: null,
    buttons: [
      {
        x: 0,
        y: 0,
        name: 'Configure StreamTab from Desktop App',
      },
    ],
    name: 'Home',
  },
];
