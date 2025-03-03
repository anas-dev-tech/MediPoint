


export const extractDateAndTime = (isoString) => {
    const date = new Date(isoString);

    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM'; // Determine AM/PM

    hours = hours % 12; // Convert to 12-hour format
    hours = hours ? hours : 12; // Handle midnight (0 becomes 12)

    const formattedDate = ` ${day}, ${month}`; // Correct date format
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${amOrPm}`;

    return { date: formattedDate, time: formattedTime };
  };