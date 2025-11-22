/**
 * Utilitaire pour parser et rendre du markdown avec support LaTeX
 * Gère les titres, listes, code blocks, formules LaTeX, gras, italique
 */

import { BlockMath, InlineMath } from 'react-katex'
import { fixLatexInText } from './latexHelper'

/**
 * Parse le markdown et retourne des éléments React
 */
export function renderMarkdown(text) {
  if (!text) return null

  // Nettoyer d'abord le texte pour éviter les problèmes de LaTeX malformé
  const cleanedText = fixLatexInText(text)
  const lines = cleanedText.split('\n')
  
  const elements = []
  let currentParagraph = []
  let inList = false
  let listItems = []

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const paragraphText = currentParagraph.join(' ')
      elements.push(
        <p key={elements.length} className="mb-3 text-gray-800 dark:text-gray-100 leading-relaxed">
          {renderTextWithLatex(paragraphText)}
        </p>
      )
      currentParagraph = []
    }
  }

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={elements.length} className="list-disc list-inside mb-4 space-y-2 text-gray-800 dark:text-gray-100 ml-4">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">{renderTextWithLatex(item)}</li>
          ))}
        </ul>
      )
      listItems = []
      inList = false
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Titre niveau 3 (###)
    if (line.startsWith('### ')) {
      flushParagraph()
      flushList()
      const title = line.substring(4).trim()
      elements.push(
        <h3 key={elements.length} className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
          {renderTextWithLatex(title)}
        </h3>
      )
      continue
    }

    // Titre niveau 4 (####)
    if (line.startsWith('#### ')) {
      flushParagraph()
      flushList()
      const title = line.substring(5).trim()
      elements.push(
        <h4 key={elements.length} className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-3 mb-2">
          {renderTextWithLatex(title)}
        </h4>
      )
      continue
    }

    // Liste (commence par - ou *)
    if (line.match(/^[-*]\s+/)) {
      flushParagraph()
      inList = true
      const item = line.replace(/^[-*]\s+/, '').trim()
      listItems.push(item)
      continue
    }

    // Code block LaTeX (\[ ... \]) - peut être sur plusieurs lignes
    if (line.includes('\\[')) {
      flushParagraph()
      flushList()
      // Chercher le début et la fin du bloc LaTeX
      let latexContent = ''
      let startIdx = line.indexOf('\\[')
      if (startIdx !== -1) {
        // Si le bloc se termine sur la même ligne
        if (line.includes('\\]')) {
          const endIdx = line.indexOf('\\]')
          latexContent = line.substring(startIdx + 2, endIdx).trim()
        } else {
          // Le bloc continue sur les lignes suivantes
          latexContent = line.substring(startIdx + 2).trim()
          i++ // Passer à la ligne suivante
          while (i < lines.length && !lines[i].includes('\\]')) {
            latexContent += ' ' + lines[i].trim()
            i++
          }
          if (i < lines.length && lines[i].includes('\\]')) {
            const endIdx = lines[i].indexOf('\\]')
            latexContent += ' ' + lines[i].substring(0, endIdx).trim()
          }
        }
        if (latexContent) {
          elements.push(
            <div key={elements.length} className="my-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-lg p-4 overflow-x-auto">
              <BlockMath math={latexContent} />
            </div>
          )
        }
      }
      continue
    }

    // Code block LaTeX ($$ ... $$)
    if (line.startsWith('$$')) {
      flushParagraph()
      flushList()
      let latexContent = ''
      if (line.endsWith('$$') && line.length > 2 && line.lastIndexOf('$$') > 1) {
        latexContent = line.substring(2, line.lastIndexOf('$$')).trim()
      } else {
        latexContent = line.substring(2).trim()
        while (i + 1 < lines.length && !lines[i + 1].includes('$$')) {
          i++
          latexContent += ' ' + lines[i].trim()
        }
        if (i + 1 < lines.length) {
          i++
          const endLine = lines[i]
          latexContent += ' ' + endLine.replace(/\$\$/g, '').trim()
        }
      }
      if (latexContent) {
        elements.push(
          <div key={elements.length} className="my-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-lg p-4 overflow-x-auto">
            <BlockMath math={latexContent} />
          </div>
        )
      }
      continue
    }

    // Ligne vide
    if (line === '') {
      flushParagraph()
      flushList()
      continue
    }

    // Texte normal
    if (inList) {
      flushList()
    }
    currentParagraph.push(line)
  }

  flushParagraph()
  flushList()

  return elements.length > 0 ? <div>{elements}</div> : <p className="text-gray-800 dark:text-gray-100 leading-relaxed">{renderTextWithLatex(cleanedText)}</p>
}

/**
 * Rend du texte avec support LaTeX inline et formatage Markdown de base (gras, italique)
 */
export function renderTextWithLatex(text) {
  if (!text) return null

  const parts = []
  let lastIndex = 0

  // Regex combinée pour détecter LaTeX et Markdown
  // LaTeX inline: \( ... \)
  // Gras: ** ... **
  // Italique: * ... *
  const pattern = /(\\\((?:[^)]+)\\\))|(\$\$(?:[^$]+)\$\$)|(\$(?:[^$]+)\$)|(\*\*(?:[^*]+)\*\*)|(\*(?:[^*]+)\*)|(\\[a-zA-Z]+(?:\[[^\]]+\])?(?:\{[^{}]+\})+)/g
  let match

  while ((match = pattern.exec(text)) !== null) {
    // Ajouter le texte avant
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.substring(lastIndex, match.index) })
    }

    // Identifier le type de match
    if (match[1]) { // LaTeX \( \)
      const latex = match[1].substring(2, match[1].length - 2)
      parts.push({ type: 'latex', content: latex })
    } else if (match[2]) { // LaTeX $$ $$
      const latex = match[2].substring(2, match[2].length - 2)
      parts.push({ type: 'latex', content: latex })
    } else if (match[3]) { // LaTeX $ $
      const latex = match[3].substring(1, match[3].length - 1)
      parts.push({ type: 'latex', content: latex })
    } else if (match[4]) { // Gras
      const boldText = match[4].substring(2, match[4].length - 2)
      parts.push({ type: 'bold', content: boldText })
    } else if (match[5]) { // Italique
      const italicText = match[5].substring(1, match[5].length - 1)
      parts.push({ type: 'italic', content: italicText })
    } else if (match[6]) { // Latex commande brute (ex: \frac{...}{...})
      parts.push({ type: 'latex', content: match[6] })
    }

    lastIndex = match.index + match[0].length
  }

  // Ajouter le reste du texte
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.substring(lastIndex) })
  }

  if (parts.length === 0) {
    return <span>{text}</span>
  }

  return (
    <>
      {parts.map((part, index) => {
        if (part.type === 'latex') {
          return (
            <span key={index} className="inline-block mx-1 align-middle">
              <InlineMath math={part.content} />
            </span>
          )
        } else if (part.type === 'bold') {
          return <strong key={index} className="font-semibold">{part.content}</strong>
        } else if (part.type === 'italic') {
          return <em key={index}>{part.content}</em>
        }
        return <span key={index}>{part.content}</span>
      })}
    </>
  )
}
