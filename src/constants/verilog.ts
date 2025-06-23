export const VERILOG_TAB_SIZE = 4;
export const VERILOG_COMMENT_SPACING_SIZE = 1;
export const VERILOG_INLINE_COMMENT = '// ';
export const VERILOG_MODULE_END = 'endmodule';
export const VERILOG_BEGIN = 'begin';
export const VERILOG_END = 'end';
export const VERILOG_IF = 'if ';
export const VERILOG_ELSE_IF = 'else if ';
export const VERILOG_ELSE = 'end else begin';
export const VERILOG_ALWAYS_FF = 'always_ff @(posedge clk or posedge reset)';
export const VERILOG_ALWAYS_COMB = 'always_comb';
export const VERILOG_IF_RESET = 'if (reset) begin';
export const VERILOG_ASSIGN = 'assign ';
export const VERILOG_EQUALITY = ' == ';
export const VERILOG_INEQUALITY = ' != ';
export const VERILOG_LESS_THAN = ' < ';
export const VERILOG_LESS_THAN_OR_EQUAL = ' <= ';
export const VERILOG_GREATER_THAN = ' > ';
export const VERILOG_GREATER_THAN_OR_EQUAL = ' >= ';
export const VERILOG_AND = ' && ';
export const VERILOG_OR = ' || ';
export const VERILOG_NOT = '!';
export const VERILOG_NAND = ' ~& ';
export const VERILOG_NOR = ' ~| ';
export const VERILOG_XOR = ' ^ ';
export const VERILOG_XNOR = ' ~^ ';
export const VERILOG_OUTPUT = 'output';
export const VERILOG_INPUT = 'input';
export const VERILOG_WIRE = 'wire';
export const VERILOG_REG = 'reg';
export const VERILOG_LOGIC = 'logic';
export const VERILOG_COLON = ':';
export const VERILOG_SEMICOLON = ';';
export const VERILOG_ASSIGNMENT_ARROW = ' <= ';

export const VERILOG_SELECTOR_NAME = '__NAME__';

export const VERILOG_MODULE_HEADER = 'module ' + VERILOG_SELECTOR_NAME + ' (';
export const VERILOG_MODULE_FOOTER = ');';
export const VERILOG_MODULE_END_FOOTER = 'endmodule';

export const VERILOG_STATE_ENUM_TYPE = 'typedef enum logic [__BITS__:0] {';
export const VERILOG_STATE_PREFIX = 'STATE_';

export const VERILOG_STATE_REG_DECL = 'state_t current_state, next_state';
export const VERILOG_RESET_CONDITION = 'reset';

export const VERILOG_DEFAULT_COMMENT = 'Default state defined as first state';
export const VERILOG_DATA_OTHERS_COMMENT = 'Default data state - empty';
export const VERILOG_DEAD_STATE_COMMENT = 'Warning! This is a dead state';
export const VERILOG_RESET_ERROR =
  'Error! Reset Node is not connected to any State, try editing the Canvas';
export const VERILOG_RESET_INVALID_ERROR =
  'Error! Reset Node connection is invalid, try editing the Canvas';
export const VERILOG_TRANSITION_ERROR = 'Error! This transition is invalid';
