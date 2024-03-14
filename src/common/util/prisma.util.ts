/**
 * 쿼리 셀렉트 결과에서 특정 컬럼제외
 * @param resultSet
 * @param keys
 */
export function excludeArray<T, Key extends keyof T>(
  resultSet: T | T[],
  ...keys: Key[]
): T | T[] {
  if (Array.isArray(resultSet)) {
    return resultSet.map((obj) => {
      for (const key of keys) {
        delete obj[key];
      }
      return obj;
    });
  } else {
    for (const key of keys) {
      delete resultSet[key];
    }

    return resultSet;
  }
}
