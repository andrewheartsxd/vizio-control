const mockAnswer = 'this is the way';
const mockReadlineQuestion = jest.fn().mockResolvedValue(mockAnswer);
const mockReadlineClose = jest.fn();
const mockReadlineOn = jest.fn();
const mockReadlineCreateInterface = jest.fn(() => ({
  question: mockReadlineQuestion,
  close: mockReadlineClose,
  on: mockReadlineOn,
}));

jest.mock('readline', () => ({
  createInterface: mockReadlineCreateInterface,
}));

jest.mock('util', () => ({
  promisify: (fn: unknown) => fn,
}));

import initReadline from '../utils/readlineUtils';

describe('readlineUtils', () => {
  it('should create a readline utility', async () => {
    const readline = initReadline();
    expect(mockReadlineCreateInterface).toBeCalled();

    const answer = await readline.askPromisedQuestion('Test Question');
    expect(answer).toBe(mockAnswer);

    readline.closeReadline();
    expect(mockReadlineClose).toBeCalled();
  });
});
