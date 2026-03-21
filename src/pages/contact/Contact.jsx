import "./Contact.css"
import { useEffect, useState, useRef } from "react"
import ScrambleHover from "../../components/fancy/text/ScrambleHover"
import GridItem from "../../components/GridItem"
import { useBreakpoint } from "../../hooks/useBreakpoint"
import { useReveal } from "../../context/RevealContext"
import { usePageReady } from "../../hooks/usePageReady"
import LoadingScreen from "../../components/loading/LoadingScreen"
import { gsap } from "gsap"
import emailjs from "@emailjs/browser"
import Cal, { getCalApi } from "@calcom/embed-react"
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

const LAYOUT = {
  title: {
    col: { mobileXs:1, mobileSm:1, mobileLg:1, tablet:1, tabletsM:1, tabletLg:1, laptopSm:1, laptopLg:1, desktop:1 },
    row: { mobileXs:2, mobileSm:2, mobileLg:2, tablet:2, tabletsM:2, tabletLg:2, laptopSm:3, laptopLg:3, desktop:3 },
    corner: 1,
  },
}

const SOCIALS = [
  { label: "Email",     handle: "tsiorymickas9@gmail.com", href: "mailto:tsiorymickas9@gmail.com" },
  { label: "LinkedIn",  handle: "/in/tsiory-rndr",         href: "https://www.linkedin.com/in/tsiory-rndr/?skipRedirect=true" },
  { label: "Instagram", handle: "/pikatsiory",              href: "https://www.instagram.com/pikatsiory/" },
  { label: "Facebook",  handle: "/babyu.644189",            href: "https://www.facebook.com/babyu.644189/" },
]

emailjs.init("CDtoOa4GSlxxVCxy2")

