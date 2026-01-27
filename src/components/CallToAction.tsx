import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

export function CallToAction() {
  const { t } = useTranslation('home');
  const navigate = useNavigate();

  const handleBookingClick = () => {
    // Navigate to home page first
    navigate('/');
    // Then scroll to booking section after a brief delay to ensure page is loaded
    setTimeout(() => {
      const bookingElement = document.getElementById('booking');
      if (bookingElement) {
        bookingElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section className="py-16 bg-indigo-600 dark:bg-indigo-800 transition-colors">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          {t('cta.title')}
        </h2>
        <p className="text-lg text-indigo-100 dark:text-indigo-200 mb-8 max-w-2xl mx-auto">
          {t('cta.subtitle')}
        </p>
        <Button 
          variant="secondary" 
          size="lg"
          onClick={handleBookingClick}
          className="bg-white dark:bg-gray-100 text-indigo-600 dark:text-indigo-800 hover:bg-indigo-50 dark:hover:bg-gray-200"
        >
          {t('cta.button')}
        </Button>
      </div>
    </section>
  );
}