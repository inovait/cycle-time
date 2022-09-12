import { JiraIssueBean } from '../types';
declare const extractMainPropertiesFromIssue: (issue: JiraIssueBean) => {
    key: string;
    issueTypeName: any;
    resolutionName: any;
    created: any;
    priorityName: any;
    statusName: any;
    labels: string;
};
export default extractMainPropertiesFromIssue;
