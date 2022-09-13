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
const getUserThatWorkedOnIssue = (changelog, assignee, issueEndDate) => {
    const assigneeChangelogs = filterStatusAndAssigneeChangesFromChangelog(changelog);
    if (!assigneeChangelogs.length && assignee) {
        return {
            accountId: assignee.accountId,
            displayName: assignee.displayName,
        };
    }
    const userAssignedBeforeWorkFinished = assigneeChangelogs.filter(({ created }) => new Date(issueEndDate).getTime() > new Date(created).getTime())[0];
    if (userAssignedBeforeWorkFinished) {
        const assignee = userAssignedBeforeWorkFinished.items.find(({ field }) => field === 'assignee');
        return {
            accountId: assignee.to,
            displayName: assignee.toString,
        };
    }
    if (assignee) {
        return {
            accountId: assignee.accountId,
            displayName: assignee.displayName,
        };
    }
    return null;
};
exports.default = getUserThatWorkedOnIssue;
