import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiTarget, FiSettings, FiActivity, FiMessageCircle, FiCalendar } from 'react-icons/fi';

const CARD_STYLES = [
  {
    icon: <FiTarget className="w-10 h-10" />,
    gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)',
    iconColor: 'text-emerald-600',
    titleColor: 'text-emerald-900',
    descColor: 'text-emerald-700',
  },
  {
    icon: <FiSettings className="w-10 h-10" />,
    gradient: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 50%, #c4b5fd 100%)',
    iconColor: 'text-violet-600',
    titleColor: 'text-violet-900',
    descColor: 'text-violet-700',
  },
  {
    icon: <FiActivity className="w-10 h-10" />,
    gradient: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #93c5fd 100%)',
    iconColor: 'text-sky-600',
    titleColor: 'text-sky-900',
    descColor: 'text-sky-700',
  },
  {
    icon: <FiClock className="w-10 h-10" />,
    gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
    descColor: 'text-blue-700',
  },
];

export function Features() {
  const { t } = useTranslation('home');
  const navigate = useNavigate();

  const cards = t('features.cards', { returnObjects: true }) as { title: string; description: string }[];

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-100 dark:from-pink-950/40 dark:via-rose-950/30 dark:to-gray-900 transition-colors">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('features.title')}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => {
            const style = CARD_STYLES[index];
            return (
              <div
                key={index}
                className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 text-center hover:-translate-y-1"
                style={{ background: style.gradient }}
              >
                <div className={`flex justify-center mb-4 ${style.iconColor}`}>
                  {style.icon}
                </div>
                <h3 className={`text-lg font-bold ${style.titleColor} mb-2`}>{card.title}</h3>
                <p className={`text-sm ${style.descColor}`}>{card.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <button
            onClick={() => navigate('/agent')}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FiMessageCircle size={18} />
            {t('features.talkToCoach')}
          </button>
          <a href="/#booking" className="w-full sm:w-auto">
            <button className="w-full px-8 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold rounded-full shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all flex items-center justify-center gap-2">
              <FiCalendar size={18} />
              {t('features.bookMachine')}
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
