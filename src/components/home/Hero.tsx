import {Link} from 'react-router-dom';

import SimpleSection from '../shared/SimpleSection';

function Hero() {
  return (
    <SimpleSection className="bg-gradient-to-br from-neutral-300 to-slate-100 pt-48 pb-48">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Welcome to HDL Flow</h2>
        <p className="text-lg font-light mb-8">
          Easily create FSM diagrams and transcribe them into useful HDL code.
        </p>
        <Link to="/canvas" className="btn-primary">
          Get Started
        </Link>
      </div>
    </SimpleSection>
  );
}

export default Hero;
