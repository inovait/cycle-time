import { JiraChangelog } from "../types";

const filterStatusAndAssigneeChangesFromChangelog = (changelog: JiraChangelog[]) =>
    changelog.filter(({ items }) => items.filter(({ field }) => field === 'assignee').length !== 0);

const getUserThatWorkedOnIssue = (changelog: JiraChangelog[], assignee: any, issueEndDate: string) => {
    const assigneeChangelogs = filterStatusAndAssigneeChangesFromChangelog(changelog);

    if (!assigneeChangelogs.length && assignee) {
        return {
            accountId: assignee.accountId,
            displayName: assignee.displayName,
        };
    }

    const userAssignedBeforeWorkFinished = assigneeChangelogs.filter(({ created }) =>
        new Date(issueEndDate).getTime() > new Date(created).getTime())[0];

    if (userAssignedBeforeWorkFinished) {
        const assignee = userAssignedBeforeWorkFinished.items.find(({ field }) => field === 'assignee');

        return {
            accountId: assignee!.to,
            displayName: assignee!.toString,
        }
    }

    if (assignee) {
        return {
            accountId: assignee.accountId,
            displayName: assignee.displayName,
        };
    }

    return null;
};

export default getUserThatWorkedOnIssue;
