const mockWolWake = jest.fn(() => true);
jest.mock('wol', () => ({
  wake: mockWolWake,
}));

const mockTogglePower = jest.fn(() => console.log('mock toggle power!'));
const mockSwitchInput = jest.fn(() => console.log('mock switch input!'));
jest.mock('../utils', () => ({
  togglePower: mockTogglePower,
  switchInput: mockSwitchInput,
}));

import type { Device } from 'vizio-smart-cast';

import start from '../start';
import type { Config, PowerCommand } from '../types';

class MockSmartcast {}

describe('start', () => {
  const mockConfig: Config = {
    ip: 'anIpAddress',
    authToken: 'anAuthToken',
    macAddress: 'aMacAddress',
    defaultInputName: 'aDefaultInput',
  };

  it('should call firstRun if a config.json file was not found', async () => {
    const mockFirstRun = jest.fn();
    await start(MockSmartcast as unknown as Device, mockFirstRun);
    expect(mockFirstRun).toHaveBeenCalledWith(MockSmartcast);
  });

  it('should call togglePower with a powerCommand if a config.json file was found and the TV is awake', async () => {
    const mockPowerCommand: PowerCommand = 'on';
    const mockSwitchInputName = mockConfig.defaultInputName;
    await start(
      MockSmartcast as unknown as Device,
      mockConfig,
      mockPowerCommand
    );
    expect(mockTogglePower).toHaveBeenCalledWith(
      expect.any(MockSmartcast),
      mockPowerCommand
    );
    expect(mockSwitchInput).toHaveBeenCalledWith(
      expect.any(MockSmartcast),
      mockSwitchInputName
    );
  });
});
