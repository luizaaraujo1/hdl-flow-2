import {Edge, Node} from 'reactflow';

import {DEFAULT_CLK_PORT} from '@constants/ports.constants';
import {VERILOG_AND, VERILOG_OR} from '@constants/verilog';
import FSMState from '@models/state';
import FSMTransition, {LogicalOperator} from '@models/transition';

import {
  getStatesFromNodes,
  getVerilogFsmTransitionConditionFromLogic,
  getVerilogStateName,
} from './utils';

/**
 * Generates properties for state reachibility.
 * Example:
 * cover (current_state == STATE_0) -name state_reachability_0;
 */
export function generateTclStateReachability(
  nodes: Node<FSMState>[],
  currentStateSignal = 'current_state',
): string {
  const states = getStatesFromNodes(nodes);
  return states
    .map(
      (state, idx) =>
        `cover {${currentStateSignal} == ${getVerilogStateName(state)}} -name state_reachability_${idx}`,
    )
    .join('\n');
}
/**
 * Generates properties for state deadlocks.
 * Example:
 *   property state_deadlock_0;
 *     @(posedge clk) s_eventually (current_state != STATE_0);
 *   endproperty
 *   AST_state_deadlock_0: assert property(state_deadlock_0);
 */
export function generateTclStateDeadlock(
  nodes: Node<FSMState>[],
  currentStateSignal = 'current_state',
): string {
  const states = getStatesFromNodes(nodes);
  return states
    .map(
      (state, idx) =>
        `assert {@(posedge ${DEFAULT_CLK_PORT.id_name}) s_eventually (${currentStateSignal} != ${getVerilogStateName(state)})} -name state_deadlock_${idx}`,
    )
    .join('\n');
}

/**
 * Generates properties for transitions.
 * Example:
 *   assert {(current_state == STATE_0 && <cond>) |=> (current_state == STATE_1)} -name transition_STATE_0_STATE_1
 */
export function generateTclStateTransitions(
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
  currentStateSignal = 'current_state',
): string {
  const states = getStatesFromNodes(nodes);
  const properties: string[] = [];

  edges.forEach(edge => {
    const sourceState = states.find(s => s.id === edge.source);
    const targetState = states.find(s => s.id === edge.target);
    if (!sourceState || !targetState) return;

    let condition = `${currentStateSignal} == ${getVerilogStateName(sourceState)}`;

    if (edge.data) {
      const {portLogic, operator} = edge.data;
      const {inputs, internals} = portLogic;

      const inputConditions = Object.keys(inputs).map(inputKey =>
        getVerilogFsmTransitionConditionFromLogic(inputs[inputKey]),
      );

      const internalConditions = Object.keys(internals).map(internalsKey =>
        getVerilogFsmTransitionConditionFromLogic(internals[internalsKey]),
      );

      const allConditions = [...inputConditions, ...internalConditions];
      let portConditionsText = '';
      if (allConditions.length > 0) {
        const joined = allConditions.join(
          operator === LogicalOperator.And ? VERILOG_AND : VERILOG_OR,
        );
        portConditionsText = `(${joined})`;
      }
      if (portConditionsText) {
        condition += ' && ' + portConditionsText;
      }
    }

    const propName = `transition_${getVerilogStateName(sourceState)}_${getVerilogStateName(targetState)}`;
    properties.push(
      `assert {@(posedge ${DEFAULT_CLK_PORT.id_name}) (${condition}) |=> (${currentStateSignal} == ${getVerilogStateName(targetState)})} -name ${propName}`,
    );
  });

  return properties.join('\n');
}

/**
 * Generates all Tcl SVA properties.
 */
export function generateTclSvaProperties(
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
  currentStateSignal = 'current_state',
): string {
  const reach = generateTclStateReachability(nodes, currentStateSignal);
  const deadlock = generateTclStateDeadlock(nodes, currentStateSignal);
  const transitions = generateTclStateTransitions(
    nodes,
    edges,
    currentStateSignal,
  );

  return [
    '# State Reachability Properties',
    reach,
    '',
    '# State Deadlock Properties',
    deadlock,
    '',
    '# State Transition Properties',
    transitions,
    '',
  ].join('\n');
}
