import { FiClock, FiTarget, FiSettings, FiActivity } from 'react-icons/fi';

export function Features() {
  const features = [
    {
      icon: <FiClock className="w-10 h-10 text-indigo-600" />,
      title: 'Flexible Scheduling',
      description: 'Book your practice session at a time that works for you. Start when you want and end when you\'re done.'
    },
    {
      icon: <FiTarget className="w-10 h-10 text-indigo-600" />,
      title: 'Precision Training',
      description: 'Our machines deliver consistent ball placement to help you focus on specific areas of your game.'
    },
    {
      icon: <FiSettings className="w-10 h-10 text-indigo-600" />,
      title: 'Customizable Settings',
      description: 'Adjust speed, spin, and trajectory to match your skill level and training goals.'
    },
    {
      icon: <FiActivity className="w-10 h-10 text-indigo-600" />,
      title: 'Track Your Progress',
      description: 'Review your booking history to see how often you practice and plan your improvement.'
    }
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Play8?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our tennis ball machines provide the perfect practice partner, available whenever you are.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}