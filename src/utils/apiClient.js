const normalizeBaseUrl = () => {
  if (typeof import.meta === 'undefined' || !import.meta.env) {
    return ''
  }

  const raw = import.meta.env.VITE_API_BASE_URL || ''
  if (!raw) {
    return ''
  }

  return raw.endsWith('/') ? raw.slice(0, -1) : raw
}

export const API_BASE_URL = normalizeBaseUrl()

/**
 * Wrapper autour de fetch pour préfixer automatiquement les appels backend.
 * Permet de continuer à utiliser des chemins relatifs (/api/...) en local
 * tout en ciblant l'URL Render en production via VITE_API_BASE_URL.
 */
export const apiFetch = (path, options = {}) => {
  if (!path) {
    throw new Error('apiFetch requires a path')
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return fetch(path, options)
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const base = API_BASE_URL || ''
  const url = `${base}${normalizedPath}`

  return fetch(url, options)
}


