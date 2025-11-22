/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

/**
 * Contexte pour gérer le thème (dark/light mode)
 * Sauvegarde la préférence dans localStorage
 */
const getInitialThemePreference = () => {
  if (typeof window === 'undefined') return false

  try {
    const saved = window.localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') {
      return saved === 'dark'
    }
  } catch {
    // ignore, fallback to light
  }

  // Par défaut on démarre en clair
  return false
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(getInitialThemePreference)

  // Appliquer le thème au chargement initial et à chaque changement
  useEffect(() => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    
    // Retirer toutes les classes dark d'abord
    root.classList.remove('dark')
    
    // Ajouter ou retirer selon l'état
    if (isDark) {
      root.classList.add('dark')
    }
    
    // Sauvegarder la préférence
    try {
      window.localStorage.setItem('theme', isDark ? 'dark' : 'light')
    } catch {
      // ignore storage errors
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

