import type { Device } from 'vizio-smart-cast';

import pairDevice from '../utils/pairDevice';
import type { PairingInitiateResponse, PairingResponse } from '../types';
import type { ReadlineUtil } from '../utils/readlineUtils';

const mockValidPin = 'aValidPin';
const mockAuthToken = 'validAuthToken';
const mockSmartcast = (shouldPairingInitiationSucceed = true) =>
  function MockSmartcast(this: Device) {
    this.pairing = {} as Device['pairing'];
    this.pairing.initiate = (_deviceName: string, _deviceId: string) => {
      return new Promise((resolve, reject) => {
        if (!shouldPairingInitiationSucceed) {
          reject('forced failed pairing initiation');
        } else {
          const mockPairingInitiateResponse: PairingInitiateResponse = {
            STATUS: {
              RESULT: 'aPairingInitiateResult',
              DETAIL: 'aPairingInitiateDetails',
            },
            ITEM: {
              CHALLENGE_TYPE: 1,
              PAIRING_REQ_TOKEN: 1234,
            },
          };
          resolve(mockPairingInitiateResponse);
        }
      });
    };
    this.pairing.pair = (pin: string) => {
      return new Promise((resolve, reject) => {
        if (pin === mockValidPin) {
          const mockPairingResponse: PairingResponse = {
            STATUS: {
              RESULT: 'aPairingResponseResult',
              DETAIL: 'aPairingResponseDetails',
            },
            ITEM: {
              AUTH_TOKEN: mockAuthToken,
            },
          };
          resolve(mockPairingResponse);
        } else {
          reject('invalid PIN');
        }
      });
    };
  };

const mockAskPromisedQuestion =
  (provideValidPin: boolean) => (_question: string) => {
    return new Promise((resolve, reject) => {
      provideValidPin ? resolve(mockValidPin) : reject('anInvalidPin');
    }).catch((err) => console.log(err));
  };

const mockIp = 'aMockIpAddress';

describe('pairDevice', () => {
  it('should initiate pairing with a VIZIO device, accept a valid PIN, and return an auth token', async () => {
    const authToken = await pairDevice(
      mockSmartcast() as unknown as Device,
      mockAskPromisedQuestion(true) as ReadlineUtil['askPromisedQuestion'],
      mockIp
    );
    expect(authToken).toEqual(mockAuthToken);
  });

  it('should initiate pairing with a VIZIO device and return null if pairing initation fails', async () => {
    const mockAuthToken = null;
    const authToken = await pairDevice(
      mockSmartcast(false) as unknown as Device,
      mockAskPromisedQuestion(true) as ReadlineUtil['askPromisedQuestion'],
      mockIp
    );
    expect(authToken).toEqual(mockAuthToken);
  });

  it('should initiate pairing with a VIZIO device and return null if invalid PIN is entered', async () => {
    const mockAuthToken = null;
    const authToken = await pairDevice(
      mockSmartcast(true) as unknown as Device,
      mockAskPromisedQuestion(false) as ReadlineUtil['askPromisedQuestion'],
      mockIp
    );
    expect(authToken).toEqual(mockAuthToken);
  });
});
