import type { Device } from 'vizio-smart-cast';

import type { ReadlineUtil } from './readlineUtils';
import { APPNAME } from '../enums';
import type {
  AuthToken,
  PairingInitiateResponse,
  PairingResponse,
} from '../types';

const pairDevice = async (
  smartcast: Device,
  askPromisedQuestion: ReadlineUtil['askPromisedQuestion'],
  ip: string
): Promise<AuthToken | null> => {
  const tv = new smartcast(ip);
  const deviceName = `${APPNAME}-${new Date().getTime()}`;
  const deviceId = `${APPNAME}-${new Date().getTime()}`;
  try {
    const _pairingInitiateResponse = (await tv.pairing.initiate(
      deviceName,
      deviceId
    )) as PairingInitiateResponse;
    // console.log('initiate response:', _pairingInitiateResponse);
  } catch (err) {
    console.log('pairing initiate failed with error: ', err);
    return null;
  }
  const pairingPin = (await askPromisedQuestion('Enter PIN: ')) || '';
  try {
    const pairingResponse = (await tv.pairing.pair(
      pairingPin
    )) as PairingResponse;
    // console.log('paired response: ', pairingResponse);
    const authToken: string = pairingResponse.ITEM.AUTH_TOKEN;
    return authToken;
  } catch (err) {
    console.log('pairing failed with error: ', err);
    return null;
  }
};

export default pairDevice;
