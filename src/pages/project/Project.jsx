import ListCardProject from "./components/ListCardProject"
import LoadingScreen   from "../../components/loading/LoadingScreen"
import "./Project.css"
import { useEffect, useState } from "react"
import ScrambleHover from "../../components/fancy/text/ScrambleHover"
import GridItem      from "../../components/GridItem"
import { useBreakpoint } from "../../hooks/useBreakpoint"
import { usePageReady }  from "../../hooks/usePageReady"
import { useReveal } from "../../context/RevealContext"
import { link } from "fontawesome"

function useGrid() {
  const compute = () => {
    const cell =
      parseInt(getComputedStyle(document.documentElement).getPropertyValue("--cell-size")) || 60
    return {
      cols:      Math.floor(window.innerWidth  / cell),
      rows:      Math.floor(window.innerHeight / cell),
      cell,
      landscape: window.innerWidth > window.innerHeight,
    }
  }
  const [g, setG] = useState(compute)
  useEffect(() => {
    setG(compute())
    const upd = () => setG(compute())
    window.addEventListener("resize", upd)
    return () => window.removeEventListener("resize", upd)
  }, [])
  return g
}

function getCardHeightPx() {
  const w  = window.innerWidth
  const h  = window.visualViewport?.height ?? window.innerHeight
  const vw = w / 100
  const vh = h / 100
  const cl = (min, val, max) => Math.min(Math.max(min, val), max)

  if (h <= 800) return cl(22, 28 * vh, 225)
  if (w <= 375) return cl(65, 20 * vh, 140)
  if (w <= 430) return cl(80, 28 * vh, 200)
  if (w <= 768) return cl(93, 28 * vh, 220)
  if (w <= 819) return cl(150, 35 * vh, 320)
  if (w <= 1024) return cl(200, 35 * vh, 380)
  if (w <= 1280) return cl(200, 35 * vh, 380)
  if (w <= 1440) return cl(200, 35 * vh, 380)
  return cl(150, 35 * vh, 380)
}

const LAYOUT = {
  name: {
    col: { mobileXs:1, mobileSm:1, mobileLg:1, tablet:1, tabletsM:1, tabletLg:1, laptopSm:1, laptopLg:1, desktop:1 },
    row: { mobileXs:2, mobileSm:2, mobileLg:2, tablet:2, tabletsM:2, tabletLg:2, laptopSm:2, laptopLg:2, desktop:2 },
    corner: 1,
  },
  title: {
    col: { mobileXs:6, mobileSm:6, mobileLg:7, tablet:8, tabletsM:7, tabletLg:8, laptopSm:8, laptopLg:8, desktop:8 },
    row: { mobileXs:2, mobileSm:2, mobileLg:2, tablet:2, tabletsM:2, tabletLg:2, laptopSm:2, laptopLg:2, desktop:2 },
    corner: 1,
  },
  services: {
    col: { mobileXs:1, mobileSm:1, mobileLg:1, tablet:1, tabletsM:13, tabletLg:15, laptopSm:18, laptopLg:20, desktop:21 },
    row: { mobileXs:4, mobileSm:5, mobileLg:5, tablet:4, tabletsM:2,  tabletLg:2,  laptopSm:2,  laptopLg:2,  desktop:2  },
    corner: 1,
  },
  carousel: {
    col: { mobileXs:1, mobileSm:1, mobileLg:1, tablet:1, tabletsM:1, tabletLg:1, laptopSm:1, laptopLg:1, desktop:1 },
    corner: 1,
  },
  workTitle: {
    col: { mobileXs:1, mobileSm:1, mobileLg:1, tablet:1, tabletsM:1, tabletLg:1, laptopSm:1, laptopLg:1, desktop:1 },
    corner:  3,
    offsetY: -12,
  },
  workType: {
    col: { mobileXs:1, mobileSm:1, mobileLg:1, tablet:1, tabletsM:1, tabletLg:1, laptopSm:12, laptopLg:13, desktop:14 },
    corner: 3,
  },
  workBase: {
    col: { mobileXs:1, mobileSm:1, mobileLg:1, tablet:8, tabletsM:7, tabletLg:7, laptopSm:17, laptopLg:19, desktop:20 },
    corner: 3,
  },
  cta: {
    col: { mobileXs:1, mobileSm:1, mobileLg:1, tablet:1, tabletsM:1, tabletLg:1, laptopSm:1, laptopLg:24, desktop:25 },
    corner: 3,
  },
}

