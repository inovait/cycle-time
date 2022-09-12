declare const isISOString: (isoString: string) => boolean;
declare const isValidDate: (d: Date) => boolean;
declare const dateStringToISOFormat: (dateString: string) => string;
declare const hoursToMinutes: (hours: number) => number;
declare const getLastThreeQuartersStartDate: (dateString?: string) => string;
export { isValidDate, isISOString, dateStringToISOFormat, hoursToMinutes, getLastThreeQuartersStartDate, };
