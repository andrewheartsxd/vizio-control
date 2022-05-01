import type { Device } from 'vizio-smart-cast';

import { isPowerCommand } from '../types';

// import type { PowerMode } from '../../types';

const togglePower = async (tv: Device, powerCommand: string): Promise<void> => {
  // const _currentMode = (await tv.power.currentMode()) as PowerMode;
  if (isPowerCommand(powerCommand)) {
    try {
      const response: unknown = await tv.control.power[powerCommand]();
      console.log('power on response: ', response);
    } catch (err) {
      console.log('power on error: ', err);
    }
  }
};

export default togglePower;
