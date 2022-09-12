import { JiraChangelog } from "../types";
declare const getIssueStartAndEndTransitionDates: (changelog: JiraChangelog[], statusesInProgress: string[], statusesInDone: string[]) => {
    issueStartDate: string;
    issueEndDate: string;
};
export default getIssueStartAndEndTransitionDates;
