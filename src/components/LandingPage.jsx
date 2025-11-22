import { useLanguage } from '../contexts/LanguageContext'
import ThemeToggle from './ThemeToggle'

function LandingPage({ onStart }) {
  const { t, language, setLanguage } = useLanguage()

  const features = [
    {
      title: t('smartScan'),
      description: t('smartScanDesc'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      accent: 'from-blue-500/10 to-blue-500/5 text-blue-600'
    },
    {
      title: t('stepByStep'),
      description: t('stepByStepDesc'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      accent: 'from-indigo-500/10 to-indigo-500/5 text-indigo-600'
    },
    {
      title: t('interactiveChat'),
      description: t('interactiveChatDesc'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      accent: 'from-purple-500/10 to-purple-500/5 text-purple-600'
    }
  ]

  const stats = [
    { label: t('statStudents'), value: '150K+' },
    { label: t('statAccuracy'), value: '98.5%' },
    { label: t('statLanguages'), value: '2' }
  ]

  const timeline = [
    { title: t('timelineScan'), desc: t('timelineScanDesc') },
    { title: t('timelineEdit'), desc: t('timelineEditDesc') },
    { title: t('timelineSolve'), desc: t('timelineSolveDesc') },
    { title: t('timelineExplain'), desc: t('timelineExplainDesc') }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white font-sans transition-colors">
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">Math Conquest</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 shadow-inner border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${language === 'fr' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  FR
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${language === 'en' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  EN
                </button>
              </div>
              <ThemeToggle />
              <button
                onClick={onStart}
                className="hidden sm:flex px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-semibold hover:-translate-y-0.5 transition-all shadow-lg shadow-gray-900/10 dark:shadow-white/10"
              >
                {t('start')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-transparent dark:from-indigo-900/30 dark:via-gray-950/80" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-transparent blur-3xl opacity-60 animate-pulse" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-16 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 shadow-sm text-sm font-semibold tracking-widest uppercase text-blue-600">
            {t('heroBadge')}
          </div>
          <h1 className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-700 to-gray-900 dark:from-white dark:via-blue-200 dark:to-white">
              {t('heroTitle')}
            </span>
            <br />
            <span className="text-blue-600 dark:text-blue-400">{t('heroSubtitle')}</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('heroDesc')}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStart}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-blue-500/30 hover:translate-y-0.5 transition-all"
            >
              {t('tryFree')}
            </button>
            <a
              href="#features"
              className="px-10 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl font-semibold text-lg hover:-translate-y-0.5 transition-all shadow-md"
            >
              {t('learnMore')}
            </a>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-lg shadow-gray-900/5 dark:shadow-black/30">
                <p className="text-4xl font-extrabold text-blue-600">{stat.value}</p>
                <p className="mt-2 text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-900/5 dark:shadow-black/40 hover:-translate-y-1 transition-transform`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.accent} flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold uppercase tracking-widest text-xs">{t('stepByStep')}</p>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">{t('journeyTitle')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">{t('journeySubtitle')}</p>
          </div>
          <div className="space-y-6">
            {timeline.map((item, idx) => (
              <div key={item.title} className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-bold text-lg flex items-center justify-center">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-3xl p-10 text-center text-white shadow-2xl relative overflow-hidden border border-white/10">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_#ffffff33,_transparent_45%)]"></div>
            <div className="relative z-10 space-y-4">
              <p className="uppercase tracking-[0.5em] text-xs font-semibold text-white/80">{t('heroBadge')}</p>
              <h3 className="text-3xl sm:text-4xl font-bold">{t('ctaTitle')}</h3>
              <p className="text-white/90 max-w-3xl mx-auto">{t('ctaSubtitle')}</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <button
                  onClick={onStart}
                  className="px-8 py-3 bg-white text-blue-800 rounded-full font-semibold shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  {t('ctaButton')}
                </button>
                <a
                  href="#features"
                  className="px-8 py-3 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all"
                >
                  {t('ctaSecondary')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} {t('footerText')}{' '}
            <a
              href="http://portfoliodek.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Dekens Ruzuba
            </a>. {t('allRightsReserved')}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
