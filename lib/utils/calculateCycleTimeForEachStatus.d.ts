import { JiraChangelog } from "../types";
declare const calculateCycleTimeForEachStatus: (statuses: string[], changelog: JiraChangelog[]) => {
    [x: string]: string | number | undefined;
};
export default calculateCycleTimeForEachStatus;
