import { AboutUs } from './AboutUs';
import { CallToAction } from './CallToAction';

export function AboutPage() {
  return (
    <div>
      <div className="bg-indigo-50 dark:bg-indigo-900/30 py-12 transition-colors">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 text-center">About Us</h1>
        </div>
      </div>
      
      <AboutUs />
      <CallToAction />
    </div>
  );
}