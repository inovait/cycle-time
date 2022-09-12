import Holidays from 'date-holidays';
import { isValidDate, isISOString } from './dateUtils';

const slovenianPublicHolidays = new Holidays('SI', { types: ['public'] });

const hasTimestampBeforeWorkingHours = (date: Date) =>
    date.getHours() < 8;

const hasTimestampAfterWorkingHours = (date: Date) =>
    date.getHours() > 16;

const resetTime = (date: Date, hours: number) => {
    date.setHours(hours);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
}

const isDateOnWeekendOrHoliday = (date: Date) =>
    date.getDay() === 6 || date.getDay() === 0 || slovenianPublicHolidays.isHoliday(date);

const setStartOfBusinessHours = (date: Date) =>
    resetTime(date, 8);

const setEndOfBusinessHours = (date: Date) =>
    resetTime(date, 16);

const convertMsToMinutes = (ms: number) =>
    Math.round(ms / 1000 / 60);

const calculateBusinessMinutesForDates = (dateFromString: string, dateToString: string) => {
    if (!dateFromString || !isISOString(dateFromString)) {
        throw new Error('Invalid date from.');
    }

    if (!dateToString || !isISOString(dateToString)) {
        throw new Error('Invalid date to.');
    }

    const dateFrom = new Date(dateFromString);
    const dateTo = new Date(dateToString);

    if (!isValidDate(dateFrom)) {
        throw new Error('Invalid date from.');
    }

    if (!isValidDate(dateTo)) {
        throw new Error('Invalid date to.');
    }

    let diff = 0;

    if (hasTimestampBeforeWorkingHours(dateFrom)) {
        setStartOfBusinessHours(dateFrom);
    } else if (hasTimestampAfterWorkingHours(dateFrom)) {
        setEndOfBusinessHours(dateFrom);
    }

    if (hasTimestampBeforeWorkingHours(dateTo)) {
        setStartOfBusinessHours(dateTo);
    } else if (hasTimestampAfterWorkingHours(dateTo)) {
        setEndOfBusinessHours(dateTo);
    }

    if (dateFrom.getTime() > dateTo.getTime()) {
        throw new Error('Date to is after date from.');
    }

    const tmpDate = new Date(+dateFrom);
    setEndOfBusinessHours(tmpDate);

    while(tmpDate.getDate() !== dateTo.getDate()) {
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
}

export default calculateBusinessMinutesForDates;
