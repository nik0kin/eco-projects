export const getNumbersFromCoordStr = (coordStr: string) => {
  try {
    const splitCoordStr = coordStr.split(',');
    return [Number(splitCoordStr[0]), Number(splitCoordStr[1])];
  } catch (e) {
    throw new Error('Invalid coordStr: ' + coordStr);
  }
};
