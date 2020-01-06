/**
 * Removes first element value in array.
 * @param array
 * @param value
 */
export default <T>(array: T[], value: T): T[] => {
  const index = array.indexOf(value);
  return [...array.slice(0, index), ...array.slice(index + 1)];
};
