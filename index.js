import chalk from 'chalk'
import prompts from 'prompts';
import { randomInt } from 'crypto';
import fs from "fs";

const ATTEMPT_LIMIT = 3;
const LOWEST = 1;
const HIGHEST = 10
const OUTPUT_PATH = 'results.txt'

let transcript = [];

function parseEntry(raw) {
  let cleaned = raw.trim();
  if (cleaned === '') throw new Error('A guess is required.');

  let n = Number(cleaned);
  if (!Number.isInteger(n)) {
    if (isNaN(n)) throw new Error('That is not a number.');
    throw new Error('Decimals are not allowed.');
  }

  if (n < LOWEST) { throw new Error('Guess must be at least ' + LOWEST + '.'); }
  if (n > HIGHEST) {
    throw new Error('Guess cannot exceed ' + HIGHEST + '.')
  }
  return n;
}

console.log(chalk.magenta.bold(' GUESS THE NUMBER!'));
console.log(chalk.cyan('=============================='));
console.log('Pick a number from ' + LOWEST + ' to ' + HIGHEST + '.')
console.log(chalk.yellow(`You get ${ATTEMPT_LIMIT} tries!`));
console.log(chalk.gray('Rules: whole numbers only. A bad entry still counts as a try.'));
console.log();

transcript.push('GUESS THE NUMBER!');
transcript.push('Pick a number from ' + LOWEST + ' to ' + HIGHEST + '.');
transcript.push(`You get ${ATTEMPT_LIMIT} tries!`);
transcript.push('Rules: whole numbers only. A bad entry still counts as a try.');

const hidden = randomInt(LOWEST, HIGHEST + 1);
let round = 0
let found = false;

while (round < ATTEMPT_LIMIT && found == false) {
  round++;
  const reply = await prompts({
    type: 'text',
    name: 'entry',
    message: chalk.bold(`Attempt ${round}/${ATTEMPT_LIMIT}: Enter your guess`)
  }, {
    onCancel: function () {
      console.log('Quit early.');
      process.exit(0);
    }
  });

  transcript.push(`Attempt ${round}/${ATTEMPT_LIMIT}: Enter your guess ... ${reply.entry}`);

  try {
    let pick = parseEntry(reply.entry);
    if (pick === hidden) found = true;
    else if (pick < hidden) {
      console.log(chalk.yellow('Too low!'));
      transcript.push('Too low!');
    } else {
      console.log(chalk.yellow('Too high!'));
      transcript.push('Too high!');
    }
  } catch (err) {
    console.log(chalk.red(err.message));
    transcript.push(err.message);
  }

  if (!found) console.log();
}

console.log();
if (found) {
  console.log(chalk.greenBright.bold('WINNER!'));
  console.log('You found ' + hidden + ' in ' + round + ' attempt(s).');
  transcript.push('WINNER!');
  transcript.push('You found ' + hidden + ' in ' + round + ' attempt(s).')
}
else {
  console.log(chalk.red.bold('GAME OVER!'))
  console.log(`The secret number was ${hidden}.`);
  transcript.push('GAME OVER!');
  transcript.push(`The secret number was ${hidden}.`);
}

console.log()
console.log(chalk.magenta.bold('Thanks for playing!'));
transcript.push('Thanks for playing!');

fs.writeFileSync(OUTPUT_PATH, transcript.join('\n'));