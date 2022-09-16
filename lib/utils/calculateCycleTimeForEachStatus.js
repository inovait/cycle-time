"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const calculateBusinessMinutesForDates_1 = __importDefault(require("./calculateBusinessMinutesForDates"));
const dateUtils_1 = require("./dateUtils");
const calculateCycleTimeForEachStatus = (statuses, changelog) => {
    const allStatusesStart = statuses.map((v) => ({ [v]: [] })).reduce((pV, cV) => (Object.assign(Object.assign({}, pV), cV)), {});
    const allStatusesEnd = statuses.map((v) => ({ [v]: [] })).reduce((pV, cV) => (Object.assign(Object.assign({}, pV), cV)), {});
    changelog
        .filter(({ items }) => items.filter(({ field }) => field === 'status').length > 0)
        .map(({ items, created }) => (Object.assign({ timestampOfChange: created }, items.filter(({ field }) => field === 'status')[0])))
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
            time = (0, calculateBusinessMinutesForDates_1.default)((0, dateUtils_1.dateStringToISOFormat)(firstMovedToStatus), (0, dateUtils_1.dateStringToISOFormat)(lastMovedToStatus));
        }
        catch (e) { }
        return {
            [`${v.replaceAll(' ', '_')}_start`]: firstMovedToStatus ? (0, dateUtils_1.dateStringToISOFormat)(firstMovedToStatus) : '',
            [`${v.replaceAll(' ', '_')}_end`]: lastMovedToStatus ? (0, dateUtils_1.dateStringToISOFormat)(lastMovedToStatus) : '',
            [`${v.replaceAll(' ', '_')}_total_time`]: time,
        };
    }).reduce((pV, cV) => (Object.assign(Object.assign({}, pV), cV)), {});
    return startEndOfAllStatuses;
};
exports.default = calculateCycleTimeForEachStatus;
