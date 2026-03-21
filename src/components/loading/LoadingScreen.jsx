import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import "./LoadingScreen.css"

export default function LoadingScreen({ isLoading, onDone, onReveal, direction = "up", theme = "dark" }) {
  const bgRef        = useRef(null)
  const part1Ref     = useRef(null)  // blanc haut
  const part2Ref     = useRef(null)  // cercle
  const part3Ref     = useRef(null)  // blanc bas
  const loopRef      = useRef(null)
  const entranceDone = useRef(false)
  const exitPending  = useRef(false)
  const onRevealRef  = useRef(onReveal)
  const onDoneRef    = useRef(onDone)
  const directionRef = useRef(direction)
  const folder = theme === "light" ? "/loadingLogo/noir" : "/loadingLogo/blanc"

  useEffect(() => { onRevealRef.current = onReveal }, [onReveal])
  useEffect(() => { onDoneRef.current   = onDone   }, [onDone])

  const triggerExit = () => {
    if (loopRef.current) loopRef.current.kill()
    if (onRevealRef.current) onRevealRef.current()

    const parts = [part1Ref.current, part2Ref.current, part3Ref.current].filter(Boolean)
    const bg    = bgRef.current
    if (!bg) return

    const exitY = directionRef.current === "down" ? "110vh" : "-110vh"

    const tl = gsap.timeline({
      onComplete: () => { if (onDoneRef.current) onDoneRef.current() }
    })

    tl.to(parts, { y: exitY, opacity: 0, duration: 0.55, ease: "power3.in", stagger: 0.1 })
    tl.to(bg, { y: exitY, duration: 0.8, ease: "power4.inOut" }, "-=0.35")
  }

  useEffect(() => {
    const bg = bgRef.current
    if (!bg) return

    const enterFrom  = directionRef.current === "down" ? "-110vh" : "110vh"
    const partFrom   = directionRef.current === "down" ? -120 : 120

    const tl = gsap.timeline({
      onComplete: () => {
        entranceDone.current = true
        // Loop — les 3 parties bougent ensemble
        loopRef.current = gsap.to(
          [part1Ref.current, part2Ref.current, part3Ref.current].filter(Boolean),
          { y: -12, duration: 0.55, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.15 }
        )
        if (exitPending.current) triggerExit()
      },
    })

    tl.fromTo(bg, { y: enterFrom }, { y: "0vh", duration: 0.45, ease: "power4.inOut" })
    // Partie 1 — blanc haut
    tl.fromTo(part1Ref.current,
      { y: partFrom, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      "-=0.2"
    )
    // Partie 2 — cercle
    tl.fromTo(part2Ref.current,
      { y: partFrom, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      "-=0.3"
    )
    // Partie 3 — blanc bas
    tl.fromTo(part3Ref.current,
      { y: partFrom, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      "-=0.3"
    )
  }, [])

  useEffect(() => {
    if (!isLoading) {
      if (entranceDone.current) {
        triggerExit()
      } else {
        exitPending.current = true
      }
    }
  }, [isLoading])

  return (
    <div ref={bgRef} className="loading-background">
      <div className="logo-parts-container">
        <div ref={part1Ref} className="logo-part">
          <img src={`${folder}/1.png`} alt="" />
        </div>
        <div ref={part2Ref} className="logo-part">
          <img src={`${folder}/2.png`} alt="" />
        </div>
        <div ref={part3Ref} className="logo-part">
          <img src={`${folder}/3.png`} alt="" />
        </div>
      </div>
    </div>
  )
}