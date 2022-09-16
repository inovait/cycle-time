/*
 * Copyright 2022, Inova IT d.o.o.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { JiraChangelog } from "../types";
import calculateBusinessMinutesForDates from "./calculateBusinessMinutesForDates";
import { dateStringToISOFormat } from './dateUtils';

const calculateCycleTimeForEachStatus = (statuses: string[], changelog: JiraChangelog[]) => {
    const allStatusesStart: { [statusName: string]: string[] } = statuses.map((v) => ({ [v]: [] })).reduce((pV, cV) => ({ ...pV, ...cV }), {});
    const allStatusesEnd: { [statusName: string]: string[] } = statuses.map((v) => ({ [v]: [] })).reduce((pV, cV) => ({ ...pV, ...cV }), {});

    changelog
        .filter(({ items }) => items.filter(({ field }) => field === 'status').length > 0)
        .map(({ items, created }) => ({
            timestampOfChange: created,
            ...items.filter(({ field }) => field === 'status')[0],
        }))
        .forEach(({ toString, fromString, timestampOfChange }) => {
            if (!allStatusesStart[toString]) {
                allStatusesStart[toString] = [];
            }
            if (!allStatusesEnd[fromString]) {
                allStatusesEnd[fromString] = [];
            }
            allStatusesStart[toString].push(timestampOfChange);
            allStatusesEnd[fromString].push(timestampOfChange);
        });

    const startEndOfAllStatuses = statuses.map((v) => {
        const firstMovedToStatus = allStatusesStart[v][allStatusesStart[v].length - 1];
        const lastMovedToStatus = allStatusesEnd[v][0];
        let time;

        try {
            time = calculateBusinessMinutesForDates(dateStringToISOFormat(firstMovedToStatus), dateStringToISOFormat(lastMovedToStatus));
        } catch(e) {}

        return {
            [`${v.replaceAll(' ', '_')}_start`]: firstMovedToStatus ? dateStringToISOFormat(firstMovedToStatus) : '',
            [`${v.replaceAll(' ', '_')}_end`]: lastMovedToStatus ? dateStringToISOFormat(lastMovedToStatus) : '',
            [`${v.replaceAll(' ', '_')}_total_time`]: time,
        };
    }).reduce((pV, cV) => ({ ...pV, ...cV }), {});

    return startEndOfAllStatuses;
}

export default calculateCycleTimeForEachStatus;
