/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  fr: {
    // App Globals
    appTitle: "Math Conquest Assistant",
    appSubtitle: "Résolvez vos problèmes mathématiques étape par étape",
    loading: "Analyse en cours...",
    analyzing: "Résolution du problème...",
    analyzingSub: "L'intelligence artificielle analyse les étapes...",
    error: "Une erreur est survenue",
    
    // Upload Screen
    uploadTitle: "Prenez une photo ou uploadez une image",
    uploadSubtitle: "Glissez-déposez votre fichier ici, ou",
    browse: "parcourez vos dossiers",
    formats: "Formats supportés: JPG, PNG, WebP",
    qualityTip: "Assurez-vous que l'image soit nette et bien éclairée",
    landscapeTip: "💡 Astuce : Mode paysage recommandé",
    landscapeTipDescription: "Les images sont mieux transcrites lorsqu'elles sont prises en mode paysage (horizontal).",
    landscape: "Paysage",
    processing: "Traitement en cours...",
    or: "ou",
    enterManually: "Saisir manuellement",
    chooseFile: "Choisir un fichier",
    takePhoto: "Prendre une photo",
    invalidImage: "Veuillez sélectionner une image valide",
    cropImage: "Rogner l'image",
    confirmCrop: "Confirmer",
    
    // Problem Display
    problemDetected: "Problème détecté",
    edit: "Modifier",
    save: "Enregistrer",
    cancel: "Annuler",
    solveButton: "Résoudre",
    back: "Retour",
    backToHome: "Retour à l'accueil",
    naturalMode: "Mode naturel",
    latexMode: "Mode avancé (LaTeX)",
    naturalPlaceholder: "Ex : (2x + 3)/5 = 7 ou √(16) = 4",
    naturalHelper: "Écrivez les équations comme sur papier : fractions avec (a)/(b), racines avec √( ) ou sqrt(). Les symboles avancés restent disponibles en changeant de mode.",
    problemPlaceholder: "Utilisez le clavier mathématique pour écrire votre problème...",
    problemPreviewPlaceholder: "Le problème s'affichera ici après la transcription.",
    problemHint: "Ajoutez ou modifiez des symboles en utilisant le clavier mathématique ci-dessous.",
    keyboardBasic: "Basique",
    keyboardAlgebra: "Algèbre",
    keyboardFunctions: "Fonctions",
    keyboardCalculus: "Analyse",
    keyboardGreek: "Alphabet grec",
    latexLabel: "LaTeX",
    
    // Solution Display
    solutionTitle: "Solution complète",
    problemSection: "Problème",
    stepsTitle: "Étapes de résolution",
    step: "Étape",
    note: "Note",
    finalAnswer: "Réponse finale",
    summary: "Résumé",
    newProblem: "Nouveau problème",
    exportPDF: "PDF",
    noSteps: "Aucune étape détaillée disponible.",
    type: "Type",
    method: "Méthode",
    resultUnavailable: "Résultat non disponible",
    mathNotation: "Notation mathématique",
    
    // Chat
    chatTitle: "Discussion",
    chatSubtitle: "Posez des questions sur cette solution",
    chatDescription: "Posez des questions pour mieux comprendre cette solution",
    chatPlaceholder: "Posez une question sur la solution...",
    chatSuggested: "Questions suggérées",
    chatTip: "Astuce : Appuyez sur Échap pour fermer",
    needHelp: "Besoin d'aide ?",
    openChat: "Ouvrir le chat",
    whyStep: "Pourquoi cette étape ?",
    example: "Exemple similaire",
    explainConcept: "Expliquer le concept",
    otherMethod: "Autre méthode ?",
    commonErrors: "Erreurs fréquentes",
    send: "Envoyer",
    
    // History Sidebar
    history: "Historique",
    entries: "Entrées",
    clearHistory: "Tout effacer",
    emptyHistory: "Aucun historique",
    emptyHistorySub: "Vos résolutions apparaîtront ici",
    deleteConfirm: "Supprimer ce problème ?",
    clearConfirm: "Tout effacer ?",
    delete: "Supprimer",
    collapseMenu: "Réduire le menu",
    expandMenu: "Déployer le menu",
    closeMenu: "Fermer",
    today: "Aujourd'hui",
    yesterday: "Hier",
    lastWeek: "7 derniers jours",
    older: "Plus ancien",
    chooseAnother: "Utiliser une autre image",
    
    // Footer
    footerText: "Math Conquest Assistant. Créé par",
    createdBy: "Créé par",
    allRightsReserved: "Tous droits réservés.",
    
    // Landing Page
    smartScan: "Scan Intelligent",
    smartScanDesc: "Prenez une photo de n'importe quel problème, manuscrit ou imprimé. Notre IA le comprend instantanément.",
    stepByStep: "Explications Pas à Pas",
    stepByStepDesc: "Ne recevez pas juste la réponse. Comprenez le 'pourquoi' et le 'comment' avec des explications détaillées.",
    interactiveChat: "Chat Interactif",
    interactiveChatDesc: "Bloqué sur une étape ? Posez des questions à l'IA comme à un vrai tuteur pour clarifier vos doutes.",
    start: "Commencer",
    learnMore: "En savoir plus",
    tryFree: "Essayer gratuitement",
    heroTitle: "Maîtrisez les maths.",
    heroSubtitle: "Sans effort.",
    heroDesc: "L'intelligence artificielle qui résout vos problèmes mathématiques et vous explique chaque étape comme un professeur particulier.",
    heroBadge: "Nouvelle génération",
    statStudents: "Élèves accompagnés",
    statAccuracy: "Précision moyenne",
    statLanguages: "Langues disponibles",
    confirmTitle: "Tout est correct ?",
    confirmSubtitle: "Vérifiez le problème détecté avant de lancer la résolution ou passez en édition manuelle pour ajuster l'équation.",
    timelineScan: "1. Capturez",
    timelineScanDesc: "Photographiez un exercice manuscrit, tapé ou importez-le depuis votre galerie.",
    timelineEdit: "2. Vérifiez",
    timelineEditDesc: "Revisualisez la transcription propre. Corrigez-la facilement en mode édition visuelle.",
    timelineSolve: "3. Résolvez",
    timelineSolveDesc: "L'IA applique automatiquement la meilleure méthode pour résoudre le problème.",
    timelineExplain: "4. Comprenez",
    timelineExplainDesc: "Recevez des explications pédagogiques étape par étape avec un langage simple.",
    journeyTitle: "Une expérience fluide du scan à l'explication",
    journeySubtitle: "Chaque étape est pensée pour vous accompagner : capture intuitive, révision rapide, résolution fiable et explication claire.",
    ctaTitle: "Prêt à rendre les maths plus simples ?",
    ctaSubtitle: "Rejoignez des milliers d'étudiants qui révisent, vérifient et comprennent leurs devoirs grâce à Math Conquest Assistant.",
    ctaButton: "Lancer l'application",
    ctaSecondary: "Découvrir les fonctionnalités",
    confirmDetected: "Problème détecté",
    chooseAnotherImage: "Changer d'image",
  },
  en: {
    // App Globals
    appTitle: "Math Conquest Assistant",
    appSubtitle: "Solve your math problems step by step",
    loading: "Analyzing...",
    analyzing: "Solving problem...",
    analyzingSub: "Artificial intelligence is analyzing the steps...",
    error: "An error occurred",
    
    // Upload Screen
    uploadTitle: "Take a photo or upload an image",
    uploadSubtitle: "Drag and drop your file here, or",
    browse: "browse your files",
    formats: "Supported formats: JPG, PNG, WebP",
    qualityTip: "Ensure the image is clear and well-lit",
    landscapeTip: "💡 Tip: Landscape mode recommended",
    landscapeTipDescription: "Images are better transcribed when taken in landscape mode (horizontal).",
    landscape: "Landscape",
    processing: "Processing...",
    or: "or",
    enterManually: "Enter manually",
    chooseFile: "Choose a file",
    takePhoto: "Take a photo",
    invalidImage: "Please select a valid image",
    cropImage: "Crop image",
    confirmCrop: "Confirm",
    
    // Problem Display
    problemDetected: "Detected Problem",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    solveButton: "Solve",
    back: "Back",
    backToHome: "Back to home",
    naturalMode: "Natural mode",
    latexMode: "Advanced (LaTeX)",
    naturalPlaceholder: "e.g. (2x + 3)/5 = 7 or √(16) = 4",
    naturalHelper: "Type expressions the way you would write them: use (a)/(b) for fractions, √() or sqrt() for roots. Switch to LaTeX mode for advanced layouts.",
    problemPlaceholder: "Use the math keyboard above to type your problem...",
    problemPreviewPlaceholder: "Your detected problem will show up here.",
    problemHint: "Use the math keyboard to insert fractions, roots, integrals and more.",
    keyboardBasic: "Basic",
    keyboardAlgebra: "Algebra",
    keyboardFunctions: "Functions",
    keyboardCalculus: "Calculus",
    keyboardGreek: "Greek",
    latexLabel: "LaTeX",
    
    // Solution Display
    solutionTitle: "Full Solution",
    problemSection: "Problem",
    stepsTitle: "Resolution Steps",
    step: "Step",
    note: "Note",
    finalAnswer: "Final Answer",
    summary: "Summary",
    newProblem: "New Problem",
    exportPDF: "PDF",
    noSteps: "No detailed steps available.",
    type: "Type",
    method: "Method",
    resultUnavailable: "Result not available",
    mathNotation: "Math notation",
    
    // Chat
    chatTitle: "Discussion",
    chatSubtitle: "Ask questions about this solution",
    chatDescription: "Ask questions to better understand this solution",
    chatPlaceholder: "Ask a question about the solution...",
    chatSuggested: "Suggested Questions",
    chatTip: "Tip: Press Esc to close",
    needHelp: "Need help?",
    openChat: "Open Chat",
    whyStep: "Why this step?",
    example: "Similar example",
    explainConcept: "Explain concept",
    otherMethod: "Other method?",
    commonErrors: "Common errors",
    send: "Send",
    
    // History Sidebar
    history: "History",
    entries: "Entries",
    clearHistory: "Clear all",
    emptyHistory: "No history",
    emptyHistorySub: "Your solutions will appear here",
    deleteConfirm: "Delete this problem?",
    clearConfirm: "Clear all history?",
    delete: "Delete",
    collapseMenu: "Collapse menu",
    expandMenu: "Expand menu",
    closeMenu: "Close",
    today: "Today",
    yesterday: "Yesterday",
    lastWeek: "Last 7 days",
    older: "Older",
    chooseAnother: "Use another image",
    
    // Footer
    footerText: "Math Conquest Assistant. Created by",
    createdBy: "Created by",
    allRightsReserved: "All rights reserved.",
    
    // Landing Page
    smartScan: "Smart Scan",
    smartScanDesc: "Snap a photo of any problem, handwritten or printed. Our AI understands it instantly.",
    stepByStep: "Step-by-Step",
    stepByStepDesc: "Don't just get the answer. Understand the 'why' and 'how' with detailed explanations.",
    interactiveChat: "Interactive Chat",
    interactiveChatDesc: "Stuck on a step? Ask the AI questions just like a real tutor to clarify your doubts.",
    start: "Get Started",
    learnMore: "Learn more",
    tryFree: "Try for free",
    heroTitle: "Master Math.",
    heroSubtitle: "Effortlessly.",
    heroDesc: "The artificial intelligence that solves your math problems and explains every step like a personal tutor.",
    heroBadge: "Next-gen tutor",
    statStudents: "Students helped",
    statAccuracy: "Average accuracy",
    statLanguages: "Available languages",
    confirmTitle: "Does this look correct?",
    confirmSubtitle: "Review the detected problem before solving it or switch to manual editing to make quick adjustments.",
    timelineScan: "1. Scan",
    timelineScanDesc: "Snap a clear photo of any handwritten or printed math problem.",
    timelineEdit: "2. Review",
    timelineEditDesc: "See the clean transcription instantly. Jump into edit mode if something looks off.",
    timelineSolve: "3. Solve",
    timelineSolveDesc: "Our AI selects the right method and solves the exercise accurately.",
    timelineExplain: "4. Understand",
    timelineExplainDesc: "Walk through every step with clear, teacher-like explanations.",
    journeyTitle: "A seamless journey from scan to explanation",
    journeySubtitle: "Every phase is crafted for clarity: capture, review, solve, and truly understand your math problems.",
    ctaTitle: "Ready to make math effortless?",
    ctaSubtitle: "Join thousands of learners who check, understand, and master their homework with Math Conquest Assistant.",
    ctaButton: "Open the app",
    ctaSecondary: "See features",
    confirmDetected: "Detected problem",
    chooseAnotherImage: "Switch image",
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('math-app-lang') || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('math-app-lang', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
