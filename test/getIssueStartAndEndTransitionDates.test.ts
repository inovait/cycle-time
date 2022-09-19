import getIssueStartAndEndTransitionDates from '../src/utils/getIssueStartAndEndTransitionDates';

import { JiraChangelog, MainStatusCategoryTypes, JiraUserDetails } from "../src/types";

const BacklogStatus = 'Backlog';

const testJiraStatusCategories = {
    [MainStatusCategoryTypes["To Do"]]: ['Selected for Development'],
    [MainStatusCategoryTypes["In Progress"]]: ['In Progress', 'In Test'],
    [MainStatusCategoryTypes.Done]: ['Verified', 'Done'],
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

describe('test getIssueStartAndEndTransitionDates function', () => {
    it('should return empty string for issueStartDate, when ticket has been moved to Done, without other transitions', () => {
        // Changelog is sorted descending.
        const ticketChangelog: JiraChangelog[] = [{
            id: '2',
            author: changelogAuthor,
            created: '2022-09-19T13:10:00.000Z',
            items: [{
                field: "status",
                fieldtype: "jira",
                fieldId: "status",
                from: BacklogStatus,
                fromString: BacklogStatus,
                to: "Done",
                toString: "Done"
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

        expect(getIssueStartAndEndTransitionDates(ticketChangelog, testJiraStatusCategories['In Progress'], testJiraStatusCategories['Done'])).toEqual({ issueStartDate: '', issueEndDate: '2022-09-19T13:10:00.000Z' });
    });

    it('should return the first timestamp of status change to Done, after ticket was reopened', () => {
        // Changelog is sorted descending.
        const ticketChangelog: JiraChangelog[] = [{
            id: '6',
            author: changelogAuthor,
            created: '2022-09-19T13:50:00.000Z',
            items: [{
                field: "status",
                fieldtype: "jira",
                fieldId: "status",
                from: "In Progress",
                fromString: "In Progress",
                to: "Done",
                toString: "Done"
            }],
            historyMetadata: {},
        }, {
            id: '5',
            author: changelogAuthor,
            created: '2022-09-19T13:40:00.000Z',
            items: [{
                field: "status",
                fieldtype: "jira",
                fieldId: "status",
                from: "Done",
                fromString: "Done",
                to: "In Progress",
                toString: "In Progress"
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
                from: "In Test",
                fromString: "In Test",
                to: "Done",
                toString: "Done"
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
                from: "In Progress",
                fromString: "In Progress",
                to: "In Test",
                toString: "In Test"
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
                from: "Selected for Development",
                fromString: "Selected for Development",
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

        expect(getIssueStartAndEndTransitionDates(ticketChangelog, testJiraStatusCategories["In Progress"], testJiraStatusCategories['Done'])).toEqual({ issueStartDate: '2022-09-19T13:10:00.000Z', issueEndDate: '2022-09-19T13:50:00.000Z' });
    });

    it('should return the first timestamp of moving the ticket to In Progress, even if ticket was reopened', () => {
        // Changelog is sorted descending.
        const ticketChangelog: JiraChangelog[] = [{
            id: '6',
            author: changelogAuthor,
            created: '2022-09-19T13:50:00.000Z',
            items: [{
                field: "status",
                fieldtype: "jira",
                fieldId: "status",
                from: "In Progress",
                fromString: "In Progress",
                to: "Done",
                toString: "Done"
            }],
            historyMetadata: {},
        }, {
            id: '5',
            author: changelogAuthor,
            created: '2022-09-19T13:40:00.000Z',
            items: [{
                field: "status",
                fieldtype: "jira",
                fieldId: "status",
                from: "Done",
                fromString: "Done",
                to: "In Progress",
                toString: "In Progress"
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
                from: "In Test",
                fromString: "In Test",
                to: "Done",
                toString: "Done"
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
                from: "In Progress",
                fromString: "In Progress",
                to: "In Test",
                toString: "In Test"
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
                from: "Selected for Development",
                fromString: "Selected for Development",
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

        expect(getIssueStartAndEndTransitionDates(ticketChangelog, testJiraStatusCategories["In Progress"], testJiraStatusCategories["Done"])).toEqual({ issueStartDate: '2022-09-19T13:10:00.000Z', issueEndDate: '2022-09-19T13:50:00.000Z' });
    });

    it('should return the first timestamp of moving the ticket to Done, even if there are multiple changelogs for different Done statuses', () => {
        // Changelog is sorted descending.
        const ticketChangelog: JiraChangelog[] = [{
            id: '5',
            author: changelogAuthor,
            created: '2022-09-19T13:40:00.000Z',
            items: [{
                field: "status",
                fieldtype: "jira",
                fieldId: "status",
                from: "Verified",
                fromString: "Verified",
                to: "Done",
                toString: "Done"
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
                from: "In Test",
                fromString: "In Test",
                to: "Verified",
                toString: "Verified"
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
                from: "In Progress",
                fromString: "In Progress",
                to: "In Test",
                toString: "In Test"
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
                from: "Selected for Development",
                fromString: "Selected for Development",
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

        expect(getIssueStartAndEndTransitionDates(ticketChangelog, testJiraStatusCategories["In Progress"], testJiraStatusCategories["Done"])).toEqual({ issueStartDate: '2022-09-19T13:10:00.000Z', issueEndDate: '2022-09-19T13:30:00.000Z' });
    });
});
