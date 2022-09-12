import calculateBusinessMinutesForDates from "../src/utils/calculateBusinessMinutesForDates";
import { dateStringToISOFormat, hoursToMinutes } from "../src/utils/dateUtils";

describe("test calculateBusinessMinutesForDates function", () => {
    it("should fail when dateFrom is missing or is in invalid format.", () => {
        const dateFrom = '2021-02-17T14:20:56.905+0100';
        const dateToValidISOFormat = '2021-02-17T14:20:56.905+0100';

        expect(() => calculateBusinessMinutesForDates(undefined as any, dateToValidISOFormat)).toThrow('Invalid date from.');

        expect(() => calculateBusinessMinutesForDates(null as any, dateToValidISOFormat)).toThrow('Invalid date from.');

        expect(() => calculateBusinessMinutesForDates('', dateToValidISOFormat)).toThrow('Invalid date from.');

        expect(() => calculateBusinessMinutesForDates('invalid date format', dateToValidISOFormat)).toThrow('Invalid date from.');

        expect(() => calculateBusinessMinutesForDates(dateFrom, dateToValidISOFormat)).toThrow('Invalid date from.');
    });

    it("should fail when dateTo is missing or is in invalid format.", () => {
        const dateFromValidISOFormat = '2021-02-17T13:00:00.000Z';
        const dateToInvalidFormat = '2021-02-17T14:20:56.905+0100';

        expect(() => calculateBusinessMinutesForDates(dateFromValidISOFormat, undefined as any)).toThrow('Invalid date to.');

        expect(() => calculateBusinessMinutesForDates(dateFromValidISOFormat, null as any)).toThrow('Invalid date to.');

        expect(() => calculateBusinessMinutesForDates(dateFromValidISOFormat, '')).toThrow('Invalid date to.');

        expect(() => calculateBusinessMinutesForDates(dateFromValidISOFormat, 'invalid date format')).toThrow('Invalid date to.');

        expect(() => calculateBusinessMinutesForDates(dateFromValidISOFormat, dateToInvalidFormat)).toThrow('Invalid date to.');
    });

    it("should return 2 hours, for dates within one business day.", () => {
        const dateFrom = dateStringToISOFormat('2021-02-17T10:20:56.905+0100');
        const dateTo = dateStringToISOFormat('2021-02-17T12:20:56.905+0100');

        expect(calculateBusinessMinutesForDates(dateFrom, dateTo)).toBe(hoursToMinutes(2));
    });

    it("should return 2 hours, for dates within two business days.", () => {
        const dateFrom = dateStringToISOFormat('2021-02-17T15:00:00.000+0100');
        const dateTo = dateStringToISOFormat('2021-02-18T09:00:00.000+0100');

        expect(calculateBusinessMinutesForDates(dateFrom, dateTo)).toBe(hoursToMinutes(2));
    });

    it("should return 2 hours, for dates within two business days, that expand over weekend.", () => {
        const dateFrom = dateStringToISOFormat('2022-08-19T15:00:00.000+0200');
        const dateTo = dateStringToISOFormat('2022-08-22T09:00:00.000+0200');

        expect(calculateBusinessMinutesForDates(dateFrom, dateTo)).toBe(hoursToMinutes(2));
    });

    it("should return 2 hours, for dates within two business days, that expand over slovenian holiday.", () => {
        const dateFrom = dateStringToISOFormat('2022-08-12T15:00:00.000+0200');
        const dateTo = dateStringToISOFormat('2022-08-16T09:00:00.000+0200');

        expect(calculateBusinessMinutesForDates(dateFrom, dateTo)).toBe(hoursToMinutes(2));
    });

    it("should return 2 hours, for dateFrom before business day.", () => {
        const dateFrom = dateStringToISOFormat('2022-08-17T07:00:00.000+0200');
        const dateTo = dateStringToISOFormat('2022-08-17T10:00:00.000+0200');

        expect(calculateBusinessMinutesForDates(dateFrom, dateTo)).toBe(hoursToMinutes(2));
    });

    it("should return 2 hours, for dateTo after business day.", () => {
        const dateFrom = dateStringToISOFormat('2022-08-17T14:00:00.000+0200');
        const dateTo = dateStringToISOFormat('2022-08-17T17:00:00.000+0200');

        expect(calculateBusinessMinutesForDates(dateFrom, dateTo)).toBe(hoursToMinutes(2));
    });

    it("should return 2 hours, for dates in different year including holidays in-between.", () => {
        const dateFrom = dateStringToISOFormat('2022/12/30 15:00');
        const dateTo = dateStringToISOFormat('2023/01/03 09:00');

        expect(calculateBusinessMinutesForDates(dateFrom, dateTo)).toBe(hoursToMinutes(2));
    });
});
