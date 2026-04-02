import { useTranslation } from 'react-i18next';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80',
    alt: 'Professional ball machine on a tennis court',
  },
  {
    src: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
    alt: 'Tennis court from above',
  },
  {
    src: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=800&q=80',
    alt: 'Stockholm, Sweden',
  },
];

function SectionImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] w-full">
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}

export function AboutUs() {
  const { t } = useTranslation('about');

  return (
    <section className="py-16 bg-white dark:bg-gray-800 transition-colors">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Group 1: Intro — text left, image right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-3">
              {t('missionLabel')}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-snug mb-8">
              {t('missionStatement')}
            </p>
            <p>{t('intro1')}</p>
          </div>

          <SectionImage {...images[0]} />
        </div>

        {/* Group 2: Why this matters + Our equipment — image left, text right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-3">
              {t('whyItMatters.title')}
            </p>
            <p className="mb-4">{t('whyItMatters.content1')}</p>
            <p className="mb-4">{t('whyItMatters.content2')}</p>
            <p>{t('whyItMatters.content3')}</p>
          </div>

          {/* Image moves to left on desktop via order */}
          <div className="lg:order-first">
            <SectionImage {...images[1]} />
          </div>
        </div>

        {/* Group 3: What we do — text left, image right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-3">
              {t('whatWeDo.title')}
            </p>
            <div className="space-y-5 mb-6">
              {(['aiCoach', 'venueRentals', 'equipmentSales'] as const).map((key) => (
                <div key={key}>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {t(`whatWeDo.items.${key}.title`)}
                  </h4>
                  <p>{t(`whatWeDo.items.${key}.content`)}</p>
                </div>
              ))}
            </div>
          </div>

          <SectionImage {...images[2]} />
        </div>

      </div>
    </section>
  );
}
