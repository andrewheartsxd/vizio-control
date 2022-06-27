import fs from 'fs';

// import { initReadline } from './utils';
// import type { Answer } from './types';

import { createPrompt } from './utils';
import type { PromptOptionsFromType } from './utils';

// type PsShutdownBlockAnswer = Answer & {
//   psShutdownExists?: boolean;
//   psShutdownFilePath?: string | null;
// };

const psShutdownExistsPrompt = {
  type: 'confirm',
  name: 'psShutdownExists',
  message: 'Have you downloaded PsTool and extracted PsShutdown?',
} as const;
const psShutdownExistsQuestion = createPrompt<{
  [psShutdownExistsPrompt.name]: NonNullable<
    PromptOptionsFromType<typeof psShutdownExistsPrompt>['initial']
  >;
}>(psShutdownExistsPrompt);

const psShutdownLocationPrompt = {
  type: 'input',
  name: 'psShutdownLocation',
  message:
    'Please enter the absolute filepath to your extracted PsShutdown.exe:',
} as const;
const psShutdownLocationQuestion = createPrompt<{
  [psShutdownLocationPrompt.name]: PromptOptionsFromType<
    typeof psShutdownLocationPrompt
  >['initial'];
}>(psShutdownLocationPrompt);

const psShutdownBlock = async () => {
  const psShutdownExistsAnswer = await psShutdownExistsQuestion();
  if (psShutdownExistsAnswer[psShutdownExistsPrompt.name]) {
    const psShutdownLocationAnswer = await psShutdownLocationQuestion();
    const test = psShutdownLocationAnswer[psShutdownLocationPrompt.name];
    return await psShutdownLocationQuestion();
    return psShutdownLocationAnswer;
  } else {
    return {
      error:
        'Please download PsTools, extract PsShutdown, and try again (see README)',
    };
  }
};


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
