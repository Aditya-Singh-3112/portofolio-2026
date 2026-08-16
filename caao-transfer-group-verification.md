# CAAO transfer-box grouping verification

The C[i+1] prefetch rectangle and label now share one SVG group, and the C[i−1] offload rectangle and label share another. Their transforms and opacity changes are therefore applied to the complete transfer units, while the CPU backing-store page boxes and GPU physical-page boxes remain static. Typecheck, production build, and desktop/mobile Research-page verification passed.
