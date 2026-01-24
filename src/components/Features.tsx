import { useTranslation } from 'react-i18next';
import { FiClock, FiTarget, FiSettings, FiActivity } from 'react-icons/fi';

export function Features() {
  const { t } = useTranslation('home');
  const features = [
    {
      icon: <FiClock className="w-10 h-10 text-indigo-600" />,
      title: t('features.flexibleScheduling.title'),
      description: t('features.flexibleScheduling.description')
    },
    {
      icon: <FiTarget className="w-10 h-10 text-indigo-600" />,
      title: t('features.precisionTraining.title'),
      description: t('features.precisionTraining.description')
    },
    {
      icon: <FiSettings className="w-10 h-10 text-indigo-600" />,
      title: t('features.customizableSettings.title'),
      description: t('features.customizableSettings.description')
    },
    {
      icon: <FiActivity className="w-10 h-10 text-indigo-600" />,
      title: t('features.trackProgress.title'),
      description: t('features.trackProgress.description')
    }
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('features.title')}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('features.subtitle')}
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