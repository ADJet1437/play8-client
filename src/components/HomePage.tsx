import { Hero } from './Hero';
import { AgentInputSection } from './AgentInputSection';
import { BallMachineFeature } from './BallMachineFeature';
import { Features } from './Features';
import { Testimonials } from './Testimonials';
import { CallToAction } from './CallToAction';

export function HomePage() {
  return (
    <div>
      <AgentInputSection />
      <Hero />
      <BallMachineFeature />
      <Features />
      <Testimonials />
      <CallToAction />
    </div>
  );
}