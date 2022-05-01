import type { Device, Discovery } from 'vizio-smart-cast';

export type Config = {
  ip: string;
  authToken: string;
  macAddress: string;
  defaultInputName?: string;
};

export type DiscoveredDevices = Discovery[];

export type AuthToken = string;

type PairingResponseStatus = {
  STATUS: {
    RESULT: string;
    DETAIL: string;
  };
};

export type PairingInitiateResponse = PairingResponseStatus & {
  ITEM: {
    CHALLENGE_TYPE: number;
    PAIRING_REQ_TOKEN: number;
  };
};

export type PairingResponse = PairingResponseStatus & {
  ITEM: { AUTH_TOKEN: string };
};

export type PowerMode = {
  STATUS: { RESULT: string; DETAIL: string };
  ITEMS: [{ CNAME: string; TYPE: string; NAME: string; VALUE: number }];
  URI: '/state/device/power_mode';
};

export type PowerCommand = keyof Device['control']['power'];
export function isPowerCommand(
  powerCommand?: string
): powerCommand is PowerCommand {
  return (
    powerCommand === 'on' || powerCommand === 'off' || powerCommand === 'toggle'
  );
}

export function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return (
    error instanceof Error &&
    (!!(error as NodeJS.ErrnoException).errno ||
      !!(error as NodeJS.ErrnoException).code ||
      !!(error as NodeJS.ErrnoException).path ||
      !!(error as NodeJS.ErrnoException).syscall)
  );
}

type InputItem = {
  HASHVAL: number;
  NAME: string;
  ENABLED: string;
  VALUE: string;
  CNAME: string;
  TYPE: string;
};
// https://github.com/heathbar/vizio-smart-cast#inputcurrent
export type CurrentInputResponse = {
  STATUS: { RESULT: string; DETAIL: string };
  ITEMS: InputItem[];
  HASHLIST: number[];
  URI: string;
  PARAMETERS: { FLAT: string; HELPTEXT: string; HASHONLY: string };
};
