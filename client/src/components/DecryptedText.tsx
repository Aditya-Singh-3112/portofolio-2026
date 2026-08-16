import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  animateOn?: "view" | "hover" | "click";
  clickMode?: "once" | "toggle";
  delay?: number;
};

const DEFAULT_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export default function DecryptedText({
  text,
  speed = 46,
  maxIterations = 10,
  sequential = true,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = DEFAULT_CHARACTERS,
  className = "",
  encryptedClassName = "encrypted-letter",
  animateOn = "view",
  clickMode = "once",
  delay = 0,
}: Props) {
  const [displayText, setDisplayText] = useState(text);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [animating, setAnimating] = useState(false);
  const [decrypted, setDecrypted] = useState(animateOn !== "click");
  const [hasAnimated, setHasAnimated] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | null>(null);
  const pointerRef = useRef(0);

  const alphabet = useMemo(() => {
    if (!useOriginalCharsOnly) return characters.split("");
    return Array.from(new Set(text.split(""))).filter((character) => character !== " ");
  }, [characters, text, useOriginalCharsOnly]);

  const scramble = useCallback((visible: Set<number>) => {
    return text.split("").map((character, index) => {
      if (character === " " || visible.has(index)) return character;
      return alphabet[(index * 11 + Math.floor(Math.random() * alphabet.length)) % alphabet.length] ?? character;
    }).join("");
  }, [alphabet, text]);

  const order = useMemo(() => {
    const indexes = text.split("").map((_, index) => index);
    if (revealDirection === "end") return indexes.reverse();
    if (revealDirection === "center") {
      const center = Math.floor(indexes.length / 2);
      const centered: number[] = [];
      for (let offset = 0; centered.length < indexes.length; offset += 1) {
        const candidate = offset % 2 === 0 ? center + Math.floor(offset / 2) : center - Math.ceil(offset / 2);
        if (candidate >= 0 && candidate < indexes.length) centered.push(candidate);
      }
      return centered;
    }
    return indexes;
  }, [revealDirection, text]);

  const startAnimation = useCallback(() => {
    if (animating || text.length === 0) return;
    if (timerRef.current) window.clearInterval(timerRef.current);
    setAnimating(true);
    setDecrypted(false);
    setRevealed(new Set());
    pointerRef.current = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplayText(text);
      setRevealed(new Set(text.split("").map((_, index) => index)));
      setAnimating(false);
      setDecrypted(true);
      return;
    }
    const run = () => {
      if (sequential) {
        setRevealed((current) => {
          if (pointerRef.current >= order.length) return current;
          const next = new Set(current);
          next.add(order[pointerRef.current]);
          pointerRef.current += 1;
          setDisplayText(scramble(next));
          return next;
        });
        if (pointerRef.current >= order.length) {
          window.clearInterval(timerRef.current ?? undefined);
          timerRef.current = null;
          window.setTimeout(() => { setDisplayText(text); setAnimating(false); setDecrypted(true); }, speed);
        }
      } else {
        setDisplayText(scramble(new Set()));
      }
    };
    timerRef.current = window.setInterval(run, Math.max(speed, 20));
    run();
    if (!sequential) {
      window.setTimeout(() => { window.clearInterval(timerRef.current ?? undefined); timerRef.current = null; setDisplayText(text); setAnimating(false); setDecrypted(true); }, speed * maxIterations);
    }
  }, [animating, maxIterations, order, scramble, sequential, speed, text]);

  useEffect(() => {
    if (animateOn !== "view" || hasAnimated) return;
    const element = rootRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setHasAnimated(true); window.setTimeout(startAnimation, delay); observer.disconnect(); }
    }, { threshold: 0.25 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [animateOn, delay, hasAnimated, startAnimation]);

  useEffect(() => {
    if (animateOn === "view") return;
    if (animateOn === "click") {
      setDisplayText(text);
      setDecrypted(false);
    }
  }, [animateOn, text]);

  useEffect(() => () => { if (timerRef.current) window.clearInterval(timerRef.current); }, []);

  const handleMouseEnter = () => { if (animateOn === "hover") startAnimation(); };
  const handleClick = () => {
    if (animateOn !== "click") return;
    if (clickMode === "once" && decrypted) return;
    startAnimation();
  };

  return (
    <span ref={rootRef} className="decrypt-wrap" onMouseEnter={handleMouseEnter} onClick={handleClick} role={animateOn === "click" ? "button" : undefined} tabIndex={animateOn === "click" ? 0 : undefined}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{displayText.split("").map((character, index) => <span key={`${index}-${character}`} className={decrypted || revealed.has(index) ? className : encryptedClassName}>{character}</span>)}</span>
    </span>
  );
}
