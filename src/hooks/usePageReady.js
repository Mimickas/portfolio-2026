import { useEffect, useState } from "react"

/**
 * usePageReady — attend que les ressources soient chargées
 * @param {string[]} imageUrls — images à précharger
 * @param {number}   minDelay  — durée minimale du loader en ms (défaut 1200)
 */
export function usePageReady(imageUrls = [], minDelay = 1200) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    const preloadImages = urls =>
      Promise.all(
        urls.map(
          url =>
            new Promise(res => {
              const img = new Image()
              img.src     = url
              img.onload  = res
              img.onerror = res
            })
        )
      )

    const start = Date.now()

    Promise.all([
      document.fonts.ready,
      preloadImages(imageUrls),
    ]).then(() => {
      if (cancelled) return
      // Respecte le délai minimum pour que le loader ne flash pas
      const elapsed   = Date.now() - start
      const remaining = Math.max(0, minDelay - elapsed)
      setTimeout(() => {
        if (!cancelled) setIsReady(true)
      }, remaining)
    })

    return () => { cancelled = true }
  }, [])

  return isReady
}