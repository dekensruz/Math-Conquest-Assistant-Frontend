import { useState, useEffect } from 'react'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { getHistory, removeFromHistory, clearHistory } from '../utils/historyStorage'
import SolutionDisplay from './SolutionDisplay'

/**
 * Page pour afficher l'historique des problèmes résolus
 */
function HistoryPage({ onBack, onSelectProblem }) {
  const [history, setHistory] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    const historyData = getHistory()
    setHistory(historyData)
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    if (window.confirm('Voulez-vous vraiment supprimer ce problème de l\'historique ?')) {
      removeFromHistory(id)
      loadHistory()
    }
  }

  const handleClearAll = () => {
    if (window.confirm('Voulez-vous vraiment supprimer tout l\'historique ?')) {
      clearHistory()
      loadHistory()
    }
  }

  const handleSelectItem = (item) => {
    setSelectedItem(item)
    if (onSelectProblem) {
      onSelectProblem(item.problem, item.solution)
    }
  }

  if (selectedItem) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedItem(null)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          ← Retour à l&rsquo;historique
        </button>
        <SolutionDisplay
          problem={selectedItem.problem}
          solution={selectedItem.solution}
          onReset={() => setSelectedItem(null)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Historique des problèmes
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            {history.length} problème{history.length > 1 ? 's' : ''} résolu{history.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm sm:text-base"
            >
              Tout effacer
            </button>
          )}
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
          >
            ← Retour
          </button>
        </div>
      </div>

      {/* Liste de l'historique */}
      {history.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Aucun problème dans l&rsquo;historique
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Les problèmes que vous résolvez seront sauvegardés ici
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectItem(item)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.timestamp).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 mb-3">
                    <BlockMath math={item.problem} />
                  </div>
                  {item.solution?.explanation?.summary && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {item.solution.explanation.summary}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  className="flex-shrink-0 p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HistoryPage

