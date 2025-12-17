import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import ThemeToggle from './ThemeToggle'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Scan, Brain, MessageCircle, ChevronRight, CheckCircle2, Zap, ArrowRight, Calculator, Users, Sparkles } from 'lucide-react'

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
    <div className="relative w-full max-w-[280px] sm:max-w-md mx-auto perspective-1000">
      {/* Phone Frame */}
      <motion.div
        initial={{ rotateY: -10, rotateX: 5 }}
        animate={{ rotateY: [-5, 5, -5], rotateX: [2, -2, 2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-20 bg-slate-900 rounded-[2.5rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden aspect-[9/18]"
      >
        {/* Dynamic Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 z-50 rounded-b-xl w-1/2 mx-auto" />

        {/* Screen Content */}
        <div className="relative h-full bg-slate-950 flex flex-col p-4 pt-10">

          {/* Header */}
          <div className="flex justify-between items-center text-white/50 mb-4 px-2">
            <Scan size={20} />
            <span className="text-xs font-mono text-blue-400">MATH SCAN</span>
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
          </div>

          {/* Camera View / Equation */}
          <div className="relative flex-1 bg-slate-800/50 rounded-2xl flex items-center justify-center overflow-hidden border border-white/5">
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
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(var(--primary),0.6)]"
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
                className="absolute bottom-4 left-4 right-4 glass-card p-4 z-30 bg-white/10 backdrop-blur-md border border-white/10"
              >
                {step === 2 ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-slate-300">Analyse...</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Résolu</span>
                      <CheckCircle2 size={16} className="text-green-400" />
                    </div>
                    <div className="font-mono text-sm text-slate-200">
                      (x + 2)(x + 3) = 0<br />
                      <span className="text-primary font-bold">x = -2, x = -3</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Decorative Glows around phone */}
      <div className="absolute top-1/4 -left-12 w-64 h-64 bg-primary/30 rounded-full blur-[80px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-purple-500/30 rounded-full blur-[80px] -z-10 animate-pulse delay-700" />
    </div>
  )
}

// --- Main Component ---
function LandingPage({ onStart }) {
  const { t, language, setLanguage } = useLanguage()
  const { scrollYProgress } = useScroll()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  }

  const features = [
    { title: t('smartScan'), description: t('smartScanDesc'), icon: <Scan className="w-6 h-6" />, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
    { title: t('stepByStep'), description: t('stepByStepDesc'), icon: <Brain className="w-6 h-6" />, color: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
    { title: t('interactiveChat'), description: t('interactiveChatDesc'), icon: <MessageCircle className="w-6 h-6" />, color: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400" },
    { title: "Onboarding Flow", description: "Expérience personnalisée pour chaque étudiant.", icon: <Users className="w-6 h-6" />, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" }
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
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/30">

      {/* Background Tech Grid */}
      <div className="fixed inset-0 z-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='currentColor'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
      />

      <nav className="sticky top-0 z-50 w-full glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-primary to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <Calculator className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-display font-bold tracking-tight">Math Conquest</span>
            </motion.div>

            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-4">
              <div className="flex items-center bg-secondary/50 rounded-full p-1 border border-border/50 backdrop-blur-sm">
                {['fr', 'en'].map((lang) => (
                  <button key={lang} onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 ${language === lang ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              <ThemeToggle />
              <button onClick={onStart} className="hidden sm:flex group relative px-6 py-2.5 bg-foreground text-background rounded-full font-semibold overflow-hidden transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                <span className="relative flex items-center gap-2 z-10">{t('start')} <ChevronRight size={16} /></span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center lg:text-left">
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold tracking-wide text-primary mb-8">
                <Sparkles size={14} />
                <span>Nouvelle version Premium disponible</span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl font-display font-bold leading-tight tracking-tight mb-8">
                {t('heroTitle')} <br />
                <span className="text-gradient leading-tight">{t('heroSubtitle')}</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed font-light">
                {t('heroDesc')}
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={onStart} className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                  {t('tryFree')} <ArrowRight size={20} />
                </button>
                <button className="px-8 py-4 glass text-foreground rounded-2xl font-bold text-lg hover:-translate-y-1 transition-all flex items-center justify-center">
                  {t('learnMore')}
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-80 grayscale hover:grayscale-0 transition-all">
                {/* Mini Stats Row */}
                {stats.map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative mt-16 lg:mt-0">
              <HeroSimulation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Expertise Mathématique</h2>
            <p className="text-xl text-muted-foreground">Une suite d'outils complète pour votre réussite.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card p-6 border border-white/50 dark:border-white/10"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 font-display">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline with Animated Connector */}
      <section className="py-32 bg-secondary/50 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-primary font-bold tracking-wider uppercase text-sm">{t('stepByStep')}</span>
            <h2 className="text-4xl font-bold mt-3 mb-4 font-display">{t('journeyTitle')}</h2>
          </motion.div>

          <div className="relative space-y-12">
            {/* Connecting Line */}
            <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-border sm:left-1/2 sm:-ml-px" />

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
                  <div className="w-10 h-10 rounded-full bg-background border-4 border-primary shadow-lg flex items-center justify-center font-bold text-foreground text-sm">
                    {idx + 1}
                  </div>
                </div>

                {/* Content Box */}
                <div className={`ml-20 sm:ml-0 w-full sm:w-1/2 ${idx % 2 === 0 ? 'sm:pr-16' : 'sm:pl-16'}`}>
                  <div className="glass-card p-6 border border-border hover:-translate-y-1 transition-transform">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2 font-display">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
            className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-12 sm:p-20 text-center text-white shadow-2xl overflow-hidden"
          >
            {/* Animated Background Elements inside CTA */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />

            <div className="relative z-10 space-y-8">
              <h3 className="text-4xl sm:text-5xl font-display font-bold">{t('ctaTitle')}</h3>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">{t('ctaSubtitle')}</p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <button onClick={onStart} className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all">
                  {t('ctaButton')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-background/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-8 space-x-6">
            {/* Social Placeholders if needed */}
          </div>
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Math Conquest •
            <a href="http://portfoliodek.netlify.app/" target="_blank" rel="noopener noreferrer" className="ml-1 font-bold text-primary hover:underline">
              Dekens Ruzuba
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage