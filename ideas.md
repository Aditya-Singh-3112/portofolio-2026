# Aditya Singh Portfolio — Design Direction

## Approach 1
**Theme Name:** Signal / Noise

**Very Brief Intro:** A high-contrast editorial portfolio that treats engineering work like a field notebook: dense where it matters, quiet where it does not. Ink-black surfaces, acid-lime signals, and typographic annotations make the work feel observed and measurable.

**Probability:** 0.07

## Approach 2
**Theme Name:** Quiet Systems

**Very Brief Intro:** A restrained research-lab interface with warm paper tones, soft graphite borders, and diagram-led storytelling. The mood is deliberate, calm, and rigorous rather than flashy.

**Probability:** 0.03

## Approach 3
**Theme Name:** Runtime / Neon

**Very Brief Intro:** A dark technical console with electric cyan, lime traces, and monospaced labels. Motion is reserved for pipeline states and data transitions, giving the site the feel of a live system rather than a static resume.

**Probability:** 0.08

## Selected Approach: Signal / Noise

**Design Movement:** Contemporary Swiss editorial design fused with observability dashboards and research-paper marginalia.

**Core Principles:**
1. Technical evidence gets the visual priority: numbers, tables, system stages, and outcomes should scan faster than decorative copy.
2. Contrast is structural: near-black fields hold off-white type, while one acid-lime signal color marks action, state, and proof.
3. Layouts should feel composed, not boxed: asymmetrical columns, ruled dividers, edge labels, and deliberate negative space replace generic centered cards.
4. Motion should reveal systems, not decorate them: decrypting text, accordion expansion, and pipeline progress all communicate state.

**Color Philosophy:** The base is a deep graphite-black that makes the site feel like a controlled lab environment. Bone-white text keeps long technical passages readable. The signature acid-lime is reserved for active states and measured outcomes, creating a visual distinction between claims and evidence. A muted steel-blue is used sparingly for secondary metadata so the page does not become neon.

**Layout Paradigm:** A long-form editorial rail with a sticky left-side index on desktop, a narrow reading measure for prose, and wide breakout bands for benchmark tables and the flagship pipeline. Sections alternate between dense technical rows and open breathing room. On mobile, the rail collapses into an anchored top strip.

**Signature Elements:**
- A vertical "signal rail" with section numbers, short labels, and lime state markers.
- Thin ruled benchmark tables with oversized metric callouts and compact source notes.
- The pipeline replay as a living horizontal trace: each completed stage lights a node and writes its actual result into the log.

**Interaction Philosophy:** Interactions should feel like inspecting a system. Hovering reveals signal, accordion rows expose implementation depth, and the pipeline replay makes every transition legible. Keyboard focus and reduced-motion preferences are first-class states.

**Animation:** Use 160–260ms ease-out transitions for hover, focus, and accordion affordances. Use a slower 500–800ms reveal only for the pipeline trace and section entrances. Decrypted text can run on hover or in-view, but never block reading. Respect `prefers-reduced-motion` by disabling parallax and substituting instant state changes.

**Typography System:** Display headlines use Space Grotesk with 600–700 weight and tight tracking. Body copy uses IBM Plex Sans for long-form readability. Metric numerals and code-like labels use IBM Plex Mono. Hierarchy: eyebrow 11px mono uppercase, display 56–84px Space Grotesk, section title 34–48px, body 16–18px with 1.7 line-height, metrics 28–56px mono.

**Brand Essence:** Aditya builds practical ML systems and explains their tradeoffs with evidence, for engineering teams who value depth over theater. Personality: rigorous, curious, unsentimental.

**Brand Voice:** Headlines are direct and specific; CTAs sound like invitations to inspect a system, not sales copy. Microcopy states what is known and what is traded away.

Example lines:
- “I build systems that make the constraint visible.”
- “Run the recorded pipeline. Watch the tradeoff appear.”

**Wordmark & Logo:** A custom monogram built from two offset brackets forming an `A`/`S` signal glyph, with the diagonal stroke intentionally interrupted like a sampled waveform. The mark should appear without text in the header and favicon.

**Signature Brand Color:** Signal Lime — `#D7FF3F`.

> Chosen because the portfolio should read like a measured engineering notebook: technically rich, visually controlled, and unmistakably authored.

## Style Decisions

- Use Signal Lime only for actions, active states, key metrics, and proof markers.
- Avoid generic rounded-card grids; use ruled surfaces, asymmetric composition, and editorial section rails.
- Keep personal interests visually low-key and clearly separated from professional evidence.
- Treat every benchmark number as authored content: preserve exact values and label the tradeoff plainly.
- Use generated visual assets only for atmosphere and brand identity; the work itself is represented through content, tables, and interactive state.
