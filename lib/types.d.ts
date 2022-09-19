declare type JiraObject = {
    [key: string]: any;
};
export declare type JiraUserDetails = {
    self: string;
    accountId: string;
    emailAddress: string | null;
    avatarUrls: JiraObject;
    displayName: string;
    active: boolean;
    timeZone: string | null;
    accountType: 'atlassian' | 'app' | 'customer';
};
export declare type JiraChangeDetails = {
    field: string;
    fieldtype: string;
    fieldId: string;
    from: string | null;
    fromString: string | null;
    to: string | null;
    toString: string | null;
};
export declare type JiraChangelog = {
    id: string;
    author: JiraUserDetails;
    created: string;
    items: JiraChangeDetails[];
    historyMetadata: JiraObject;
};
declare type JiraPageOfChangelogs = {
    startAt: number;
    maxResults: number;
    total: number;
    histories: JiraChangelog[];
};
export declare type JiraIssueBean = {
    expand: string;
    id: string;
    self: string;
    key: string;
    renderedFields: JiraObject;
    properties: JiraObject;
    names: JiraObject;
    schema: JiraObject;
    transitions: JiraObject[];
    operations: JiraObject;
    editmeta: JiraObject;
    changelog: JiraPageOfChangelogs;
    versionedRepresentations: JiraObject;
    fieldsToInclude: JiraObject;
    fields: JiraObject;
};
export declare type JiraSearchResults = {
    expand: string;
    startAt: number;
    maxResults: number;
    total: number;
    issues: JiraIssueBean[];
    warningMessages: string[];
    names: JiraObject;
    schema: JiraObject;
};
declare type StatusCategory = {
    self: string;
    id: number;
    key: string;
    colorName: string;
    name: MainStatusCategoryTypes;
};
declare type StatusDetails = {
    self: string;
    description: string;
    iconUrl: string;
    name: string;
    id: string;
    statusCategory: StatusCategory;
};
export declare type IssueTypeWithStatus = {
    self: string;
    id: string;
    name: string;
    subtask: boolean;
    statuses: StatusDetails[];
};
export declare enum MainStatusCategoryTypes {
    'To Do' = "To Do",
    'In Progress' = "In Progress",
    'Done' = "Done"
}
export {};
