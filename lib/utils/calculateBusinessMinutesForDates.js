"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_holidays_1 = __importDefault(require("date-holidays"));
const dateUtils_1 = require("./dateUtils");
const slovenianPublicHolidays = new date_holidays_1.default('SI', { types: ['public'] });
const hasTimestampBeforeWorkingHours = (date) => date.getHours() < 8;
const hasTimestampAfterWorkingHours = (date) => date.getHours() > 16;
const resetTime = (date, hours) => {
    date.setHours(hours);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
};
const isDateOnWeekendOrHoliday = (date) => date.getDay() === 6 || date.getDay() === 0 || slovenianPublicHolidays.isHoliday(date);
const setStartOfBusinessHours = (date) => resetTime(date, 8);
const setEndOfBusinessHours = (date) => resetTime(date, 16);
const convertMsToMinutes = (ms) => Math.round(ms / 1000 / 60);
const calculateBusinessMinutesForDates = (dateFromString, dateToString) => {
    if (!dateFromString || !(0, dateUtils_1.isISOString)(dateFromString)) {
        throw new Error('Invalid date from.');
    }
    if (!dateToString || !(0, dateUtils_1.isISOString)(dateToString)) {
        throw new Error('Invalid date to.');
    }
    const dateFrom = new Date(dateFromString);
    const dateTo = new Date(dateToString);
    if (!(0, dateUtils_1.isValidDate)(dateFrom)) {
        throw new Error('Invalid date from.');
    }
    if (!(0, dateUtils_1.isValidDate)(dateTo)) {
        throw new Error('Invalid date to.');
    }
    let diff = 0;
    if (hasTimestampBeforeWorkingHours(dateFrom)) {
        setStartOfBusinessHours(dateFrom);
    }
    else if (hasTimestampAfterWorkingHours(dateFrom)) {
        setEndOfBusinessHours(dateFrom);
    }
    if (hasTimestampBeforeWorkingHours(dateTo)) {
        setStartOfBusinessHours(dateTo);
    }
    else if (hasTimestampAfterWorkingHours(dateTo)) {
        setEndOfBusinessHours(dateTo);
    }
    if (dateFrom.getTime() > dateTo.getTime()) {
        throw new Error('Date to is after date from.');
    }
    const tmpDate = new Date(+dateFrom);
    setEndOfBusinessHours(tmpDate);
    while (tmpDate.getDate() !== dateTo.getDate()) {
        if (!isDateOnWeekendOrHoliday(tmpDate)) {
            diff += tmpDate.getTime() - dateFrom.getTime();
        }
        const nextDate = tmpDate.getDate() + 1;
        tmpDate.setDate(nextDate);
        setEndOfBusinessHours(tmpDate);
        dateFrom.setDate(nextDate);
        setStartOfBusinessHours(dateFrom);
    }
    diff += dateTo.getTime() - dateFrom.getTime();
    return convertMsToMinutes(diff);
};
exports.default = calculateBusinessMinutesForDates;
