import getUsersThatWorkedOnIssue from '../src/utils/getUsersThatWorkedOnIssue';
import getIssueStartAndEndTransitionDates from '../src/utils/getIssueStartAndEndTransitionDates';
import { JiraChangelog, MainStatusCategoryTypes, JiraUserDetails } from "../src/types";

const testJiraStatusCategories = {
    [MainStatusCategoryTypes["To Do"]]: ['Selected for Development'],
    [MainStatusCategoryTypes["In Progress"]]: ['In Progress', 'In Test'],
    [MainStatusCategoryTypes.Done]: ['Done'],
};

// Changelog author can be fixed value, since it is not checked.
const changelogAuthor: JiraUserDetails = {
    self: '',
    accountId: '',
    emailAddress: '',
    avatarUrls: {},
    displayName: '',
    active: false,
    timeZone: "Europe/Ljubljana",
    accountType: 'atlassian',
};

// Assignee field in ticket.
const assigneeField: JiraUserDetails = {
    self: '',
    accountId: '',
    emailAddress: '',
    avatarUrls: {},
    displayName: "John Doe",
    active: false,
    timeZone: "Europe/Ljubljana",
    accountType: "atlassian",
}

describe('test getUsersThatWorkedOnIssue function', () => {
    it('should return null if no user was assigned to this ticket, only status was changed.', () => {
        // Changelog is sorted descending.
        const ticketChangelog: JiraChangelog[] = [{
            id: '3',
            author: changelogAuthor,
            created: '2022-09-19T13:20:00.000Z',
            items: [{
                field: "status",
                fieldtype: "jira",
                fieldId: "status",
                from: 'In Progress',
                fromString: 'In Progress',
                to: "Done",
                toString: "Done"
            }],
            historyMetadata: {},
        }, {
            id: '2',
            author: changelogAuthor,
            created: '2022-09-19T13:10:00.000Z',
            items: [{
                field: "status",
                fieldtype: "jira",
                fieldId: "status",
                from: 'Selected for Development',
                fromString: 'Selected for Development',
                to: "In Progress",
                toString: "In Progress"
            }],
            historyMetadata: {},
        }, {
            id: '1',
            author: changelogAuthor,
            created: '2022-09-19T13:00:00.000Z',
            items: [{
                field: "description",
                fieldtype: "jira",
                fieldId: "description",
                from: null,
                fromString: null,
                to: null,
                toString: "Test description for ticket"
            }],
            historyMetadata: {},
        }];

        const { issueStartDate, issueEndDate } = getIssueStartAndEndTransitionDates(ticketChangelog, testJiraStatusCategories["In Progress"], testJiraStatusCategories["Done"]);

        expect(getUsersThatWorkedOnIssue(ticketChangelog, null, issueStartDate, issueEndDate)).toBe(null);
    });

    it('should return "Test User 1", when this user was assigned after moving the ticket to In Progress.', () => {
        const assignedUser = 'Test User 1';

        // Changelog is sorted descending.
        const ticketChangelog: JiraChangelog[] = [{
            id: '4',
            author: changelogAuthor,
            created: '2022-09-19T13:30:00.000Z',
            items: [{
                field: "status",
                fieldtype: "jira",
                fieldId: "status",
                from: 'In Progress',
                fromString: 'In Progress',
                to: 'Done',
                toString: 'Done',
            }],
            historyMetadata: {},
        }, {
            id: '3',
            author: changelogAuthor,
            created: '2022-09-19T13:20:00.000Z',
            items: [{
                field: "assignee",
                fieldtype: "jira",
                fieldId: "assignee",
                from: null,
                fromString: null,
                to: assignedUser,
                toString: assignedUser,
            }],
            historyMetadata: {},
        }, {
            id: '2',
            author: changelogAuthor,
            created: '2022-09-19T13:10:00.000Z',
            items: [{
                field: "status",
                fieldtype: "jira",
                fieldId: "status",
                from: 'Selected for Development',
                fromString: 'Selected for Development',
                to: 'In Progress',
                toString: "In Progress"
            }],
            historyMetadata: {},
        }, {
            id: '1',
            author: changelogAuthor,
            created: '2022-09-19T13:00:00.000Z',
            items: [{
                field: "description",
                fieldtype: "jira",
                fieldId: "description",
                from: null,
                fromString: null,
                to: null,
                toString: "Test description for ticket"
            }],
            historyMetadata: {},
        }];

        const { issueStartDate, issueEndDate } = getIssueStartAndEndTransitionDates(ticketChangelog, testJiraStatusCategories["In Progress"], testJiraStatusCategories["Done"]);

        expect(getUsersThatWorkedOnIssue(ticketChangelog, assigneeField, issueStartDate, issueEndDate)).toBe(assignedUser);
    });

    it('should return the assigned user field in ticket, when this user was assigned before moving the ticket to In Progress', () => {
        const assignedUser = 'Test User 1';

        // Changelog is sorted descending.
        const ticketChangelog: JiraChangelog[] = [{
            id: '4',
            author: changelogAuthor,
            created: '2022-09-19T13:30:00.000Z',
            items: [{
                field: "status",
                fieldtype: "jira",
                fieldId: "status",
                from: 'In Progress',
                fromString: 'In Progress',
                to: 'Done',
                toString: 'Done',
            }],
            historyMetadata: {},
        }, {
            id: '3',
            author: changelogAuthor,
            created: '2022-09-19T13:20:00.000Z',
            items: [{
                field: "status",
                fieldtype: "jira",
                fieldId: "status",
                from: 'To Do',
                fromString: 'To Do',
                to: 'In Progress',
                toString: 'In Progress',
            }],
            historyMetadata: {},
        }, {
            id: '2',
            author: changelogAuthor,
            created: '2022-09-19T13:10:00.000Z',
            items: [{
                field: "assignee",
                fieldtype: "jira",
                fieldId: "assignee",
                from: null,
                fromString: null,
                to: assignedUser,
                toString: assignedUser,
            }],
            historyMetadata: {},
        }, {
            id: '1',
            author: changelogAuthor,
            created: '2022-09-19T13:00:00.000Z',
            items: [{
                field: "description",
                fieldtype: "jira",
                fieldId: "description",
                from: null,
                fromString: null,
                to: null,
                toString: "Test description for ticket",
            }],
            historyMetadata: {},
        }];

        const { issueStartDate, issueEndDate } = getIssueStartAndEndTransitionDates(ticketChangelog, testJiraStatusCategories["In Progress"], testJiraStatusCategories["Done"]);

        expect(getUsersThatWorkedOnIssue(ticketChangelog, assigneeField, issueStartDate, issueEndDate)).toBe(assigneeField.displayName);
    });

    it('should return 2 users, when those 2 users were assigned to ticket, while the ticket was in progress', () => {
        const assignedUser1 = 'Test User 1';
        const assignedUser2 = 'Test User 2';

        // Changelog is sorted descending.
        const ticketChangelog: JiraChangelog[] = [{
            id: '6',
            author: changelogAuthor,
            created: '2022-09-19T13:50:00.000Z',
            items: [{
                field: "status",
                fieldtype: "jira",
                fieldId: "status",
                from: 'In Test',
                fromString: 'In Test',
                to: 'Done',
                toString: "Done",
            }],
            historyMetadata: {},
        }, {
            id: '5',
            author: changelogAuthor,
            created: '2022-09-19T13:40:00.000Z',
            items: [{
                field: "assignee",
                fieldtype: "jira",
                fieldId: "assignee",
                from: assignedUser1,
                fromString: assignedUser1,
                to: assignedUser2,
                toString: assignedUser2,
            }],
            historyMetadata: {},
        }, {
            id: '4',
            author: changelogAuthor,
            created: '2022-09-19T13:30:00.000Z',
            items: [{
                field: "status",
                fieldtype: "jira",
                fieldId: "status",
                from: 'In Progress',
                fromString: 'In Progress',
                to: 'In Test',
                toString: "In Test",
            }],
            historyMetadata: {},
        }, {
            id: '3',
            author: changelogAuthor,
            created: '2022-09-19T13:20:00.000Z',
            items: [{
                field: "assignee",
                fieldtype: "jira",
                fieldId: "assignee",
                from: null,
                fromString: null,
                to: assignedUser1,
                toString: assignedUser1,
            }],
            historyMetadata: {},
        }, {
            id: '2',
            author: changelogAuthor,
            created: '2022-09-19T13:10:00.000Z',
            items: [{
                field: "status",
                fieldtype: "jira",
                fieldId: "status",
                from: 'Selected for Development',
                fromString: 'Selected for Development',
                to: 'In Progress',
                toString: "In Progress",
            }],
            historyMetadata: {},
        }, {
            id: '1',
            author: changelogAuthor,
            created: '2022-09-19T13:00:00.000Z',
            items: [{
                field: "description",
                fieldtype: "jira",
                fieldId: "description",
                from: null,
                fromString: null,
                to: null,
                toString: "Test description for ticket",
            }],
            historyMetadata: {},
        }];

        const { issueStartDate, issueEndDate } = getIssueStartAndEndTransitionDates(ticketChangelog, testJiraStatusCategories["In Progress"], testJiraStatusCategories["Done"]);

        expect(getUsersThatWorkedOnIssue(ticketChangelog, assigneeField, issueStartDate, issueEndDate)).toBe(`${[assignedUser1, assignedUser2].join(',')}`);
    });
});
