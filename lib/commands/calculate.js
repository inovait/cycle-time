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
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../utils");
const API_1 = require("../API");
const types_1 = require("../types");
const calculateCycleTimeForEachStatus_1 = __importDefault(require("../utils/calculateCycleTimeForEachStatus"));
const getStatuses = (email, token, domain, project) => __awaiter(void 0, void 0, void 0, function* () {
    const statuses = yield (0, API_1.fetchStatusesForProject)(email, token, domain, project);
    const mainStatusCategories = {
        [types_1.MainStatusCategoryTypes['To Do']]: [],
        [types_1.MainStatusCategoryTypes['In Progress']]: [],
        [types_1.MainStatusCategoryTypes['Done']]: [],
    };
    statuses.forEach(({ statuses }) => {
        statuses.forEach(({ statusCategory, name }) => {
            mainStatusCategories[statusCategory.name] = Array.from(new Set([...mainStatusCategories[statusCategory.name], name]));
        });
    });
    return mainStatusCategories;
});
const calculate = (email, token, domain, project) => __awaiter(void 0, void 0, void 0, function* () {
    const projectStatuses = yield getStatuses(email, token, domain, project);
    const projectStatusesArray = Object.values(projectStatuses).reduce((pV, cV) => [...pV, ...cV], []);
    const JQL = `project="${encodeURIComponent(project)}" and status!="Backlog" and issueType!="Epic" and created>="${utils_1.dateUtils.getLastThreeQuartersStartDate()}"`;
    const allIssues = [];
    let startAt = 0;
    const MAX_RESULTS = 20;
    const tickets = yield (0, API_1.fetchTicketsForProject)(email, token, domain, startAt, MAX_RESULTS, JQL);
    const { total: TOTAL_ISSUES, issues } = tickets;
    startAt += MAX_RESULTS;
    allIssues.push(...issues);
    for (let i = startAt; i < TOTAL_ISSUES; i += MAX_RESULTS) {
        const tickets = yield (0, API_1.fetchTicketsForProject)(email, token, domain, i, MAX_RESULTS, JQL);
        const { issues } = tickets;
        allIssues.push(...issues);
    }
    const issuesDetails = allIssues.map((issue) => {
        const { fields: { assignee } } = issue;
        const changelog = issue.changelog.histories;
        const { issueStartDate, issueEndDate } = (0, utils_1.getIssueStartAndEndTransitionDates)(changelog, projectStatuses['In Progress'], projectStatuses.Done);
        const whoWorkedOnThisIssue = (0, utils_1.getUsersThatWorkedOnIssue)(changelog, assignee, issueStartDate, issueEndDate);
        const allStatusesCycleTime = (0, calculateCycleTimeForEachStatus_1.default)(Object.keys(projectStatusesArray), changelog);
        let time;
        try {
            time = (0, utils_1.calculateBusinessMinutesForDates)(issueStartDate, issueEndDate);
        }
        catch (e) {
            // time = 'Invalid dates.'
        }
        return Object.assign(Object.assign(Object.assign({}, (0, utils_1.extractMainPropertiesFromIssue)(issue)), { issueStartDate,
            issueEndDate,
            time, whoWorkedOnThisName: `"${whoWorkedOnThisIssue !== null && whoWorkedOnThisIssue !== void 0 ? whoWorkedOnThisIssue : ""}"` }), allStatusesCycleTime);
    });
    const { withoutOutliers } = (0, utils_1.filterOutOutliersUsingIQR)(issuesDetails);
    const withoutOutliersSorted = withoutOutliers.sort((a, b) => new Date(b.issueEndDate).getTime() - new Date(a.issueEndDate).getTime());
    const headers = Object.keys(issuesDetails[0]);
    const content = [
        headers.join(','),
        ...withoutOutliersSorted.map((a) => Object.values(a).join(',')),
    ].join('\n');
    const fileName = `${project}-exported-progress.csv`;
    fs_1.default.writeFile(`${project}-exported-progress.csv`, content, err => {
        if (err) {
            console.error(err);
        }
    });
    return fileName;
});
exports.default = calculate;
