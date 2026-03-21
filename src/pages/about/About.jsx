import "./About.css"
import { useEffect, useState, useRef } from "react"
import ScrambleHover from "../../components/fancy/text/ScrambleHover"
import GridItem from "../../components/GridItem"
import { useBreakpoint } from "../../hooks/useBreakpoint"
import { useReveal } from "../../context/RevealContext"
import { usePageReady } from "../../hooks/usePageReady"
import LoadingScreen from "../../components/loading/LoadingScreen"
import { gsap } from "gsap"

function useGrid() {
  const compute = () => {
    const cell =
      parseInt(getComputedStyle(document.documentElement).getPropertyValue("--cell-size")) || 60
    const viewH = window.visualViewport?.height ?? window.innerHeight
    return {
      cols:      Math.floor(window.innerWidth / cell),
      rows:      Math.floor(viewH / cell),
      cell,
      landscape: window.innerWidth > viewH,
    }
  }
  const [g, setG] = useState(compute)
  useEffect(() => {
    setG(compute())
    const upd = () => setG(compute())
    window.addEventListener("resize", upd)
    window.visualViewport?.addEventListener("resize", upd)
    return () => {
      window.removeEventListener("resize", upd)
      window.visualViewport?.removeEventListener("resize", upd)
    }
  }, [])
  return g
}

const DESKTOP_BPS = new Set(["laptopSm", "laptopLg", "desktop"])
const TABLET_BPS  = new Set(["tabletsM", "tabletLg"])

const SPECS = [
  { label: "SPECIALTY",  value: "Designing & Developing" },
  { label: "BASED IN",   value: "Madagascar" },
  { label: "FOCUS",      value: "80% on screen" },
]

