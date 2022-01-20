jest.mock('fs', () => ({
  // access: jest.fn(),
  constants: { R_OK: 4 },
}));

jest.mock('fs/promises', () => ({
  access: jest.fn(),
}));

import { PathLike } from 'fs';
import { access } from 'fs/promises';

const mockSmartcast = jest.fn();
jest.mock('vizio-smart-cast', () => mockSmartcast);

const mockStart = jest.fn().mockResolvedValue(undefined);
const mockFirstRun = jest.fn();
jest.mock('../firstRun', () => mockFirstRun);

import checkForConfigAndStart from '../app';
import type { Config } from '../types';

/* fs.d.ts
  export function access(
    path: PathLike,
    mode: number | undefined,
  ): void;
*/
const mockAccess =
  (configFound = false) =>
  (_path: PathLike, _mode: number | undefined): void => {
    if (configFound) {
      return;
    } else {
      const error = new Error('testError') as NodeJS.ErrnoException;
      error.code = 'ENOENT';
      throw error;
    }
  };

describe('app', () => {
  const mockConfig: Config = {
    ip: 'anIpAddress',
    authToken: 'anAuthToken',
    macAddress: 'aMacAddress',
  };

  it('should call start with firstRun as a parameter if a config.json file was not found', async () => {
    (access as unknown as ReturnType<typeof jest.fn>).mockImplementation(
      mockAccess(false)
    );
    await checkForConfigAndStart(mockStart);
    expect(mockStart).toHaveBeenCalledWith(mockSmartcast, mockFirstRun);
  });

  it('should call togglePower with a powerCommand if a config.json file was found and the TV is awake', async () => {
    (access as unknown as ReturnType<typeof jest.fn>).mockImplementation(
      mockAccess(true)
    );
    const mockPowerCommand = 'mockPowerCommand';
    process.argv[2] = mockPowerCommand;
    jest.mock('../../config.json', () => mockConfig, { virtual: true });
    await checkForConfigAndStart(mockStart);
    expect(mockStart).toHaveBeenCalledWith(
      mockSmartcast,
      mockConfig,
      mockPowerCommand
    );
  });

  it('should not call firstRun if unexpected error occurs', async () => {
    (access as unknown as ReturnType<typeof jest.fn>).mockImplementation(
      mockAccess(true)
    );
    const mockPowerCommand = 'mockPowerCommand';
    process.argv[2] = mockPowerCommand;
    jest.mock('../../config.json', () => mockConfig, { virtual: true });
    const mockStart = jest.fn().mockRejectedValue(null);
    await checkForConfigAndStart(mockStart);
    expect(mockFirstRun).not.toHaveBeenCalled();
  });
});
