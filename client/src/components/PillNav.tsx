import { useState } from "react";

type PillItem = { label: string; path: string; ariaLabel?: string };

export default function PillNav({ logo, logoAlt = "Aditya Singh", items, activeHref }: { logo?: string; logoAlt?: string; items: PillItem[]; activeHref?: string }) {
  const [open, setOpen] = useState(false);
  return <div className="pill-nav-shell">
    <nav className="pill-nav" aria-label="Primary navigation">
      <a className="pill-logo pill-logo-text" href="/" aria-label="Home">ADITYA SINGH</a>
      <div className="pill-nav-items">
        {items.map((item, index) => <a key={item.path} href={item.path} className={`pill-link ${activeHref === item.path ? "is-active" : ""}`} style={{ "--pill-delay": `${index * 28}ms` } as React.CSSProperties} aria-current={activeHref === item.path ? "page" : undefined} aria-label={item.ariaLabel || item.label}><span className="pill-link-fill" aria-hidden="true" /><span className="pill-link-label">{item.label}</span></a>)}
      </div>
      <button className={`pill-menu-toggle ${open ? "is-open" : ""}`} type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen((value) => !value)}><i /><i /></button>
    </nav>
    <div className={`pill-mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>{items.map((item) => <a key={item.path} href={item.path} className={activeHref === item.path ? "is-active" : ""} onClick={() => setOpen(false)}>{item.label}</a>)}</div>
  </div>;
}
