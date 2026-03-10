import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMessageCircle, FiClipboard, FiCalendar, FiZap } from 'react-icons/fi';

const STEP_STYLES = [
  {
    bgIcon: <FiMessageCircle size={120} />,
    gradient: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 50%, #c4b5fd 100%)',
    iconColor: 'text-violet-500',
    titleColor: 'text-violet-900',
    descColor: 'text-violet-700',
  },
  {
    bgIcon: <FiClipboard size={120} />,
    gradient: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #93c5fd 100%)',
    iconColor: 'text-sky-500',
    titleColor: 'text-sky-900',
    descColor: 'text-sky-700',
  },
  {
    bgIcon: <FiCalendar size={120} />,
    gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)',
    iconColor: 'text-emerald-500',
    titleColor: 'text-emerald-900',
    descColor: 'text-emerald-700',
  },
  {
    bgIcon: <FiZap size={120} />,
    gradient: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 50%, #fdba74 100%)',
    iconColor: 'text-orange-500',
    titleColor: 'text-orange-900',
    descColor: 'text-orange-700',
  },
];

export function BallMachineFeature() {
  const navigate = useNavigate();
  const { t } = useTranslation('home');

  const steps = t('howItWorks.steps', { returnObjects: true }) as { title: string; description: string }[];

  return (
    <section className="relative py-20 transition-colors">
      {/* Light mode background */}
      <div
        className="absolute inset-0 dark:hidden pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #f5f7ff 0%, #eaedff 45%, #dce1fc 100%)' }}
      />
      {/* Dark mode background */}
      <div
        className="absolute inset-0 hidden dark:block pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #1e1b4b 0%, #13113a 50%, #0a0920 100%)' }}
      />
      <div className="relative z-10 container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            {t('howItWorks.title')}
          </h2>
        </div>

        {/* Cards */}
        <div className="relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-violet-300 via-sky-300 via-emerald-300 to-orange-300 dark:from-violet-700 dark:via-sky-700 dark:via-emerald-700 dark:to-orange-700 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, index) => {
              const style = STEP_STYLES[index];
              return (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col group hover:-translate-y-1"
                  style={{ background: style.gradient }}
                >
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${style.iconColor} opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`}
                  >
                    {style.bgIcon}
                  </div>
                  <h3 className={`text-base font-bold ${style.titleColor} mb-2 leading-snug relative z-10`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm ${style.descColor} leading-relaxed flex-1 relative z-10`}>
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <button
            onClick={() => navigate('/agent')}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FiMessageCircle size={18} />
            {t('howItWorks.talkToCoach')}
          </button>
          <a href="/#booking" className="w-full sm:w-auto">
            <button className="w-full px-8 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold rounded-full shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all flex items-center justify-center gap-2">
              <FiCalendar size={18} />
              {t('howItWorks.bookMachine')}
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
