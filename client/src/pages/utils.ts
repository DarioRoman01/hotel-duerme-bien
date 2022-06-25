export type SelectOption = {
  option: string,
  value: string
}

export const checkValues = (value: string): string | null => value  === '' ? null : value; 

export const toTitle = (str: string) => str.replace(/(^|\s)\S/g, (t) => t.toUpperCase());
