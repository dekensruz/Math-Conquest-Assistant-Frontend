/**
 * Utilitaires pour gérer l'historique des problèmes dans localStorage
 */

const HISTORY_KEY = 'math_assistant_history'
const MAX_HISTORY_ITEMS = 50 // Limiter à 50 problèmes pour éviter de surcharger localStorage

/**
 * Structure d'un élément d'historique :
 * {
 *   id: string (timestamp),
 *   problem: string (LaTeX),
 *   solution: object,
 *   timestamp: number,
 *   title: string (optionnel, généré automatiquement)
 * }
 */

/**
 * Récupère tout l'historique
 */
export function getHistory() {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY)
    if (!historyJson) return []
    
    const history = JSON.parse(historyJson)
    // Trier par timestamp décroissant (plus récent en premier)
    return history.sort((a, b) => b.timestamp - a.timestamp)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error)
    return []
  }
}

/**
 * Ajoute un problème à l'historique
 */
export function addToHistory(problem, solution) {
  try {
    const history = getHistory()
    
    const newItem = {
      id: Date.now().toString(),
      problem: problem,
      solution: solution,
      timestamp: Date.now(),
      title: generateTitle(problem)
    }
    
    // Ajouter au début
    history.unshift(newItem)
    
    // Limiter le nombre d'éléments
    if (history.length > MAX_HISTORY_ITEMS) {
      history.splice(MAX_HISTORY_ITEMS)
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    return newItem
  } catch (error) {
    console.error('Erreur lors de l\'ajout à l\'historique:', error)
    return null
  }
}

/**
 * Supprime un élément de l'historique
 */
export function removeFromHistory(id) {
  try {
    const history = getHistory()
    const filtered = history.filter(item => item.id !== id)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'historique:', error)
    return false
  }
}

/**
 * Vide tout l'historique
 */
export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY)
    return true
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'historique:', error)
    return false
  }
}

/**
 * Génère un titre à partir du LaTeX du problème
 */
function generateTitle(problem) {
  // Prendre les 50 premiers caractères du LaTeX
  let title = problem.substring(0, 50)
  if (problem.length > 50) {
    title += '...'
  }
  // Remplacer les commandes LaTeX communes par des symboles plus lisibles
  title = title
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\int/g, '∫')
    .replace(/\\sum/g, 'Σ')
    .replace(/\\pi/g, 'π')
    .replace(/\\infty/g, '∞')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/\{|\}/g, '')
  
  return title || 'Problème mathématique'
}

/**
 * Récupère un élément spécifique de l'historique par son ID
 */
export function getHistoryItem(id) {
  const history = getHistory()
  return history.find(item => item.id === id)
}

