"use strict";
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
