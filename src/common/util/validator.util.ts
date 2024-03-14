/**
 * Boolean 확인
 * @param value
 */
export const validateBoolean = (value) => {
  switch (typeof value === 'string' ? value.toLowerCase().trim() : value) {
    case true:
    case 'true':
    case 1:
    case '1':
      return true;
    case false:
    case 'false':
    case 0:
    case '0':
      return false;
    default:
      return value;
  }
};

/**
 * Number 로 변경
 * @param value
 */
export const validateNumber = (value) => {
  return Number(value);
};
