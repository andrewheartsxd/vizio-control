import type { Device } from 'vizio-smart-cast';

import { togglePower } from '../utils';

describe('togglePower', () => {
  const mockTvOn = jest.fn();
  const mockTvOff = jest.fn();

  const mockTv = {
    control: {
      power: {
        on: mockTvOn,
        off: mockTvOff,
      },
    },
  };

  it("should turn the TV on when given the 'on' command", async () => {
    await togglePower(mockTv as unknown as Device, 'on');
    expect(mockTvOn).toHaveBeenCalled();
  });

  it("should turn the TV off when given the 'off' command", async () => {
    await togglePower(mockTv as unknown as Device, 'off');
    expect(mockTvOff).toHaveBeenCalled();
  });
});
