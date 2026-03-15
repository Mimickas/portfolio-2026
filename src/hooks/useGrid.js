// src/hooks/useGrid.js
import { useCallback } from "react"

export function useGrid() {
  // Convertit N cellules en valeur CSS
  const cols = useCallback((n) => `calc(${n} * var(--cell-size))`, [])
  const rows = useCallback((n) => `calc(${n} * var(--cell-size))`, [])

  // Retourne un style positionné sur la grille
  const at = useCallback((col, row) => ({
    position: "absolute",
    left: `calc(${col} * var(--cell-size))`,
    top: `calc(${row} * var(--cell-size))`,
  }), [])

  return { cols, rows, at }
}