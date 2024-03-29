interface Macro {
  type: string;
  id: string;
}

export interface Button {
  x: number;
  y: number;
  name: string;
  macro?: Macro;
  page_id?: string;
  value?: string; // TODO: Hmmmm
}

export interface Macro {
  type: string;
  id: string;
}

export interface Page {
  id: string;
  height: number;
  width: number;
  background_color: string | null;
  background_image: string | null;
  buttons: Button[];
  name: string;
}

export interface ConfigFile {
  password: string;
  passwordRequired: boolean;
  useSecureProtocol: boolean;
  webServerPort: number;
  webSocketPort: number;
}

export interface RequestMessage {
  type: string;
  request_type: string;
  page_id: string;
  date: number;
}
