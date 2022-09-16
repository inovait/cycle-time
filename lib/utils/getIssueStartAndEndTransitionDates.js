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
Object.defineProperty(exports, "__esModule", { value: true });
const getIssueStartAndEndTransitionDates = (changelog, statusesInProgress, statusesInDone) => {
    // all changelogs are sorted descending by date created.
    const issueStartDate = changelog
        .filter(({ items }) => items.filter(({ toString, field, fromString }) => field === 'status' && statusesInProgress.includes(toString) && toString !== fromString).length !== 0)
        .map(({ created }) => ({ created }))
        .pop();
    const issueEndDate = changelog
        .filter(({ items }) => items.filter(({ toString, field, fromString }) => field === 'status' && statusesInDone.includes(toString) && toString !== fromString).length !== 0)
        .map(({ created }) => ({ created }))
        .pop();
    return {
        issueStartDate: (issueStartDate === null || issueStartDate === void 0 ? void 0 : issueStartDate.created) ? new Date(issueStartDate.created).toISOString() : '',
        issueEndDate: (issueEndDate === null || issueEndDate === void 0 ? void 0 : issueEndDate.created) ? new Date(issueEndDate.created).toISOString() : '',
    };
};
exports.default = getIssueStartAndEndTransitionDates;
