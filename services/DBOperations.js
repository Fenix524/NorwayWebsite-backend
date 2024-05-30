export const updateModel = (newData, updatedObj) => {
  Object.keys(newData).forEach((key) => {
    updatedObj[key] = newData[key];
  });
};
