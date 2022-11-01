import { DateObject } from '../types/common';

export function replaceIndex<T>(array: T[], index: number, value: T): T[] {
  array[index] = value;
  return array;
}

export function replaceMatch<T>(
  array: T[],
  match: (value: T, index: number) => boolean,
  value: T
): T[] {
  return array.map((item, i) => {
    if (match(item, i)) {
      return value;
    } else {
      return item;
    }
  });
}

export function toFormData(from: {
  [key: string]: Blob | string | boolean | number | null | undefined;
}): FormData {
  const data = new FormData();

  for (const [key, value] of Object.entries(from)) {
    if (value != null) {
      data.append(key, toFormField(value));
    }
  }
  return data;
}

export function toFormField(
  input: Date | Blob | string | boolean | number
): Blob | string {
  if (input instanceof Date) {
    return stringifyDate(input);
  }

  switch (typeof input) {
    case 'number':
      return input.toString();
    case 'boolean':
      return input ? 'true' : 'false';
    default:
      return input;
  }
}

export function stringifyDate(date: Date): string {
  if (date == null) return null;
  return date.getTime().toString();
}

export function parseDate(date?: DateObject): Date | null {
  if (date != null) {
    return new Date(date);
  } else {
    return null;
  }
}
