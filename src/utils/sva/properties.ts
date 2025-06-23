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
 *   property state_reachability_0;
 *     (current_state == STATE_0);
 *   endproperty
 *   COV_state_reachability_0: cover property(state_reachability_0);
 */
function generateSvaStateReachability(
  nodes: Node<FSMState>[],
  currentStateSignal = 'current_state',
): {properties: string; asserts: string} {
  const states = getStatesFromNodes(nodes);
  const properties = states
    .map((state, idx) =>
      [
        `property state_reachability_${idx};`,
        `    (${currentStateSignal} == ${getVerilogStateName(state)});`,
        `endproperty`,
      ].join('\n'),
    )
    .join('\n\n');
  const asserts = states
    .map(
      (_state, idx) =>
        `COV_state_reachability_${idx}: cover property(state_reachability_${idx});`,
    )
    .join('\n');
  return {properties, asserts};
}

/**
 * Generates properties for state deadlocks.
 * Example:
 *   property state_deadlock_0;
 *     @(posedge clk) s_eventually (current_state != STATE_0);
 *   endproperty
 *   AST_state_deadlock_0: assert property(state_deadlock_0);
 */
function generateSvaStateDeadlock(
  nodes: Node<FSMState>[],
  currentStateSignal = 'current_state',
): {properties: string; asserts: string} {
  const states = getStatesFromNodes(nodes);
  const properties = states
    .map((state, idx) =>
      [
        `property state_deadlock_${idx};`,
        `    @(posedge ${DEFAULT_CLK_PORT.id_name}) s_eventually (${currentStateSignal} != ${getVerilogStateName(state)});`,
        `endproperty`,
      ].join('\n'),
    )
    .join('\n\n');
  const asserts = states
    .map(
      (_state, idx) =>
        `AST_state_deadlock_${idx}: assert property(state_deadlock_${idx});`,
    )
    .join('\n');
  return {properties, asserts};
}

/**
 * Generates properties for transitions.
 * Example:
 *   property transition_0_1;
 *     (current_state == STATE_0 && <cond>) |=> (current_state == STATE_1);
 *   endproperty
 *   AST_transition_0_1: assert(property(transition_0_1));
 */
function generateSvaStateTransitions(
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
  currentStateSignal = 'current_state',
): {properties: string; asserts: string} {
  const states = getStatesFromNodes(nodes);
  const properties: string[] = [];
  const asserts: string[] = [];

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
      [
        `property ${propName};`,
        `     @(posedge ${DEFAULT_CLK_PORT.id_name}) (${condition}) |=> (${currentStateSignal} == ${getVerilogStateName(targetState)});`,
        `endproperty`,
      ].join('\n'),
    );
    asserts.push(`AST_${propName}: assert property(${propName});`);
  });

  return {
    properties: properties.join('\n\n'),
    asserts: asserts.join('\n'),
  };
}

export function generateSvaProperties(
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
  currentStateSignal = 'current_state',
): string {
  const reach = generateSvaStateReachability(nodes, currentStateSignal);
  const deadlock = generateSvaStateDeadlock(nodes, currentStateSignal);
  const transitions = generateSvaStateTransitions(
    nodes,
    edges,
    currentStateSignal,
  );

  return [
    '// State Reachability Properties',
    reach.properties,
    '',
    reach.asserts,
    '',
    '// State Deadlock Properties',
    deadlock.properties,
    '',
    deadlock.asserts,
    '',
    '// State Transition Properties',
    transitions.properties,
    '',
    transitions.asserts,
    '',
  ].join('\n');
}
