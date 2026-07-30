export const apiDate = (value: string | number | Date): Date => {
  if (value instanceof Date || typeof value === 'number') return new Date(value);
  const normalized = /^\d{4}-\d{2}-\d{2}T/.test(value)
    && !/(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)
    ? `${value}Z`
    : value;
  return new Date(normalized);
};

export const formatApiTimestamp = (value: string | number | Date): string =>
  apiDate(value).toLocaleString();
