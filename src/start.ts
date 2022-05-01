import wol from 'wol';
import type { Device } from 'vizio-smart-cast';

import type { FirstRun } from './firstRun';
import { togglePower, switchInput } from './utils';
import { Config, isPowerCommand } from './types';

export type Start = typeof start;

async function start(smartcast: Device, firstRun: FirstRun): Promise<void>;
async function start(
  smartcast: Device,
  config: Config,
  powerCommand?: string
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
    if (config && isPowerCommand(powerCommand)) {
      const { ip, authToken, macAddress, defaultInputName } = config;
      const tv = new smartcast(ip, authToken);
      try {
        const awake = await wol.wake(macAddress);
        if (awake) {
          await togglePower(tv, powerCommand);
          if (defaultInputName && powerCommand === 'on') {
            await switchInput(tv, defaultInputName);
          }
        }
      } catch (err) {
        return console.log('Failed to wake TV:', err);
      }
    } else {
      return console.log(
        `Config is not defined or Invalid power command (Use 'on', 'off', or 'toggle')`
      );
    }
  }
}

export default start;
