export const VHDL_TAB = '    ';
export const VHDL_LINE_COMMENT = '-- ';
export const VHDL_FSM_END_SECTION = ')';
export const VHDL_BEGIN = 'begin';
export const VHDL_BEGIN_PROCESS = 'process (';
export const VHDL_END_PROCESS = 'end process';
export const VHDL_END_IF = 'end if';
export const VHDL_STATE_PREFIX = 'STATE_';
export const VHDL_WHEN = 'when ';
export const VHDL_DEFINITION_ARROW = '=>';

export const VHDL_FSM_ENTITY_HEADER = 'entity FSM is';
export const VHDL_FSM_ENTITY_PORT_HEADER = 'port (';
export const VHDL_FSM_ENTITY_FOOTER = 'end entity FSM';

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
