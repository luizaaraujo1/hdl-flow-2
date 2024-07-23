import {DEFAULT_TAB_SPACES_AMOUNT} from '@constants/transduction';
import {ConditionElement} from '@models/transduction';

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

function getConditionText(
  ifStartText: string,
  elsifStartText: string,
  elseStartText: string,
  conditionEndText: string,
  isFirstElement: boolean,
  isLastElement: boolean,
  conditionText: string,
) {
  let startText = '';
  if (isFirstElement) startText = ifStartText;
  else if (isLastElement) startText = elseStartText;
  else startText = elsifStartText;
  //Note: This works well for VHDL, but maybe not other languages
  return startText + conditionText + (!isLastElement ? conditionEndText : '\n');
}

export function getConditionSection(
  tabAmount: number,
  ifStartText: string,
  elsifStartText: string,
  elseStartText: string,
  conditionEndText: string,
  sectionEndText: string,
  conditions: ConditionElement[],
) {
  if (conditions.length === 0) return '';
  if (conditions.length === 1 && !conditions[0].conditionText) {
    return conditions[0].getConditionContent(tabAmount);
  }

  const content: string[] = [];
  conditions.forEach((condition, index) => {
    const conditionText = getConditionText(
      ifStartText,
      elsifStartText,
      elseStartText,
      conditionEndText,
      index === 0,
      index === conditions.length - 1,
      condition.conditionText ?? '',
    );
    content.push(conditionText);
    content.push(condition.getConditionContent(tabAmount + 1));
  });
  content.push(sectionEndText);

  const contentSection = content.join('');
  return contentSection;
}
