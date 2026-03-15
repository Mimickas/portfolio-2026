"use client";

import { useState, useEffect, useRef } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function ScrambleHover({
  text,
  auto = true,        // true = animation au chargement
  hover = true,       // true = animation au survol
  scrambleSpeed = 25,
  iterationsPerLetter = 3,
  className = "",
}) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);
  const letterIndex = useRef(0);
  const subIter = useRef(0);
  const originalLetters = useRef(text.split(""));

  const stopScramble = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startScramble = () => {
    stopScramble();
    letterIndex.current = 0;
    subIter.current = 0;
    setDisplayText(text);

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) => {
        const prevArr = prev.split("");
        const originalArr = originalLetters.current;

        if (letterIndex.current >= originalArr.length) {
          stopScramble();
          return text;
        }

        const idx = letterIndex.current;
        const originalChar = originalArr[idx];

        if (originalChar === " ") {
          letterIndex.current++;
          return prev;
        }

        const newArr = [...prevArr];

        if (subIter.current < iterationsPerLetter) {
          newArr[idx] = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          subIter.current++;
        } else {
          newArr[idx] = originalChar;
          letterIndex.current++;
          subIter.current = 0;
        }
        return newArr.join("");
      });
    }, scrambleSpeed);
  };


  useEffect(() => {
    if (auto) {
      startScramble();
    }
    return stopScramble;
  }, [auto]); 

  useEffect(() => {
    originalLetters.current = text.split("");
    setDisplayText(text);
    stopScramble();
    if (auto) {
      startScramble();
    }
  }, [text]);

  return (
    <span
      className={className}
      onMouseEnter={hover ? startScramble : undefined}
    >
      {displayText}
    </span>
  );
}