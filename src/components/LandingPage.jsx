import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import ThemeToggle from './ThemeToggle'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Scan, Brain, MessageCircle, ChevronRight, CheckCircle2, Zap, ArrowRight, Calculator } from 'lucide-react'

// --- Composant de Simulation (Hero Graphic) ---
// --- Composant de Simulation (Hero Graphic) ---
const HeroSimulation = () => {
  const [step, setStep] = useState(0)

  // Cycle d'animation de la simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    // CHANGEMENT ICI : max-w-[280px] sur mobile, sm:max-w-md sur tablette/desktop
    <div className="relative w-full max-w-[280px] sm:max-w-md mx-auto perspective-1000">
      {/* Phone Frame */}
      <motion.div 
        initial={{ rotateY: -10, rotateX: 5 }}
        animate={{ rotateY: [-5, 5, -5], rotateX: [2, -2, 2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-20 bg-gray-900 rounded-[2.5rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden aspect-[9/18]"
      >
        {/* Dynamic Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 z-50 rounded-b-xl w-1/2 mx-auto" />

        {/* Screen Content */}
        <div className="relative h-full bg-gray-950 flex flex-col p-4 pt-10">
          
          {/* Header */}
          <div className="flex justify-between items-center text-white/50 mb-4 px-2">
            <Scan size={20} />
            <span className="text-xs font-mono">AI SCANNER</span>
            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            </div>
          </div>

          {/* Camera View / Equation */}
          <div className="relative flex-1 bg-gray-800/50 rounded-2xl flex items-center justify-center overflow-hidden border border-white/5">
            <div className="text-white text-3xl font-serif font-italic tracking-wider">
              x² + 5x + 6 = 0
            </div>
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

            {/* Scanning Line Animation */}
            <AnimatePresence>
              {(step === 1 || step === 0) && (
                <motion.div
                  initial={{ top: "0%", opacity: 0 }}
                  animate={{ top: "100%", opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Solution Popup */}
          <AnimatePresence mode="wait">
            {step >= 2 && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-100 dark:border-gray-700 z-30"
              >
                {step === 2 ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Analyse...</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-green-500 uppercase tracking-wider">Résolu</span>
                      <CheckCircle2 size={16} className="text-green-500" />
                    </div>
                    <div className="font-mono text-sm text-gray-800 dark:text-gray-200">
                      (x + 2)(x + 3) = 0<br/>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">x = -2, x = -3</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Decorative Glows around phone */}
      <div className="absolute top-1/4 -left-12 w-64 h-64 bg-blue-500/30 rounded-full blur-[80px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-purple-500/30 rounded-full blur-[80px] -z-10 animate-pulse delay-700" />
    </div>
  )
}

// --- Main Component ---
function LandingPage({ onStart }) {
  const { t, language, setLanguage } = useLanguage()
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  }

  const features = [
    {
      title: t('smartScan'),
      description: t('smartScanDesc'),
      icon: <Scan className="w-6 h-6" />,
      color: "blue"
    },
    {
      title: t('stepByStep'),
      description: t('stepByStepDesc'),
      icon: <Brain className="w-6 h-6" />,
      color: "indigo"
    },
    {
      title: t('interactiveChat'),
      description: t('interactiveChatDesc'),
      icon: <MessageCircle className="w-6 h-6" />,
      color: "purple"
    }
  ]

  const stats = [
    { label: t('statStudents'), value: '150K+', icon: <Brain size={20} /> },
    { label: t('statAccuracy'), value: '99.9%', icon: <Zap size={20} /> },
    { label: t('statLanguages'), value: '2', icon: <MessageCircle size={20} /> }
  ]

  const timeline = [
    { title: t('timelineScan'), desc: t('timelineScanDesc') },
    { title: t('timelineEdit'), desc: t('timelineEditDesc') },
    { title: t('timelineSolve'), desc: t('timelineSolveDesc') },
    { title: t('timelineExplain'), desc: t('timelineExplainDesc') }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white font-sans overflow-x-hidden selection:bg-blue-500/30">
      
      {/* Background Tech Grid */}
      <div className="fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
      />

      <nav className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Calculator className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                Math Conquest
              </span>
            </motion.div>
            
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3 sm:gap-4"
            >
               <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700">
                {['fr', 'en'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 ${language === lang ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm transform scale-105' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              <ThemeToggle />
              <button
                onClick={onStart}
                className="hidden sm:flex group relative px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-semibold overflow-hidden transition-all shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <span className="relative flex items-center gap-2">
                  {t('start')} <ChevronRight size={16} />
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                {t('heroBadge')}
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl font-extrabold leading-tight tracking-tight mb-6">
                {t('heroTitle')} <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 animate-gradient-x">
                  {t('heroSubtitle')}
                </span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                {t('heroDesc')}
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={onStart}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  {t('tryFree')} <ArrowRight size={20} />
                </button>
                <a
                  href="#features"
                  className="px-8 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl font-bold text-lg hover:-translate-y-1 transition-all shadow-sm hover:shadow-md flex items-center justify-center"
                >
                  {t('learnMore')}
                </a>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-80 grayscale hover:grayscale-0 transition-all">
                 {/* Mini Stats Row */}
                 {stats.map((stat, i) => (
                    <div key={i} className="flex flex-col">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
                    </div>
                 ))}
              </motion.div>
            </motion.div>

          {/* Right Column: Simulation */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              // CHANGEMENT ICI : 'hidden' supprimé, ajout de 'mt-16' pour espacer sur mobile
              className="relative block mt-16 lg:mt-0"
            >
               <HeroSimulation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section with Hover Effects */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('smartScan')} & More</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Tout ce dont tu as besoin pour exceller en maths.</p>
            </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white dark:bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl dark:shadow-none hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300
                    ${feature.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white' : ''}
                    ${feature.color === 'indigo' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white' : ''}
                    ${feature.color === 'purple' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white' : ''}
                `}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                
                {/* Decorative corner blob */}
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline with Animated Connector */}
      <section className="py-32 bg-gray-50 dark:bg-black/50 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="text-center mb-20"
          >
            <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm">{t('stepByStep')}</span>
            <h2 className="text-4xl font-bold mt-3 mb-4">{t('journeyTitle')}</h2>
          </motion.div>

          <div className="relative space-y-12">
            {/* Connecting Line */}
            <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-gray-800 sm:left-1/2 sm:-ml-px" />

            {timeline.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`relative flex items-center ${idx % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
              >
                {/* Dot */}
                <div className="absolute left-0 sm:left-1/2 w-14 h-14 -ml-[2px] sm:-ml-7 flex items-center justify-center z-10">
                   <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 border-4 border-blue-500 shadow-lg flex items-center justify-center font-bold text-gray-900 dark:text-white text-sm">
                      {idx + 1}
                   </div>
                </div>

                {/* Content Box */}
                <div className={`ml-20 sm:ml-0 w-full sm:w-1/2 ${idx % 2 === 0 ? 'sm:pr-16' : 'sm:pl-16'}`}>
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-transform">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-[2.5rem] p-12 sm:p-20 text-center text-white shadow-2xl overflow-hidden"
          >
            {/* Animated Background Elements inside CTA */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
               <div className="absolute top-[-50%] left-[-20%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[100px] animate-pulse" />
               <div className="absolute bottom-[-50%] right-[-20%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 space-y-8">
              <h3 className="text-4xl sm:text-5xl font-bold tracking-tight">{t('ctaTitle')}</h3>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">{t('ctaSubtitle')}</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <button
                  onClick={onStart}
                  className="px-10 py-4 bg-white text-blue-900 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  {t('ctaButton')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-8 space-x-6">
                {/* Social Placeholders if needed */}
            </div>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {t('footerText')}{' '}
            <a
              href="http://portfoliodek.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-80 transition-opacity"
            >
              Dekens Ruzuba
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage