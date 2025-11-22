import 'katex/dist/katex.min.css'
import { renderMarkdown } from '../utils/markdownRenderer.jsx'

function StepDescription({ description }) {
  if (!description) return null

  return (
    <div className="space-y-2 leading-relaxed text-gray-700 dark:text-gray-200">
      {renderMarkdown(description)}
    </div>
  )
}

export default StepDescription
