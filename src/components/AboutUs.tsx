import { useTranslation } from 'react-i18next';

export function AboutUs() {
  const { t } = useTranslation('about');
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{t('title')}</h2>
          
          <div className="prose prose-lg mx-auto">
            <p>
              {t('intro')}
            </p>
            
            <p>
              {t('founded')}
            </p>
            
            <h3>{t('mission.title')}</h3>
            <p>
              {t('mission.content')}
            </p>
            
            <h3>{t('machines.title')}</h3>
            <p>
              {t('machines.description')}
            </p>
            <ul>
              <li>{t('machines.features.adjustableSpeed')}</li>
              <li>{t('machines.features.programmablePatterns')}</li>
              <li>{t('machines.features.ballCapacity')}</li>
              <li>{t('machines.features.batteryLife')}</li>
              <li>{t('machines.features.remoteControl')}</li>
            </ul>
            
            <h3>{t('howItWorks.title')}</h3>
            <p>
              {t('howItWorks.description')}
            </p>
            <ol>
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