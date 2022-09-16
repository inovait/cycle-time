import { JiraChangelog } from "../types";
declare const getUsersThatWorkedOnIssue: (changelog: JiraChangelog[], assignee: any, issueStartDate: string, issueEndDate: string) => string | null;
export default getUsersThatWorkedOnIssue;
