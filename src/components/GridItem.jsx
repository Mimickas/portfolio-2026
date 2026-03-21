import { useEffect, useState } from "react"

function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    if (typeof window === "undefined") return "desktop"
    const w = window.innerWidth
    if (w <= 375)  return "mobileXs"
    if (w <= 398)  return "mobileSm"
    if (w <= 430)  return "mobileLg"
    if (w <= 768)  return "tablet"
    if (w <= 820)  return "tabletsM"
    if (w <= 1024) return "tabletLg"
    if (w <= 1280) return "laptopSm"
    if (w <= 1440) return "laptopLg"
    return "desktop"
  })

  useEffect(() => {
    function check() {
      const w = window.innerWidth
      if (w <= 375)       setBp("mobileXs")
      else if (w <= 398)  setBp("mobileSm")
      else if (w <= 430)  setBp("mobileLg")
      else if (w <= 768)  setBp("tablet")
      else if (w <= 820)  setBp("tabletsM")
      else if (w <= 1024) setBp("tabletLg")
      else if (w <= 1280) setBp("laptopSm")
      else if (w <= 1440) setBp("laptopLg")
      else                setBp("desktop")
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return bp
}

function family(bp) {
  if (bp === "mobileXs" || bp === "mobileSm" || bp === "mobileLg") return "mobile"
  if (bp === "tablet"   || bp === "tabletsM" || bp === "tabletLg") return "tablet"
  if (bp === "laptopSm" || bp === "laptopLg")                      return "laptop"
  return "desktop"
}

function resolve(prop, bp) {
  if (prop == null)             return prop
  if (typeof prop === "number") return prop
  if (typeof prop === "string") return prop
  return (
    prop[bp]          ??
    prop[family(bp)]  ??
    prop.tablet       ??
    prop.desktop      ??
    prop.default
  )
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

  const c    = Math.min(4, Math.max(1, resolve(corner,  bp) ?? 1))
  const col_ = resolve(col,     bp)
  const row_ = resolve(row,     bp)
  const cs   = resolve(colSpan, bp)
  const rs   = resolve(rowSpan, bp)
  const ox   = resolve(offsetX, bp)
  const oy   = resolve(offsetY, bp)

  const cell = "var(--cell-size)"
  // 100dvh partout — suit la vraie hauteur visible sur tous les devices
  // dvh = dynamic viewport height = exclut la barre d'adresse mobile
  const vh   = "100dvh"
  const css  = { position: "fixed" }

  function toOffset(o) {
    if (!o || o === 0)         return null
    if (typeof o === "string") return o
    return `${o}px`
  }

  const ox_ = toOffset(ox)
  const oy_ = toOffset(oy)

  if (c === 1 || c === 3) {
    css.left = ox_
      ? `calc(${col_} * ${cell} + ${ox_})`
      : `calc(${col_} * ${cell})`
  } else {
    css.right = ox_
      ? `calc(100vw - ${col_ + 1} * ${cell} + ${ox_})`
      : `calc(100vw - ${col_ + 1} * ${cell})`
  }

  if (c === 1 || c === 2) {
    css.top = oy_
      ? `calc(${row_} * ${cell} + ${oy_})`
      : `calc(${row_} * ${cell})`
  } else {
    css.bottom = oy_
      ? `calc(${vh} - ${row_ + 1} * ${cell} + ${oy_})`
      : `calc(${vh} - ${row_ + 1} * ${cell})`
  }

  if (cs != null) css.width  = `calc(${cs} * ${cell})`
  if (rs != null) css.height = `calc(${rs} * ${cell})`

  return (
    <div className={className} style={{ ...css, ...style }} {...props}>
      {children}
    </div>
  )
}