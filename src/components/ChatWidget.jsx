import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import ChatInterface from './ChatInterface'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * Widget de chat flottant qui s'ouvre depuis le côté
 * Style chatbot classique des sites web
 */
const ChatWidget = forwardRef(function ChatWidget({ problem, solution }, ref) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const widgetRef = useRef(null)

  // Exposer la méthode openChat pour l'appeler depuis l'extérieur
  useImperativeHandle(ref, () => ({
    openChat: () => setIsOpen(true)
  }))

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  return (
    <>
      {/* Bouton flottant pour ouvrir le chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
          aria-label={t('openChat')}
        >
          <svg 
            className="w-7 h-7 transition-transform group-hover:scale-110" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* Panneau de chat qui s'ouvre depuis le côté */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[calc(100vh-8rem)] sm:h-[600px] max-h-[600px] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-in-up">
          {/* Header du chat */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">{t('chatTitle')}</h3>
                <p className="text-xs text-white/80">{t('chatSubtitle')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Bouton pour réduire */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Fermer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Zone de chat - prend tout l'espace restant */}
          <div className="flex-1 overflow-hidden flex flex-col bg-gray-50 dark:bg-gray-800">
            <ChatInterface 
              problem={problem} 
              solution={solution} 
              isModal={true}
            />
          </div>
        </div>
      )}
    </>
  )
})

export default ChatWidget

