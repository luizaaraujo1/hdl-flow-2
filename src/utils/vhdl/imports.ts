import {vhdlCodeLine} from './utils';

export function generateVhdlImports(
  tabAmount: number,
  projectName: string,
  authorName: string,
) {
  return (
    vhdlCodeLine('Resulting VHDL code from HDL Flow', tabAmount, true, true) +
    vhdlCodeLine('Project Name: ' + projectName, tabAmount, false, true) +
    vhdlCodeLine('Author: ' + authorName, tabAmount, false, true) +
    vhdlCodeLine(
      'Last Updated: ' + new Date().toString(),
      tabAmount,
      false,
      true,
    ) +
    vhdlCodeLine('library IEEE', tabAmount) +
    vhdlCodeLine('use IEEE.std_logic_1164.all', tabAmount)
  );
}
