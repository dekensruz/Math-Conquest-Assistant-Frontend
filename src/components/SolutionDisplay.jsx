import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { useEffect, useRef } from 'react'
import jsPDF from 'jspdf'
import { addToHistory } from '../utils/historyStorage'
import StepDescription from './StepDescription'
import { fixLatexInText, latexToPlainText } from '../utils/latexHelper'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * Composant pour afficher la solution complète avec explications étape par étape
 * Inclut l'export PDF
 */
function SolutionDisplay({ problem, solution, onReset, onOpenChat }) {
  const { t } = useLanguage()
  const contentRef = useRef(null)

  // Sauvegarder dans l'historique quand la solution est affichée
  useEffect(() => {
    if (problem && solution) {
      addToHistory(problem, solution)
    }
  }, [problem, solution])

  /**
   * Exporte la solution en PDF avec captures optimisées par section
   * Génère des captures séparées en JPEG pour réduire drastiquement la taille
   */
  const handleExportPDF = async () => {
    if (!contentRef.current) return

    try {
      const html2canvas = (await import('html2canvas')).default
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = 210
      const pageHeight = 297
      const margin = 10
      const contentWidth = pageWidth - 2 * margin
      
      let currentY = margin

      // Fonction pour capturer et ajouter une section
      const addSectionToPDF = async (element) => {
        if (!element) return
        
        // Capture avec configuration spécifique pour éviter les problèmes de layout
        const canvas = await html2canvas(element, {
          scale: 2, // Suffisant pour une bonne qualité (3 était peut-être trop lourd)
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 1200, // FORCE une largeur "Desktop" pour que la police ne soit pas énorme
          onclone: (clonedDoc) => {
            // IMPORTANT: Force l'overflow visible pour les formules mathématiques
            // Sinon html2canvas ignore les parties qui dépassent ou ont des scrollbars
            const mathBlocks = clonedDoc.querySelectorAll('.katex-display, .katex-html, .overflow-x-auto');
            mathBlocks.forEach(block => {
              block.style.overflow = 'visible';
              block.style.width = 'auto';
              block.style.whiteSpace = 'normal';
            });
            
            // S'assurer que le conteneur cloné a la bonne largeur
            const clonedElement = clonedDoc.body.querySelector('[data-section="' + element.getAttribute('data-section') + '"]');
            if (clonedElement) {
                clonedElement.style.width = '1100px'; // Largeur fixe pour le rendu
                clonedElement.style.padding = '20px';
            }
          }
        })
        
        // JPEG qualité 0.8 pour réduire la taille
        const imgData = canvas.toDataURL('image/jpeg', 0.8)
        const imgHeight = (canvas.height * contentWidth) / canvas.width
        
        // Nouvelle page si nécessaire
        if (currentY + imgHeight > pageHeight - margin) {
          pdf.addPage()
          currentY = margin
        }
        
        pdf.addImage(imgData, 'JPEG', margin, currentY, contentWidth, imgHeight)
        currentY += imgHeight + 5 // Espace entre sections
      }

      // On utilise à nouveau data-section pour cibler proprement les blocs
      const sections = ['problem', 'steps', 'answer', 'summary']
      
      for (const sectionName of sections) {
          // On cherche l'élément dans le DOM actuel
          const sectionEl = contentRef.current.querySelector(`[data-section="${sectionName}"]`)
          if (sectionEl) {
            await addSectionToPDF(sectionEl)
          }
      }

      pdf.save('solution-math-conquest.pdf')
    } catch (error) {
      console.error('Erreur export PDF:', error)
      alert('Erreur lors de la création du PDF')
    }
  }

  // Parsing de l'explication si c'est une string JSON brute
  let explanation = solution.explanation || {};
  if (typeof explanation === 'string') {
    const originalText = explanation;
    try {
      // Essayer d'extraire le JSON d'un bloc de code markdown
      const jsonMatch = explanation.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        explanation = JSON.parse(jsonMatch[1]);
      } else {
        // Essayer de parser directement
        explanation = JSON.parse(explanation);
      }
    } catch (e) {
      console.error("Erreur de parsing JSON:", e);
      // Fallback si le parsing échoue
      explanation = {
        steps: [],
        summary: 'Erreur lors du parsing de l\'explication.',
        raw_text: originalText
      };
    }
  }

  // Traitement de la réponse finale avec nettoyage agressif
  const wolframResult = solution?.wolfram_result?.result
  let rawFinalAnswer = explanation.final_answer || wolframResult || ''
  if (typeof rawFinalAnswer === 'string') {
    rawFinalAnswer = fixLatexInText(rawFinalAnswer).replace(/\s+/g, ' ').trim()
  } else {
    rawFinalAnswer = ''
  }

  const plainFinalAnswer = latexToPlainText(rawFinalAnswer)
  const displayFinalAnswer = plainFinalAnswer || rawFinalAnswer || t('resultUnavailable')
  const showLatexNotation = rawFinalAnswer && plainFinalAnswer !== rawFinalAnswer

  // Nettoyer le problème pour l'affichage (retirer les délimiteurs \[ \] s'ils sont présents)
  const displayProblem = typeof problem === 'string' ? fixLatexInText(problem.replace(/^\\\[|\\\]$/g, '').trim()) : problem;

  return (
    <div className="space-y-6 pb-2">
      {/* En-tête avec actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              {t('solutionTitle') || 'Solution'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Résolution étape par étape</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportPDF}
            className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t('exportPDF') || 'PDF'}
          </button>
          <button
            onClick={onReset}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('newProblem') || 'Nouveau'}
          </button>
        </div>
      </div>

      {/* Contenu exportable */}
      <div ref={contentRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
        
        {/* Problème original */}
        <div data-section="problem" className="mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-3">
            {t('problemSection')}
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 overflow-x-auto">
            <BlockMath math={displayProblem} />
          </div>
        </div>

        {/* Étapes de résolution */}
        {explanation.steps && explanation.steps.length > 0 ? (
          <div data-section="steps" className="space-y-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold leading-none pt-[1px]">
                {explanation.steps.length}
              </span>
              {t('stepsTitle')}
            </h3>
            
            <div className="relative border-l-2 border-blue-100 dark:border-blue-900/30 ml-3 space-y-8 pl-6 pb-2">
              {explanation.steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Point sur la ligne temporelle */}
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-2 border-blue-500 z-10"></div>
                  
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-3">
                      <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                        {t('step')} {step.step_number}
                      </h4>
                    </div>

                    <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      <StepDescription description={step.description} />
                    </div>

                    {step.latex && (
                      <div className="my-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-3 overflow-x-auto border border-blue-100 dark:border-blue-900/20">
                         <div className="text-blue-900 dark:text-blue-100">
                          <BlockMath math={fixLatexInText(step.latex)} />
                         </div>
                      </div>
                    )}

                    {step.explanation && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                        <span className="font-medium not-italic mr-1">{t('note')}:</span>
                        {step.explanation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {t('noSteps')}
            {explanation.raw_text && (
               <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded text-left text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                 {explanation.raw_text}
               </div>
            )}
            {explanation.type && (
              <span className="block mt-2">
                Type: {explanation.type || 'N/A'}, Méthode: {explanation.method || 'N/A'}
              </span>
            )}
          </div>
        )}

        {/* Réponse finale */}
        <div data-section="answer" className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('finalAnswer')}
          </h3>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-xl p-6 border border-green-100 dark:border-green-800/30 shadow-sm">
            <div className="text-center space-y-4">
              <p className="text-2xl font-semibold text-green-900 dark:text-green-100">
                {displayFinalAnswer}
              </p>

              {showLatexNotation && (
                <div className="bg-white/70 dark:bg-white/5 border border-green-100/60 dark:border-green-800/40 rounded-lg p-4">
                  <p className="text-xs uppercase tracking-wider text-green-700 dark:text-green-300 mb-2 font-semibold">
                    {t('mathNotation')}
                  </p>
                  <div className="text-green-900 dark:text-green-100">
                    <BlockMath math={rawFinalAnswer} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Résumé (si disponible) */}
        {explanation.summary && (
          <div data-section="summary" className="mt-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {t('summary')}
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {latexToPlainText(explanation.summary) || explanation.summary}
              </div>
            </div>
          </div>
        )}

        {/* Section pour ouvrir le chat après le résumé */}
        {explanation.summary && onOpenChat && (
          <div className="mt-8 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/10 rounded-2xl p-6 border border-purple-100 dark:border-purple-800/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('needHelp') || 'Besoin d\'aide ?'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('chatDescription') || 'Posez des questions pour mieux comprendre cette solution'}
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenChat}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {t('openChat') || 'Ouvrir le chat'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SolutionDisplay
