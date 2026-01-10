import { Link } from 'react-router-dom';
import { Button } from './Button';

export function CallToAction() {
  return (
    <section className="py-16 bg-indigo-600">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Improve Your Tennis Game?
        </h2>
        <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
          Book a tennis ball machine now and take your skills to the next level.
          Our machines are available at convenient locations and times.
        </p>
        <Link to="/booking">
          <Button 
            variant="secondary" 
            size="lg"
            className="bg-white text-indigo-600 hover:bg-indigo-50"
          >
            Book a Machine Now
          </Button>
        </Link>
      </div>
    </section>
  );
}