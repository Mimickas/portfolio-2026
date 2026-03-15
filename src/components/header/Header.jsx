import React from "react"
import "./Header.css"
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa"
import ScrambleHover from "../fancy/text/ScrambleHover"
import GridItem from "../GridItem"

export default function Header() {
  return (
    <header className="header-row">

      {/* ── Logo ── col=1 row=0 corner=1 */}
      <GridItem col={1} row={0} corner={3} className="header-logo">
        <img src="/logo192.png" alt="Logo" />
      </GridItem>

      {/* ── Nav ── col=8 / 11 / 14 row=0 corner=1 */}
      <GridItem col={8} row={0} corner={3} className="nav-item">
        <ScrambleHover
          text="P R O J E C T S"
          auto hover
          scrambleSpeed={25}
          iterationsPerLetter={3}
          className="cursor-pointer"
        />
      </GridItem>

      <GridItem col={10} row={0} corner={3} className="nav-item">
        <ScrambleHover
          text="A B O U T"
          auto hover
          scrambleSpeed={25}
          iterationsPerLetter={3}
          className="cursor-pointer"
        />
      </GridItem>

      <GridItem col={12} row={0} corner={3} className="nav-item">
        <ScrambleHover
          text="C O N T A C T"
          auto hover
          scrambleSpeed={25}
          iterationsPerLetter={3}
          className="cursor-pointer"
        />
      </GridItem>

      {/* ── Contact ── side="right" → ancré depuis la droite */}
      {/* Téléphone : 4 cellules depuis la droite */}
      <GridItem col={21} row={0} corner={3}  className="contact-item">
        <FaPhoneAlt className="contact-icon" />
        <ScrambleHover
          text="+261 33 61 314 00"
          auto
          hover={false}
          scrambleSpeed={25}
          iterationsPerLetter={3}
        />
      </GridItem>

      {/* Email : 1 cellule depuis la droite */}
      <GridItem col={24} row={0} corner={3}  className="contact-item">
        <FaEnvelope className="contact-icon" />
        <ScrambleHover
          text="tsiorymickas9@gmail.com"
          auto
          hover={false}
          scrambleSpeed={25}
          iterationsPerLetter={3}
        />
      </GridItem>

    </header>
  )
}