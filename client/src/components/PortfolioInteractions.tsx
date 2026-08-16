import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";

type AccordionItem = { image: string; label: string; meta: string };
type WheelItem = string | { label: string; path?: string };

export function AccordionGallery({ items }: { items: AccordionItem[] }) {
  const [active, setActive] = useState(1);
  return (
    <div className="accordion-gallery" role="list" aria-label="Research and systems gallery">
      {items.map((item, index) => (
        <button key={item.label} className={`gallery-panel ${active === index ? "is-active" : ""}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)} aria-label={`Show ${item.label}`}>
          <img src={item.image} alt="" /><span className="gallery-scrim" /><span className="gallery-label"><i />{item.label}<small>{item.meta}</small></span>
        </button>
      ))}
    </div>
  );
}

export function OptionWheel({ items, defaultSelected = 0, onChange, onItemClick, className = "" }: { items: WheelItem[]; defaultSelected?: number; onChange?: (index: number, item: WheelItem) => void; onItemClick?: (index: number, item: WheelItem) => void; className?: string }) {
  const labels = useMemo(() => items.map((item) => typeof item === "string" ? item : item.label), [items]);
  const [selected, setSelected] = useState(defaultSelected);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const select = (value: number) => {
    const next = Math.max(0, Math.min(labels.length - 1, value));
    setSelected(next);
    onChange?.(next, items[next]);
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      select(selected + (event.deltaY > 0 ? 1 : -1));
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [selected]);

  return (
    <div ref={rootRef} className={`option-wheel ${className}`} tabIndex={0} role="listbox" aria-label="Navigation wheel" onKeyDown={(event) => { if (event.key === "ArrowDown" || event.key === "ArrowRight") { event.preventDefault(); select(selected + 1); } if (event.key === "ArrowUp" || event.key === "ArrowLeft") { event.preventDefault(); select(selected - 1); } }} onPointerDown={(event) => setDragStart(event.clientY)} onPointerUp={(event) => { if (dragStart !== null && Math.abs(event.clientY - dragStart) > 12) select(selected + (event.clientY < dragStart ? 1 : -1)); setDragStart(null); }}>
      {labels.map((label, index) => {
        const distance = index - selected;
        const opacity = Math.max(0.12, 1 - Math.abs(distance) * 0.22);
        return <button key={`${label}-${index}`} className={index === selected ? "is-selected" : ""} style={{ transform: `translateY(${distance * 52}px) rotate(${distance * 4}deg)`, opacity, filter: `blur(${Math.min(Math.abs(distance) * 0.8, 2)}px)` }} onClick={() => { select(index); onItemClick?.(index, items[index]); }} role="option" aria-selected={index === selected}>{label}</button>;
      })}
    </div>
  );
}

const pageItems = [
  { label: "about", path: "/about" },
  { label: "experience", path: "/experience" },
  { label: "research", path: "/research" },
  { label: "projects", path: "/projects" },
  { label: "skills", path: "/skills" },
  { label: "interests", path: "/interests" },
  { label: "contact", path: "/contact" }
];

export function NavigationWheel({ className = "" }: { className?: string }) {
  const [location, setLocation] = useLocation();
  const currentIndex = Math.max(0, pageItems.findIndex((item) => item.path === location));
  return <OptionWheel items={pageItems} defaultSelected={currentIndex} className={`navigation-wheel ${className}`} onItemClick={(_, item) => { if (typeof item !== "string" && item.path) setLocation(item.path); }} />;
}
