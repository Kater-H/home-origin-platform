import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null)
  const [loading, setLoading] = useState(true)

  // Default theme fallback
  const defaultTheme = {
    theme_id: 'default',
    name: 'Modern Green',
    primary_color: '#10B981',
    secondary_color: '#3B82F6',
    accent_color: '#F59E0B',
    background_color: '#ffffff',
    text_color: '#1F2937',
    text_light: '#6B7280',
    success_color: '#10B981',
    warning_color: '#F59E0B',
    error_color: '#EF4444',
    info_color: '#3B82F6',
    border_color: '#E5E7EB'
  }

  useEffect(() => {
    fetchActiveTheme()
  }, [])

  useEffect(() => {
    if (theme) {
      applyThemeToDocument(theme)
    }
  }, [theme])

  const fetchActiveTheme = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // const response = await fetch('https://77h9ikcz967q.manus.space/api/themes/active')
      // const data = await response.json()
      // if (data.success && data.theme) {
      //   setTheme(data.theme)
      // } else {
      //   setTheme(defaultTheme)
      // }
      
      // Using default theme for now
      setTheme(defaultTheme)
    } catch (error) {
      console.error('Failed to fetch active theme:', error)
      setTheme(defaultTheme)
    } finally {
      setLoading(false)
    }
  }

  const applyThemeToDocument = (themeData) => {
    const root = document.documentElement
    
    // Apply CSS custom properties
    root.style.setProperty('--color-primary', themeData.primary_color)
    root.style.setProperty('--color-secondary', themeData.secondary_color)
    root.style.setProperty('--color-accent', themeData.accent_color)
    root.style.setProperty('--color-background', themeData.background_color)
    root.style.setProperty('--color-text', themeData.text_color)
    root.style.setProperty('--color-text-light', themeData.text_light)
    root.style.setProperty('--color-success', themeData.success_color)
    root.style.setProperty('--color-warning', themeData.warning_color)
    root.style.setProperty('--color-error', themeData.error_color)
    root.style.setProperty('--color-info', themeData.info_color)
    root.style.setProperty('--color-border', themeData.border_color)

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeData.primary_color)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'theme-color'
      meta.content = themeData.primary_color
      document.getElementsByTagName('head')[0].appendChild(meta)
    }
  }

  const updateTheme = (newTheme) => {
    setTheme(newTheme)
  }

  const refreshTheme = () => {
    fetchActiveTheme()
  }

  const getThemeColors = () => {
    if (!theme) return {}
    
    return {
      primary: theme.primary_color,
      secondary: theme.secondary_color,
      accent: theme.accent_color,
      background: theme.background_color,
      text: theme.text_color,
      textLight: theme.text_light,
      success: theme.success_color,
      warning: theme.warning_color,
      error: theme.error_color,
      info: theme.info_color,
      border: theme.border_color
    }
  }

  const value = {
    theme,
    loading,
    updateTheme,
    refreshTheme,
    getThemeColors,
    colors: getThemeColors()
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider

