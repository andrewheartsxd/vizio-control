import type { Device } from 'vizio-smart-cast';

// import type { PowerMode } from '../../types';

const togglePower = async (tv: Device, powerCommand: string): Promise<void> => {
  // const _currentMode = (await tv.power.currentMode()) as PowerMode;
  if (powerCommand === 'on') {
    try {
      const response: unknown = await tv.control.power.on();
      console.log('power on response: ', response);
    } catch (err) {
      console.log('power on error: ', err);
    }
  }
  if (powerCommand === 'off') {
    try {
      const response: unknown = await tv.control.power.off();
      console.log('power off response: ', response);
    } catch (err) {
      console.log('power off error: ', err);
    }
  }
};

export default togglePower;
