import { JiraChangelog } from "../types";
declare const getUserThatWorkedOnIssue: (changelog: JiraChangelog[], assignee: any, issueEndDate: string) => {
    accountId: any;
    displayName: any;
} | null;
export default getUserThatWorkedOnIssue;