const PROJECTS = [
  { id: 1, image: "/img/Capture.PNG", title: "E-Kiraro",   type: "DESIGN & DEVELOPEMENT", base: "BASED IN MADAGASCAR",link:"https://www.behance.net/gallery/246200527/A-modern-e-commerce-experience-for-a-footwear-brand" },
  { id: 2, image: "/img/pm.png",       title: "P. M' LAY",  type: "BRANDING & DESIGN", base: "BASED IN MADAGASCAR",  link:"https://www.behance.net/gallery/246200087/PIZZA-MLay?" },
  { id: 3, image: "/img/st.PNG",       title: "Project 3",  type: "WEB DESIGN",               base: "BASED IN MADAGASCAR",     link:"https://valentine-s-day-14.vercel.app/" },
  { id: 4, image: "/img/e-jery.PNG",       title: "Project 4",  type: "E-COMMERCE",             base: "BASED IN MADAGASCAR",     link:"https://www.figma.com/proto/N6vdOXti6YIqdY4aMUhJSY/Untitled?t=zVZKO6HJUwF2cUYM-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&node-id=76-113" },
]

const DESKTOP_ONLY = new Set([])

const OFFSETS = {
  mobileXs: { t: 5,  y: 4, b: 3, c: 2 },
  mobileSm:  { t: 5,  y: 4, b: 3, c: 1 },
  mobileLg:  { t: 6,  y: 5, b: 4, c: 2 },
  tablet:    { t: 4,  y: 3, b: 3, c: 1 },
  tabletsM:  { t: 5,  y: 4, b: 4, c: 2 },
  tabletLg:  { t: 5,  y: 4, b: 4, c: 2 },
  laptopSm:  { t: 4,  y: 3, b: 3, c: 1 },
  laptopLg:  { t: 1,  y: 1, b: 1, c: 1 },
  desktop:   { t: 1,  y: 1, b: 1, c: 1 },

  landscape_tablet:   { t: 1, y: 3, b: 2, c: 1 },
  landscape_tabletsM: { t: 1, y: 3, b: 2, c: 1 },
  landscape_tabletLg: { t: 3, y: 2, b: 2, c: 1 },
  landscape_laptopSm: { t: 3, y: 3, b: 3, c: 1 },
}

