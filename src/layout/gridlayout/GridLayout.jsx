import { useEffect, useState, useRef } from "react"
import "./GridLayout.css"

export default function GridLayout() {
  const [grid, setGrid]         = useState({ rows: 0, cols: 0 })
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const cellSizeRef = useRef(60)

  useEffect(() => {
    function calculateGrid() {
      const rootStyles = getComputedStyle(document.documentElement)
      const cols       = parseInt(rootStyles.getPropertyValue("--grid-cols")) || 31
      const cellSize   = window.innerWidth / cols
      cellSizeRef.current = cellSize

      const viewH = window.visualViewport?.height ?? window.innerHeight
      const rows  = Math.ceil(viewH / cellSize)

      document.documentElement.style.setProperty("--cell-size", `${cellSize}px`)
      document.documentElement.style.setProperty("--grid-rows", `${rows}`)

      setGrid({ rows, cols })
    }

    calculateGrid()
    window.addEventListener("resize", calculateGrid)
    window.visualViewport?.addEventListener("resize", calculateGrid)

    return () => {
      window.removeEventListener("resize", calculateGrid)
      window.visualViewport?.removeEventListener("resize", calculateGrid)
    }
  }, [])

  // Détecte la cellule via mousemove sur le document
  useEffect(() => {
    const onMove = (e) => {
      const cell = cellSizeRef.current
      const col  = Math.floor(e.clientX / cell)
      const row  = Math.floor(e.clientY / cell)
      setHoveredIndex(row * grid.cols + col)
    }
    const onLeave = () => setHoveredIndex(null)

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)
    return () => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [grid.cols])

  const cells = Array.from({ length: grid.rows * grid.cols })

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${grid.cols}, var(--cell-size))`,
        gridAutoRows: `var(--cell-size)`,
      }}
    >
      {cells.map((_, i) => (
        <div
          key={i}
          className="cell"
          style={
            hoveredIndex === i
              ? { background: "var(--grid-hover)", transition: "background 0.00001s" }
              : undefined
          }
        />
      ))}
    </div>
  )
}