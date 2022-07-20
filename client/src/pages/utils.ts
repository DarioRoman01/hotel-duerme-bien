// util function to send a null value if the string is empty
export const checkValues = (value: string): string | null => value  === '' ? null : value; 

// util function to convenrt a string to title
export const toTitle = (str: string) => str.replace(/(^|\s)\S/g, (t) => t.toUpperCase());

// util function to validate ruts
export const checkRut = (rut: string): boolean => /^(\d{1,3}(?:\.\d{1,3}){2}-[\dkK])$/.test(rut);