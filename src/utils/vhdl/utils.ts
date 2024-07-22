import {
  VHDL_COMMENT_SPACING_SIZE,
  VHDL_ELSE,
  VHDL_ELSIF,
  VHDL_END_IF,
  VHDL_IF,
  VHDL_INLINE_COMMENT,
  VHDL_TAB_DEPTH,
  VHDL_TAB_SIZE,
  VHDL_THEN,
} from '@constants/vhdl';
import {ConditionElement} from '@models/transduction';
import {
  getConditionSection,
  getInlineComment,
  getXTabs,
} from '@utils/transduction';

export function getVhdlXTabs(amount: number) {
  return getXTabs(amount, VHDL_TAB_SIZE);
}

export function getVhdlInlineComment(comment: string) {
  return getInlineComment(
    comment,
    VHDL_COMMENT_SPACING_SIZE,
    VHDL_INLINE_COMMENT,
  );
}

export function vhdlCodeLine(
  content: string,
  tabDepth = VHDL_TAB_DEPTH.NO_TAB,
  hasSemicolon = true,
  commented = false,
) {
  return (
    getVhdlXTabs(tabDepth) +
    (commented ? VHDL_INLINE_COMMENT : '') +
    content +
    (hasSemicolon ? ';' : '') +
    '\n'
  );
}

export function getVhdlConditionSection(
  tabAmount: number,
  conditions: ConditionElement[],
) {
  return getConditionSection(
    tabAmount,
    getVhdlXTabs(tabAmount) + VHDL_IF,
    getVhdlXTabs(tabAmount) + VHDL_ELSIF,
    getVhdlXTabs(tabAmount) + VHDL_ELSE,
    VHDL_THEN + '\n',
    vhdlCodeLine(VHDL_END_IF, tabAmount),
    conditions,
  );
}
