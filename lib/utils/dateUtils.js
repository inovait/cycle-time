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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastThreeQuartersStartDate = exports.hoursToMinutes = exports.dateStringToISOFormat = exports.isISOString = exports.isValidDate = void 0;
const isISOString = (isoString) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(isoString);
exports.isISOString = isISOString;
const isValidDate = (d) => !isNaN(d.getTime());
exports.isValidDate = isValidDate;
const dateStringToISOFormat = (dateString) => new Date(dateString).toISOString();
exports.dateStringToISOFormat = dateStringToISOFormat;
const hoursToMinutes = (hours) => hours * 60;
exports.hoursToMinutes = hoursToMinutes;
const getLastThreeQuartersStartDate = (dateString) => {
    const currentDate = dateString ? new Date(dateString) : new Date();
    const currentMonth = currentDate.getMonth();
    const currentQuarter = Math.floor(currentMonth / 3) + 1;
    currentDate.setMonth(currentQuarter * 3 - 3);
    currentDate.setDate(1);
    const previous3QuartersDate = new Date(currentDate.toISOString());
    previous3QuartersDate.setMonth(previous3QuartersDate.getMonth() - 9);
    return `${previous3QuartersDate.getFullYear()}/${previous3QuartersDate.getMonth() + 1}/${previous3QuartersDate.getDate()}`;
};
exports.getLastThreeQuartersStartDate = getLastThreeQuartersStartDate;
