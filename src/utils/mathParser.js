import { fixLatexInText } from './latexHelper'

const greekMap = {
  'α': '\\alpha',
  'β': '\\beta',
  'γ': '\\gamma',
  'δ': '\\delta',
  'Δ': '\\Delta',
  'θ': '\\theta',
  'λ': '\\lambda',
  'μ': '\\mu',
  'σ': '\\sigma',
  'ω': '\\omega',
  'Ω': '\\Omega',
  'π': '\\pi',
}

const symbolMap = {
  '∞': '\\infty',
  '±': '\\pm',
  '÷': '\\div',
  '×': '\\times',
  '∫': '\\int',
  'Σ': '\\sum',
  '√': '\\sqrt',
  '∛': '\\sqrt[3]',
  '∂': '\\partial ',
  '→': '\\to ',
  '∈': '\\in ',
}

function normalizeGreeks(text) {
  let output = text
  Object.entries(greekMap).forEach(([char, latex]) => {
    output = output.split(char).join(latex)
  })
  Object.entries(symbolMap).forEach(([char, latex]) => {
    output = output.split(char).join(`${latex}`)
  })
  return output
}

function wrapExponents(text) {
  return text.replace(/\^(\s*\(?[-+]?[A-Za-z0-9.,]+(?:\))?)/g, (_, exp) => {
    const cleaned = exp.trim().replace(/^\(|\)$/g, '')
    return `^{${cleaned}}`
  })
}

function handleFunctions(text) {
  const functions = ['sin', 'cos', 'tan', 'ln', 'log', 'exp']
  let output = text
  functions.forEach((fn) => {
    const pattern = new RegExp(`${fn}\\s*\\(([^()]*)\\)`, 'gi')
    output = output.replace(pattern, (_, inner) => `\\${fn}\\left(${inner}\\right)`)
  })
  return output
}

function handleLogWithBase(text) {
  const pattern = /log_\(([^)]+)\)\s*\(([^)]+)\)/gi
  return text.replace(pattern, (_, base, arg) => `\\log_{${base}}\\left(${arg}\\right)`)
}

function handleSqrt(text) {
  let output = text
  const sqrtPattern = /(\\sqrt|sqrt)\s*\(([^()]+)\)/gi
  while (sqrtPattern.test(output)) {
    output = output.replace(sqrtPattern, (_, __, inner) => `\\sqrt{${inner}}`)
  }
  return output
}

function handleFractions(text) {
  let output = text
  const parenthesesFrac = /\(([^()]+)\)\s*\/\s*\(([^()]+)\)/g
  output = output.replace(parenthesesFrac, (_, top, bottom) => `\\frac{${top}}{${bottom}}`)

  // Cas simple a/b
  const simpleFrac = /([A-Za-z0-9.+-]+)\s*\/\s*([A-Za-z0-9.+-]+)/g
  output = output.replace(simpleFrac, (match, top, bottom) => {
    if (match.includes('\\frac')) return match
    return `\\frac{${top}}{${bottom}}`
  })
  return output
}

function handleInequalities(text) {
  return text
    .replace(/<=/g, '\\leq ')
    .replace(/>=/g, '\\geq ')
    .replace(/!=/g, '\\neq ')
}

function handleAbsoluteValues(text) {
  return text.replace(/\|([^|]+)\|/g, (_, inner) => `\\left|${inner}\\right|`)
}

function handleDerivatives(text) {
  let output = text.replace(/d([A-Za-z])\/d([A-Za-z])/g, (_, num, den) => `\\frac{d${num}}{d${den}}`)
  output = output.replace(/dy\/dx/g, '\\frac{dy}{dx}')
  return output
}

/**
 * Convertit une saisie "naturelle" (style Word) en LaTeX simple.
 */
export function naturalToLatex(input = '') {
  if (!input || typeof input !== 'string') return ''

  let work = input
  work = normalizeGreeks(work)
  work = handleInequalities(work)
  work = handleLogWithBase(work)
  work = handleFunctions(work)
  work = handleSqrt(work)
  work = handleFractions(work)
  work = handleDerivatives(work)
  work = handleAbsoluteValues(work)
  work = wrapExponents(work)

  // Nettoyer les multiplications implicites
  work = work.replace(/\*/g, '\\cdot ')

  return fixLatexInText(work)
}


