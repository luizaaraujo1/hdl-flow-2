import {DEFAULT_TAB_SPACES_AMOUNT} from '@constants/transduction';

export function getStringWithBreakLines(source: string[]): string {
  return source.map(value => value).join('\n');
}

export function addBreakLine(source: string): string {
  return source + '\n';
}

export function getXSpaces(amount: number): string {
  return ' '.repeat(amount);
}

export function getXTabs(
  amount: number,
  tabSize: number = DEFAULT_TAB_SPACES_AMOUNT,
): string {
  return getXSpaces(tabSize).repeat(amount);
}

export function getInlineComment(
  comment: string,
  tabNumber: number,
  commentFormat: string,
): string {
  return getXSpaces(tabNumber) + commentFormat + comment;
}

export function getCodeWrapperSection(
  tabAmount: number,
  firstLine: string,
  lastLine: string,
  getContent: (tabAmount: number) => string,
): string {
  return firstLine + getContent(tabAmount + 1) + lastLine;
}
