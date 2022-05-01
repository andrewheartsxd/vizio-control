import fs from 'fs/promises';
import { sep } from 'path';

import type { Config } from '../types';
import { CONFIG_FILE_NAME, CONFIG_FILE_DIRECTORY } from '../enums';

export const createConfig = (
  ip: string,
  authToken: string,
  macAddress: string,
  defaultInputName?: string,
  psShutdownFilePath?: string
): Config => ({
  ip,
  authToken,
  macAddress,
  defaultInputName,
  psShutdownFilePath,
});

export const writeConfig = async (config: Config) => {
  const fileContent = JSON.stringify(config);
  const fileName = CONFIG_FILE_NAME;
  await writeFile(CONFIG_FILE_DIRECTORY, fileName, fileContent);
};

export const writeFile = async (
  fileDirectory: string,
  fileName: string,
  fileContent: string
) => {
  try {
    await fs.writeFile(`${fileDirectory}${sep}${fileName}`, fileContent);
    console.log(`File ${fileName} successfully created in ${fileDirectory}`);
  } catch (err) {
    console.log(`error writing file ${fileName}: `, err);
  }
};
