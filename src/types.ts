type JiraObject = {
    [key: string]: any;
}

type JiraUserDetails = {
    self: string;
    accountId: string;
    emailAddress: string | null;
    avatarUrls: JiraObject; // TODO;
    displayName: string;
    active: boolean;
    timeZone: string | null;
    accountType: 'atlassian' | 'app' | 'customer';
}

export type JiraChangeDetails = {
    field: string;
    fieldtype: string;
    fieldId: string;
    from: string;
    fromString: string;
    to: string;
    toString: string;
}

export type JiraChangelog = {
    id: string;
    author: JiraUserDetails;
    created: string;
    items: JiraChangeDetails[];
    historyMetadata: JiraObject; // TODO;
}

type JiraPageOfChangelogs = {
    startAt: number;
    maxResults: number;
    total: number;
    histories: JiraChangelog[];
}

export type JiraIssueBean = {
    expand: string;
    id: string;
    self: string;
    key: string;
    renderedFields: JiraObject;
    properties: JiraObject;
    names: JiraObject;
    schema: JiraObject;

    transitions: JiraObject[]; // TODO
    operations: JiraObject; // TODO
    editmeta: JiraObject; // TODO

    changelog: JiraPageOfChangelogs;

    versionedRepresentations: JiraObject;

    fieldsToInclude: JiraObject; // TODO;

    fields: JiraObject;
}

export type JiraSearchResults = {
    expand: string;
    startAt: number;
    maxResults: number;
    total: number;
    issues: JiraIssueBean[];
    warningMessages: string[];
    names: JiraObject;
    schema: JiraObject;
};

type StatusCategory = {
    self: string;
    id: number;
    key: string;
    colorName: string;
    name: MainStatusCategoryTypes;
}

type StatusDetails = {
    self: string;
    description: string;
    iconUrl: string;
    name: string;
    id: string;
    statusCategory: StatusCategory;
};

export type IssueTypeWithStatus = {
    self: string;
    id: string;
    name: string;
    subtask: boolean;
    statuses: StatusDetails[];
};

export enum MainStatusCategoryTypes {
    'To Do' = 'To Do',
    'In Progress' = 'In Progress',
    'Done' = 'Done',
};
