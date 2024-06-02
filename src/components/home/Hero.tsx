import {Link} from 'react-router-dom';

import ROUTE_PATHS from '../../constants/routePaths';
import SimpleSection from '../shared/SimpleSection';

function Hero() {
  return (
    <SimpleSection className="bg-gradient-to-br from-neutral-300 to-slate-100 pb-48 pt-48">
      <div className="container mx-auto text-center">
        <h2 className="mb-4 text-4xl font-bold">Welcome to HDL Flow</h2>
        <p className="mb-8 text-lg font-light">
          Easily create FSM diagrams and transcribe them into useful HDL code.
        </p>
        <Link to={ROUTE_PATHS.Canvas} className="btn-primary">
          Get Started
        </Link>
      </div>
    </SimpleSection>
  );
}

export default Hero;
