import { useTranslation } from 'react-i18next';

export function AboutUs() {
  const { t } = useTranslation('about');
  return (
    <section className="py-16 bg-white dark:bg-gray-800 transition-colors">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg dark:prose-invert mx-auto text-left max-w-none">

            <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
              {t('tagline')}
            </p>
            <p className="mb-4">{t('intro1')}</p>
            <p className="mb-10">{t('intro2')}</p>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-10">
              {t('whatWeDo.title')}
            </h3>
            <p className="mb-6">{t('whatWeDo.description')}</p>
            <div className="space-y-6 mb-6">
              {(['aiCoach', 'venueRentals', 'equipmentSales'] as const).map((key) => (
                <div key={key}>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {t(`whatWeDo.items.${key}.title`)}
                  </h4>
                  <p>{t(`whatWeDo.items.${key}.content`)}</p>
                </div>
              ))}
            </div>
            <p className="mb-10 italic">{t('whatWeDo.closing')}</p>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-10">
              {t('whyItMatters.title')}
            </h3>
            <p className="mb-4">{t('whyItMatters.content1')}</p>
            <p className="mb-4">{t('whyItMatters.content2')}</p>
            <p className="mb-10">{t('whyItMatters.content3')}</p>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-10">
              {t('equipment.title')}
            </h3>
            <p className="mb-6">{t('equipment.description')}</p>
            <div className="space-y-6 mb-10">
              {(['paceSPro', 'novaSPro'] as const).map((key) => (
                <div key={key}>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {t(`equipment.machines.${key}.title`)}
                  </h4>
                  <p>{t(`equipment.machines.${key}.content`)}</p>
                </div>
              ))}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-10">
              {t('venues.title')}
            </h3>
            <p className="mb-4">{t('venues.content1')}</p>
            <p className="mb-10">{t('venues.content2')}</p>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-10">
              {t('company.title')}
            </h3>
            <p className="mb-4">{t('company.content1')}</p>
            <p className="mb-4">{t('company.content2')}</p>

          </div>
        </div>
      </div>
    </section>
  );
}
