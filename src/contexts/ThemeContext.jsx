/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

/**
 * Contexte pour gérer le thème (dark/light mode)
 * Sauvegarde la préférence dans localStorage
 */
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // Récupérer la préférence depuis localStorage ou utiliser la préférence système
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') {
      return saved === 'dark'
    }
    // Détecter la préférence système par défaut
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark
  })

  // Appliquer le thème au chargement initial et à chaque changement
  useEffect(() => {
    const root = document.documentElement
    
    // Retirer toutes les classes dark d'abord
    root.classList.remove('dark')
    
    // Ajouter ou retirer selon l'état
    if (isDark) {
      root.classList.add('dark')
    }
    
    // Sauvegarder la préférence
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
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

