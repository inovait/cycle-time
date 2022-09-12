import { getLastThreeQuartersStartDate } from '../src/utils/dateUtils';

describe('test getLastThreeQuartersStartDate function', () => {
    it('should return 4th quarter start date of 2021', () => {
        const date = getLastThreeQuartersStartDate('2022-09-08T05:41:12.759Z');

        expect(date).toBe('2021/10/1');
    });

    it('should return first quarter start date of 2020 which is leap year', () => {
        const date = getLastThreeQuartersStartDate('2020-12-08T05:41:12.759Z');

        expect(date).toBe('2020/1/1');
    });

    it('should return first quarter start date of 2020 with different date format', () => {
        const date = getLastThreeQuartersStartDate('2020/12/1');

        expect(date).toBe('2020/1/1');
    });
});
