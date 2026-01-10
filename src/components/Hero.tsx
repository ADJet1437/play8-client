import { Link } from 'react-router-dom';
import { Button } from './Button';

export function Hero() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Elevate Your Tennis Game with Play<span className="text-indigo-600">8</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              Book our premium tennis ball machines and practice at your own pace. 
              Perfect your technique, improve your reflexes, and take your game to the next level.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#booking" className="inline-block">
                <Button variant="primary" size="lg">
                  Book a Machine
                </Button>
              </a>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-200 rounded-full opacity-50"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-200 rounded-full opacity-50"></div>
              <img 
                src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Tennis player practicing with ball machine" 
                className="rounded-lg shadow-xl relative z-10 w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}