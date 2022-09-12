#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const figlet_1 = __importDefault(require("figlet"));
const commander_1 = require("commander");
const calculateCommand_1 = __importDefault(require("./commands/calculateCommand"));
const cliName = 'cycle-time';
// Show app name in console.
console.log(figlet_1.default.textSync(cliName, { horizontalLayout: 'full' }));
// Add description and version.
commander_1.program
    .name(cliName)
    .description('CLI for calculating cycle time of JIRA project and generating results to .csv file');
// Add calculate command.
commander_1.program.addCommand((0, calculateCommand_1.default)(commander_1.program));
commander_1.program.parse(process.argv);
if (!process.argv.slice(2).length) {
    commander_1.program.outputHelp();
}
