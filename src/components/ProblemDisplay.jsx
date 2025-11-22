import { useState, useEffect, useRef } from 'react'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { useLanguage } from '../contexts/LanguageContext'
import { fixLatexInText, latexToPlainText } from '../utils/latexHelper'
import { naturalToLatex } from '../utils/mathParser'

/**
 * Composant pour afficher et éditer le problème mathématique
 * Interface type "Calculatrice Scientifique" avec onglets
 */
function ProblemDisplay({ latex, onSolve, onReset }) {
  const { t } = useLanguage()
  const [editableLatex, setEditableLatex] = useState('')
  const [simpleInput, setSimpleInput] = useState('')
  const [editorMode, setEditorMode] = useState('natural')
  const [activeTab, setActiveTab] = useState('basic')
  const latexTextareaRef = useRef(null)
  const naturalTextareaRef = useRef(null)

  useEffect(() => {
    const cleanLatex = latex ? fixLatexInText(latex.replace(/^\\\[|\\\]$/g, '').trim()) : ''
    setEditableLatex(cleanLatex)
    setSimpleInput(latexToPlainText(cleanLatex))
  }, [latex])

  const handleSolve = () => {
    onSolve(editableLatex.trim())
  }

  const updateNaturalInput = (value) => {
    setSimpleInput(value)
    setEditableLatex(naturalToLatex(value))
  }

  const handleModeChange = (mode) => {
    setEditorMode(mode)
    if (mode === 'natural') {
      setSimpleInput((prev) => prev || latexToPlainText(editableLatex))
    }
  }

  const applyInsertion = (ref, currentValue, updater, config = {}) => {
    if (!ref.current) return
    const input = ref.current
    const { start = '', end = '', cursorOffset = 0 } = config
    const selStart = input.selectionStart ?? currentValue.length
    const selEnd = input.selectionEnd ?? currentValue.length

    const before = currentValue.substring(0, selStart)
    const selection = currentValue.substring(selStart, selEnd)
    const after = currentValue.substring(selEnd)
    const nextValue = before + start + selection + end + after

    updater(nextValue)

    requestAnimationFrame(() => {
      input.focus()
      if (selection.length > 0) {
        input.setSelectionRange(selStart + start.length, selEnd + start.length)
      } else {
        const newCursorPos = selStart + start.length + cursorOffset
        input.setSelectionRange(newCursorPos, newCursorPos)
      }
    })
  }

  const handleInsertSymbol = (symbol) => {
    if (editorMode === 'natural') {
      if (!symbol.natural) return
      const config = symbol.natural
      applyInsertion(naturalTextareaRef, simpleInput, updateNaturalInput, config)
    } else {
      const config = symbol.latex || { start: symbol.label }
      applyInsertion(latexTextareaRef, editableLatex, setEditableLatex, config)
    }
  }

  // Configuration des catégories de symboles
  const categories = {
    basic: { label: t('keyboardBasic'), icon: '+−' },
    algebra: { label: t('keyboardAlgebra'), icon: 'x²' },
    functions: { label: t('keyboardFunctions'), icon: 'f(x)' },
    calculus: { label: t('keyboardCalculus'), icon: '∫dx' },
    greek: { label: t('keyboardGreek'), icon: 'αβ' }
  }

  const symbols = {
    basic: [
      { label: '+', latex: { start: '+' }, natural: { start: '+' } },
      { label: '−', latex: { start: '-' }, natural: { start: '-' } },
      { label: '×', latex: { start: '\\times ' }, natural: { start: '×' } },
      { label: '÷', latex: { start: '\\div ' }, natural: { start: '÷' } },
      { label: '=', latex: { start: '=' }, natural: { start: '=' } },
      { label: '≠', latex: { start: '\\neq ' }, natural: { start: '≠' } },
      { label: '±', latex: { start: '\\pm ' }, natural: { start: '±' } },
      { label: '(', latex: { start: '(', end: ')' }, natural: { start: '(', end: ')' } },
      { label: ')', latex: { start: ')' }, natural: { start: ')' } },
      { label: '[ ]', latex: { start: '[', end: ']' }, natural: { start: '[', end: ']' } },
      { label: '{ }', latex: { start: '\\{', end: '\\}' }, natural: { start: '{', end: '}' } },
    ],
    algebra: [
      { label: '𝒂/𝒃', latex: { start: '\\frac{', end: '}{}', cursorOffset: 0 }, natural: { start: '(', end: ')/()', cursorOffset: 0 }, description: 'Fraction : numérateur/dénominateur' },
      { label: 'x²', latex: { start: '^{2}' }, natural: { start: '^2' } },
      { label: 'xⁿ', latex: { start: '^{', end: '}' }, natural: { start: '^(', end: ')' } },
      { label: '√', latex: { start: '\\sqrt{', end: '}' }, natural: { start: '√(', end: ')' } },
      { label: '³√', latex: { start: '\\sqrt[3]{', end: '}' }, natural: { start: '∛(', end: ')' } },
      { label: '|x|', latex: { start: '|', end: '|' }, natural: { start: '|', end: '|' } },
      { label: '∞', latex: { start: '\\infty ' }, natural: { start: '∞' } },
      { label: 'π', latex: { start: '\\pi ' }, natural: { start: 'π' } },
      { label: '<', latex: { start: '<' }, natural: { start: '<' } },
      { label: '>', latex: { start: '>' }, natural: { start: '>' } },
      { label: '≤', latex: { start: '\\leq ' }, natural: { start: '≤' } },
      { label: '≥', latex: { start: '\\geq ' }, natural: { start: '≥' } },
    ],
    functions: [
      { label: 'sin', latex: { start: '\\sin(', end: ')' }, natural: { start: 'sin(', end: ')' } },
      { label: 'cos', latex: { start: '\\cos(', end: ')' }, natural: { start: 'cos(', end: ')' } },
      { label: 'tan', latex: { start: '\\tan(', end: ')' }, natural: { start: 'tan(', end: ')' } },
      { label: 'log', latex: { start: '\\log(', end: ')' }, natural: { start: 'log(', end: ')' } },
      { label: 'ln', latex: { start: '\\ln(', end: ')' }, natural: { start: 'ln(', end: ')' } },
      { label: 'logₙ', latex: { start: '\\log_{', end: '}()', cursorOffset: 0 }, natural: { start: 'log_(', end: ')( )', cursorOffset: -2 } },
      { label: 'eˣ', latex: { start: 'e^{', end: '}' }, natural: { start: 'e^(', end: ')' } },
      { label: 'f(x)', latex: { start: 'f(x)' }, natural: { start: 'f(x)' } },
    ],
    calculus: [
      { label: '∫', latex: { start: '\\int ' }, natural: { start: '∫ ' } },
      { label: '∫ₐᵇ', latex: { start: '\\int_{', end: '}^{} ' }, natural: { start: '∫_(', end: ')^() ', cursorOffset: 0 } },
      { label: 'lim', latex: { start: '\\lim_{x \\to ', end: '} ' }, natural: { start: 'lim(', end: ')→()', cursorOffset: -2 } },
      { label: 'Σ', latex: { start: '\\sum_{', end: '}^{} ' }, natural: { start: 'Σ_(', end: ')^() ', cursorOffset: 0 } },
      { label: '∂x', latex: { start: '\\partial ' }, natural: { start: '∂' } },
      { label: 'dy/dx', latex: { start: '\\frac{d}{dx}' }, natural: { start: 'dy/dx' } },
      { label: '→', latex: { start: '\\to ' }, natural: { start: '→' } },
      { label: '∈', latex: { start: '\\in ' }, natural: { start: '∈' } },
    ],
    greek: [
      { label: 'α', latex: { start: '\\alpha ' }, natural: { start: 'α' } },
      { label: 'β', latex: { start: '\\beta ' }, natural: { start: 'β' } },
      { label: 'γ', latex: { start: '\\gamma ' }, natural: { start: 'γ' } },
      { label: 'δ', latex: { start: '\\delta ' }, natural: { start: 'δ' } },
      { label: 'Δ', latex: { start: '\\Delta ' }, natural: { start: 'Δ' } },
      { label: 'θ', latex: { start: '\\theta ' }, natural: { start: 'θ' } },
      { label: 'λ', latex: { start: '\\lambda ' }, natural: { start: 'λ' } },
      { label: 'μ', latex: { start: '\\mu ' }, natural: { start: 'μ' } },
      { label: 'σ', latex: { start: '\\sigma ' }, natural: { start: 'σ' } },
      { label: 'ω', latex: { start: '\\omega ' }, natural: { start: 'ω' } },
      { label: 'Ω', latex: { start: '\\Omega ' }, natural: { start: 'Ω' } },
    ]
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-gray-200 dark:border-gray-700 transition-all animate-fade-in">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
            <span className="w-1.5 h-6 sm:h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full shadow-md"></span>
            {t('problemDetected') || 'Éditeur de problème'}
          </h2>
          <div className="flex items-center gap-2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-full p-1.5 text-xs font-bold shadow-inner w-full sm:w-auto">
            <button
              onClick={() => handleModeChange('natural')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-full transition-all text-center ${editorMode === 'natural' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
            >
              <span className="hidden sm:inline">✏️ </span>
              {t('naturalMode') || 'Naturel'}
            </button>
            <button
              onClick={() => handleModeChange('latex')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-full transition-all text-center ${editorMode === 'latex' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
            >
              <span className="hidden sm:inline">📐 </span>
              {t('latexMode') || 'LaTeX'}
            </button>
          </div>
        </div>
      </div>

      {/* Zone de prévisualisation (Rendu Math) */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900/80 dark:to-blue-900/10 rounded-2xl p-4 sm:p-8 mb-6 border-2 border-slate-200 dark:border-gray-700 flex items-center justify-center min-h-[120px] sm:min-h-[140px] shadow-lg relative overflow-hidden">
        <div className="absolute top-2 right-2 px-2 sm:px-3 py-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-600 dark:text-gray-400 shadow-sm">
          Aperçu
        </div>
        <div className="text-center text-lg sm:text-xl md:text-2xl overflow-x-auto max-w-full text-slate-900 dark:text-slate-100 w-full">
          {editableLatex ? (
             <BlockMath math={fixLatexInText(editableLatex)} />
          ) : (
             <span className="text-gray-400 italic text-sm sm:text-base"> {t('problemPreviewPlaceholder') || 'Votre formule apparaîtra ici'}</span>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 flex items-center gap-2">
        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        {editorMode === 'natural' ? (t('naturalHelper') || 'Écrivez naturellement, ex: (3+2)/5') : (t('problemHint') || 'Utilisez LaTeX pour les formules complexes')}
      </p>

      {/* Interface Éditeur Calculatrice */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-800">
        
        {/* Onglets de catégories */}
        <div className="flex overflow-x-auto scrollbar-thin border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all
                ${activeTab === key 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <span className="font-mono text-xs opacity-70">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grille de symboles */}
        <div className="p-3 bg-gray-50 dark:bg-gray-900/30 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto scrollbar-thin">
          {symbols[activeTab].map((sym, idx) => {
            const isDisabled = editorMode === 'natural' && !sym.natural
            const isFraction = sym.label === '𝒂/𝒃'
            return (
              <button
                key={idx}
                type="button"
                disabled={isDisabled}
                onClick={() => !isDisabled && handleInsertSymbol(sym)}
                className={`h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition-all relative group ${
                  isDisabled
                    ? 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60'
                    : isFraction
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-500 border-blue-400 dark:border-blue-600 text-white hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg active:scale-95 shadow-md font-bold'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md active:scale-95 shadow-sm'
                }`}
                title={sym.description || (editorMode === 'natural' ? sym.natural?.start || sym.latex?.start || sym.label : sym.latex?.start || sym.label)}
              >
                {sym.label}
                {isFraction && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
              </button>
            )
          })}
        </div>

        {/* Zone de texte */}
        {editorMode === 'natural' ? (
          <div className="relative border-t border-gray-200 dark:border-gray-700">
            <textarea
              ref={naturalTextareaRef}
              value={simpleInput}
              onChange={(e) => updateNaturalInput(e.target.value)}
              className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium text-sm sm:text-base focus:outline-none focus:bg-blue-50/10 dark:focus:bg-blue-900/10 resize-y min-h-[120px] sm:min-h-[140px]"
              placeholder={t('naturalPlaceholder')}
            />
            <div className="absolute bottom-2 right-3 text-[10px] text-gray-400 dark:text-gray-500 pointer-events-none">
              {t('naturalMode')}
            </div>
          </div>
        ) : (
          <div className="relative border-t border-gray-200 dark:border-gray-700">
            <textarea
              ref={latexTextareaRef}
              value={editableLatex}
              onChange={(e) => setEditableLatex(e.target.value)}
              className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-xs sm:text-sm focus:outline-none focus:bg-blue-50/10 dark:focus:bg-blue-900/10 resize-y min-h-[100px] sm:min-h-[120px]"
              placeholder={t('problemPlaceholder')}
              spellCheck="false"
            />
            <div className="absolute bottom-2 right-3 text-[10px] text-gray-400 dark:text-gray-500 pointer-events-none">
              {t('latexLabel')}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={handleSolve}
          className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-3 group"
        >
          <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {t('solveButton') || 'Résoudre maintenant'}
        </button>
        <button
          onClick={onReset}
          className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all shadow-md hover:shadow-lg"
        >
          {t('cancel') || 'Annuler'}
        </button>
      </div>
    </div>
  )
}

export default ProblemDisplay