export default function Project() {
  const { revealed, setRevealed, direction, theme } = useReveal()

  const [autoBottom,   setAutoBottom]   = useState(false)
  const [autoType,     setAutoType]     = useState(false)
  const [autoBase,     setAutoBase]     = useState(false)
  const [autoCta,      setAutoCta]      = useState(false)
  const [autoName,     setAutoName]     = useState(false)
  const [autoTitle,    setAutoTitle]    = useState(false)
  const [autoServices, setAutoServices] = useState(false)
  
  const [nameProjectTitle, setNameProjectTitle] = useState("")
  const [baseProject,      setBaseProject]      = useState("")
  const [typeProject,      setTypeProject]      = useState("")
  const [paused,           setPaused]           = useState(false)
  const [hoveredId,        setHoveredId]        = useState(null)
  const [showLoader,       setShowLoader]       = useState(true)

  
  useEffect(() => {
    if (!revealed) {
      setShowLoader(true)
      setAutoBottom(false)
      setAutoType(false)
      setAutoBase(false)
      setAutoCta(false)
      setAutoName(false)
      setAutoTitle(false)
      setAutoServices(false)
    }
  }, [revealed])

 
  useEffect(() => {
    if (!revealed) return
    const t1 = setTimeout(() => setAutoBottom(true),    850)
    const t2 = setTimeout(() => setAutoType(true),      900)
    const t3 = setTimeout(() => setAutoBase(true),      950)
    const t4 = setTimeout(() => setAutoCta(true),      1000)
    const t5 = setTimeout(() => setAutoName(true),     1050)
    const t6 = setTimeout(() => setAutoTitle(true),    1100)
    const t7 = setTimeout(() => setAutoServices(true), 1150)
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4)
      clearTimeout(t5); clearTimeout(t6); clearTimeout(t7)
    }
  }, [revealed])

  const isReady = usePageReady(PROJECTS.map(p => p.image), 1500)

  const { cols, rows, cell, landscape } = useGrid()
  const bp                              = useBreakpoint()

  const cardProps = {
    setPaused, hoveredId, setHoveredId,
    nameProjectTitle, setNameProjectTitle,
    baseProject,      setBaseProject,
    typeProject,      setTypeProject,
  }

  const landscapeKey  = `landscape_${bp}`
  const isDesktopOnly = DESKTOP_ONLY.has(bp)

  const off = (!isDesktopOnly && landscape && OFFSETS[landscapeKey])
    ? OFFSETS[landscapeKey]
    : (OFFSETS[bp] ?? OFFSETS.desktop)

  const rawWorkTitle = rows - off.t
  const rowWorkTitle = Math.max(rawWorkTitle, 6)

  const cardHeightPx = getCardHeightPx()
  const carouselRows = Math.ceil(cardHeightPx / cell)
  const rowCarousel  = bp === "mobileXs"
    ? Math.max(2, rowWorkTitle - carouselRows)
    : Math.max(2, rowWorkTitle - 1 - carouselRows)

  const rowWorkType = rows - off.y
  const rowWorkBase = rows - off.b
  const rowCta      = rows - off.c

  const L = LAYOUT

  return (
    <>
      {revealed && (
        <div className="project-page">

          <GridItem {...L.name} className="page-enter">
            <h2 className="semi-title">
              <ScrambleHover text="TSIORY"     auto={autoName} hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
              <span className="muted">
                <br />
                <ScrambleHover text="alias "   auto={autoName} hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
              </span>
              <ScrambleHover text="PIKATSIORY" auto={autoName} hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
            </h2>
          </GridItem>

          <GridItem {...L.title} className="page-enter">
            <h2 className="semi-title">
              <ScrambleHover text="DESIGNER"    auto={autoTitle} hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
              <span className="muted">
                <ScrambleHover text=" & "       auto={autoTitle} hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
              </span>
              <br />
              <ScrambleHover text="ENGINEERING" auto={autoTitle} hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
            </h2>
          </GridItem>

          <GridItem {...L.services} className="page-enter">
            <h2 className="muted-titre-semi">
              <ScrambleHover text="SERVICES" auto={autoServices} hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
            </h2>
            <ul className="list-services">
              {["BRANDING", "UX / UI Design", "Web Development (React,..)", "eCommerce"].map(s => (
                <li key={s}>
                  <ScrambleHover text={s} auto={autoServices} hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
                </li>
              ))}
            </ul>
          </GridItem>

          <GridItem
            {...L.carousel}
            row={rowCarousel}
            style={{ width: "calc(100vw - 2 * var(--cell-size))", overflow: "hidden", zIndex: 2 }}
          >
            <div className="list-projects-wrapper">
              <div
                className="list-projects"
                style={{ animationPlayState: paused ? "paused" : "running" }}
              >
                {[...PROJECTS, ...PROJECTS].map((project, i) => (
                  <div key={i} className="card-reveal" style={{ "--i": i % PROJECTS.length }}>
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      <ListCardProject project={project} {...cardProps} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </GridItem>

          <GridItem {...L.workTitle} row={rowWorkTitle} className="page-enter-late">
            <ScrambleHover
              text={nameProjectTitle || "MY WORK"}
              auto={autoBottom} hover={false} scrambleSpeed={25} iterationsPerLetter={3}
              className="card-project-title"
            />
          </GridItem>

          <GridItem {...L.workType} row={rowWorkType} className="pinned-bottom info-work page-enter-late">
            <ScrambleHover
              text={typeProject || "DESIGN & ENGINEERING"}
              auto={autoType} hover={false} scrambleSpeed={6} iterationsPerLetter={2}
            />
          </GridItem>

          <GridItem {...L.workBase} row={rowWorkBase} className="pinned-bottom info-work page-enter-late">
            <ScrambleHover
              text={baseProject || "BASED IN MADAGASCAR"}
              auto={autoBase} hover={false} scrambleSpeed={10} iterationsPerLetter={2}
            />
          </GridItem>

          <GridItem {...L.cta} row={rowCta} className="pinned-bottom page-enter-late">
            <button className="btn">
              <ScrambleHover
                text="TELL ME ABOUT YOUR WORK"
                auto={autoCta} hover={false} scrambleSpeed={12} iterationsPerLetter={1}
              />
            </button>
          </GridItem>

        </div>
      )}

      {showLoader && (
        <LoadingScreen
          isLoading={!isReady}
          direction={direction}
          theme={theme}
          onReveal={() => setRevealed(true)}
          onDone={() => setShowLoader(false)}
        />
      )}
    </>
  )
}