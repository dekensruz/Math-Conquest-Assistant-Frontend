/**
 * Composant de chargement réutilisable
 * Affiche un spinner animé
 */
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
      </div>
      <div className="flex gap-2">
        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  )
}

export default LoadingSpinner

