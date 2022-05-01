import { promises } from 'fs';
import { parse, sep } from 'path';
import readline, { AsyncCompleter } from 'readline';
import { promisify } from 'util';

// modified from: https://stackoverflow.com/a/64686218/4459209
const fileSystemCompleter: AsyncCompleter = (line: string, callback) => {
  let { dir } = parse(line);
  const { base } = parse(line);
  promises
    .readdir(dir, { withFileTypes: true })
    .then((dirEntries) => {
      // for an exact match that is a directory, read the contents of the directory
      if (
        dirEntries.find((entry) => entry.name === base && entry.isDirectory())
      ) {
        dir =
          dir === '/' || dir === sep ? `${dir}${base}` : `${dir}${sep}${base}`;
        return promises.readdir(dir, { withFileTypes: true });
      }
      return dirEntries.filter((entry) => entry.name.startsWith(base));
    })
    .then((matchingEntries) => {
      if (dir === sep || dir === '/') {
        dir = '';
      }
      const hits = matchingEntries
        .filter((entry) => entry.isFile() || entry.isDirectory())
        .map(
          (entry) =>
            `${dir}${sep}${entry.name}${
              entry.isDirectory() && !entry.name.endsWith(sep) ? sep : ''
            }`
        );
      callback(null, [hits, line]);
    })
    .catch(() => callback(null, [[], line]));
};

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
    completer: fileSystemCompleter,
  });
  // https://stackoverflow.com/questions/66472406/promisify-in-redis-client-violates-eslint-rules
  const promisedQuestion = promisify(rl.question).bind(rl); // eslint-disable-line @typescript-eslint/unbound-method

  const closeReadline = closeReadlineInterface(rl);

  rl.on('SIGINT', () => {
    closeReadline();
  });

  return {
    rl,
    askPromisedQuestion: promisedQuestionCreator(promisedQuestion),
    closeReadline,
  };
};

export default initReadline;
