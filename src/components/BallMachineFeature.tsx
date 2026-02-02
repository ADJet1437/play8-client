import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  FiTarget,
  FiBarChart2,
  FiRotateCw,
  FiZap,
  FiSmartphone,
  FiList,
  FiVideo,
  FiCrosshair,
} from 'react-icons/fi';

interface CardConfig {
  key: string;
  icon: React.ReactNode;
  gradient: string;
  // Desktop absolute position (% based)
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  parallaxSpeed: number;
}

const CARDS: CardConfig[] = [
  {
    key: 'practiceModes',
    icon: <FiTarget size={28} />,
    gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
    x: 8, y: 2,
    rotation: -6, width: 180, height: 110,
    parallaxSpeed: 0.4,
  },
  {
    key: 'sessionAnalytics',
    icon: <FiBarChart2 size={28} />,
    gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    x: 62, y: 0,
    rotation: 4, width: 200, height: 110,
    parallaxSpeed: 0.6,
  },
  {
    key: 'spinSettings',
    icon: <FiRotateCw size={28} />,
    gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
    x: 0, y: 28,
    rotation: -4, width: 170, height: 105,
    parallaxSpeed: 0.3,
  },
  {
    key: 'speedControl',
    icon: <FiZap size={28} />,
    gradient: 'linear-gradient(135deg, #06b6d4, #14b8a6)',
    x: 78, y: 15,
    rotation: 7, width: 165, height: 100,
    parallaxSpeed: 0.5,
  },
  {
    key: 'appControl',
    icon: <FiSmartphone size={28} />,
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    x: 2, y: 58,
    rotation: 5, width: 170, height: 105,
    parallaxSpeed: 0.35,
  },
  {
    key: 'customDrills',
    icon: <FiList size={28} />,
    gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
    x: 75, y: 50,
    rotation: -5, width: 185, height: 110,
    parallaxSpeed: 0.55,
  },
  {
    key: 'videoReplay',
    icon: <FiVideo size={28} />,
    gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
    x: 12, y: 76,
    rotation: 3, width: 180, height: 105,
    parallaxSpeed: 0.45,
  },
  {
    key: 'smartTracking',
    icon: <FiCrosshair size={28} />,
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    x: 65, y: 74,
    rotation: -3, width: 185, height: 105,
    parallaxSpeed: 0.5,
  },
];

export function BallMachineFeature() {
  const { t } = useTranslation('tutorial');
  const sectionRef = useRef<HTMLElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setMouseOffset({
      x: (e.clientX - cx) / rect.width,
      y: (e.clientY - cy) / rect.height,
    });
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    setMouseOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = -rect.top / window.innerHeight;
      setScrollOffset(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-16 overflow-hidden bg-gradient-to-b from-amber-50/40 to-white dark:from-gray-900 dark:to-gray-800"
    >
      {/* Desktop: orbital layout */}
      {!isMobile && (
        <div className="relative mx-auto max-w-6xl" style={{ height: 520 }}>
          {/* Cards */}
          {CARDS.map((card) => {
            const tx = mouseOffset.x * 30 * card.parallaxSpeed;
            const ty = mouseOffset.y * 30 * card.parallaxSpeed + scrollOffset * 40 * card.parallaxSpeed;
            return (
              <div
                key={card.key}
                className="absolute transition-transform duration-200 ease-out cursor-pointer group"
                style={{
                  left: `${card.x}%`,
                  top: `${card.y}%`,
                  width: card.width,
                  height: card.height,
                  transform: `translate(${tx}px, ${ty}px) rotate(${card.rotation}deg)`,
                }}
              >
                <div
                  className="w-full h-full rounded-2xl shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 flex flex-col items-center justify-center gap-3 text-white"
                  style={{ background: card.gradient }}
                >
                  {card.icon}
                  <span className="text-sm font-semibold tracking-wide">
                    {t(`cards.${card.key}`)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Center CTA */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center pointer-events-auto max-w-lg px-6">
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-500 dark:text-gray-400 mb-4">
                {t('label')}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {t('title')}
              </h2>
              <h2 className="text-4xl md:text-5xl font-bold italic text-indigo-600 dark:text-indigo-400 mb-6">
                {t('titleHighlight')}
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {t('subtitle')}
              </p>
              <a href="/#booking">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg hover:shadow-xl">
                  {t('book')} →
                </button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Mobile: grid layout */}
      {isMobile && (
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-500 dark:text-gray-400 mb-4">
              {t('label')}
            </p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t('title')}
            </h2>
            <h2 className="text-3xl font-bold italic text-indigo-600 dark:text-indigo-400 mb-4">
              {t('titleHighlight')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {t('subtitle')}
            </p>
            <a href="/#booking">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold transition-colors shadow-lg">
                {t('book')} →
              </button>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {CARDS.map((card) => (
              <div
                key={card.key}
                className="rounded-2xl shadow-md flex flex-col items-center justify-center gap-2 text-white py-8 px-4"
                style={{ background: card.gradient }}
              >
                {card.icon}
                <span className="text-xs font-semibold tracking-wide text-center">
                  {t(`cards.${card.key}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
