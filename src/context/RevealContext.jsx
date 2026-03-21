import { createContext, useContext, useState, useCallback } from "react"

const RevealContext = createContext()

export function RevealProvider({ children }) {
  const [revealed,  setRevealed]  = useState(false)
  const [direction, setDirection] = useState("up")

  // Lit le thème sauvegardé — default dark
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("theme") ?? "dark"
  })

  // Sauvegarde à chaque changement
  const setTheme = (next) => {
    localStorage.setItem("theme", next)
    setThemeState(next)
  }

  const resetReveal = useCallback((dir = "up") => {
    setDirection(dir)
    setRevealed(false)
  }, [])

  return (
    <RevealContext.Provider value={{
      revealed, setRevealed,
      direction, resetReveal,
      theme, setTheme
    }}>
      {children}
    </RevealContext.Provider>
  )
}

export const useReveal = () => useContext(RevealContext)