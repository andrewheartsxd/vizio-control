import { prompt } from 'enquirer';

export const createPrompt =
  <T extends { [key: string]: unknown }>(promptObject: PromptOptions) =>
  () =>
    prompt<T>(promptObject);

export type PromptParameters = Parameters<typeof prompt>[0];

export type PromptOptions = Exclude<
  PromptParameters,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Function | Array<unknown>
>;

export type ExtractPromptOptionByType<T extends { type: unknown }> = Extract<
  PromptOptions,
  Pick<T, 'type'>
>;
