const mockWriteFile = jest.fn();
jest.mock('fs/promises', () => ({
  writeFile: mockWriteFile,
}));

import { createConfig, writeConfig } from '../utils/configUtils';
import type { Config } from '../types';

describe('configUtils', () => {
  const mockIp = 'anIpAddress';
  const mockAuthToken = 'anAuthToken';
  const mockMacAddress = 'aMacAddress';

  const mockConfig: Config = {
    ip: mockIp,
    authToken: mockAuthToken,
    macAddress: mockMacAddress,
  };

  it('should create a config object', () => {
    const config = createConfig(mockIp, mockAuthToken, mockMacAddress);
    expect(config).toEqual(mockConfig);
  });

  it('should write a config file', async () => {
    await writeConfig(mockConfig);
    expect(mockWriteFile).toHaveBeenCalledWith(
      'config.json',
      JSON.stringify(mockConfig)
    );
  });
});
