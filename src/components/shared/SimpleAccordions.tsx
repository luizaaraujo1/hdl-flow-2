import {ReactNode, useState} from 'react';

import {ChevronDownIcon} from '@radix-ui/react-icons';

export interface AccordionItem {
  title: string;
  content: ReactNode;
}

interface Props {
  elements: AccordionItem[];
}

function SimpleAccordions({elements}: Props) {
  const [isOpenArray, setIsOpenArray] = useState<boolean[]>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    elements.map(_ => false),
  );

  const handleClick = (index: number) => {
    setIsOpenArray(prev => {
      const newArray = [...prev];
      newArray[index] = !newArray[index];
      return newArray;
    });
  };

  const getSpinStyle = (open: boolean) => (open ? 'rotate-180' : '');

  const getFixedStyle = (open: boolean) => (open ? 'sticky top-0' : '');

  const getRoundStyle = (open: boolean) =>
    open ? 'rounded-lg rounded-b-none' : 'rounded-lg';

  return (
    <div className="space-y-4 ">
      {elements.map(({title: header, content}, index) => (
        <div
          key={`header-${index}`}
          className="rounded-lg bg-white shadow-md focus-within:ring focus-within:ring-gray-400 focus-within:ring-opacity-75 focus:outline-none">
          <div
            className={`btn-canvas w-full px-2 py-4 hover:cursor-pointer ${getRoundStyle(isOpenArray[index])} ${getFixedStyle(isOpenArray[index])}`}
            onClick={() => handleClick(index)}>
            <div className="flex w-full justify-between ">
              <span className="select-none text-sm font-medium text-black">
                {header}
              </span>
              <ChevronDownIcon
                className={`transition-transform ${getSpinStyle(isOpenArray[index])}`}
              />
            </div>
          </div>
          {isOpenArray[index] && (
            <div className="w-full rounded-b-lg bg-slate-200 px-4 py-3 transition ease-in-out">
              <div className="text-sm text-gray-900">{content}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default SimpleAccordions;
