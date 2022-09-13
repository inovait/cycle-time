"use strict";
/*
 * Copyright 2022, Inova IT d.o.o.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const calculate_1 = __importDefault(require("./calculate"));
const showConsoleErrorAndExit = (program, option) => program.error(`error: option ${option.flags} missing`, { exitCode: 1 });
const calculateCommand = (program) => {
    const calculateCommand = new commander_1.Command('calculate')
        .description('calculates cycle time of JIRA project and generates results to .csv file');
    const optionEmail = new commander_1.Option('-e, --email <user@example.com>', 'email that has access to the Jira project for which cycle time is calculated');
    const optionToken = new commander_1.Option('-t, --token <API-token>', 'Jira API token used to authenticate');
    const optionDomain = new commander_1.Option('-d, --domain <your-domain.atlassian.net>', 'domain of attlasian project');
    const optionProjectId = new commander_1.Option('-p, --project <id>', 'attlasian project id or name');
    calculateCommand.addOption(optionEmail);
    calculateCommand.addOption(optionToken);
    calculateCommand.addOption(optionDomain);
    calculateCommand.addOption(optionProjectId);
    calculateCommand
        .action((options) => __awaiter(void 0, void 0, void 0, function* () {
        const areOptionsEmpty = Object.keys(options).length === 0;
        if (areOptionsEmpty) {
            program.help();
        }
        const { email, token, domain, project } = options;
        if (!email) {
            showConsoleErrorAndExit(program, optionEmail);
        }
        if (!token) {
            showConsoleErrorAndExit(program, optionToken);
        }
        if (!domain) {
            showConsoleErrorAndExit(program, optionDomain);
        }
        if (!project) {
            showConsoleErrorAndExit(program, optionProjectId);
        }
        try {
            const fileName = yield (0, calculate_1.default)(email, token, domain, project);
            console.log(`Finished calculating. Wrote results to ${fileName}`);
        }
        catch (e) {
            program.error(`error occured while calculating cycle time: ${e}`, { exitCode: 1 });
        }
    }));
    return calculateCommand;
};
exports.default = calculateCommand;
