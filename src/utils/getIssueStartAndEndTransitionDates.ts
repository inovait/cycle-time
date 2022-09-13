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

import { JiraChangelog } from "../types";

const getIssueStartAndEndTransitionDates = (changelog: JiraChangelog[], statusesInProgress: string[], statusesInDone: string[]) => {
    // all changelogs are sorted descending by date created.

    const issueStartDate = changelog
        .filter(({ items }) => items.filter(({ to, field, from }) => field === 'status' && statusesInProgress.includes(to) && to !== from).length !== 0)
        .map(({ created }) => ({ created }))
        .pop();

    const issueEndDate = changelog
        .filter(({ items }) => items.filter(({ to, field, from }) => field === 'status' && statusesInDone.includes(to) && to !== from).length !== 0)
        .map(({ created }) => ({ created }))
        [0];

    return {
        issueStartDate: issueStartDate?.created ? new Date(issueStartDate.created).toISOString() : '',
        issueEndDate: issueEndDate?.created ? new Date(issueEndDate.created).toISOString() : '',
    };
};

export default getIssueStartAndEndTransitionDates;
