exports.formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
  
    // Extracting components
    const time = date.toLocaleTimeString(); // Time
    const day = date.getDate(); // Date
    const month = date.toLocaleString('default', { month: 'long' }); // Month in full text
    const year = date.getFullYear(); // Year
  
    return `${time} ${day} ${month} ${year}`;
  };