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

import { Command, Option } from 'commander';
import calculate from './calculate';

const showConsoleErrorAndExit = (program: Command, option: Option) =>
    program.error(`error: option ${option.flags} missing`, { exitCode: 1 });

const calculateCommand = (program: Command) => {
    const calculateCommand = new Command('calculate')
        .description('calculates cycle time of JIRA project and generates results to .csv file');

    const optionEmail = new Option('-e, --email <user@example.com>', 'email that has access to the Jira project for which cycle time is calculated');
    const optionToken = new Option('-t, --token <API-token>', 'Jira API token used to authenticate');
    const optionDomain = new Option('-d, --domain <your-domain.atlassian.net>', 'domain of attlasian project');
    const optionProjectId = new Option('-p, --project <id>', 'attlasian project id or name');

    calculateCommand.addOption(optionEmail);
    calculateCommand.addOption(optionToken);
    calculateCommand.addOption(optionDomain);
    calculateCommand.addOption(optionProjectId);

    calculateCommand
        .action(async (options) => {
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
                const fileName = await calculate(email, token, domain, project);

                console.log(`Finished calculating. Wrote results to ${fileName}`);
            } catch(e) {
                program.error(`error occured while calculating cycle time: ${e}`, { exitCode: 1 });
            }
        });

    return calculateCommand;
}

export default calculateCommand;
