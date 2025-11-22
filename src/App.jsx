import { useState } from 'react'
import ImageUpload from './components/ImageUpload'
import ProblemDisplay from './components/ProblemDisplay'
import SolutionDisplay from './components/SolutionDisplay'
import HistorySidebar from './components/HistorySidebar'
import LoadingSpinner from './components/LoadingSpinner'
import ThemeToggle from './components/ThemeToggle'
import LandingPage from './components/LandingPage'
import ProblemReview from './components/ProblemReview'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'

/**
 * Composant principal de l'application
 * Enveloppé par les Providers pour le thème et la langue
 */
function MainContent() {
  const [isStarted, setIsStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState('upload') // upload, extracting, confirm, latex, solving, solution, history
  const [latexProblem, setLatexProblem] = useState('')
  const [solution, setSolution] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [inputMode, setInputMode] = useState('upload') // upload | manual
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false)
  const { t, language, setLanguage } = useLanguage()

  /**
   * Tente d'extraire un message d'erreur exploitable depuis une réponse HTTP
   */
  const extractErrorMessage = async (response, fallbackMessage) => {
    try {
      const rawText = await response.text()
      if (!rawText) {
        return fallbackMessage
      }

      try {
        const parsed = JSON.parse(rawText)
        return (
          parsed?.detail ||
          parsed?.message ||
          parsed?.error ||
          fallbackMessage
        )
      } catch {
        return rawText
      }
    } catch {
      return fallbackMessage
    }
  }

  if (!isStarted) {
    return <LandingPage onStart={() => setIsStarted(true)} />
  }

  /**
   * Gère l'extraction du LaTeX depuis l'image
   */
  const handleImageUpload = async (imageFile) => {
    setLoading(true)
    setError(null)
    setCurrentStep('extracting')

    try {
      const formData = new FormData()
      formData.append('file', imageFile)

      const response = await fetch('/api/extract-latex', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const message = await extractErrorMessage(
          response,
          'Erreur lors de l\'extraction du LaTeX'
        )
        throw new Error(message)
      }

      const data = await response.json()
      setLatexProblem(data.latex)
      setSolution(null)
      setInputMode('upload')
      setCurrentStep('confirm')
    } catch (err) {
      let errorMessage = err.message || 'Une erreur est survenue lors de l\'extraction du LaTeX'
      
      // Message plus explicite pour les erreurs de connexion
      if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
        errorMessage = 'Impossible de se connecter au backend. Assurez-vous que le backend est lancé (python main.py dans le dossier backend).'
      }
      
      setError(errorMessage)
      setCurrentStep('upload')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Gère la résolution du problème mathématique
   * @param {string} customLatex - LaTeX personnalisé (optionnel, utilise latexProblem par défaut)
   */
  const handleSolve = async (customLatex = null) => {
    const latexToSolve = customLatex || latexProblem
    setLatexProblem(latexToSolve) // Mettre à jour le LaTeX si personnalisé
    
    setLoading(true)
    setError(null)
    setCurrentStep('solving')

    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          latex: latexToSolve,
          language: language 
        }),
      })

      if (!response.ok) {
        const message = await extractErrorMessage(
          response,
          'Erreur lors de la résolution'
        )
        throw new Error(message)
      }

      const data = await response.json()
      setSolution(data)
      setCurrentStep('solution')
    } catch (err) {
      let errorMessage = err.message || 'Une erreur est survenue lors de la résolution'
      
      // Message plus explicite pour les erreurs de connexion
      if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
        errorMessage = 'Impossible de se connecter au backend. Assurez-vous que le backend est lancé (python main.py dans le dossier backend).'
      }

      setError(errorMessage)
      setCurrentStep('latex') // Revenir à l'étape précédente
    } finally {
      setLoading(false)
    }
  }

  /**
   * Sélectionne un problème depuis l'historique
   */
  const handleSelectProblem = (problem, solution) => {
      setLatexProblem(problem)
    setSolution(solution)
    setCurrentStep('solution')
  }

  /**
   * Retour à la page principale
   */
  const handleBackToMain = () => {
    setCurrentStep('upload')
    setError(null)
    setLatexProblem('')
    setSolution(null)
    setInputMode('upload')
  }

  const handleCancelEdit = () => {
    if (inputMode === 'manual') {
      handleBackToMain()
    } else {
      setCurrentStep('confirm')
    }
  }

  const handleBackToLanding = () => {
    setIsStarted(false)
    setCurrentStep('upload')
    setError(null)
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50/50 dark:bg-gray-950 transition-colors font-sans overflow-x-hidden">
      <div className="flex-1 flex relative w-full">
        {/* Menu latéral Historique (Nouveau Design) */}
        <HistorySidebar 
          onSelectProblem={handleSelectProblem} 
          onCollapseChange={(collapsed) => setIsHistoryCollapsed(collapsed)}
        />
        
        {/* Contenu principal - Ajusté avec une marge gauche pour éviter le chevauchement avec le dock */}
        <div
          className="flex-1 flex flex-col min-w-0 w-full transition-all duration-500 lg:ml-[var(--sidebar-width)]"
          style={{ '--sidebar-width': isHistoryCollapsed ? '4rem' : '18rem' }}
        >
        {/* Header - Design amélioré */}
        <header className="bg-gradient-to-r from-white via-blue-50/30 to-white dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 shadow-md border-b border-blue-100 dark:border-gray-700 transition-colors">
          <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <button 
                onClick={handleBackToLanding}
                className="flex items-center gap-3 hover:opacity-90 transition-all group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                    {t('appTitle')}
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {t('appSubtitle')}
                  </p>
                </div>
              </button>
              
              <div className="flex items-center gap-3">
                {/* Sélecteur de langue */}
                <div className="flex items-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl p-1 shadow-inner border border-gray-300 dark:border-gray-600">
                  <button 
                    onClick={() => setLanguage('fr')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${language === 'fr' ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-600 dark:to-gray-700 text-blue-600 dark:text-blue-400 shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    🇫🇷 FR
                  </button>
                  <button 
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${language === 'en' ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-600 dark:to-gray-700 text-blue-600 dark:text-blue-400 shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    🇬🇧 EN
                  </button>
                </div>
                
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r shadow-sm animate-fade-in">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-200 font-medium">
                    {error}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      onClick={() => setError(null)}
                      className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none"
                    >
                      <span className="sr-only">Fermer</span>
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Global Loading Indicator */}
          {loading && currentStep !== 'solving' && (
            <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300">
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-10 rounded-3xl shadow-2xl flex flex-col items-center border-2 border-gray-200 dark:border-gray-700">
                <LoadingSpinner />
                <p className="mt-6 text-lg text-gray-700 dark:text-gray-300 font-semibold">
                  {t('loading') || 'Chargement...'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Veuillez patienter
                </p>
              </div>
            </div>
          )}

          {/* Main Views */}
          <div className="transition-all duration-300 ease-in-out">
            {currentStep === 'upload' && (
              <div className="animate-fade-in">
                <ImageUpload onImageUpload={handleImageUpload} />
                
                {/* Mode manuel quick link */}
                <div className="mt-8 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-50/50 dark:bg-gray-950 text-gray-500 dark:text-gray-400">
                        {t('or')}
                      </span>
                    </div>
                  </div>
                <button
                  onClick={() => {
                    setInputMode('manual')
                    setLatexProblem('')
                    setSolution(null)
                    setCurrentStep('latex')
                  }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <svg className="mr-2 -ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {t('enterManually')}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'confirm' && (
              <div className="animate-fade-in">
                <button
                  onClick={handleBackToMain}
                  className="mb-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t('back')}
                </button>
                <ProblemReview
                  latex={latexProblem}
                  onEdit={() => setCurrentStep('latex')}
                  onSolve={() => handleSolve(latexProblem)}
                  onReset={handleBackToMain}
                />
              </div>
            )}

            {currentStep === 'latex' && (
              <div className="animate-fade-in">
                <button
                  onClick={() => {
                    if (inputMode === 'manual') {
                      handleBackToMain()
                    } else {
                      setCurrentStep('confirm')
                    }
                  }}
                  className="mb-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t('back')}
                </button>
                <ProblemDisplay 
                  latex={latexProblem} 
                  onSolve={handleSolve} 
                  onReset={handleCancelEdit}
                />
              </div>
            )}

            {(currentStep === 'solving' || currentStep === 'solution') && (
              <div className="animate-fade-in">
                {currentStep === 'solving' ? (
                   <div className="flex flex-col items-center justify-center py-20 px-6">
                    <div className="mb-8 w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <LoadingSpinner />
                    <p className="mt-8 text-2xl text-gray-900 dark:text-gray-100 font-bold text-center">
                      {t('analyzing') || 'Analyse en cours...'}
                    </p>
                    <p className="text-base text-gray-500 dark:text-gray-400 mt-3 text-center max-w-md">
                      {t('analyzingSub') || 'Notre IA résout votre problème étape par étape'}
                    </p>
                  </div>
                ) : (
                  <SolutionDisplay 
                    problem={latexProblem} 
                    solution={solution} 
                    onReset={handleBackToMain} 
                  />
                )}
              </div>
            )}
          </div>
        </main>

        {/* Footer - Design simple et élégant */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-3 mt-auto shrink-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Math Conquest • Créé par{' '}
              <a 
                href="http://portfoliodek.netlify.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
              >
                Dekens Ruzuba
              </a>
            </p>
          </div>
        </footer>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MainContent />
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