export default function Contact() {
    const bp                                          = useBreakpoint()
    const { rows, cols, cell }                        = useGrid()
    const { revealed, setRevealed, direction, theme } = useReveal()
    const [showLoader,  setShowLoader]                = useState(true)
    const isReady                                     = usePageReady([], 800)

    const [activeTab,   setActiveTab]   = useState("quote")
    const [copied,      setCopied]      = useState(false)
    const [autoTitle,   setAutoTitle]   = useState(false)
    const [autoForm,    setAutoForm]    = useState(false)
    const [autoTagline, setAutoTagline] = useState(false)
    const [autoSocial0, setAutoSocial0] = useState(false)
    const [autoSocial1, setAutoSocial1] = useState(false)
    const [autoSocial2, setAutoSocial2] = useState(false)
    const [autoSocial3, setAutoSocial3] = useState(false)

    const autoSocials = [autoSocial0, autoSocial1, autoSocial2, autoSocial3]
    const [formValues, setFormValues] = useState({ name: "", email: "", message: "" })

    const titleRef = useRef(null)
    const formRef  = useRef(null)
    const boxRef   = useRef(null)

    const isDesktop = DESKTOP_BPS.has(bp)
    const isTablet  = TABLET_BPS.has(bp)
    const isMobile  = !isDesktop && !isTablet

    useEffect(() => {
        if (!revealed) {
        setShowLoader(true)
        setAutoTitle(false); setAutoForm(false); setAutoTagline(false)
        setAutoSocial0(false); setAutoSocial1(false)
        setAutoSocial2(false); setAutoSocial3(false)
        }
    }, [revealed])

    useEffect(() => {
        if (!revealed) return
        const t1 = setTimeout(() => setAutoTitle(true),   300)
        const t2 = setTimeout(() => setAutoForm(true),    600)
        const t3 = setTimeout(() => setAutoTagline(true), 900)
        const t4 = setTimeout(() => setAutoSocial0(true), 1000)
        const t5 = setTimeout(() => setAutoSocial1(true), 1100)
        const t6 = setTimeout(() => setAutoSocial2(true), 1200)
        const t7 = setTimeout(() => setAutoSocial3(true), 1300)
        return () => {
        clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4)
        clearTimeout(t5); clearTimeout(t6); clearTimeout(t7)
        }
    }, [revealed])

    useEffect(() => {
        if (activeTab !== "quote" || !autoForm) return
        const t = setTimeout(() => {
        if (!formRef.current) return
        const fields = formRef.current.querySelectorAll(".contact-field")
        gsap.fromTo(fields,
            { opacity: 0, y: 20, filter: "blur(6px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power3.out", stagger: 0.1 }
        )
        }, 50)
        return () => clearTimeout(t)
    }, [activeTab, autoForm])

    useEffect(() => {
        if (!autoTitle || !titleRef.current) return
        gsap.fromTo(titleRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
        )
    }, [autoTitle])
    useEffect(() => {
    getCalApi({ namespace: "15min" })
        .then(cal => cal("ui", { hideEventTypeDetails: false, layout: "month_view" }))
    getCalApi({ namespace: "30min" })
        .then(cal => cal("ui", { hideEventTypeDetails: false, layout: "month_view" }))
    }, [])
    const switchTab = (tab) => {
        if (tab === activeTab || !boxRef.current) return
        gsap.to(boxRef.current, {
        opacity: 0, y: 10, duration: 0.2, ease: "power2.in",
        onComplete: () => {
            setActiveTab(tab)
            gsap.fromTo(boxRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
            )
        }
        })
    }

    const handleCopy = (e, isEmail) => {
        if (!isEmail) return
        e.preventDefault()
        navigator.clipboard.writeText("tsiorymickas9@gmail.com").then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        })
    }

    const handleChange = (e) => setFormValues(v => ({ ...v, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        const time = new Date().toLocaleString("fr-FR", {
        weekday: "long", year: "numeric", month: "long",
        day: "numeric", hour: "2-digit", minute: "2-digit",
        })
        try {
        await emailjs.send("service_1fki3ag", "template_553wvnp", {
            name: formValues.name, from_name: formValues.name,
            email: formValues.email, message: formValues.message, time,
        })
        alert("Message envoyé !")
        } catch (err) {
        console.error(err)
        alert("Erreur d'envoi.")
        }
    }

    const formCol = isDesktop
    ? { mobileXs:1, mobileSm:1, mobileLg:1, tablet:1, tabletsM:1, tabletLg:1, laptopSm:14, laptopLg:16, desktop:18 }
    : { mobileXs:1, mobileSm:1, mobileLg:1, tablet:1, tabletsM:1, tabletLg:1, laptopSm:1,  laptopLg:1,  desktop:1  }

    const formRow    = isDesktop ? 3 : 5
    const taglineCol = { mobileXs:1, mobileSm:1, mobileLg:1, tablet:1, tabletsM:1, tabletLg:1, laptopSm:1, laptopLg:1, desktop:1 }
    const rowTagline = rows - 2
    const isNestHub = window.innerHeight <= 600 && window.innerWidth > window.innerHeight
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
            <div className="contact-page">

            {/* ── TITRE ── */}
            <GridItem {...LAYOUT.title}>
                <div ref={titleRef} style={{ opacity: 0 }}>
                <h1 className="contact-big-title">
                    <ScrambleHover text="CONTACT" auto={autoTitle} hover={false} scrambleSpeed={20} iterationsPerLetter={3} />
                </h1>
                </div>
            </GridItem>

            {/* ── BOX ── */}
            <GridItem col={formCol} row={formRow} corner={1}>
                <div className="contact-box">
                <div className="contact-switch">
                    <button className={`contact-switch-btn ${activeTab === "quote" ? "active" : ""}`} onClick={() => switchTab("quote")}>
                    Request a Quote
                    </button>
                    <button className={`contact-switch-btn ${activeTab === "call" ? "active" : ""}`} onClick={() => switchTab("call")}>
                    Book a Free Call
                    </button>
                </div>

                <div className="contact-box-content" ref={boxRef}>
                    {activeTab === "quote" && (
                    <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
                        <div className="contact-field">
                        <p className="contact-form-section-label">Contact information</p>
                        <input type="text" name="name" placeholder="Full Name"
                            value={formValues.name} onChange={handleChange}
                            className="contact-input" autoComplete="off" />
                        </div>
                        <div className="contact-field">
                        <input type="email" name="email" placeholder="Your Email"
                            value={formValues.email} onChange={handleChange}
                            className="contact-input" autoComplete="off" />
                        </div>
                        <div className="contact-field">
                        <textarea name="message" placeholder="Tell me about your project..."
                            value={formValues.message} onChange={handleChange}
                            className="contact-input contact-textarea" rows={4} />
                        </div>
                        <div className="contact-field">
                        <button type="submit" className="contact-submit-full btn">SEND MESSAGE</button>
                        </div>
                    </form>
                    )}

                    {activeTab === "call" && (
                    <div className="contact-call">
                        <div className="contact-call-header">
                        <div className="contact-call-logo">
                            <img src="/faviconeblanc.png" alt="Logo" />
                        </div>
                        <p className="contact-call-title">No sales pitch</p>
                        <p className="contact-call-subtitle">
                            Just honest advice on whether we're the right fit. Let's bring your vision to life!
                        </p>
                        </div>
                        <div className="contact-call-options">
  <button
    data-cal-namespace="15min"
    data-cal-link="tsiory-randria-kxj6bo/15min"
    data-cal-config='{"layout":"month_view"}'
    className="contact-call-card"
  >
    <div className="contact-call-card-left">
      <div className="contact-call-card-title">15 Min Meeting</div>
      <div className="contact-call-card-duration">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        15m
      </div>
    </div>
    <div className="contact-call-card-arrow">→</div>
  </button>

  <button
    data-cal-namespace="30min"
    data-cal-link="tsiory-randria-kxj6bo/30min"
    data-cal-config='{"layout":"month_view"}'
    className="contact-call-card"
  >
    <div className="contact-call-card-left">
      <div className="contact-call-card-title">30 Min Meeting</div>
      <div className="contact-call-card-duration">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        30m
      </div>
    </div>
    <div className="contact-call-card-arrow">→</div>
  </button>
</div>
                    </div>
                    )}
                </div>
                </div>
            </GridItem>

           
                <GridItem col={taglineCol} row={rowTagline} corner={3}>
                    <p className="contact-tagline">
                    <ScrambleHover text="Let's build something" auto={autoTagline} hover={false} scrambleSpeed={18} iterationsPerLetter={2} />
                    <br />
                    <span className="contact-tagline-accent">
                        <ScrambleHover text="extraordinary together." auto={autoTagline} hover={false} scrambleSpeed={18} iterationsPerLetter={2} />
                    </span>
                    </p>
                </GridItem>

            

                {SOCIALS.map(({ label, handle, href }, idx) => {
                const isEmail = href.startsWith("mailto")

                const useDesktopLayout = isDesktop || isNestHub

                const baseCol = useDesktopLayout
                ? (bp === "laptopSm" ? 14 : bp === "laptopLg" ? 16 : isNestHub ? 11 : 18)
                : 1
                const rightCol = useDesktopLayout ? baseCol + 6 : cols - 3
                const col      = idx % 2 === 0 ? baseCol : rightCol

                const row = idx < 2
                ? ((!useDesktopLayout) ? rows - 5 : rows - 3)
                : ((!useDesktopLayout) ? rows - 4 : rows - 2)

                return (
                    <GridItem key={label} col={col} row={row} corner={3}>
                        <a
                            href={href}
                            target={isEmail ? "_self" : "_blank"}
                            rel="noreferrer"
                            className="contact-social-item"
                            onClick={(e) => handleCopy(e, isEmail)}
                        >
                            <span className="contact-social-label">
                                <ScrambleHover
                                    text={isEmail ? (copied ? "C O P I E D  ✓" : label + "  ⎘") : label + "  ↗"}
                                    auto={autoSocials[idx]}
                                    hover={true}
                                    scrambleSpeed={15}
                                    iterationsPerLetter={2}
                                />
                            </span>
                            <span className="contact-social-handle">
                                <ScrambleHover
                                    text={handle}
                                    auto={autoSocials[idx]}
                                    hover={false}
                                    scrambleSpeed={12}
                                    iterationsPerLetter={1}
                                />
                            </span>
                        </a>
                    </GridItem>
                )
                })}

            </div>
        )}
    </>
  )
}