export const checkValue = (s: string) => s === '' ? null : s;

export const validateRut = (rut: string) => /^(\d{1,3}(?:\.\d{1,3}){2}-[\dkK])$/.test(rut);