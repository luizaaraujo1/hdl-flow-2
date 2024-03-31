import Benefits from '../components/home/Benefits';
import Features from '../components/home/Features';
import Hero from '../components/home/Hero';
import JoinNow from '../components/home/JoinNow';
import SocialProof from '../components/home/socialProof/SocialProof';

function Home() {
  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <Hero />
      <Features />
      <JoinNow />
      <Benefits />
      <SocialProof />
    </div>
  );
}

export default Home;
