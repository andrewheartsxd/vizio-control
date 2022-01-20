import wol from 'wol';
import type { Device } from 'vizio-smart-cast';

import type { FirstRun } from './firstRun';
import { togglePower } from './utils';
import { Config } from './types';

export type Start = typeof start;

async function start(smartcast: Device, firstRun: FirstRun): Promise<void>;
async function start(
  smartcast: Device,
  config: Config,
  powerCommand: string
): Promise<void>;
async function start(
  smartcast: Device,
  configOrFirstRun?: Config | FirstRun,
  powerCommand?: string
): Promise<void> {
  if (typeof configOrFirstRun === 'function') {
    // call firstRun to pair device and create config file
    console.log(`config.json not found. First run, creating config file...`);
    const firstRun = configOrFirstRun;
    await firstRun(smartcast);
  } else {
    const config = configOrFirstRun;
    if (config && powerCommand) {
      const tv = new smartcast(config.ip, config.authToken);
      try {
        const awake = await wol.wake(config.macAddress);
        if (awake) {
          await togglePower(tv, powerCommand);
        }
      } catch (err) {
        return console.log('Failed to wake TV:', err);
      }
    }
  }
}

export default start;
