import { Hero } from './Hero';
import { BallMachineFeature } from './BallMachineFeature';
import { TutorialSection } from './TutorialSection';
import { Features } from './Features';
import { Testimonials } from './Testimonials';
import { CallToAction } from './CallToAction';

export function HomePage() {
  return (
    <div>
      <Hero />
      <TutorialSection />
      <BallMachineFeature />
      <Features />
      <Testimonials />
      <CallToAction />
    </div>
  );
}