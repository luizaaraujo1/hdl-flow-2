import {verilogCodeLine} from './utils';

export function generateVerilogImports(
  tabAmount: number,
  projectName: string,
  authorName: string,
) {
  return (
    verilogCodeLine(
      'Resulting Verilog code from HDL Flow',
      tabAmount,
      true,
      true,
    ) +
    verilogCodeLine('Project Name: ' + projectName, tabAmount, false, true) +
    verilogCodeLine('Author: ' + authorName, tabAmount, false, true) +
    verilogCodeLine(
      'Last Updated: ' + new Date().toString(),
      tabAmount,
      false,
      true,
    )
  );
}
