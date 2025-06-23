import {PortCategory} from '@constants/ports.constants';
import Port, {PortTypeEnum, PortValue} from '@models/port';
import {ExpressionItem, LogicType, PortLogic} from '@models/state';

import StateNodeListElement from './StateNodeListElement';

interface StateNodePortListProps {
  outputsList: PortLogic[];
  internalsList: PortLogic[];
}

function renderExpression(expression?: ExpressionItem[], allPorts?: Port[]) {
  if (!expression || expression.length === 0) return '';
  return expression
    .map((item, idx) => {
      const op = idx > 0 && item.operator ? ` ${item.operator} ` : '';
      let portStr = item.port;

      // Try to find the port definition to check for logic_vector
      let portDef;
      if (allPorts) {
        portDef = allPorts.find(p => p.id_name === item.port);
      }
      const isLogicVector =
        portDef && portDef.type === PortTypeEnum.LogicVector;

      if (
        isLogicVector &&
        item.from !== undefined &&
        item.to !== undefined &&
        item.from !== '' &&
        item.to !== ''
      ) {
        portStr += `[${item.from}:${item.to}]`;
      }

      return `${op}${portStr}`;
    })
    .join('');
}

function renderAssignedPort(portLogic: PortLogic) {
  let portStr = portLogic.port.id_name;
  if (
    portLogic.port.type === PortTypeEnum.LogicVector &&
    (portLogic as any).from !== undefined &&
    (portLogic as any).to !== undefined &&
    (portLogic as any).from !== '' &&
    (portLogic as any).to !== ''
  ) {
    portStr += `[${(portLogic as any).from}:${(portLogic as any).to}]`;
  }
  return portStr;
}

function StateNodePortList({
  outputsList,
  internalsList,
}: StateNodePortListProps) {
  const hasOutputs = outputsList.length > 0;
  const hasInternals = internalsList.length > 0;

  const allPorts = [
    ...outputsList.map(l => l.port),
    ...internalsList.map(l => l.port),
  ];

  const getElementClassName = (
    portCategory: PortCategory,
    logicType: LogicType,
    customValue: PortValue,
  ) => {
    const isInternal = portCategory === 'Internal';
    const elementStyle = isInternal ? 'bg-slate-100' : 'bg-white';
    if (logicType === LogicType.Default) return elementStyle;
    if (customValue) {
      return elementStyle;
    }
    return 'bg-red-300/20 text-red-500';
  };

  return (
    <div className="nowheel max-h-[140px] overflow-y-auto">
      {(hasOutputs || hasInternals) && (
        <>
          {outputsList.map((portLogic, index) => (
            <StateNodeListElement
              key={portLogic.port.id}
              name={renderAssignedPort(portLogic)}
              className={getElementClassName(
                'Output',
                portLogic.type,
                portLogic.customValue,
              )}
              value={
                portLogic.type === LogicType.Default
                  ? String(portLogic.port.defaultValue)
                  : portLogic.expression && portLogic.expression.length > 0
                    ? renderExpression(portLogic.expression, allPorts)
                    : String(portLogic.customValue ?? '')
              }
              hideBottomBorder={
                !hasOutputs &&
                outputsList.length > 0 &&
                index === outputsList.length - 1
              }
            />
          ))}
          {internalsList.map((portLogic, index) => (
            <StateNodeListElement
              key={portLogic.port.id}
              name={renderAssignedPort(portLogic)}
              className={getElementClassName(
                'Internal',
                portLogic.type,
                portLogic.customValue,
              )}
              value={
                portLogic.type === LogicType.Default
                  ? String(portLogic.port.defaultValue)
                  : portLogic.expression && portLogic.expression.length > 0
                    ? renderExpression(portLogic.expression, allPorts)
                    : String(portLogic.customValue ?? '')
              }
              hideBottomBorder={
                internalsList.length > 0 && index === internalsList.length - 1
              }
            />
          ))}
        </>
      )}
    </div>
  );
}

export default StateNodePortList;
