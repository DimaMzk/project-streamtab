/* eslint-disable @typescript-eslint/no-explicit-any */
const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

export const consoleLog = (...args: any) => {
  if (isDebug) {
    console.log(args); // eslint-disable-line no-console
  }
};

export const consoleError = (...args: any) => {
  if (isDebug) {
    console.error(args); // eslint-disable-line no-console
  }
};
