"use client";

import { useState, useEffect, useRef } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function ScrambleHover({
  text,
  auto = true,
  hover = true,
  scrambleSpeed = 25,
  iterationsPerLetter = 3,
  className = "",
}) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef    = useRef(null);
  const letterIndex    = useRef(0);
  const subIter        = useRef(0);
  const originalLetters = useRef(text.split(""));
  // Garde le texte original dans un ref pour les closures
  const textRef        = useRef(text);

  useEffect(() => {
    textRef.current = text
    originalLetters.current = text.split("")
  }, [text])

  const stopScramble = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    // Force toujours le bon texte à l'arrêt
    setDisplayText(textRef.current)
  }

  const startScramble = () => {
    stopScramble()
    letterIndex.current = 0
    subIter.current     = 0
    // Commence avec le texte original — pas de flash
    setDisplayText(textRef.current)

    intervalRef.current = setInterval(() => {
      const original = originalLetters.current
      const idx      = letterIndex.current

      // Terminé
      if (idx >= original.length) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setDisplayText(textRef.current)
        return
      }

      const char = original[idx]

      // Espace → passe directement
      if (char === " " || char === "\n") {
        letterIndex.current++
        return
      }

      if (subIter.current < iterationsPerLetter) {
        // Scramble — on reconstruit depuis les refs, pas depuis prev
        setDisplayText(() => {
          const arr = textRef.current.split("")
          // Lettres déjà résolues → originales
          for (let i = 0; i < idx; i++) arr[i] = original[i]
          // Lettre courante → random
          arr[idx] = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          // Lettres suivantes → originales (pas scramblées d'avance)
          return arr.join("")
        })
        subIter.current++
      } else {
        // Fixe la lettre courante
        letterIndex.current++
        subIter.current = 0
        setDisplayText(() => {
          const arr = textRef.current.split("")
          for (let i = 0; i <= idx; i++) arr[i] = original[i]
          return arr.join("")
        })
      }
    }, scrambleSpeed)
  }

  useEffect(() => {
    if (auto) startScramble()
    return stopScramble
  }, [auto])

  useEffect(() => {
    originalLetters.current = text.split("")
    textRef.current         = text
    setDisplayText(text)
    stopScramble()
    if (auto) startScramble()
  }, [text])

  return (
    <span
      className={className}
      onMouseEnter={hover ? startScramble : undefined}
    >
      {displayText}
    </span>
  )
}