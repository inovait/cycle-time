import fs from 'fs';
import { calculateBusinessMinutesForDates, getIssueStartAndEndTransitionDates, getUserThatWorkedOnIssue, filterOutOutliersUsingIQR, extractMainPropertiesFromIssue, dateUtils } from '../utils';
import { fetchTicketsForProject, fetchStatusesForProject } from '../API';
import { JiraIssueBean, JiraSearchResults, IssueTypeWithStatus, MainStatusCategoryTypes } from '../types';

const getStatuses = async (email: string, token: string, domain: string, project: string) => {
    const statuses: IssueTypeWithStatus[] = await fetchStatusesForProject(email, token, domain, project);

    const mainStatusCategories = {
        [MainStatusCategoryTypes['To Do']]: [] as string[],
        [MainStatusCategoryTypes['In Progress']]: [] as string[],
        [MainStatusCategoryTypes['Done']]: [] as string[],
    };

    statuses.forEach(({ statuses }) => {
        statuses.forEach(({ statusCategory, id }) => {
            mainStatusCategories[statusCategory.name] = Array.from(new Set([...mainStatusCategories[statusCategory.name], id]));
        });
    });

    return mainStatusCategories;
}

const calculate = async (email: string, token: string, domain: string, project: string) => {
    const projectStatuses = await getStatuses(email, token, domain, project);

    const JQL = `project="${encodeURIComponent(project)}" and status!="Backlog" and issueType!="Epic" and created>="${dateUtils.getLastThreeQuartersStartDate()}"`;

    const allIssues: JiraIssueBean[] = [];

    let startAt = 0;
    const MAX_RESULTS = 20;

    const tickets: JiraSearchResults = await fetchTicketsForProject(email, token, domain, startAt, MAX_RESULTS, JQL);
    const { total: TOTAL_ISSUES, issues } = tickets;

    startAt += MAX_RESULTS;
    allIssues.push(...issues);

    for (let i = startAt; i < TOTAL_ISSUES; i += MAX_RESULTS) {
        const tickets: JiraSearchResults = await fetchTicketsForProject(email, token, domain, i, MAX_RESULTS, JQL);
        const { issues } = tickets;
        allIssues.push(...issues);
    }

    const issuesDetails = allIssues.map((issue) => {
        const { fields: { assignee } } = issue;
        const changelog = issue.changelog.histories;
        const { issueStartDate, issueEndDate } = getIssueStartAndEndTransitionDates(changelog, projectStatuses['In Progress'], projectStatuses.Done);
        const whoWorkedOnThisIssue = getUserThatWorkedOnIssue(changelog, assignee, issueEndDate);
        let time;

        try {
            time = calculateBusinessMinutesForDates(issueStartDate, issueEndDate);
        } catch(e) {
            // time = 'Invalid dates.'
        }

        return {
            ...extractMainPropertiesFromIssue(issue),
            issueStartDate,
            issueEndDate,
            time,
            whoWorkedOnThisName: whoWorkedOnThisIssue?.displayName,
            whoWorkedOnThisAccountId: whoWorkedOnThisIssue?.accountId,
        };
    });

    const { withoutOutliers } = filterOutOutliersUsingIQR(issuesDetails);

    const withoutOutliersSorted = withoutOutliers.sort((a, b) =>
        new Date(b.issueEndDate).getTime() - new Date(a.issueEndDate).getTime());

    const headers = Object.keys(issuesDetails[0]);
    const content = [
        headers.join(','),
        ...withoutOutliersSorted.map((a) => Object.values(a).join(',')),
    ].join('\n');

    const fileName = `${project}-exported-progress.csv`;
    fs.writeFile(`${project}-exported-progress.csv`, content, err => {
        if (err) {
            console.error(err);
        }
    });

    return fileName;
}

export default calculate;
