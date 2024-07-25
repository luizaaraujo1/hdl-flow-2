import RoundedScrollContainer from '@components/shared/RoundedScrollContainer';
import SimpleAccordions, {
  AccordionItem,
} from '@components/shared/SimpleAccordions';

import AboutPortSettings from './contents/AboutPortSettings';
import AboutProjectSettings from './contents/AboutProjectSettings';
import AboutStateSettings from './contents/AboutStateSettings';
import AboutTransitionSettings from './contents/AboutTransitionSettings';
import CanvasControls from './contents/CanvasControls';
import CodeResults from './contents/CodeResults';
import GettingStarted from './contents/GettingStarted';
import WhatIsHdlFlow from './contents/WhatIsHdlFlow';

function HowToUse() {
  const elements: AccordionItem[] = [
    {
      title: 'What is HDL Flow?',
      content: <WhatIsHdlFlow />,
    },
    {
      title: 'Canvas controls',
      content: <CanvasControls />,
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
      title: 'About: State settings',
      content: <AboutStateSettings />,
    },
    {
      title: 'About: Transition settings',
      content: <AboutTransitionSettings />,
    },
    {
      title: 'About: Project settings',
      content: <AboutProjectSettings />,
    },
    {title: 'About: Code results', content: <CodeResults />},
  ];

  return (
    <RoundedScrollContainer>
      <SimpleAccordions elements={elements} />
    </RoundedScrollContainer>
  );
}

export default HowToUse;
