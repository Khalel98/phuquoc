---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["documents.html","razgovornik.html","converter.html","pogoda.html","music.html","challenge.html"]
---

Scope: whole app (index.html as primary; documents, razgovornik, converter, pogoda, music, challenge, more). Mode: Operate (mobile web, phone-first).
Audience/job: four friends on Phu Quoc checking "what now / what next", documents, phrases, prices — one hand, bright sun or night market.
Constraints: static HTML/CSS/JS, offline SW, all data files unchanged in shape; no new external font hosts.

## Direction contract
THESIS: The app is the pool edge of the resort: tile grid as the layout armature, painted depth markers as the time typography, lane rope as the day's progress. Refuses the white-card travel template with photo headers and one blue accent.
OWN-WORLD: USER-PINNED palette (restored original): night sea ground #0a1620, tiles #12232f/#1a303e, grout #26465a, turquoise #14b8a6 for shell selection and primary actions (dark text on it), mango #f4b740 for depth-marker times, "now" and alerts. Rubik 800 self-hosted numerals as painted depth markings; system UI sans for text. 8px tile grid; lane-rope dashes as progress. Pool panels = teal/mango glow gradient over tile.
STORY: Open → instantly see today's NOW and NEXT with countdown and route button; swipe days; tap a stop for a bottom sheet with photos, audio guide, tips; tabs reach documents, phrases (show-to-local, speak), currency.
FIRST VIEWPORT: Compact app bar (Фукуок · day N of 7). Water panel: kicker "Сейчас"/"Далее", next stop time as huge depth-marker numerals (~64px), title, "через 40 мин", route button; lane rope of today's stops beneath (beads: past filled, now coral). Day strip of 7 date tiles. Timeline list starts above the fold. Bottom tab bar (Маршрут, Документы, Фразы, Валюта, Ещё) in water color.
FORM: candidate 6 of 7 (resort pool deck); signature move: lane-rope day progress + depth-marker time numerals; raises: Crouwel 8px tile grid, Star-atlas importance ramp, Emigre one numeral face at all sizes. Seed key b1433d11.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
