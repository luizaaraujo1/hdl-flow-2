import {GITHUB_LINK} from '../../constants/links';
import SimpleSection from '../shared/SimpleSection';

function JoinNow() {
  return (
    <SimpleSection className="mt-16 bg-gradient-to-tl from-gray-800 to-slate-700 py-20 text-gray-100 shadow-lg">
      <div className="container mx-auto text-center">
        <h2 className="mb-4 text-3xl font-bold">Join the HDL Flow team!</h2>
        <a
          href={GITHUB_LINK}
          className="inline-block rounded-full bg-white px-6 py-2 font-bold text-gray-800 transition-all hover:px-7">
          Contribute
        </a>
      </div>
    </SimpleSection>
  );
}

export default JoinNow;
