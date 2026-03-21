import { useEffect, useState } from "react"

export function useGridSize() {
  const [size, setSize] = useState({ cols: 30, rows: 15 })

  useEffect(() => {
    function update() {
      const style    = getComputedStyle(document.documentElement)
      const cols     = parseInt(style.getPropertyValue("--grid-cols")) || 30
      const cellSize = parseFloat(style.getPropertyValue("--cell-size")) || (window.innerWidth / cols)
      const rows     = Math.ceil(window.innerHeight / cellSize)
      setSize({ cols, rows })
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return size
}