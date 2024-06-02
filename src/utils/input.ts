export function removeForbiddenChars(input: string): string {
  return input.replace(/[^A-Za-z0-9_ ]/g, '');
}

export function changeSpacesIntoUnderlines(input: string): string {
  return input.replace(/ /g, '_');
}

export function removeAllNonNumeric(input: string): string {
  return input.replace(/\D/g, '');
}

export function removeAllNonLogical(input: string): string {
  return input.replace(/[^01]/g, '');
}

export const numericOnlyPattern = 'd*';

export const logicalOnlyPattern = '[01]*';
