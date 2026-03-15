import ListCardProject from "./components/ListCardProject"
import "./Project.css"
import { useEffect, useState } from "react"
import ScrambleHover from "../../components/fancy/text/ScrambleHover"
import GridItem from "../../components/GridItem"

export default function Project() {
  const [nameProjectTitle, setNameProjectTitle] = useState("")
  const [baseProject, setBaseProject]           = useState("")
  const [typeProject, setTypeProject]           = useState("")
  const [paused, setPaused]                     = useState(false)
  const [hoveredId, setHoveredId]               = useState(null)

  const projects = [
    { id: 1, image: "/img/Capture.PNG", title: "Project 1", type: "DESIGN &\nDEVELOPEMENT", base: "FRANCE" },
    { id: 2, image: "/img/1.jpg",       title: "Project 2", type: "DESIGN & DEVELOPEMENT", base: "FRANCE" },
    { id: 3, image: "/img/2.jpg",       title: "Project 3", type: "BRANDING",               base: "MADAGASCAR" },
    { id: 4, image: "/img/3.jpg",       title: "Project 4", type: "E-COMMERCE",             base: "MADAGASCAR" },
  ]

  useEffect(() => {
    const preload = (urls) => Promise.all(
      urls.map(url => new Promise(res => {
        const img = new Image(); img.src = url
        img.onload = res; img.onerror = res
      }))
    )
    Promise.all([document.fonts.ready, preload(projects.map(p => p.image))])
  }, [])

  const cardProps = {
    setPaused, hoveredId, setHoveredId,
    nameProjectTitle, setNameProjectTitle,
    baseProject,      setBaseProject,
    typeProject,      setTypeProject,
  }

  return (
    <div className="project-page">

     
        <GridItem
            col={{ desktop: 1, tablet: 15, mobile: 1 }}
            row={{ desktop: 2, tablet: 1, mobile: 3 }}
            corner={1}>
            <h2 className="semi-title">
                <ScrambleHover text="TSIORY" auto hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
                <span className="muted">
                <br /><ScrambleHover text="alias " auto hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
                </span>
                <ScrambleHover text="PIKATSIORY" auto hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
            </h2>
        </GridItem>


        <GridItem 
            col={{ desktop: 8, tablet: 15, mobile: 8 }}
            row={{ desktop: 2, tablet: 1, mobile: 3 }} 
            corner={1}
        >
            <h2 className="semi-title">
            <ScrambleHover text="DESIGNER" auto hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
            <span className="muted">
                <ScrambleHover text=" & " auto hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
            </span>
            <br />
            <ScrambleHover text="ENGINEERING" auto hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
            </h2>
        </GridItem>

      
        <GridItem 
            col={{ desktop: 21, tablet: 15, mobile: 1 }}
            row={{ desktop: 2, tablet: 1, mobile: 6 }}
            corner={1}
        >
            <h2 className="muted-titre-semi">
            <ScrambleHover text="SERVICES" auto hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
            </h2>
            <ul className="list-services">
            {["BRANDING", "UX / UI Design", "Web Development (React,..)", "eCommerce"].map(s => (
                <li key={s}>
                <ScrambleHover text={s} auto hover={false} scrambleSpeed={25} iterationsPerLetter={3} />
                </li>
            ))}
            </ul>
        </GridItem>


        <GridItem 
            col={{ desktop: 1, tablet: 15, mobile: 1 }}
            row={{ desktop: 5, tablet: 1, mobile: 11 }}
            corner={1}

            style={{ width: "calc(100vw - 2 * var(--cell-size))", overflow: "hidden", zIndex: 2 }}
        >
            <div className="list-projects"
            style={{ animationPlayState: paused ? "paused" : "running" }}
            >
            {[...projects, ...projects].map((project, i) => (
                <ListCardProject key={i} project={project} {...cardProps} />
            ))}
            </div>
        </GridItem>

        
        <GridItem 
            col={{ desktop: 1, tablet: 15, mobile: 1 }}
            row={{ desktop: 14, tablet: 1, mobile: 21 }}
            corner={3} 
            offsetY={-12}
        >
            <ScrambleHover
                text={nameProjectTitle || "MY WORK"}
                auto hover={false} scrambleSpeed={25} iterationsPerLetter={3}
                className="card-project-title"
            />
        </GridItem>


        <GridItem 
            col={{ desktop: 14, tablet: 15, mobile: 1 }}
            row={{ desktop: 14, tablet: 1, mobile: 23 }}
            corner={3} 
            className="pinned-bottom info-work"
        >
            <ScrambleHover
            text={typeProject || "DESIGN\nENGINEERING"}
            auto hover={false} scrambleSpeed={6} iterationsPerLetter={2}
            />
        </GridItem>


        <GridItem 
            col={{ desktop: 20, tablet: 15, mobile:1 }}
            row={{ desktop: 14, tablet: 1, mobile: 24 }} 
            corner={3} 
            className="pinned-bottom info-work"
        >
            <ScrambleHover
            text={baseProject || "BASED IN MADAGASCAR"}
            auto hover={false} scrambleSpeed={10} iterationsPerLetter={2}
            />
        </GridItem>


        <GridItem
            col={{ desktop: 27, tablet: 15, mobile: 1 }}
            row={{ desktop: 14, tablet: 1, mobile: 28 }}
            corner={1}
            className="pinned-bottom"
        >
            <button className="btn">
                <ScrambleHover text="TELL ME ABOUT YOUR WORK" auto hover={false} scrambleSpeed={12} iterationsPerLetter={1} />
            </button>
        </GridItem>

    </div>
  )
}