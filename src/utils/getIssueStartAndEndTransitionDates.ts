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
