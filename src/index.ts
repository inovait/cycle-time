#!/usr/bin/env node

import figlet from 'figlet';
import { program } from 'commander';
import calculateCommand from './commands/calculateCommand';

const cliName = 'cycle-time';

// Show app name in console.
console.log(
    figlet.textSync(cliName, { horizontalLayout: 'full' })
);

// Add description and version.
program
  .name(cliName)
  .description('CLI for calculating cycle time of JIRA project and generating results to .csv file');

// Add calculate command.
program.addCommand(calculateCommand(program));



program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
