const isISOString = (isoString: string) =>
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(isoString);

const isValidDate = (d: Date) =>
    !isNaN(d.getTime());

const dateStringToISOFormat = (dateString: string) =>
    new Date(dateString).toISOString();

const hoursToMinutes = (hours: number) =>
    hours * 60;

const getLastThreeQuartersStartDate = (dateString?: string) => {
    const currentDate = dateString ? new Date(dateString) : new Date();
    const currentMonth = currentDate.getMonth();

    const currentQuarter = Math.floor(currentMonth / 3) + 1;

    currentDate.setMonth(currentQuarter * 3 - 3);
    currentDate.setDate(1);

    const previous3QuartersDate = new Date(currentDate.toISOString());
    previous3QuartersDate.setMonth(previous3QuartersDate.getMonth() - 9);

    return `${previous3QuartersDate.getFullYear()}/${previous3QuartersDate.getMonth() + 1}/${previous3QuartersDate.getDate()}`;
}

export {
    isValidDate,
    isISOString,
    dateStringToISOFormat,
    hoursToMinutes,
    getLastThreeQuartersStartDate,
};
