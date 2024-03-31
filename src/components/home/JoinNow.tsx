import {Link} from 'react-router-dom';

import SimpleSection from '../shared/SimpleSection';

function JoinNow() {
  return (
    <SimpleSection className="bg-gradient-to-tl from-gray-800 to-slate-700 text-gray-100 py-20 mt-16 shadow-lg">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Join the HDL Flow team!</h2>
        <Link
          to="#contribute"
          className="bg-white text-gray-800 font-bold py-2 px-6 rounded-full inline-block hover:px-7 transition-all">
          Contribute
        </Link>
      </div>
    </SimpleSection>
  );
}

export default JoinNow;
