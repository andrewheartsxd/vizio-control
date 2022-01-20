const mockWolWake = jest.fn(() => true);
jest.mock('wol', () => ({
  wake: mockWolWake,
}));

const mockTogglePower = jest.fn(() => console.log('YOYO'));
jest.mock('../utils', () => ({
  togglePower: mockTogglePower,
}));

import type { Device } from 'vizio-smart-cast';

import start from '../start';
import type { Config } from '../types';

class MockSmartcast {}

describe('start', () => {
  const mockConfig: Config = {
    ip: 'anIpAddress',
    authToken: 'anAuthToken',
    macAddress: 'aMacAddress',
  };

  it('should call firstRun if a config.json file was not found', async () => {
    const mockFirstRun = jest.fn();
    await start(MockSmartcast as unknown as Device, mockFirstRun);
    expect(mockFirstRun).toHaveBeenCalledWith(MockSmartcast);
  });

  it('should call togglePower with a powerCommand if a config.json file was found and the TV is awake', async () => {
    const mockPowerCommand = 'mockPowerCommand';
    await start(
      MockSmartcast as unknown as Device,
      mockConfig,
      'mockPowerCommand'
    );
    expect(mockTogglePower).toHaveBeenCalledWith(
      expect.any(MockSmartcast),
      mockPowerCommand
    );
  });
});
