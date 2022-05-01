import type { Device } from 'vizio-smart-cast';

import type { CurrentInputResponse } from '../types';

const switchInput = async (tv: Device, input: string): Promise<void> => {
  try {
    const currentInput = (await tv.input.current()) as CurrentInputResponse;
    if (currentInput.ITEMS[0].VALUE !== input) {
      await tv.input.set(input);
    }
  } catch (err) {
    console.log('error getting inputs: ', err);
  }
};

export default switchInput;
