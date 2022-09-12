import { calculateIQRWithLowerAndUpperLimit } from "../src/utils/filterOutOutliersUsingIQR";

describe("test calculateIQRWithLowerAndUpperLimit function", () => {
    it("should return for IQR when array has even number of items.", () => {
        const evenNumberOfItemsArray = [1, 3, 5, 7];

        expect(calculateIQRWithLowerAndUpperLimit(evenNumberOfItemsArray)).toEqual({ IQR: 4, q1: 2, q3: 6, upperLimit: 12, lowerLimit: -4 });
    });

    it("should return for IQR when array has odd number of items.", () => {
        const oddNumberOfItemsArray = [1, 3, 5, 7, 9];

        expect(calculateIQRWithLowerAndUpperLimit(oddNumberOfItemsArray)).toEqual({ IQR: 4, q1: 3, q3: 7, upperLimit: 13, lowerLimit: -3 });
    });
});
