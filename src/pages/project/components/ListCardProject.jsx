import React from "react";
import "./ListCardProject.css";

export default function ListCardProject({ project, setPaused, hoveredId, setHoveredId, nameProjectTitle, setNameProjectTitle, baseProject, setBaseProject, typeProject, setTypeProject }) {
  const isHovered = hoveredId === project.id;

  return <>
    <div
        className={`card-project ${hoveredId !== null && !isHovered ? "card-unfocused" : ""}`}
        onMouseEnter={() => {
            setPaused(true);
            setHoveredId(project.id); 
            setNameProjectTitle(project.title);
            setBaseProject(project.base);
            setTypeProject(project.type); 
        }}
        onMouseLeave={() => {
            setPaused(false);
            setHoveredId(null);
            setNameProjectTitle("");
            setBaseProject("");
            setTypeProject(""); 
        }}
    >
        <div className="card-project-image">
            <img src={project.image} alt={project.title} />
        </div>
      
    </div>
    
  </>
}