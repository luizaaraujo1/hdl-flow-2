import {
  VHDL_COMMENT_SPACING_SIZE,
  VHDL_INLINE_COMMENT,
  VHDL_TAB_DEPTH,
  VHDL_TAB_SIZE,
} from '@constants/vhdl';
import {getInlineComment, getXTabs} from '@utils/transduction';

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
