export declare const calculateIQRWithLowerAndUpperLimit: (items: number[]) => {
    IQR: number;
    upperLimit: number;
    lowerLimit: number;
    q1: number;
    q3: number;
};
declare const filterOutOutliersUsingIQR: (items: any[]) => {
    upperLimit: number;
    lowerLimit: number;
    withoutOutliers: any[];
    outliers: any[];
    IQR: number;
    q1: number;
    q3: number;
};
export default filterOutOutliersUsingIQR;
