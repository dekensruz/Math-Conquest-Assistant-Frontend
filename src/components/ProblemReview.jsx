import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { useLanguage } from '../contexts/LanguageContext'
import { fixLatexInText } from '../utils/latexHelper'

function ProblemReview({ latex, onEdit, onSolve, onReset }) {
  const { t } = useLanguage()
  const cleanedLatex = latex ? fixLatexInText(latex.replace(/^\\\[|\\\]$/g, '').trim()) : ''

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-8 sm:p-10 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-md">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {t('problemDetected') || 'Problème détecté'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            {t('confirmTitle') || 'Vérifiez votre problème'}
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
            {t('confirmSubtitle') || 'Assurez-vous que le problème est correctement détecté avant de continuer'}
          </p>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('back')}
        </button>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900/60 dark:to-blue-900/20 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-8 min-h-[180px] flex items-center justify-center text-center overflow-x-auto shadow-lg">
        {cleanedLatex ? (
          <div className="text-2xl">
            <BlockMath math={cleanedLatex} />
          </div>
        ) : (
          <p className="text-gray-400 italic text-lg">{t('problemPreviewPlaceholder') || 'Aucun problème détecté'}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <button
          onClick={onSolve}
          className="px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {t('solveButton') || 'Résoudre'}
        </button>
        <button
          onClick={onEdit}
          className="px-6 py-4 rounded-xl bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 font-semibold hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-md hover:shadow-lg"
        >
          {t('edit') || 'Modifier'}
        </button>
        <button
          onClick={onReset}
          className="px-6 py-4 rounded-xl bg-gray-100 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all"
        >
          {t('chooseAnother') || 'Changer'}
        </button>
      </div>
    </div>
  )
}

export default ProblemReview


