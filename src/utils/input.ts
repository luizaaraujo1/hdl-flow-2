export function removeForbiddenChars(input: string): string {
  return input.replace(/[^A-Za-z0-9_ ]/g, '');
}

export function changeSpacesIntoUnderlines(input: string): string {
  return input.replace(/ /g, '_');
}
