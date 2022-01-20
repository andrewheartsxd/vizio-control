import readline from 'readline';
import { promisify } from 'util';

const closeReadlineInterface = (rl: readline.Interface) => () => {
  console.log('closing readline');
  rl.close();
  process.stdin.destroy();
};

export type ReadlineUtil = ReturnType<typeof initReadline>;

type PromisedQuestion = (arg1: string) => Promise<void>;

const promisedQuestionCreator =
  (promisedQuestion: PromisedQuestion) => async (prompt: string) => {
    try {
      const answer = await promisedQuestion(prompt);
      return answer as unknown as string;
    } catch (err) {
      console.error('Question error: ', err);
      return null;
    }
  };

const initReadline = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  // https://stackoverflow.com/questions/66472406/promisify-in-redis-client-violates-eslint-rules
  const promisedQuestion = promisify(rl.question).bind(rl); // eslint-disable-line @typescript-eslint/unbound-method

  return {
    rl,
    askPromisedQuestion: promisedQuestionCreator(promisedQuestion),
    closeReadline: closeReadlineInterface(rl),
  };
};

export default initReadline;
