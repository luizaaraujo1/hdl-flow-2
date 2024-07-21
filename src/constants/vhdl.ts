export const VHDL_TAB_SIZE = 4;
export const VHDL_COMMENT_SPACING_SIZE = 1;
export const VHDL_INLINE_COMMENT = '-- ';
export const VHDL_FSM_END_SECTION = ')';
export const VHDL_BEGIN = 'begin';
export const VHDL_BEGIN_PROCESS = 'process (';
export const VHDL_END_PROCESS = 'end process';
export const VHDL_IF = 'if ';
export const VHDL_ELSIF = 'elsif ';
export const VHDL_END_IF = 'end if';
export const VHDL_THEN = ' then';
export const VHDL_STATE_PREFIX = 'STATE_';
export const VHDL_WHEN = 'when ';
export const VHDL_DEFINITION_ARROW = '=>';
export const VHDL_ASSIGNMENT_ARROW = ' <= ';
export const VHDL_ELSE = 'else';
export const VHDL_EQUALITY = ' = ';
export const VHDL_INEQUALITY = ' /= ';
export const VHDL_AND = ' and ';
export const VHDL_OR = ' or ';
export const VHDL_OUT = ' out ';
export const VHDL_IN = ' in ';
export const VHDL_COLON = ':';

export const VHDL_SELECTOR_NAME = '__NAME__';
export const VHDL_FSM_ENTITY_HEADER = 'entity ' + VHDL_SELECTOR_NAME + ' is';
export const VHDL_FSM_ENTITY_PORT_HEADER = 'port (';
export const VHDL_FSM_ENTITY_FOOTER = 'end entity ' + VHDL_SELECTOR_NAME;

export const VHDL_FSM_ARCHITECTURE_HEADER = 'architecture Behavioral of FSM is';
export const VHDL_FSM_ARCHITECTURE_FOOTER = 'end architecture Behavioral';
export const VHDL_FSM_ARCHITECTURE_TYPE = 'type state_type is (';
export const VHDL_FSM_ARCHITECTURE_SIGNALS =
  'signal current_state, next_state : state_type';

export const VHDL_FSM_CLOCK_PROCESS_LINE_1 = "if reset = '1' then";
export const VHDL_FSM_CLOCK_PROCESS_LINE_2 = 'current_state <= ';
export const VHDL_FSM_CLOCK_PROCESS_LINE_3 = 'elsif rising_edge(clk) then';
export const VHDL_FSM_CLOCK_PROCESS_LINE_4 = 'current_state <= next_state';

export const VHDL_FSM_STATE_PROCESS_HEADER = 'case current_state is';
export const VHDL_FSM_STATE_PROCESS_FOOTER = 'end case';

export const VHDL_FSM_STATE_PROCESS_WHEN_OTHERS = 'when others =>';
export const VHDL_FSM_STATE_PROCESS_NEXT_STATE_ASSIGN = 'next_state <= ';
export const VHDL_FSM_STATE_PROCESS_DEFAULT_COMMENT =
  'Default state defined as first state';
export const VHDL_FSM_STATE_PROCESS_INTERNALS_COMMENT =
  'Note: Declare inputs on the Port Editor';
export const VHDL_FSM_STATE_PROCESS_OUTPUTS_COMMENT =
  'Note: Declare outputs on the Port Editor';
export const VHDL_FSM_STATE_PROCESS_DEAD_COMMENT =
  'Warning! This is a dead state';
export const VHDL_FSM_STATE_PROCESS_TRANSITION_ERROR =
  'Error! This transition is invalid';

export enum VHDL_TAB_DEPTH {
  NO_TAB,
  ONE_TAB,
  TWO_TABS,
  THREE_TABS,
  FOUR_TABS,
  FIVE_TABS,
}
