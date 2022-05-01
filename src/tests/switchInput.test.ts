import type { Device } from 'vizio-smart-cast';

import { switchInput } from '../utils';
import type { CurrentInputResponse } from '../types';

describe('switchInput', () => {
  const defaultInput = 'defaultInput';
  const mockSetInput = jest.fn();
  const mockCurrentInput = jest.fn(
    () =>
      ({
        ITEMS: [{ VALUE: 'currentInput' }],
      } as CurrentInputResponse)
  );

  const mockTv = {
    input: {
      set: mockSetInput,
      current: mockCurrentInput,
    },
  };

  afterEach(() => {
    mockSetInput.mockClear();
  });

  it("should switch to passed input if it's not the current input", async () => {
    await switchInput(mockTv as unknown as Device, defaultInput);
    expect(mockSetInput).toHaveBeenCalledWith(defaultInput);
  });

  it('should not switch inputs if the passed input is the current input', async () => {
    await switchInput(mockTv as unknown as Device, 'currentInput');
    expect(mockSetInput).not.toBeCalled();
  });
});
