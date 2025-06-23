export const VHDL_TAB_SIZE = 4;
export const VHDL_COMMENT_SPACING_SIZE = 1;
export const VHDL_INLINE_COMMENT = '-- ';
export const VHDL_FSM_END_SECTION = ')';
export const VHDL_BEGIN = 'begin';
export const VHDL_BEGIN_PROCESS = 'process (';
export const VHDL_END_PROCESS = 'end process';
export const VHDL_IF = 'if ';
export const VHDL_ELSIF = 'elsif ';
export const VHDL_ELSE = 'else ';
export const VHDL_END_IF = 'end if';
export const VHDL_THEN = ' then';
export const VHDL_STATE_PREFIX = 'STATE_';
export const VHDL_WHEN = 'when ';
export const VHDL_DEFINITION_ARROW = ' =>';
export const VHDL_ASSIGNMENT_ARROW = ' <= ';
export const VHDL_EQUALITY = ' = ';
export const VHDL_INEQUALITY = ' /= ';
export const VHDL_LESS_THAN = ' < ';
export const VHDL_LESS_THAN_OR_EQUAL = ' <= ';
export const VHDL_GREATER_THAN = ' > ';
export const VHDL_GREATER_THAN_OR_EQUAL = ' >= ';
export const VHDL_AND = ' and ';
export const VHDL_OR = ' or ';
export const VHDL_NAND = ' nand ';
export const VHDL_NOR = ' nor ';
export const VHDL_XOR = ' xor ';
export const VHDL_XNOR = ' xnor ';
export const VHDL_SLL = ' sll ';
export const VHDL_SRL = ' srl ';
export const VHDL_OUT = ' out ';
export const VHDL_IN = ' in ';
export const VHDL_COLON = ':';

export const VHDL_SELECTOR_NAME = '__NAME__';
export const VHDL_SELECTOR_NAME_2 = '__NAME2__';

export const VHDL_FSM_ENTITY_HEADER = 'entity ' + VHDL_SELECTOR_NAME + ' is';
export const VHDL_FSM_ENTITY_PORT_HEADER = 'port (';
export const VHDL_FSM_ENTITY_FOOTER = 'end entity ' + VHDL_SELECTOR_NAME;

export const VHDL_FSM_ARCHITECTURE_HEADER =
  'architecture ' + VHDL_SELECTOR_NAME + '  of ' + VHDL_SELECTOR_NAME_2 + ' is';
export const VHDL_FSM_ARCHITECTURE_FOOTER =
  'end architecture ' + VHDL_SELECTOR_NAME;
export const VHDL_FSM_ARCHITECTURE_TYPE = 'type state_type is (';
export const VHDL_FSM_ARCHITECTURE_SIGNALS =
  'signal current_state, next_state : state_type';

export const VHDL_FSM_ARCHITECTURE_STATE_NAME = 'current_state';

export const VHDL_FSM_CLOCK_PROCESS_CONDITION_1 = "reset = '1'";
export const VHDL_FSM_CLOCK_PROCESS_CONTENT_1 =
  VHDL_FSM_ARCHITECTURE_STATE_NAME + ' <= ';
export const VHDL_FSM_CLOCK_PROCESS_CONDITION_2 = 'rising_edge(clk)';
export const VHDL_FSM_CLOCK_PROCESS_CONTENT_2 =
  VHDL_FSM_ARCHITECTURE_STATE_NAME + ' <= next_state';

export const VHDL_FSM_STATE_PROCESS_HEADER =
  'case ' + VHDL_FSM_ARCHITECTURE_STATE_NAME + ' is';
export const VHDL_FSM_STATE_PROCESS_FOOTER = 'end case';

export const VHDL_FSM_STATE_PROCESS_WHEN_OTHERS = 'when others =>';
export const VHDL_FSM_STATE_PROCESS_NEXT_STATE_ASSIGN = 'next_state <= ';
export const VHDL_FSM_STATE_PROCESS_DEFAULT_COMMENT =
  'Default state defined as first state';
export const VHDL_FSM_STATE_PROCESS_DATA_OTHERS_COMMENT =
  'Default data state - empty';
export const VHDL_FSM_STATE_PROCESS_DEAD_COMMENT =
  'Warning! This is a dead state';
export const VHDL_FSM_RESET_ERROR =
  'Error! Reset Node is not connected to any State, try editing the Canvas';
export const VHDL_FSM_RESET_INVALID_ERROR =
  'Error! Reset Node is connection is invalid, try editing the Canvas';
export const VHDL_FSM_STATE_PROCESS_TRANSITION_ERROR =
  'Error! This transition is invalid';
