const mockWriteFile = jest.fn();
jest.mock('fs/promises', () => ({
  writeFile: mockWriteFile,
}));

import { createConfig, writeConfig } from '../utils/configUtils';
import type { Config } from '../types';
import { CONFIG_FILE_DIRECTORY, CONFIG_FILE_NAME } from '../enums';
describe('configUtils', () => {
  const mockIp = 'anIpAddress';
  const mockAuthToken = 'anAuthToken';
  const mockMacAddress = 'aMacAddress';
  const mockDefaultInput = 'aDefaultInput';

  const mockConfig: Config = {
    ip: mockIp,
    authToken: mockAuthToken,
    macAddress: mockMacAddress,
    defaultInputName: mockDefaultInput,
  };

  it('should create a config object', () => {
    const config = createConfig(
      mockIp,
      mockAuthToken,
      mockMacAddress,
      mockDefaultInput
    );
    expect(config).toEqual(mockConfig);
  });

  it('should write a config file', async () => {
    await writeConfig(mockConfig);
    expect(mockWriteFile).toHaveBeenCalledWith(
      `${CONFIG_FILE_DIRECTORY}${CONFIG_FILE_NAME}`,
      JSON.stringify(mockConfig)
    );
  });
});
