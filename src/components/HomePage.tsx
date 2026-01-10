import { Hero } from './Hero';
import { Features } from './Features';
import { BookingSection } from './BookingSection';
import { Testimonials } from './Testimonials';
import { CallToAction } from './CallToAction';

export function HomePage() {
  return (
    <div>
      <Hero />
      <BookingSection />
      <Features />
      <Testimonials />
      <CallToAction />
    </div>
  );
}