import React, { useEffect, useState } from "react"
import { FaPhoneAlt, FaEnvelope, FaBars, FaTimes } from "react-icons/fa"
import ScrambleHover from "../fancy/text/ScrambleHover"
import GridItem from "../GridItem"
import { useBreakpoint } from "../../hooks/useBreakpoint"
import { useLocation, useNavigate } from "react-router-dom"
import "./Header.css"
import { useReveal } from "../../context/RevealContext"

function useGrid() {
  const compute = () => {
    const cell =
      parseInt(getComputedStyle(document.documentElement).getPropertyValue("--cell-size")) || 60
    return {
      cols: Math.floor(window.innerWidth / cell),
      rows: Math.floor(window.innerHeight / cell),
      cell,
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

const HEADER_OFFSETS = {
  mobileXs: { logoRow: 0, logoCol: 1, burgerRow: 0, burgerColsOffset: 2 },
  mobileSm:  { logoRow: 0, logoCol: 1, burgerRow: 0, burgerColsOffset: 2 },
  mobileLg:  { logoRow: 0, logoCol: 1, burgerRow: 0, burgerColsOffset: 2 },
  tablet:    { logoRow: 0, logoCol: 1, burgerRow: 0, burgerColsOffset: 2 },
  tabletsM:  { logoRow: 0, logoCol: 1, burgerRow: 0, burgerColsOffset: 2 },
  tabletLg:  { logoRow: 0, logoCol: 1, burgerRow: 0, burgerColsOffset: 2 },
  laptopSm:  { logoRow: 0, logoCol: 1, burgerRow: 0, burgerColsOffset: 2 },
  laptopLg:  { logoRow: 0, logoCol: 1, burgerRow: 0, burgerColsOffset: 2 },
  desktop:   { logoRow: 0, logoCol: 1, burgerRow: 0, burgerColsOffset: 2 },
}

const DESKTOP_BPS = new Set(["desktop"])

const NAV_LINKS = [
  { label: "P R O J E C T S", path: "/" },
  { label: "A B O U T",       path: "/about" },
  { label: "C O N T A C T",   path: "/contact" },
]

export default function Header() {
  const bp        = useBreakpoint()
  const isDesktop = DESKTOP_BPS.has(bp)
  const { cols }  = useGrid()
  const location  = useLocation()
  const navigate  = useNavigate()

  const [menuOpen,   setMenuOpen]   = useState(false)
  const [activeLink, setActiveLink] = useState(null)
  const { revealed, resetReveal, theme, setTheme } = useReveal()

  const [autoNav1,  setAutoNav1]  = useState(false)
  const [autoNav2,  setAutoNav2]  = useState(false)
  const [autoNav3,  setAutoNav3]  = useState(false)
  const [autoPhone, setAutoPhone] = useState(false)
  const [autoEmail, setAutoEmail] = useState(false)
  const [autoTheme, setAutoTheme] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "")
  }, [theme])

  useEffect(() => {
    const link = document.querySelector("link[rel='icon']")
    if (link) link.href = theme === "dark" ? "/faviconeblanc.png" : "/favicon-noir.png"
  }, [theme])

  useEffect(() => {
    const titles = {
      "/":        "Pikatsiory — Projects",
      "/about":   "Pikatsiory — About",
      "/contact": "Pikatsiory — Contact",
    }
    document.title = titles[location.pathname] ?? "Pikatsiory"
  }, [location.pathname])

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark"
    if (document.startViewTransition) {
      document.startViewTransition(() => setTheme(next))
    } else {
      setTheme(next)
    }
  }

  const themeLabel = theme === "dark" ? "L I G H T" : "D A R K"

  // ── Navigation avec direction correcte AVANT le montage du nouveau composant ──
  const goTo = (path) => {
    const dir = (path === "/" && location.pathname !== "/") ? "down" : "up"
    resetReveal(dir)
    navigate(path)
  }

  useEffect(() => { if (isDesktop) setMenuOpen(false) }, [isDesktop])

  useEffect(() => {
    if (!revealed) return
    const t = setTimeout(() => {
      setAutoNav1(true)
      setAutoNav2(true)
      setAutoNav3(true)
      setAutoPhone(true)
      setAutoEmail(true)
      setAutoTheme(true)
    }, 950)
    return () => clearTimeout(t)
  }, [revealed])

  const handleClose = () => {
    setActiveLink(null)
    setMenuOpen(false)
  }

  if (!revealed) return null

  const off             = HEADER_OFFSETS[bp] ?? HEADER_OFFSETS.desktop
  const burgerCol       = cols - off.burgerColsOffset
  const themeColMobile  = burgerCol - 2
  const themeColDesktop = cols - 2
  const autoStates      = [autoNav1, autoNav2, autoNav3]

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/"
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <header className="header-row">

        {/* ── LOGO ── */}
        <GridItem
          col={off.logoCol} row={off.logoRow} corner={3}
          className="header-logo"
          style={{ zIndex: 1002 }}
        >
          <img
            src={theme === "light" ? "/favicon-noir.png" : "/faviconeblanc.png"}
            alt="Logo"
            onClick={() => goTo("/")}
            style={{ cursor: "pointer" }}
          />
        </GridItem>

        {/* ── NAV — desktop ── */}
        {isDesktop && NAV_LINKS.map(({ label, path }, idx) => (
          <GridItem
            key={path}
            col={[8, 10, 12][idx]}
            row={0}
            corner={3}
            className={`nav-item ${isActive(path) ? "nav-item--active" : ""}`}
            onClick={() => goTo(path)}
          >
            <span className="nav-item-inner">
              <ScrambleHover
                text={label}
                auto={autoStates[idx]}
                hover
                scrambleSpeed={25}
                iterationsPerLetter={3}
                className="cursor-pointer"
              />
              <span className="nav-underline" />
            </span>
          </GridItem>
        ))}

        {/* ── CONTACT — desktop ── */}
        {isDesktop && (
          <>
            <GridItem col={21} row={0} corner={3} className="contact-item">
              <FaPhoneAlt className="contact-icon" />
              <ScrambleHover text="+261 33 61 314 00" auto={autoPhone} hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
            </GridItem>
            <GridItem col={24} row={0} corner={3} className="contact-item">
              <FaEnvelope className="contact-icon" />
              <ScrambleHover text="tsiorymickas9@gmail.com" auto={autoEmail} hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
            </GridItem>
          </>
        )}

        {/* ── THEME — desktop ── */}
        {isDesktop && (
          <GridItem col={themeColDesktop} row={0} corner={3} className="theme-switcher" onClick={toggleTheme}>
            <span className="theme-switcher-inner">
              <ScrambleHover
                key={themeLabel}
                text={themeLabel}
                auto={autoTheme}
                hover
                scrambleSpeed={20}
                iterationsPerLetter={2}
                className="cursor-pointer"
              />
              <span className="theme-underline" />
            </span>
          </GridItem>
        )}

        {/* ── THEME — mobile ── */}
        {isDesktop && (
          <GridItem col={themeColDesktop} row={0} corner={3} className="theme-switcher" onClick={toggleTheme}>
            <span className="theme-switcher-inner">
              <ScrambleHover
                key={themeLabel}
                text={themeLabel}
                auto={autoTheme}
                hover
                scrambleSpeed={20}
                iterationsPerLetter={2}
                className="cursor-pointer"
              />
              <span className="theme-underline" />
            </span>
          </GridItem>
        )}

        {/* ── BURGER ── */}
        {!isDesktop && (
          <GridItem col={burgerCol} row={0} corner={3} style={{ zIndex: 1001 }}>
            <button
              className="burger-btn"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <span className={`burger-icon-wrap ${menuOpen ? "is-open" : ""}`}>
                <FaBars  className="icon-bars"  />
                <FaTimes className="icon-times" />
              </span>
            </button>
          </GridItem>
        )}

        {/* ── MENU OVERLAY ── */}
        {!isDesktop && (
          <nav
            className={`menu-overlay ${menuOpen ? "menu-overlay--open" : ""}`}
            aria-label="Navigation mobile"
            aria-hidden={!menuOpen}
          >
            <div className="menu-center">
              <ul className="menu-nav-list">
                {NAV_LINKS.map(({ label, path }, idx) => (
                  <li
                    key={path}
                    className={`menu-nav-item ${activeLink === path ? "is-hovered" : ""} ${isActive(path) ? "menu-nav-item--active" : ""}`}
                    onMouseEnter={() => setActiveLink(path)}
                    onMouseLeave={() => setActiveLink(null)}
                    onClick={() => { goTo(path); handleClose() }}
                  >
                    <span className="menu-nav-text">
                      <ScrambleHover
                        key={label + menuOpen}
                        text={label}
                        auto={[autoNav1, autoNav2, autoNav3][idx]}
                        hover={false}
                        scrambleSpeed={12}
                        iterationsPerLetter={2}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="menu-copyright">© Pikatsiory 2026</div>

            <div className="menu-bottom-contact">
              <div className="menu-contact-item">
                <FaPhoneAlt className="contact-icon" />
                <ScrambleHover text="+261 33 61 314 00" auto hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
              </div>
              <div className="menu-contact-item">
                <FaEnvelope className="contact-icon" />
                <ScrambleHover text="tsiorymickas9@gmail.com" auto hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
              </div>
            </div>

            <div className="menu-theme-btn" onClick={toggleTheme}>
              <ScrambleHover
                key={themeLabel + "menu"}
                text={themeLabel}
                auto={autoTheme}
                hover={false}
                scrambleSpeed={20}
                iterationsPerLetter={2}
              />
              <span className="theme-underline" />
            </div>
          </nav>
        )}

      </header>
    </>
  )
}