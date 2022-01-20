import { access } from 'fs/promises';
import { constants } from 'fs';

import vizioSmartCast from 'vizio-smart-cast';

import start from './start';
import type { Start } from './start';
import firstRun from './firstRun';
import { isNodeError } from './types';
import type { Config } from './types';

const checkForConfigAndStart = async (start: Start) => {
  try {
    await access('../config.json', constants.R_OK);
    const powerCommand = process.argv[2];
    await start(
      vizioSmartCast,
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../config.json') as Config,
      powerCommand
    );
  } catch (err) {
    if (isNodeError(err) && err.code === 'ENOENT') {
      await start(vizioSmartCast, firstRun);
    } else {
      console.log('checkForConfigAndStart error: ', err);
    }
  }
};

if (process.env.NODE_ENV !== 'test') {
  checkForConfigAndStart(start)
    .then(() => console.log('finished'))
    .catch((err) => console.log(err));
}

export default checkForConfigAndStart;
