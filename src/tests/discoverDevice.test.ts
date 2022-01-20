import type { Device, Discovery } from 'vizio-smart-cast';

import discoverDevice from '../utils/discoverDevice';

const mockDiscoveredDevice: Discovery = {
  ip: 'aMockIpAddress',
  name: 'aMockName',
  manufacturer: 'VIZIO',
  model: 'aMockModel',
};

const mockDiscover: (mockDevices: Discovery[]) => Device['discover'] =
  (mockDevices: Discovery[]) =>
  (
    success: (discovery: Discovery) => void,
    error?: (error: unknown) => void,
    _timeout?: number
  ): void => {
    mockDevices.forEach((discoveredDevice) => {
      if (discoveredDevice.manufacturer.toLocaleUpperCase() === 'VIZIO') {
        success(mockDiscoveredDevice);
      } else {
        error &&
          error(
            `Error message for incorrect manufacturer: ', ${discoveredDevice.manufacturer}`
          );
      }
    });
  };

describe('discoverDevice', () => {
  it('should return an array of valid devices (manufacturer === VIZIO)', async () => {
    const mockSmartcast = {
      discover: mockDiscover([mockDiscoveredDevice]),
    };
    const devices = await discoverDevice(mockSmartcast as Device);
    expect(devices).toEqual([mockDiscoveredDevice]);
  });

  it('should return an empty array if no valid devices were found', async () => {
    const mockSmartcast = {
      discover: mockDiscover([]),
    };
    const devices = await discoverDevice(mockSmartcast as Device);
    expect(devices).toEqual([]);
  });
});
