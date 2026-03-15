import { useEffect, useState } from "react"
import "./GridLayout.css"

function GridLayout() {
 
  const defaultCellSize = 60

  const [grid, setGrid] = useState({ rows: 0, cols: 0 })

  useEffect(() => {
    function calculateGrid() {

      const rootStyles = getComputedStyle(document.documentElement)
      const cellSize = parseInt(rootStyles.getPropertyValue("--cell-size")) || defaultCellSize

      const cols = Math.ceil(window.innerWidth / cellSize)
      const rows = Math.ceil(window.innerHeight / cellSize)
      setGrid({ rows, cols })
    }

    calculateGrid()
    window.addEventListener("resize", calculateGrid)
    return () => window.removeEventListener("resize", calculateGrid)
  }, [])

  const totalCells = grid.rows * grid.cols
  const cells = Array.from({ length: totalCells })

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${grid.cols}, var(--cell-size))`,
        gridAutoRows: `var(--cell-size)`,
      }}
    >
      {cells.map((_, i) => (
        <div key={i} className="cell" />
      ))}
    </div>
  )
}

export default GridLayout