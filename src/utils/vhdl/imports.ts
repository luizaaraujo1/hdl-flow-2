import {vhdlCodeLine} from './utils';

export function generateVhdlImports(tabAmount: number) {
  return (
    vhdlCodeLine('Resulting VHDL code from HDL Flow', tabAmount, true, true) +
    vhdlCodeLine('library IEEE', tabAmount) +
    vhdlCodeLine('use IEEE.std_logic_1164.all', tabAmount)
  );
}
