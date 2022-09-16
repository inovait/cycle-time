import { JiraChangelog } from "../types";
declare const getUserThatWorkedOnIssue: (changelog: JiraChangelog[], assignee: any, issueStartDate: string, issueEndDate: string) => string | null;
export default getUserThatWorkedOnIssue;