export default function About() {
    const bp                                          = useBreakpoint()
    const { rows, cols, cell }                        = useGrid()
    const { revealed, setRevealed, direction, theme } = useReveal()
    const [showLoader, setShowLoader]                 = useState(true)
    const isReady                                     = usePageReady(["/img/profile.jpg"], 800)

    const [autoTitle,  setAutoTitle]  = useState(false)
    const [autoPhoto,  setAutoPhoto]  = useState(false)
    const [autoBio,    setAutoBio]    = useState(false)
    const [autoSpec0,  setAutoSpec0]  = useState(false)
    const [autoSpec1,  setAutoSpec1]  = useState(false)
    const [autoSpec2,  setAutoSpec2]  = useState(false)

    const titleRef = useRef(null)
    const photoRef = useRef(null)
    const bioRef   = useRef(null)

    const isDesktop = DESKTOP_BPS.has(bp)
    const isTablet  = TABLET_BPS.has(bp)
    const isMobile  = !isDesktop && !isTablet

    useEffect(() => {
        if (!revealed) {
        setShowLoader(true)
        setAutoTitle(false); setAutoPhoto(false); setAutoBio(false)
        setAutoSpec0(false); setAutoSpec1(false); setAutoSpec2(false)
        }
    }, [revealed])

    useEffect(() => {
        if (!revealed) return
        const t1 = setTimeout(() => setAutoTitle(true),  300)
        const t2 = setTimeout(() => setAutoPhoto(true),  500)
        const t3 = setTimeout(() => setAutoBio(true),    700)
        const t4 = setTimeout(() => setAutoSpec0(true),  900)
        const t5 = setTimeout(() => setAutoSpec1(true),  1050)
        const t6 = setTimeout(() => setAutoSpec2(true),  1200)
        return () => {
        clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
        clearTimeout(t4); clearTimeout(t5); clearTimeout(t6)
        }
    }, [revealed])

    useEffect(() => {
        if (!autoTitle || !titleRef.current) return
        gsap.fromTo(titleRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
        )
    }, [autoTitle])

    useEffect(() => {
        if (!autoPhoto || !photoRef.current) return
        gsap.fromTo(photoRef.current,
        { opacity: 0, scale: 0.97, filter: "blur(8px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out" }
        )
    }, [autoPhoto])

    useEffect(() => {
        if (!autoBio || !bioRef.current) return
        const lines = bioRef.current.querySelectorAll(".bio-line")
        gsap.fromTo(lines,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.12 }
        )
    }, [autoBio])

    const titleCol  = { mobileXs:1, mobileSm:1, mobileLg:1, tablet:1, tabletsM:1, tabletLg:1, laptopSm:1, laptopLg:1, desktop:1 }
    const titleRow  = { mobileXs:2, mobileSm:2, mobileLg:2, tablet:2, tabletsM:2, tabletLg:2, laptopSm:3, laptopLg:3, desktop:3 }

    const photoCol  = isDesktop
        ? { mobileXs:1, mobileSm:1, mobileLg:1, tablet:1, tabletsM:1, tabletLg:1, laptopSm:14, laptopLg:16, desktop:18 }
        : { mobileXs:1, mobileSm:1, mobileLg:1, tablet:1, tabletsM:1, tabletLg:1, laptopSm:1,  laptopLg:1,  desktop:1 }
    const photoRow  = isDesktop ? 3 : 5

    const bioCol    = { mobileXs:1, mobileSm:1, mobileLg:1, tablet:1, tabletsM:1, tabletLg:1, laptopSm:1, laptopLg:1, desktop:1 }
    const bioRow = isMobile || isTablet ? rows - 3 : rows - 1

  const specBaseCol  = isDesktop
    ? (bp === "laptopSm" ? 14 : bp === "laptopLg" ? 16 : 18)
    : 1
  const specRightCol = isDesktop ? specBaseCol + 8 : cols - 2

  return (
    <>
      {showLoader && (
        <LoadingScreen
          isLoading={!isReady}
          direction={direction}
          theme={theme}
          onReveal={() => setRevealed(true)}
          onDone={() => setShowLoader(false)}
        />
      )}

      {revealed && (
        <div className="about-page">

          <GridItem col={titleCol} row={titleRow} corner={1}>
            <div ref={titleRef} style={{ opacity: 0 }}>
              <h1 className="about-big-title">
                <ScrambleHover text="ABOUT" auto={autoTitle} hover={false} scrambleSpeed={20} iterationsPerLetter={3} />
              </h1>
            </div>
          </GridItem>

          <GridItem col={photoCol} row={photoRow} corner={1}>
            <div ref={photoRef} style={{ opacity: 0 }} className="about-photo-wrapper">
              <img
                src="/img/ts.jpg"
                alt="Tsiory Mickas"
                className="about-photo"
              />
            </div>
          </GridItem>

          
            <GridItem col={bioCol} row={bioRow} corner={3}>
                <div className="about-bio">

                    <p className="about-bio-main">
                        <ScrambleHover text="I'm Tsiory Mickas as PIKATSIORY," auto={autoBio} hover={false} scrambleSpeed={20} iterationsPerLetter={2} />
                    
                        <ScrambleHover text="Designer & Engineer —" auto={autoBio} hover={false} scrambleSpeed={20} iterationsPerLetter={2} />
                    
                        <ScrambleHover text="giving the best possible to every client." auto={autoBio} hover={false} scrambleSpeed={20} iterationsPerLetter={2} />
                    </p>
                    <p className="about-bio-main">
                        <ScrambleHover text="Based in Madagascar. Passionate about technology," auto={autoSpec0} hover={false} scrambleSpeed={15} iterationsPerLetter={1} />
                        
                        <ScrambleHover text="I spend 80% of my time on screen." auto={autoSpec0} hover={false} scrambleSpeed={15} iterationsPerLetter={1} />
                    </p>
                    <p className="about-bio-main">
                        <ScrambleHover text="Specialising in designing & developing" auto={autoSpec1} hover={false} scrambleSpeed={15} iterationsPerLetter={1} />
                    
                        <ScrambleHover text=" experiences that stand out." auto={autoSpec1} hover={false} scrambleSpeed={15} iterationsPerLetter={1} />
                    </p>
                </div>
            </GridItem>
            

   
            <GridItem col={specBaseCol} row={isMobile || isTablet ? rows - 2 : rows - 1} corner={1}>
                <button className="btn about-cv-btn">
                <a href="/cv.pdf" download >
                    <ScrambleHover
                        text="DOWNLOAD MY CV"
                        auto={autoSpec0}
                        hover={false}
                        scrambleSpeed={15}
                        iterationsPerLetter={2}
                    />
                </a>
                </button>
            </GridItem>
        </div>
      )}
    </>
  )
}