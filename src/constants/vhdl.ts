import {getNTabs} from '@utils/vhdl';

export const VHDL_TAB = '    ';
export const VHDL_FSM_ENTITY_HEADER = 'entity FSM is\n';
export const VHDL_FSM_ENTITY_PORT_HEADER = getNTabs(1) + 'port (\n';
export const VHDL_FSM_ENTITY_PORT_FOOTER = getNTabs(1) + ');\n';
export const VHDL_FSM_ENTITY_FOOTER = 'end entity FSM;\n';
export const VHDL_LINE_COMMENT = '-- ';
