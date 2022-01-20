import fs from 'fs/promises';

import type { Config } from '../types';

export const createConfig = (
  ip: string,
  authToken: string,
  macAddress: string
): Config => ({
  ip,
  authToken,
  macAddress,
});

export const writeConfig = async (config: Config) => {
  const fileContent = JSON.stringify(config);
  const filePath = 'config.json';
  try {
    console.log(fs.writeFile);
    await fs.writeFile(filePath, fileContent);
    console.log(`File ${filePath} successfully created`);
  } catch (err) {
    console.log('error writing config file: ', err);
  }
};
