import fs from 'fs';

// import { initReadline } from './utils';
// import type { Answer } from './types';

import { createPrompt } from './utils';
import type { ExtractPromptOptionByType } from './utils';

// type PsShutdownBlockAnswer = Answer & {
//   psShutdownExists?: boolean;
//   psShutdownFilePath?: string | null;
// };

const psShutdownExistsPrompt = {
  type: 'confirm',
  name: 'psShutdownExists',
  message: 'Have you downloaded PsTool and extracted PsShutdown?',
} as const;
const psShutdownBlock = createPrompt<{
  [psShutdownExistsPrompt.name]: NonNullable<
    ExtractPromptOptionByType<typeof psShutdownExistsPrompt>['initial']
  >;
}>(psShutdownExistsPrompt);

// const psShutdownBlockOld = async (
//   askPromisedQuestion: ReturnType<typeof initReadline>['askPromisedQuestion']
// ): Promise<PsShutdownBlockAnswer> => {
//   const psShutdownExists = (
//     (await askPromisedQuestion(
//       'Have you downloaded PsTool and extracted PsShutdown? [Y/n] '
//     )) || 'y'
//   ).toLocaleLowerCase();
//   let psShutdownFilePath;
//   if (psShutdownExists === 'y') {
//     while (
//       !psShutdownFilePath &&
//       (psShutdownFilePath ? fs.existsSync(psShutdownFilePath) : true)
//     ) {
//       psShutdownFilePath = await askPromisedQuestion(
//         'Please enter the absolute filepath to your extracted PsShutdown.exe: '
//       );
//     }
//     return {
//       proceed: true,
//       error: null,
//       psShutdownExists: !!psShutdownExists,
//       psShutdownFilePath,
//     };
//   } else {
//     return {
//       proceed: false,
//       error:
//         'Please download PsTools, extract PsShutdown, and try again (see README)',
//     };
//   }
// };

export default psShutdownBlock;
