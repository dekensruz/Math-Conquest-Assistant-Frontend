import { useState, useRef, useEffect } from 'react'
import LoadingSpinner from './LoadingSpinner'
import { renderMarkdown } from '../utils/markdownRenderer.jsx'
import { useLanguage } from '../contexts/LanguageContext'
import { apiFetch } from '../utils/apiClient'

function ChatInterface({ problem, solution }) {
  const { t, language } = useLanguage()
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll automatique
  useEffect(() => {
    if (!messagesContainerRef.current) return
    if (messages.length === 0 && !isLoading) return
    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [messages, isLoading])

  const buildHistoryPayload = (historyList) => {
    return historyList
      .filter((msg) => msg.type === 'user' || msg.type === 'assistant')
      .slice(-8)
      .map((msg) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!inputValue.trim() || isLoading) return

    const question = inputValue.trim()
    setInputValue('')
    
    const userMessage = {
      type: 'user',
      content: question,
      timestamp: new Date()
    }

    const updatedHistory = [...messages, userMessage]
    setMessages(updatedHistory)
    setIsLoading(true)

    try {
      const response = await apiFetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem: problem,
          solution: solution,
          question: question,
          language: language,
          history: buildHistoryPayload(updatedHistory)
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Erreur lors de l\'envoi de la question'
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || errorMessage
        } catch (e) {
          if (response.status === 404) {
            errorMessage = 'Endpoint /api/chat non trouvé. Veuillez redémarrer le backend pour charger le nouvel endpoint.'
          } else {
            errorMessage = `Erreur ${response.status}: ${response.statusText}`
          }
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      const assistantMessage = {
        type: 'assistant',
        content: data.answer,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      let errorContent = err.message || 'Une erreur est survenue. Veuillez réessayer.'
      
      if (err.message && (err.message.includes('404') || err.message.includes('Not Found'))) {
        errorContent = '❌ Endpoint non trouvé. Veuillez redémarrer le backend (Ctrl+C puis python main.py) pour charger le nouvel endpoint /api/chat.'
      }
      
      const errorMessage = {
        type: 'error',
        content: errorContent,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const renderMessage = (content) => {
    return renderMarkdown(content)
  }

  const suggestedQuestions = [
    t('whyStep'),
    t('example'),
    t('explainConcept'),
    t('otherMethod'),
    t('commonErrors')
  ]

  const handleSuggestedQuestion = (question) => {
    setInputValue(question)
    inputRef.current?.focus()
  }

  return (
    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {t('chatTitle')}
      </h3>
      
      {/* Suggestions de questions */}
      {messages.length === 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {t('chatSuggested')} :
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="px-3 py-1.5 text-xs sm:text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-800"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Zone de chat - CORRECTION APPLIQUÉE ICI */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col min-h-0">
        {/* Historique des messages - HAUTEUR DYNAMIQUE */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[120px] max-h-[280px] sm:max-h-[350px]"
        >
          {messages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4 sm:py-8">
              <p className="text-sm">
                {t('chatPlaceholder')}
              </p>
              <p className="text-xs mt-2 text-gray-400 dark:text-gray-500">
                {t('chatSuggested')}
              </p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-2 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.type === 'error'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
                }`}
              >
                {message.type === 'assistant' || message.type === 'error' ? (
                  <div className="text-sm leading-relaxed break-words">
                    {renderMessage(message.content)}
                  </div>
                ) : (
                  <div className="text-sm text-white break-words">{message.content}</div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                <LoadingSpinner />
              </div>
            </div>
          )}
        </div>

        {/* Zone de saisie */}
        <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('chatPlaceholder')}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-sm"
            >
              {t('send')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface