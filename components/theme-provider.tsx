"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { 
  ThemeMode, 
  ThemeConfig, 
  getThemeConfig, 
  applyThemeToCSS, 
  getAvailableThemes 
} from "@/lib/theme-config"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: ThemeMode
  defaultColorTheme?: string
  storageKey?: string
}

type ThemeProviderState = {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  colorTheme: string
  setColorTheme: (theme: string) => void
  availableThemes: Array<{ name: string; displayName: string; description: string }>
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  colorTheme: "default",
  setColorTheme: () => null,
  availableThemes: getAvailableThemes(),
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorTheme = "default",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>(defaultTheme)
  const [colorTheme, setColorTheme] = useState<string>(defaultColorTheme)

  // Initialize theme from localStorage on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem(storageKey) as ThemeMode
      const storedColorTheme = localStorage.getItem(`${storageKey}-color`) || defaultColorTheme
      if (storedTheme) {
        setTheme(storedTheme)
      }
      if (storedColorTheme) {
        setColorTheme(storedColorTheme)
      }
    }
  }, [storageKey, defaultColorTheme])

  // Apply theme when theme or colorTheme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentMode = theme === "system" 
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : theme
      
      const isDark = currentMode === "dark"
      const themeConfig = getThemeConfig(colorTheme, isDark)
      applyThemeToCSS(themeConfig, isDark)
    }
  }, [theme, colorTheme])

  // Listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      
      const handleChange = () => {
        const isDark = mediaQuery.matches
        const themeConfig = getThemeConfig(colorTheme, isDark)
        applyThemeToCSS(themeConfig, isDark)
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme, colorTheme])

  const value = {
    theme,
    setTheme: (theme: ThemeMode) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, theme)
      }
      setTheme(theme)
    },
    colorTheme,
    setColorTheme: (theme: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${storageKey}-color`, theme)
      }
      setColorTheme(theme)
    },
    availableThemes: getAvailableThemes(),
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}


