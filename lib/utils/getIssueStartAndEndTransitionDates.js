"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getIssueStartAndEndTransitionDates = (changelog, statusesInProgress, statusesInDone) => {
    // all changelogs are sorted descending by date created.
    const issueStartDate = changelog
        .filter(({ items }) => items.filter(({ to, field, from }) => field === 'status' && statusesInProgress.includes(to) && to !== from).length !== 0)
        .map(({ created }) => ({ created }))
        .pop();
    const issueEndDate = changelog
        .filter(({ items }) => items.filter(({ to, field, from }) => field === 'status' && statusesInDone.includes(to) && to !== from).length !== 0)
        .map(({ created }) => ({ created }))[0];
    return {
        issueStartDate: (issueStartDate === null || issueStartDate === void 0 ? void 0 : issueStartDate.created) ? new Date(issueStartDate.created).toISOString() : '',
        issueEndDate: (issueEndDate === null || issueEndDate === void 0 ? void 0 : issueEndDate.created) ? new Date(issueEndDate.created).toISOString() : '',
    };
};
exports.default = getIssueStartAndEndTransitionDates;
