import fs from 'fs/promises';

import type { Config } from '../types';
import { CONFIG_FILE_NAME, CONFIG_FILE_DIRECTORY } from '../enums';

export const createConfig = (
  ip: string,
  authToken: string,
  macAddress: string,
  defaultInputName?: string
): Config => ({
  ip,
  authToken,
  macAddress,
  defaultInputName,
});

export const writeConfig = async (config: Config) => {
  const fileContent = JSON.stringify(config);
  const filePath = CONFIG_FILE_NAME;
  try {
    await fs.writeFile(`${CONFIG_FILE_DIRECTORY}${filePath}`, fileContent);
    console.log(`File ${filePath} successfully created`);
  } catch (err) {
    console.log('error writing config file: ', err);
  }
};
