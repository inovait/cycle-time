import { JiraIssueBean } from '../types';

const extractMainPropertiesFromIssue = (issue: JiraIssueBean) => {
    const {
      issuetype: { name: issueTypeName },
      resolution,
      created,
      priority: { name: priorityName },
      status: { name: statusName },
      labels,
    } = issue.fields;

    return {
      key: issue.key,
      issueTypeName,
      resolutionName: resolution && resolution.name,
      created,
      priorityName,
      statusName,
      labels: labels ? `"${labels.join(',')}"` : '',
    };
}

export default extractMainPropertiesFromIssue;
