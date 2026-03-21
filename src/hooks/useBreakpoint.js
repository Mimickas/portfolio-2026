import { useEffect, useState } from "react"

function getBp() {
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
}

export function useBreakpoint() {
  // () => getBp() : évalué une seule fois au montage,
  // avec la vraie largeur — pas "desktop" par défaut
  const [bp, setBp] = useState(() => getBp())

  useEffect(() => {
    const upd = () => setBp(getBp())
    window.addEventListener("resize", upd)
    return () => window.removeEventListener("resize", upd)
  }, [])

  return bp
}