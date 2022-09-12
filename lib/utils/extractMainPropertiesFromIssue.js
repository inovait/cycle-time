"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractMainPropertiesFromIssue = (issue) => {
    const { issuetype: { name: issueTypeName }, resolution, created, priority: { name: priorityName }, status: { name: statusName }, labels, } = issue.fields;
    return {
        key: issue.key,
        issueTypeName,
        resolutionName: resolution && resolution.name,
        created,
        priorityName,
        statusName,
        labels: labels ? `"${labels.join(',')}"` : '',
    };
};
exports.default = extractMainPropertiesFromIssue;
