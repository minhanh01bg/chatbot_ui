"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { type ThemeName, getCurrentTheme, applyTheme, themes } from "@/lib/theme"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  customTheme: ThemeName
  setCustomTheme: (theme: ThemeName) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  customTheme: "default",
  setCustomTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  
  const [customTheme, setCustomTheme] = useState<ThemeName>('light')

  // Initialize theme from localStorage on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem(storageKey) as Theme
      if (storedTheme) {
        setTheme(storedTheme)
      }
    }
  }, [storageKey])

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      
      const handleChange = () => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(mediaQuery.matches ? "dark" : "light")
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  useEffect(() => {
    // Apply theme based on current mode
    const currentMode = theme === 'system' 
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light')
      : theme;
    
    // Apply custom theme colors based on mode
    if (currentMode === 'dark') {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  }, [theme, customTheme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, theme)
      }
      setTheme(theme)
    },
    customTheme,
    setCustomTheme: (theme: ThemeName) => {
      setCustomTheme(theme)
    },
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

// Theme selector component
export function ThemeSelector() {
  const { customTheme, setCustomTheme } = useTheme()
  
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Theme
      </label>
      <select
        value={customTheme}
        onChange={(e) => setCustomTheme(e.target.value as ThemeName)}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Select theme"
      >
        {Object.keys(themes).map((themeName) => (
          <option key={themeName} value={themeName}>
            {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
          </option>
        ))}
      </select>
    </div>
  )
}
