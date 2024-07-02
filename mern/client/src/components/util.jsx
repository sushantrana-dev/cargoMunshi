// Desc: Utility functions for Starter component
// this fxn is used to format the data for the Starter component
export const formatData = (data) => {
  // Function to format each name list
  const formatNames = (names) => names?.map(name => ({ value: name, label: name }));

  // Iterate over each key in the data object, apply formatting, and return a new object
  return Object.keys(data).reduce((formattedData, key) => {
    console.log('formattedData[key]',formattedData[key], data[key],data)
      formattedData[key] = formatNames(data[key]);
      return formattedData;
  }, {});
}

// Function to extract unique values for select inputs
export const getUniqueOptions = (data, key) => {
  const allValues = data.map(item => item[key]);
  console.log('Array.from(new Set(allValues))', Array.from(new Set(allValues)),data);
  return { [key]: Array.from(new Set(allValues)) };
};

export const formatWeightRanges = (ranges) => {
  return ranges.map(range => {
      // Ensure we check that min and max are valid numbers before formatting
      if (typeof range.min === 'number' && typeof range.max === 'number') {
          return `${range.min} - ${range.max}`;
      } else {
          throw new Error('Invalid min or max values');
      }
  });
}
