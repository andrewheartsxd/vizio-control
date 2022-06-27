import { prompt } from 'enquirer';

export const createPrompt =
  <T extends { [key: string]: unknown }>(promptObject: PromptOptions) =>
  () =>
    prompt<T>(promptObject);

export type PromptParameters = Parameters<typeof prompt>[0];

export type PromptOptions = Extract<
  Exclude<
    PromptParameters,
    // eslint-disable-next-line @typescript-eslint/ban-types
    Function | Array<unknown>
  >,
  { type: string }
>;
// export type PromptOptions = Exclude<
//   PromptParameters,
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   Function | Array<unknown>
// >;

// export type ExtractPromptOptionsByType<T extends { type: string }> = Extract<
//   PromptOptions,
//   Pick<T, 'type'>
// >;

/* TOOD: Make this less brittle? */
/* copied from enquirer/index.d.ts */
// type ArrayPromptOptionsType = {
//   type:
//     | 'autocomplete'
//     | 'editable'
//     | 'form'
//     | 'multiselect'
//     | 'select'
//     | 'survey'
//     | 'list'
//     | 'scale';
// };
// type BooleanPromptOptionsType = { type: 'confirm' };
// type StringPromptOptionsType = {
//   type: 'input' | 'invisible' | 'list' | 'password' | 'text';
// };
// type NumberPromptOptionsType = { type: 'numeral' };
// type SnippetPromptOptionsType = { type: 'snippet' };
// type SortPromptOptionsType = { type: 'sort' };
/* /////////////////////////////// */

// type GetPromptOptionsType<T extends { type: string }> =
//   T['type'] extends ArrayPromptOptionsType['type']
//     ? ArrayPromptOptionsType
//     : T extends BooleanPromptOptionsType
//     ? BooleanPromptOptionsType
//     : T extends StringPromptOptionsType
//     ? StringPromptOptionsType
//     : T extends NumberPromptOptionsType
//     ? NumberPromptOptionsType
//     : T extends SnippetPromptOptionsType
//     ? SnippetPromptOptionsType
//     : T extends SortPromptOptionsType
//     ? SortPromptOptionsType
//     : T;

// export type PromptOptionsFromType<T extends { type: string }> =
//   ExtractPromptOptionsByType<GetPromptOptionsType<T>>;

type DiscriminateUnion<T, K extends keyof T, V extends T[K]> = T extends Record<
  K,
  V
>
  ? T
  : T extends Record<K, infer U>
  ? V extends U
    ? T
    : never
  : never;

export type PromptOptionsFromType<T extends { type: PromptOptions['type'] }> =
  Extract<
    DiscriminateUnion<PromptOptions, 'type', T['type']>,
    { type: string }
  >;
