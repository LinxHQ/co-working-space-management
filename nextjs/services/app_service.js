export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Parses an ISO date string and returns a string formatted as 'YYYY-MM-DD'.
 * @param {string} dateString - The ISO string representing the date.
 * @returns {string} The date formatted as 'YYYY-MM-DD', suitable for date input fields.
 */
export const parseDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns month from 0-11
    const day = date.getDate();

    // Pad the month and day with leading zeros if necessary
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${year}-${formattedMonth}-${formattedDay}`;
}

/**
 * Parses an ISO date-time string and returns an object with date and time formatted for HTML input fields.
 * @param {string} dateTimeString - The ISO string representing the date and time.
 * @returns {object} An object with 'date' formatted as 'YYYY-MM-DD' and 'time' formatted as 'HH:mm'.
 */
export const parseDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: '', time: '' };
    
    const dateTime = new Date(dateTimeString);
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1; // getMonth() returns month from 0-11
    const day = dateTime.getDate();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();

    // Pad the month, day, hours, and minutes with leading zeros if necessary
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return {
        date: `${year}-${formattedMonth}-${formattedDay}`,
        time: `${formattedHours}:${formattedMinutes}`
    };
}
