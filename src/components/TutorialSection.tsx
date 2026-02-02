import { useTranslation } from 'react-i18next';

export function TutorialSection() {
  const { t } = useTranslation('tutorial');
  
  const steps = [
    {
      number: 1,
      gif: '/tutorial/Step1.gif',
      title: t('step1.title', 'Step 1'),
    },
    {
      number: 2,
      gif: '/tutorial/step2.gif',
      title: t('step2.title', 'Step 2'),
    },
    {
      number: 3,
      gif: '/tutorial/step3.gif',
      title: t('step3.title', 'Step 3'),
    },
    {
      number: 4,
      gif: '/tutorial/step4.gif',
      title: t('step4.title', 'Step 4'),
    },
  ];

  return (
    <section 
      className="py-16 overflow-hidden bg-gradient-to-b from-amber-50/40 to-white dark:from-gray-900 dark:to-gray-800 transition-colors"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('title', 'How to get started')}
          </h2>
          {t('subtitle') && (
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <img
                  src={step.gif}
                  alt={`Step ${step.number}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
