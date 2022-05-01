import { sep } from 'path';

import {
  TURN_ON_BAT_FILE_NAME,
  TURN_OFF_BAT_FILE_NAME,
  TURN_OFF_AND_SLEEP_BAT_FILE_NAME,
} from '../enums';
import { writeFile } from './configUtils';

const writeBatFiles = async (
  fileDirectory: string,
  psShutdownFilePath: string
) => {
  await writeTurnOnBatFile(fileDirectory);
  await writeTurnOffBatFile(fileDirectory);
  await writeTurnOffAndSleepBatFile(fileDirectory, psShutdownFilePath);
};

const writeTurnOnBatFile = async (fileDirectory: string) => {
  console.log('attempting to write TurnOnVizio .bat file...');
  const turnOnBatFileContent = `node ${fileDirectory}${sep}app.js on`;
  await writeFile(fileDirectory, TURN_ON_BAT_FILE_NAME, turnOnBatFileContent);
};

const writeTurnOffBatFile = async (fileDirectory: string) => {
  console.log('attempting to write TurnOffVizio .bat file...');
  const turnOffBatFileContent = `node ${fileDirectory}${sep}app.js off`;
  await writeFile(fileDirectory, TURN_OFF_BAT_FILE_NAME, turnOffBatFileContent);
};

const writeTurnOffAndSleepBatFile = async (
  fileDirectory: string,
  psShutdownFilePath: string
) => {
  console.log('attempting to write TurnOffVizioAndSleep .bat file...');
  const turnOffAndSleepBatFileContent = `call ${fileDirectory}${sep}${TURN_OFF_BAT_FILE_NAME} && ${psShutdownFilePath} -d -t 0 -accepteula`;
  await writeFile(
    fileDirectory,
    TURN_OFF_AND_SLEEP_BAT_FILE_NAME,
    turnOffAndSleepBatFileContent
  );
};

export default writeBatFiles;
