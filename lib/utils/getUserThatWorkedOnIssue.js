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
const filterStatusAndAssigneeChangesFromChangelog = (changelog) => changelog.filter(({ items }) => items.filter(({ field }) => field === 'assignee').length !== 0);
const getCurrentAssignedUser = (assignee) => {
    if (assignee) {
        return assignee.displayName;
    }
    return null;
};
const getUserThatWorkedOnIssue = (changelog, assignee, issueStartDate, issueEndDate) => {
    const assigneeChangelogs = filterStatusAndAssigneeChangesFromChangelog(changelog);
    if (!assigneeChangelogs.length) {
        return getCurrentAssignedUser(assignee);
    }
    if (!issueStartDate || !issueEndDate) {
        return getCurrentAssignedUser(assignee);
    }
    const startDate = new Date(issueStartDate).getTime();
    const endDate = new Date(issueEndDate).getTime();
    const allUsersAssignedBetweenImplementationOfIssue = assigneeChangelogs.filter(({ created }) => {
        const current = new Date(created).getTime();
        return current >= startDate && current <= endDate;
    });
    if (allUsersAssignedBetweenImplementationOfIssue.length) {
        const assignee = allUsersAssignedBetweenImplementationOfIssue
            .reverse()
            .map(({ items }) => items.filter(({ field }) => field === 'assignee').map(({ toString, fromString }) => [fromString, toString]).reduce((pV, cV) => [...pV, ...cV], []))
            .reduce((pV, cV) => [...pV, ...cV], [])
            .filter((v) => v !== null);
        const uniqueAssignees = Array.from(new Set(assignee))
            .join(',');
        return uniqueAssignees;
    }
    return getCurrentAssignedUser(assignee);
};
exports.default = getUserThatWorkedOnIssue;
