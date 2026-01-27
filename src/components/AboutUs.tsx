import { useTranslation } from 'react-i18next';

export function AboutUs() {
  const { t } = useTranslation('about');
  return (
    <section className="py-16 bg-white dark:bg-gray-800 transition-colors">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">{t('title')}</h2>
          
          <div className="prose prose-lg dark:prose-invert mx-auto text-left max-w-none">
            <p className="mb-6">
              {t('intro')}
            </p>
            
            <p className="mb-8">
              {t('founded')}
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">{t('mission.title')}</h3>
            <p className="mb-8">
              {t('mission.content')}
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">{t('machines.title')}</h3>
            <p className="mb-4">
              {t('machines.description')}
            </p>
            <ul className="list-disc list-inside mb-8 space-y-2">
              <li>{t('machines.features.adjustableSpeed')}</li>
              <li>{t('machines.features.programmablePatterns')}</li>
              <li>{t('machines.features.ballCapacity')}</li>
              <li>{t('machines.features.batteryLife')}</li>
              <li>{t('machines.features.remoteControl')}</li>
            </ul>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">{t('howItWorks.title')}</h3>
            <p className="mb-4">
              {t('howItWorks.description')}
            </p>
            <ol className="list-decimal list-inside mb-8 space-y-2">
              <li>{t('howItWorks.steps.select')}</li>
              <li>{t('howItWorks.steps.book')}</li>
              <li>{t('howItWorks.steps.practice')}</li>
              <li>{t('howItWorks.steps.end')}</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}