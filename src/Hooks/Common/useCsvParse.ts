import { useCallback } from 'react';
import { parseCsvByStep } from 'Utils/functions';

export default () =>
  useCallback(async (file: File, rowLimit?: number, columnLimit?: number) => {
    const data = await parseCsvByStep(file, rowLimit, columnLimit);
    return { headers: data[0], rows: data.slice(1) };
  }, []);
