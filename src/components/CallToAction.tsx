import { useTranslation } from 'react-i18next';
import { Button } from './Button';

export function CallToAction() {
  const { t } = useTranslation('home');
  return (
    <section className="py-16 bg-indigo-600">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          {t('cta.title')}
        </h2>
        <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
          {t('cta.subtitle')}
        </p>
        <a href="#booking">
          <Button 
            variant="secondary" 
            size="lg"
            className="bg-white text-indigo-600 hover:bg-indigo-50"
          >
            {t('cta.button')}
          </Button>
        </a>
      </div>
    </section>
  );
}