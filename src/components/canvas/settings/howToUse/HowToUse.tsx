import RoundedScrollContainer from '@components/shared/RoundedScrollContainer';
import SimpleAccordions, {
  AccordionItem,
} from '@components/shared/SimpleAccordions';

import AboutPortSettings from './contents/AboutPortSettings';
import AboutProjectSettings from './contents/AboutProjectSettings';
import GettingStarted from './contents/GettingStarted';
import WhatIsHdlFlow from './contents/WhatIsHdlFlow';

function HowToUse() {
  const elements: AccordionItem[] = [
    {
      title: 'What is HDL Flow?',
      content: <WhatIsHdlFlow />,
    },
    {
      title: 'Getting started',
      content: <GettingStarted />,
    },
    {
      title: 'About: Port settings',
      content: <AboutPortSettings />,
    },
    {
      title: 'About: Project settings',
      content: <AboutProjectSettings />,
    },
  ];

  return (
    <RoundedScrollContainer>
      <SimpleAccordions elements={elements} />
    </RoundedScrollContainer>
  );
}

export default HowToUse;
