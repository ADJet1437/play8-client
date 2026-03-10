import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMessageCircle, FiCalendar, FiShoppingBag } from 'react-icons/fi';

export function CallToAction() {
  const navigate = useNavigate();
  const { t } = useTranslation('home');

  return (
    <section className="py-16 bg-indigo-600 dark:bg-indigo-800 transition-colors">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Section 1 */}
          <div className="flex-1 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-10 flex flex-col items-start">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {t('cta.session.title')}
            </h2>
            <p className="text-indigo-100 mb-8 text-base leading-relaxed">
              {t('cta.session.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-auto w-full">
              <button
                onClick={() => navigate('/agent')}
                className="flex-1 px-6 py-3 bg-white text-indigo-700 font-semibold rounded-full hover:bg-indigo-50 transition-all shadow flex items-center justify-center gap-2"
              >
                <FiMessageCircle size={18} />
                {t('cta.session.talkToCoach')}
              </button>
              <a href="/#booking" className="flex-1">
                <button className="w-full px-6 py-3 bg-indigo-500/40 hover:bg-indigo-500/60 text-white font-semibold rounded-full border border-white/30 transition-all flex items-center justify-center gap-2">
                  <FiCalendar size={18} />
                  {t('cta.session.bookMachine')}
                </button>
              </a>
            </div>
          </div>

          {/* Section 2 */}
          <div className="lg:w-72 bg-gradient-to-br from-gray-800 to-gray-700 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-10 flex flex-col items-start border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-3">
              {t('cta.store.title')}
            </h2>
            <p className="text-gray-300 mb-8 text-base leading-relaxed">
              {t('cta.store.description')}
            </p>
            <a href="https://store.play8.ai" target="_blank" rel="noopener noreferrer" className="mt-auto w-full">
              <button className="w-full px-6 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all shadow flex items-center justify-center gap-2">
                <FiShoppingBag size={18} />
                {t('cta.store.visitStore')}
              </button>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
