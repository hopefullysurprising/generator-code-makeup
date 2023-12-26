import Generator from 'yeoman-generator';
import chalk from 'chalk';

export function logInfoMessage(generator: Generator, message: string) {
  generator.log(
    getGeneratorHeader(generator.description),
  );
  generator.log(
    getInfoMessage(message),
  );
}

function getGeneratorHeader(description?: string): string {
  return chalk.italic.whiteBright(description ? ` ${description}` : 'Unknown generator');
}

function getInfoMessage(message: string): string {
  const formattedMessageLines = message
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line);
  formattedMessageLines.unshift('');
  formattedMessageLines.push('');
  const formattedMessage = formattedMessageLines.join('\n');
  return chalk.green(formattedMessage);
}
