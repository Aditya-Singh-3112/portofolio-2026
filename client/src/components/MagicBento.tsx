import { useEffect, useRef, useState } from "react";

type BentoItem = { id: string; number: string; title: string; kicker: string; summary: string; tags: string[]; result: string };

export default function MagicBento({ items, onSelect }: { items: BentoItem[]; onSelect: (id: string) => void }) {
  return <div className="magic-bento-grid" aria-label="Selected projects">{items.map((item) => <MagicBentoCard key={item.id} item={item} onSelect={onSelect} />)}</div>;
}

function MagicBentoCard({ item, onSelect }: { item: BentoItem; onSelect: (id: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches || window.innerWidth < 768);
    sync();
    media.addEventListener?.("change", sync);
    window.addEventListener("resize", sync);
    return () => { media.removeEventListener?.("change", sync); window.removeEventListener("resize", sync); };
  }, []);

  const move = (event: React.PointerEvent<HTMLElement>) => {
    const element = ref.current;
    if (!element || reduced) return;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    element.style.setProperty("--bento-x", `${(x / rect.width) * 100}%`);
    element.style.setProperty("--bento-y", `${(y / rect.height) * 100}%`);
    element.style.setProperty("--bento-tilt-x", `${((y / rect.height) - 0.5) * -4}deg`);
    element.style.setProperty("--bento-tilt-y", `${((x / rect.width) - 0.5) * 5}deg`);
    element.style.setProperty("--bento-magnet-x", `${((x / rect.width) - 0.5) * 5}px`);
    element.style.setProperty("--bento-magnet-y", `${((y / rect.height) - 0.5) * 5}px`);
  };

  const enter = () => {
    if (reduced) return;
    setParticles(Array.from({ length: 8 }, (_, id) => ({ id, x: 15 + Math.random() * 70, y: 25 + Math.random() * 50 })));
  };
  const leave = () => { setParticles([]); if (ref.current) { ref.current.style.setProperty("--bento-tilt-x", "0deg"); ref.current.style.setProperty("--bento-tilt-y", "0deg"); ref.current.style.setProperty("--bento-magnet-x", "0px"); ref.current.style.setProperty("--bento-magnet-y", "0px"); } };

  return <article ref={ref} className="magic-bento-card" onPointerMove={move} onPointerEnter={enter} onPointerLeave={leave} onClick={() => onSelect(item.id)} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(item.id); } }}>
    <div className="magic-bento-spotlight" aria-hidden="true" />
    {particles.map((particle) => <i key={particle.id} className="magic-bento-particle" style={{ left: `${particle.x}%`, top: `${particle.y}%` }} aria-hidden="true" />)}
    <div className="magic-bento-top"><span>{item.number} / {item.tags[0]}</span><span>{item.result}</span></div>
    <div className="magic-bento-content"><p className="eyebrow lime">{item.kicker}</p><h3>{item.title}</h3><p>{item.summary}</p></div>
    <div className="magic-bento-bottom"><div>{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><b>Open case <span>↗</span></b></div>
  </article>;
}
