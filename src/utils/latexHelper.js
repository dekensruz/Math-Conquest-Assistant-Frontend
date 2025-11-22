/**
 * Utilitaires pour détecter et corriger le LaTeX dans les textes
 */

/**
 * Détecte et corrige les formules LaTeX mal formatées dans un texte
 * Ex: "rac{-4}{2}" -> "\frac{-4}{2}"
 */
export function fixLatexInText(text) {
  if (!text || typeof text !== 'string') return text

  // 1. NETTOYAGE AGRESSIF : Suppression des caractères de contrôle
  // Le caractère \f (Form Feed) est le coupable principal qui s'affiche en rouge
  let clean = Array.from(text)
    .filter((char) => {
      const code = char.charCodeAt(0)
      const isPrintable = code >= 32 || code === 10 || code === 13 || code === 9
      return isPrintable
    })
    .join('')

  // 2. CORRECTIONS DE SYNTAXE
  
  // Supprimer ou corriger les commandes \f résiduelles (provoquent un "f" rouge)
  // - Si un \f précède déjà un backslash, on le supprime simplement
  clean = clean.replace(/\\f\s*(?=\\)/gi, '')
  // Convertir les \f suivis d'un espace ou d'une parenthèse/accolade en \frac
  clean = clean.replace(/\\f\s*(?=\(|\{)/gi, '\\frac')
  // Supprimer tout \f restant (commande inconnue)
  clean = clean.replace(/\\f/gi, '')

  // "rac{a}{b}" -> "\frac{a}{b}"
  clean = clean.replace(/rac\{([^}]+)\}\{([^}]+)\}/g, '\\frac{$1}{$2}')
  
  // "sqrt{a}" sans backslash -> "\sqrt{a}"
  clean = clean.replace(/(?<!\\)sqrt\{/g, '\\sqrt{')
  
  // Commandes mathématiques courantes sans backslash
  const commonCommands = [
    'int', 'sum', 'pi', 'infty', 'theta', 'alpha', 'beta', 'gamma', 'delta', 
    'sigma', 'omega', 'lambda', 'mu', 'phi', 'psi', 'rho', 'tau', 'approx',
    'neq', 'leq', 'geq', 'pm', 'times', 'div'
  ]
  
  commonCommands.forEach(cmd => {
    const regex = new RegExp(`(?<!\\\\)\\b${cmd}\\b`, 'g')
    clean = clean.replace(regex, `\\${cmd}`)
  })

  return clean.trim()
}

/**
 * Convertit une expression LaTeX simple en texte lisible par tout le monde
 * Exemple : "\frac{-4}{2}" -> "(-4) / (2)"
 */
export function latexToPlainText(text) {
  if (!text || typeof text !== 'string') return ''

  let plain = fixLatexInText(text)

  // Fractions simples
  const fracRegex = /\\frac\{([^{}]+)\}\{([^{}]+)\}/g
  plain = plain.replace(fracRegex, '($1) / ($2)')

  // Racines
  plain = plain.replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
  plain = plain.replace(/\\sqrt\[(\d+)\]\{([^}]+)\}/g, '$1√($2)')

  // Puissances simples x^{2}
  plain = plain.replace(/\^\{([^}]+)\}/g, '^($1)')

  // Symboles courants
  const symbolMap = {
    '\\times': '×',
    '\\cdot': '·',
    '\\div': '÷',
    '\\pm': '±',
    '\\pi': 'π',
    '\\infty': '∞',
    '\\leq': '≤',
    '\\geq': '≥',
    '\\neq': '≠',
    '\\approx': '≈',
    '\\to': '→'
  }

  Object.entries(symbolMap).forEach(([latexCmd, symbol]) => {
    plain = plain.replace(new RegExp(latexCmd, 'g'), symbol)
  })

  // Nettoyage des commandes restantes
  plain = plain
    .replace(/\\left|\\right/g, '')
    .replace(/\\,/g, ' ')
    .replace(/\\!/g, '')
    .replace(/\\\\/g, ' ')

  // Retirer les accolades inutiles
  plain = plain.replace(/[{}]/g, '')

  // Supprimer les backslash restants
  plain = plain.replace(/\\/g, '')

  return plain.replace(/\s+/g, ' ').trim()
}
