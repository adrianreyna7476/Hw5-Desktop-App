import chalk from 'chalk'
import prompts from 'prompts';
import { randomInt } from 'crypto';

const ATTEMPT_LIMIT = 3;
const LOWEST = 1;
const HIGHEST = 10

console.log(chalk.magenta.bold(' GUESS THE NUMBER!'));
console.log(chalk.cyan('=============================='));
console.log('Pick a number from ' + LOWEST + ' to ' + HIGHEST + '.')
console.log(chalk.yellow(`You get ${ATTEMPT_LIMIT} tries!`));
console.log(chalk.gray('Rules: whole numbers only. A bad entry still counts as a try.'));
console.log();

const hidden = randomInt(LOWEST, HIGHEST + 1);

const reply = await prompts({
  type: 'text',
  name: 'entry',
  message: `Attempt 1/${ATTEMPT_LIMIT}: Enter your guess`
});

console.log(`You typed: ${reply.entry}`);