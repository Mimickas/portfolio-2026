import { useEffect, useState } from "react"

function useBreakpoint() {
  const [bp, setBp] = useState("desktop")
  useEffect(() => {
    function check() {
      const w = window.innerWidth
      if (w <= 428)      setBp("mobile")
      else if (w <= 768) setBp("tablet")
      else               setBp("desktop")
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return bp
}

// Résout une prop responsive : peut être un nombre ou { desktop, tablet, mobile }
function resolve(prop, bp) {
  if (prop == null)              return prop
  if (typeof prop === "number")  return prop
  if (typeof prop === "string")  return prop
  // objet responsive
  if (bp === "mobile")  return prop.mobile  ?? prop.tablet  ?? prop.desktop ?? prop.default
  if (bp === "tablet")  return prop.tablet  ?? prop.desktop ?? prop.default
  return                       prop.desktop ?? prop.default ?? prop
}

export default function GridItem({
  col     = 1,
  row     = 0,
  corner  = 1,
  colSpan = null,
  rowSpan = null,
  offsetX = 0,
  offsetY = 0,
  style   = {},
  className,
  children,
  ...props
}) {
  const bp = useBreakpoint()

  // Résout toutes les props responsives
  const c   = Math.min(4, Math.max(1, resolve(corner,  bp) ?? 1))
  const col_ = resolve(col,     bp)
  const row_ = resolve(row,     bp)
  const cs   = resolve(colSpan, bp)
  const rs   = resolve(rowSpan, bp)
  const ox   = resolve(offsetX, bp)
  const oy   = resolve(offsetY, bp)

  const cell = "var(--cell-size)"
  const css  = { position: "fixed" }

  function toOffset(o) {
    if (!o || o === 0) return null
    if (typeof o === "string") return o          // calc() ou var() passé direct
    return `${o}px`
  }

  const ox_ = toOffset(ox)
  const oy_ = toOffset(oy)

  // ── Axe X ──
  if (c === 1 || c === 3) {
    css.left = ox_
      ? `calc(${col_} * ${cell} + ${ox_})`
      : `calc(${col_} * ${cell})`
  } else {
    css.right = ox_
      ? `calc(100vw - ${col_ + 1} * ${cell} + ${ox_})`
      : `calc(100vw - ${col_ + 1} * ${cell})`
  }

  // ── Axe Y ──
  if (c === 1 || c === 2) {
    css.top = oy_
      ? `calc(${row_} * ${cell} + ${oy_})`
      : `calc(${row_} * ${cell})`
  } else {
    css.bottom = oy_
      ? `calc(100vh - ${row_ + 1} * ${cell} + ${oy_})`
      : `calc(100vh - ${row_ + 1} * ${cell})`
  }

  if (cs != null) css.width  = `calc(${cs} * ${cell})`
  if (rs != null) css.height = `calc(${rs} * ${cell})`

  return (
    <div className={className} style={{ ...css, ...style }} {...props}>
      {children}
    </div>
  )
}