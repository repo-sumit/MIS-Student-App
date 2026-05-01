# SwiftChat Design System

> Reference document synthesized from the SwiftChat Design System Figma file + verified against actual SSO Login Flow screens (T39I73t2utym5RkZsN7QYe).
> **Last updated:** 2026-04-28 — synced with Figma overview sheets (Color, Typography, Spacing, Corner Radius, Grid). Added Visual Scale, Spacing Usage Map (by category), Radius Do's & Don'ts, Grid Do's & Don'ts, and Why Use a Grid sections.
> Use this as the single source of truth when building any SwiftChat UI.

---

## 1. Foundations

### 1.1 Color System

SwiftChat uses a **light/dark dual-theme** palette. All colors switch automatically when the user toggles dark mode.

> **Token architecture:** Primitive tokens → aliased by Semantic tokens → used in components. Never use primitive hex values directly in components.

#### Color Quick Reference (Most Used)

| Use Case | Token | Light | Dark |
|---|---|---|---|
| Primary button / link | `color/interactive/primary` | `#386AF6` | `#386AF6` |
| Primary text | `color/text/primary` | `#0E0E0E` | `#FFFFFF` |
| Secondary text | `color/text/secondary` | `#7383A5` | `#A4ADC1` |
| Page background | `color/background/default` | `#FFFFFF` | `#1C1B34` |
| Card / surface | `color/background/surfaceRaised` | `#FFFFFF` | `#32304B` |
| Borders | `color/border/default` | `#D5D8DF` | `#32304B` |
| Disabled state | `color/text/disabled` | `#999999` | `#7383A5` |
| Success | `color/status/success` | `#00BA34` | `#00D43C` |
| Error | `color/status/error` | `#EB5757` | `#FF7070` |
| Warning | `color/status/warning` | `#F8B200` | `#FFB800` |
| User chat bubble | `color/chat/userBubble` | `#386AF6` | `#386AF6` |
| Bot chat bubble | `color/chat/botBubble` | `#ECECEC` | `#2A284D` |

---

#### Primitive Color Ramps

These are the raw color values stored in the **Primitive/Colors** Figma variable collection. Reference semantic tokens instead of these in components.

**Primary**

| Token | Hex | Notes |
|---|---|---|
| `primary/50` | `#EEF2FF` | Lightest tint — icon wrappers, hover bg |
| `primary/100` | `#E0E7FF` | Light tint — badges, subtle highlights |
| `primary/200` | `#C3D2FC` | Disabled button bg, input border |
| `primary/300` | `#84A2F4` | Dark mode brand text / info |
| `primary/400` | `#345CCC` | Brand subdued text, border |
| `primary/500` | `#386AF6` | **Brand blue — primary buttons, links, active states** |
| `primary/600` | `#1339A3` | Hover state |
| `primary/700` | `#2B3E8B` | Pressed / active state |
| `primary/800` | `#041B5B` | Dark mode brand subtle bg |

**Neutral**

| Token | Hex | Notes |
|---|---|---|
| `neutral/0` | `#FFFFFF` | White |
| `neutral/50` | `#ECECEC` | App background, surface |
| `neutral/100` | `#D5D8DF` | Borders, dividers |
| `neutral/150` | `#BBC6DD` | Secondary hover |
| `neutral/200` | `#A4ADC1` | Dark mode secondary text |
| `neutral/300` | `#999999` | Disabled text |
| `neutral/400` | `#828996` | Tertiary text, timestamps |
| `neutral/500` | `#7383A5` | Secondary text, captions |
| `neutral/600` | `#32304B` | Dark mode surface raised |
| `neutral/700` | `#2A284D` | Dark mode surface |
| `neutral/800` | `#1C1B34` | Dark mode page background |
| `neutral/900` | `#0E0E0E` | Primary text (light mode) |

**Status**

| Token | Light Hex | Dark Hex |
|---|---|---|
| `status/error` | `#EB5757` | `#FF7070` |
| `status/warning` | `#F8B200` | `#FFB800` |
| `status/success` | `#00BA34` | `#00D43C` |
| `status/info` | `#84A2F4` | `#84A2F4` |
| `text/error` | `#C0392B` | — (WCAG AA on white) |
| `text/warning` | `#9A6500` | — (WCAG AA on white) |
| `text/success` | `#007B22` | — (WCAG AA on white) |

**Card & Accent primitives** (light / dark pairs)

| Token | Light | Dark |
|---|---|---|
| `card/blue` | `#A4E2FA` | `#79B5CB` |
| `card/yellow` | `#FDE1AC` | `#BE9F64` |
| `card/green` | `#CCEFBF` | `#8CB87C` |
| `card/orange` | `#FFD4BB` | `#A06845` |
| `card/pink` | `#FCD5F1` | `#A05E7A` |
| `card/mint` | `#CFFBDB` | `#5E9E70` |
| `card/cream` | `#FFF5D0` | `#907832` |
| `card/lightGreen` | `#ECFFE5` | `#5E8C52` |
| `accent/orange` | `#FFDDCA` | `#B8754A` |
| `accent/purple` | `#D7C9FF` | `#8B72E8` |
| `accent/pink` | `#FFCACA` | `#C85880` |
| `accent/brown` | `#D9B6A1` | `#7A4428` |

---

#### Semantic Tokens — Background

Stored in **Semantic/Colors** collection, modes: Light / Dark.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `color/background/default` | `#FFFFFF` | `#1C1B34` | Page / canvas background |
| `color/background/surface` | `#ECECEC` | `#2A284D` | Card, panel, sidebar |
| `color/background/surfaceRaised` | `#FFFFFF` | `#32304B` | Elevated card, dropdown, tooltip |
| `color/background/subtle` | `#D5D8DF` | `#32304B` | Section bg, subtle fills |
| `color/background/brand` | `#386AF6` | `#386AF6` | Primary button, active nav item |
| `color/background/brandSubtle` | `#C3D2FC` | `#041B5B` | Brand tint bg, badge |
| `color/background/inverse` | `#1C1B34` | `#FFFFFF` | Inverse surface |
| `color/surface/brandSubtle` | `#EEF2FF` | `#041B5B` | Icon wrapper, lightest brand tint |
| `color/surface/successSubtle` | `#D4F5DC` | `#003D12` | Success banner / toast bg |
| `color/surface/warningSubtle` | `#FFF3CC` | `#3D2800` | Warning banner / toast bg |
| `color/surface/errorSubtle` | `#FDEAEA` | `#3D0F0F` | Error field bg / toast bg |
| `color/surface/infoSubtle` | `#E0E7FF` | `#041B5B` | Info banner bg |

#### Semantic Tokens — Text

| Token | Light | Dark | Usage |
|---|---|---|---|
| `color/text/primary` | `#0E0E0E` | `#FFFFFF` | Body copy, headings |
| `color/text/secondary` | `#7383A5` | `#A4ADC1` | Subheadings, metadata, labels |
| `color/text/tertiary` | `#828996` | `#A4ADC1` | Captions, helper text, placeholders |
| `color/text/disabled` | `#999999` | `#7383A5` | Disabled labels and inputs |
| `color/text/inverse` | `#FFFFFF` | `#0E0E0E` | Text on dark / brand background |
| `color/text/brand` | `#386AF6` | `#84A2F4` | Links, brand emphasis |
| `color/text/onBrand` | `#FFFFFF` | `#FFFFFF` | Text sitting on brand bg |
| `color/text/brandSubdued` | `#345CCC` | `#C3D2FC` | Subdued brand text |
| `color/text/success` | `#007B22` | `#00D43C` | Success message — WCAG AA |
| `color/text/warning` | `#9A6500` | `#FFB800` | Warning message — WCAG AA |
| `color/text/error` | `#C0392B` | `#FF7070` | Error message — WCAG AA |
| `color/text/info` | `#345CCC` | `#84A2F4` | Info / helper text |

#### Semantic Tokens — Icon

> Always use icon tokens (not text tokens) for icon fills. Separate token = separate control.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `color/icon/primary` | `#0E0E0E` | `#FFFFFF` | Default icon |
| `color/icon/secondary` | `#7383A5` | `#A4ADC1` | Subdued / secondary icon |
| `color/icon/tertiary` | `#828996` | `#828996` | Decorative / metadata icon |
| `color/icon/brand` | `#386AF6` | `#84A2F4` | Brand-colored icon |
| `color/icon/onPrimary` | `#FFFFFF` | `#FFFFFF` | Icon on primary button |
| `color/icon/inverse` | `#FFFFFF` | `#0E0E0E` | Icon on inverse surface |
| `color/icon/success` | `#00BA34` | `#00D43C` | Success state icon |
| `color/icon/warning` | `#F8B200` | `#FFB800` | Warning state icon |
| `color/icon/error` | `#EB5757` | `#FF7070` | Error / danger icon |
| `color/icon/disabled` | `#999999` | `#7383A5` | Disabled icon |

#### Semantic Tokens — Interactive

| Token | Light | Dark | Usage |
|---|---|---|---|
| `color/interactive/primary` | `#386AF6` | `#386AF6` | Primary button — default |
| `color/interactive/primaryHover` | `#1339A3` | `#345CCC` | Primary button — hover |
| `color/interactive/primaryActive` | `#2B3E8B` | `#84A2F4` | Primary button — pressed |
| `color/interactive/primaryDisabled` | `#C3D2FC` | `#041B5B` | Primary button — disabled |
| `color/interactive/secondary` | `#D5D8DF` | `#32304B` | Secondary button — default |
| `color/interactive/secondaryHover` | `#BBC6DD` | `#7383A5` | Secondary button — hover |
| `color/interactive/secondaryActive` | `#BBC6DD` | `#7383A5` | Secondary button — pressed |
| `color/interactive/secondaryDisabled` | `#ECECEC` | `#2A284D` | Secondary button — disabled |
| `color/interactive/destructive` | `#EB5757` | `#EB5757` | Delete / danger action |
| `color/interactive/focus` | `#386AF6` | `#84A2F4` | Keyboard focus ring |

#### Semantic Tokens — Border

| Token | Light | Dark | Usage |
|---|---|---|---|
| `color/border/default` | `#D5D8DF` | `#32304B` | Default input / card border |
| `color/border/subtle` | `#ECECEC` | `#2A284D` | Dividers, separators |
| `color/border/strong` | `#999999` | `#828996` | Emphasized border |
| `color/border/brand` | `#345CCC` | `#386AF6` | Active input focus border |
| `color/border/focus` | `#386AF6` | `#84A2F4` | Keyboard focus ring border |
| `color/border/error` | `#EB5757` | `#EB5757` | Error state border |

#### Semantic Tokens — Status

| Token | Light | Dark | Usage |
|---|---|---|---|
| `color/status/success` | `#00BA34` | `#00D43C` | Success fill (icon, badge dot) |
| `color/status/successSubtle` | `#CCEFBF` | `#8CB87C` | Success surface (chip bg, banner) |
| `color/status/warning` | `#F8B200` | `#FFB800` | Warning fill |
| `color/status/warningSubtle` | `#FDE1AC` | `#BE9F64` | Warning surface |
| `color/status/error` | `#EB5757` | `#FF7070` | Error fill |
| `color/status/errorSubtle` | `#FDEAEA` | `#3D0F0F` | Error surface |
| `color/status/info` | `#84A2F4` | `#84A2F4` | Info fill |
| `color/status/infoSubtle` | `#C3D2FC` | `#041B5B` | Info surface |

#### Semantic Tokens — Chat

> Chat tokens are the only component-level tokens in the color system. All other components use background/text/icon/interactive tokens.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `color/chat/userBubble` | `#386AF6` | `#386AF6` | Outgoing message bubble bg |
| `color/chat/botBubble` | `#ECECEC` | `#2A284D` | Incoming / bot message bubble bg |
| `color/chat/userText` | `#FFFFFF` | `#FFFFFF` | Text inside user bubble |
| `color/chat/botText` | `#0E0E0E` | `#FFFFFF` | Text inside bot bubble |
| `color/chat/timestamp` | `#828996` | `#828996` | Message timestamp |
| `color/chat/inputBackground` | `#FFFFFF` | `#32304B` | Composer input field bg |
| `color/chat/inputBorder` | `#D5D8DF` | `#32304B` | Composer input field border |
| `color/chat/typing` | `#7383A5` | `#A4ADC1` | Typing indicator dots |

#### Button Colors (verified from production)

| State | Background | Text | Token |
|---|---|---|---|
| Primary Enabled | `#386AF6` | `#FFFFFF` | `color/interactive/primary` |
| Primary Disabled | `#C3D2FC` | `#FFFFFF` | `color/interactive/primaryDisabled` |
| Secondary/Outlined | `#FFFFFF` | `#386AF6` | 1.5px border `color/border/brand` |
| Destructive | `#EB5757` | `#FFFFFF` | `color/interactive/destructive` |

#### Language / Selection Card Colors

| State | Background | Border | Text |
|---|---|---|---|
| Selected | `#ECFFE5` | `1.5px #00BA34` | `#00BA34` SemiBold |
| Unselected | `#FFFFFF` | `1.5px #386AF6` | `#0E0E0E` Medium |

#### Surface Colors

| Token | Value | Usage |
|---|---|---|
| Screen Background | `#FFFFFF` (`color/background/default`) | Login/onboarding screens are white (not grey) |
| App Background | `#ECECEC` (`color/background/surface`) | Main app post-login |
| Card / Sheet Surface | `#FFFFFF` (`color/background/surfaceRaised`) | All card, bottom sheet, modal surfaces |
| Hero Banner BG | `#F4F6FA` (var: `--color/primary-blue-4`) | Top decorative section on login screen |
| Image Preview Background | `~#1A1A1A` | Media lightbox backgrounds |

#### Secondary Color Palette

7 secondary colors used across cards, tags, and categorized content. Use `color/card/*` tokens.

| Slot | Token | Light Hex | Usage |
|---|---|---|---|
| Secondary 1 (Blue) | `color/card/blue` | `#A4E2FA` | Informational elements |
| Secondary 2 (Yellow) | `color/card/yellow` | `#FDE1AC` | Warning/caution |
| Secondary 3 (Green) | `color/card/green` | `#CCEFBF` | Positive/success |
| Secondary 4 (Orange) | `color/card/orange` | `#FFD4BB` | Alerts |
| Secondary 5 (Pink) | `color/card/pink` | `#FCD5F1` | Highlights |
| Secondary 6 (Mint) | `color/card/mint` | `#CFFBDB` | Alternate accent |
| Secondary 7 (Purple) | `color/accent/purple` | `#D7C9FF` | Special states |

#### Color Decision Tree

Use this when picking a color:

1. **Need text color?** → Use `color/text/*` (primary / secondary / tertiary / disabled / brand / inverse)
2. **Need button / interactive?** → Use `color/interactive/*` (primary / secondary / destructive + hover/active/disabled variants)
3. **Need background / surface?** → Use `color/background/*` (default / surface / surfaceRaised / brand / inverse)
4. **Need icon?** → Use `color/icon/*` (NOT text tokens — icons are separate)
5. **Need border?** → Use `color/border/*` (default / subtle / strong / brand / focus / error)
6. **Need status indicator?** → Use `color/status/*` (success / warning / error / info + Subtle variant for bg)
7. **Chat context?** → Use `color/chat/*` (userBubble / botBubble / userText / botText / inputBackground)

**Light/Dark Handling:** Always use semantic token. Light/dark values switch automatically. Never hardcode hex values.

---

### 1.2 Typography

> **Token architecture:** `Primitive/Typography` variable collection → Figma text styles → components. Never hardcode font sizes or weights.

**Font families:**
- **Montserrat** — all Latin text: display, heading, title, body, label, caption
- **Mukta** — Devanagari, Gujarati, Marathi (use `/Indic` twin styles)
- **Noto Sans** — Telugu, Tamil, and other scripts not covered by Mukta

#### Primitive Font Variables (`Primitive/Typography`)

**Sizes** (FLOAT): `font/size/10` · `/11` · `/12` · `/14` · `/16` · `/18` · `/20` · `/24` · `/28` · `/36` · `/45` · `/57`

**Line heights** (FLOAT): `font/lineHeight/snug` (14px) · `/base` (20px) · `/relaxed` (24px) · `/indicBase` (22px) · `/indicLarge` (26px)

**Letter spacings** (FLOAT): `font/letterSpacing/tighter` (−0.25) · `/tight` (−0.2) · `/none` (0) · `/wide` (+0.1) · `/wider` (+0.25) · `/widest` (+0.5)

**Weights** (FLOAT): `font/weight/regular` (400) · `/medium` (500) · `/semiBold` (600) · `/bold` (700)

**Families** (STRING): `font/family/primary` (Montserrat) · `/indic` (Mukta) · `/indicFallback` (Noto Sans)

#### Text Style Scale

All styles are Figma text styles. Reference by name in components (e.g., `Title/Medium`).

##### Montserrat (Latin)

| Style | Size | Weight | Line-height | Letter-spacing | Verified use |
|---|---|---|---|---|---|
| `Display/Large` | 57px | Regular | 64px | −0.25px | Splash/marketing only |
| `Display/Medium` | 45px | Regular | 52px | 0 | — |
| `Display/Small` | 36px | Regular | 44px | 0 | — |
| `Heading/Large` | 28px | SemiBold | 36px | 0 | — |
| `Heading/Medium` | 24px | SemiBold | 32px | 0 | — |
| `Heading/Small` | 20px | SemiBold | 28px | 0 | — |
| `Title/Large` | 16px | **Bold** | 20px | 0 | Screen title / page heading ✓ |
| `Title/Medium` | 16px | SemiBold | 20px | +0.1px | Button label, language card native name ✓ |
| `Title/Small` | 14px | SemiBold | 20px | −0.2px | — |
| `Body/Large` | 16px | Regular | 24px | +0.5px | — |
| `Body/Medium` | 14px | Regular | 20px | +0.25px | Chat bubbles (Latin) |
| `Body/Small` | 12px | Regular | 16px | +0.4px | — |
| `Body/XSmall` | 10px | Regular | 14px | +0.2px | T&C body text ✓ |
| `Label/Large` | 16px | Medium | 20px | +0.1px | Secondary / ghost button label |
| `Label/Medium` | 14px | Medium | 20px | +0.1px | Input text, placeholder, language card English name ✓ |
| `Label/Small` | 12px | Medium | 16px | +0.25px | Error messages ✓ |
| `Label/XSmall` | 10px | Medium | 14px | +0.25px | T&C links ✓ |
| `Caption` | 11px | Medium | 14px | +0.2px | Subtitle, badge/chip label, metadata ✓ |
| `Caption/Small` | 10px | Regular | 14px | +0.2px | Chat timestamp, "Delivered · Seen" |

> **Title/Large vs Title/Medium at 16px:** Bold (700) for screen headings; SemiBold (600) for interactive labels. These are intentionally different weights at the same size.

##### Indic twins (Mukta / Noto Sans)

Use these styles in place of their Latin counterparts whenever the text field contains user-generated Indic content. Line heights are +2–4px taller to accommodate Devanagari ascenders and prevent glyph clipping.

| Style | Replaces | Family | Size | Weight | Line-height | Applies to |
|---|---|---|---|---|---|---|
| `Body/Large/Indic` | `Body/Large` | Mukta | 16px | Regular | 26px | Long-form Indic body text |
| `Body/Medium/Indic` | `Body/Medium` | Mukta | 14px | Regular | 22px | Chat bubbles — Indic input |
| `Body/Small/Indic` | `Body/Small` | Mukta | 12px | Regular | 18px | Secondary Indic text |
| `Label/Medium/Indic` | `Label/Medium` | Mukta | 14px | Medium | 22px | Input fields — Indic input |
| `Caption/Indic` | `Caption` | Noto Sans | 11px | Regular | 16px | Timestamps, labels — non-Mukta scripts |

#### Typography Usage Map

| UI context | Style token |
|---|---|
| Screen title / page heading | `Title/Large` ✓ |
| Primary button label | `Title/Medium` ✓ |
| Secondary / ghost button label | `Label/Large` |
| Navigation bar title | `Title/Large` |
| Section heading (in-screen) | `Heading/Small` |
| Input field text | `Label/Medium` ✓ |
| Input placeholder | `Label/Medium` ✓ |
| Input error message | `Label/Small` ✓ |
| Chat bubble — Latin | `Body/Medium` |
| Chat bubble — Indic | `Body/Medium/Indic` |
| Chat timestamp | `Caption/Small` |
| T&C body | `Body/XSmall` ✓ |
| T&C links | `Label/XSmall` ✓ |
| Subtitle / metadata label | `Caption` ✓ |
| Badge / chip label | `Caption` |
| Language card — native name | `Title/Medium` ✓ |
| Language card — English name | `Label/Medium` ✓ |

---

### 1.3 Spacing & Dividers

> **Token architecture:** `Primitive/Spacing` variable collection (ID: `VariableCollectionId:795:50`) → `space/*` tokens. Rule: always use `space/*` tokens. Never hardcode pixel values.

#### Primitive Spacing Tokens

| Token | Value | Alias | Usage |
|---|---|---|---|
| `space/0` | 0px | none | Flush / no gap |
| `space/2` | 2px | 2xs | ⚠️ Optical nudge only — never layout gaps |
| `space/4` | 4px | xs | ⚠️ Optical nudge only — icon correction, divider offsets, indicator dots |
| `space/8` | 8px | sm | Icon–label gap, between-messages gap, language card gutter |
| `space/12` | 12px | md | Chat bubble padding, card gap, bottom nav vertical pad |
| `space/16` | 16px | lg | Screen horizontal margin, card padding, input bar padding |
| `space/20` | 20px | lg+ | — |
| `space/24` | 24px | xl | Between related items, language card top/bottom padding |
| `space/32` | 32px | 2xl | Section gap, between component groups |
| `space/40` | 40px | 3xl | — |
| `space/48` | 48px | 4xl | Screen-level section gaps |
| `space/64` | 64px | 5xl | — |
| `space/80` | 80px | 6xl | — |
| `space/96` | 96px | 7xl | — |
| `space/128` | 128px | 8xl | Max spacer, splash screen margin |

#### Chat-Specific Spacing Map

| Context | Token |
|---|---|
| Chat bubble — internal padding | `space/12` |
| Between messages gap | `space/8` |
| Timestamp margin | `space/4` |
| Input bar padding | `space/16` |
| Page horizontal margin | `space/16` |
| Section gap | `space/32` |
| Card padding | `space/16` |
| Card gap | `space/12` |

#### Component Padding Reference

| Component | Horizontal | Vertical | Notes |
|---|---|---|---|
| Button Large | `space/16` | `space/16` | → 56px tall |
| Button Medium | `space/12` | `space/12` | |
| Button Small | `space/8` | `space/8` | |
| Input field | `space/8` | `space/12` | |
| Chip / Badge | `space/8` | `space/4` | |
| Card (standard) | `space/16` | `space/16` | |
| List item | `space/16` | `space/12` | |
| Bottom Nav item | `space/8` | `space/12` | touch target |
| Chat bubble | `space/12` | `space/12` | all sides |
| Modal / Sheet | `space/16` | `space/16` | |
| Toast / Snackbar | `space/16` | `space/12` | |
| Page horizontal margin | `space/16` | — | content width = 328px |
| Section vertical gap | — | `space/32` | |

#### Visual Scale — Feel the Space

Each step in the scale is roughly 1.5–2× the prior one — a clear, predictable jump that makes hierarchy readable at a glance.

```
space/2    ▍                      2px   (optical nudge)
space/4    ▊                      4px   (optical nudge)
space/8    ██                     8px   (small gap)
space/12   ███                    12px  (component padding)
space/16   ████                   16px  (page margin)
space/24   ██████                 24px  (group spacing)
space/32   ████████               32px  (section gap)
space/48   ████████████           48px  (large section gap)
space/64   ████████████████       64px  (screen-level gap)
space/128  ████████████████████   128px (max spacer)
```

Use this visual rhythm to confirm your choice — if a step feels like it skips a beat, you're probably picking the wrong token.

#### Spacing Usage Map (by Category)

| Context | Token | Category |
|---|---|---|
| Chat bubble — internal padding | `space/12` | Chat |
| Chat bubble — between messages | `space/8` | Chat |
| Message timestamp margin | `space/4` | Chat |
| Input bar — horizontal padding | `space/16` | Chat |
| Grade chip — horizontal padding | `space/8` | Chat |
| Grade chip — row gap | `space/8` | Chat |
| Button — large horizontal | `space/16` | Button |
| Button — medium horizontal | `space/12` | Button |
| Button — row gap | `space/8` | Button |
| Card — internal padding | `space/16` | Card |
| Card — gap between cards | `space/12` | Card |
| Page — horizontal margin | `space/16` | Page |
| Section — vertical gap | `space/32` | Section |
| Nav bar — item gap | `space/8` | Nav |
| List item — vertical padding | `space/12` | List |
| List item — leading icon gap | `space/8` | List |
| Group — margin (top/bottom) | `space/24` | Grouping |
| Modal — padding | `space/16` | Modal |
| Toast — padding | `space/16` | Overlay |

#### Spacing Governance

**Do's & Don'ts:**
- ✓ DO: Use `space/8` for icon–label gaps, message separators, and divider spacing
- ✓ DO: Use `space/12` for internal component padding (chat bubbles, cards, buttons)
- ✓ DO: Use `space/16` for screen margins and major container padding
- ✓ DO: Use `space/32` for section gaps and visual grouping
- ✗ DON'T: Use arbitrary values like 15px, 18px, or 30px — always pick the nearest token
- ✗ DON'T: Use `space/2` or `space/4` for layout spacing — only for optical nudges
- ✗ DON'T: Inconsistent padding across buttons of different sizes — all use `space/16`/`space/12`/`space/8`

**Why Base-8?**
- Divides evenly across 1×, 1.5×, 2×, 3× pixel densities (mdpi → xxxhdpi) for crisp rendering
- Fewer decisions = faster work — no pixel debates
- Creates consistent visual rhythm across all screens
- Exception tokens (`space/2`, `space/4`) for optical fine-tuning only

**Verified spacing from production:**
- Screen horizontal padding: `16px` (`space/16`)
- Button internal padding: `8px` horizontal, `14px` vertical
- Input internal padding: `8px` horizontal, `12px` vertical
- Language card padding: `24px` left, `16px` right, `12px` top/bottom
- Gap between language cards: `8px`

**Dividers:**
- Thin: `1px` solid `~#E5E7EB`
- Medium: `2px` solid `~#E5E7EB`
- Used to separate list items, section breaks

---

### 1.4 Corner Radius

> **Token architecture:** `Primitive/Radius` variable collection (ID: `VariableCollectionId:795:2010`) → `radius/*` tokens. Rule: always use `radius/*` tokens. Never hardcode corner radius values.

#### Primitive Radius Tokens

| Token | Value | Usage |
|---|---|---|
| `radius/none` | 0px | Square elements, full-bleed images, bottom edges of sheets |
| `radius/xs` | 2px | Chat bubble tail corners (directional cue), inline badge |
| `radius/sm` | 4px | Tooltip, tag, small chip |
| `radius/md` | 8px | Standard button, input field, card, dropdown |
| `radius/lg` | 12px | Chat bubble (all but tail), language selector card, content card |
| `radius/xl` | 16px | Modal top corners, large sheet, container |
| `radius/2xl` | 20px | Chip, floating action button |
| `radius/3xl` | 24px | Hero card |
| `radius/full` | 999 | Pill button, avatar circle, search input, progress bar, toggle |

#### Chat Bubble Mixed-Radius Patterns

> Some components intentionally use different radii per corner. **Never flatten them to uniform.**

| Component | Top-Left | Top-Right | Bottom-Right | Bottom-Left | Rationale |
|---|---|---|---|---|---|
| Chat Bubble (User) | lg | lg | xs | lg | Tail corner (br) points toward sender |
| Chat Bubble (Bot) | lg | lg | lg | xs | Tail corner (bl) points toward sender |
| Bottom Sheet / Modal | xl | xl | none | none | Only top edge visible; anchored to screen |
| Toast / Notification | lg | lg | lg | lg | Uniform rounding for floating feel |

#### Component Radius Reference

| Component | Token | Notes |
|---|---|---|
| Button (all sizes) | `radius/full` | Pill shape |
| Input field | `radius/full` | Pill shape |
| Chip / Badge | `radius/md` or `radius/2xl` | Depends on context |
| Card (standard) | `radius/md` | |
| Card (large) | `radius/lg` | |
| Chat bubble | `radius/lg` + mixed corners | See patterns above |
| Avatar | `radius/full` | Circle |
| Modal / Sheet | `radius/xl` top, `radius/none` bottom | Anchored to screen |
| Tooltip | `radius/sm` | |
| Progress bar | `radius/full` | Pill-shaped progress |
| Toggle | `radius/full` | Circular / pill |
| Search bar | `radius/full` | Pill shape |
| Image thumbnail | `radius/md` | |
| Dropdown | `radius/md` | |
| Divider | `radius/none` | No rounding |

#### Radius Design Principles

- **Depth hierarchy:** More rounded = visually floats higher. `radius/full` for topmost elements (pills, avatars), `radius/md` for mid-layer (buttons), `radius/none` for ground-level (dividers)
- **Approachability:** SwiftChat is ed-tech for students — rounded edges feel friendlier than sharp
- **Reduced visual tension:** Rounded corners create softer, more inviting UI
- **Touch affordance:** Obvious rounded shapes on mobile feel more tappable

#### Radius Do's & Don'ts

**Do's:**
- ✓ DO: Use `radius/full` for buttons, toggles, and pill-shaped inputs — they should always read as fully tappable
- ✓ DO: Apply mixed-corner radii on chat bubbles to keep the directional tail (sender cue) visible
- ✓ DO: Use `radius/xl` (16px) on bottom sheets and modal top corners only — leave bottom edges flat (`radius/none`) since they're anchored
- ✓ DO: Round small inline elements (chips, badges, tooltips) with `radius/sm`–`radius/md` — too much rounding shrinks usable surface
- ✓ DO: Match radius scale to component size — bigger surfaces tolerate larger radii without feeling soft

**Don'ts:**
- ✗ DON'T: Use `radius/full` on buttons — it should always read as fully tappable on chat input or message bubble
- ✗ DON'T: Apply uniform corners to chat bubbles — it removes the directional tail and breaks sender association
- ✗ DON'T: Use sharp corners (`radius/none`) on interactive elements — it reduces touch affordance and feels unfriendly
- ✗ DON'T: Mix arbitrary values like `10px`, `15px`, or `18px` — always pick the nearest token
- ✗ DON'T: Round image thumbnails with `radius/full` unless they're avatars — full circles imply identity, not media

#### Why Rounded Corners?

- **Feels approachable** — Sharp corners read as formal/clinical; rounded corners feel friendly and inviting, which fits SwiftChat's ed-tech, student-first audience
- **Reduces visual tension** — Right angles create eye stopping points; soft corners let the eye glide across the layout, lowering cognitive load on long chat threads
- **Depth hierarchy** — More rounded = visually floats higher, less rounded = anchored. Pills/avatars (radius/full) feel topmost, dividers (radius/none) feel ground-level
- **Touch affordance** — Obvious rounded shapes look more tappable on mobile — users tap rounded targets faster than square ones in usability studies

**Verified from production:**
- Button: `border-radius: 50px` (full pill)
- Phone input field: `border-radius: 25px` (pill)
- Language cards: `border-radius: 12px` (`radius/lg`)

---

### 1.5 Grid System

> **Token architecture:** `Primitive/Grid` variable collection (ID: `VariableCollectionId:795:2266`) with 9 FLOAT tokens. Rule: always align content to the column grid. Never position elements by eye.

#### Responsive Breakpoints

| Breakpoint | Viewport | Columns | Margin | Gutter | Column Width @ Max |
|---|---|---|---|---|---|
| **Small** | 320–599px | 4 | 16px | 20px | ~57px @ 320px |
| **Medium** | 600–1135px | 8 | 36px | 36px | ~60px @ 804px |
| **Large** | 1136px+ | 12 | 64px | 36px | ~60px @ 1244px |

> **Mobile viewport:** `360px` is the canonical screen width (not 390px).

#### Primitive Grid Tokens

| Token | Value | Notes |
|---|---|---|
| `grid/mobile/columns` | 4 | Small breakpoint (320–599px) |
| `grid/mobile/margin` | 16px | Horizontal padding on mobile |
| `grid/mobile/gutter` | 20px | Gap between mobile columns |
| `grid/tablet/columns` | 8 | Medium breakpoint (600–1135px) |
| `grid/tablet/margin` | 36px | Horizontal padding on tablet |
| `grid/tablet/gutter` | 36px | Gap between tablet columns |
| `grid/desktop/columns` | 12 | Large breakpoint (1136px+) |
| `grid/desktop/margin` | 64px | Horizontal padding on desktop |
| `grid/desktop/gutter` | 36px | Gap between desktop columns |

#### Column Span Reference (Chat-Centric)

| Element | Small (4 cols) | Medium (8 cols) | Large (12 cols) | Notes |
|---|---|---|---|---|
| Page heading | 4/4 | 8/8 | 12/12 | Full-width hero / banner |
| **Chat thread** | **4/4** | **6/8** | **8/12** | Centre-constrained on wide screens |
| Input bar | 4/4 | 8/8 | 8/12 | Matches chat thread width |
| Sidebar / nav | — | 2/8 | 3/12 | Hidden on mobile |
| Main + sidebar | — | 6/8 + 2/8 | 9/12 + 3/12 | Main takes majority |
| Standard card | 4/4 | 4/8 | 3/12 | 1-up mobile, 2-up tablet, 4-up desktop |
| Large card | 4/4 | 8/8 | 6/12 | 1-up all breakpoints |
| Standalone button | 4/4 (280px) | 4/8 | 3/12 | Centred, not full-width |
| Form field | 4/4 | 6/8 | 4/12 | Narrower than full-width |
| Modal / dialog | 4/4 | 6/8 | 6/12 | Centred, not full-width |

#### Layout Patterns

| Pattern | Mobile (4 cols) | Tablet (8 cols) | Desktop (12 cols) |
|---|---|---|---|
| Full-width banner | 4/4 | 8/8 | 12/12 |
| Chat + sidebar | 4/4 | 6/8 + 2/8 | 9/12 + 3/12 |
| 4-up card grid | 1 col | 2 cols | 4 cols |
| 2-col content | 1/1 | 1/2 | 1/2 |
| Centred action | 4/4 (280px) | 4/8 (280px) | 3/12 (280px) |

#### Grid Design Rules

- **Mobile-first:** Design at 320px first, scale up to tablet/desktop
- **Chat constraint:** Constrain chat thread to 8/12 cols on large to prevent horizontal scrolling and maintain readability
- **Reading width:** Never design full-width on desktop for text-heavy content (reading line length > 80 chars fatigues eyes)
- **Button sizing:** `280px` centered, not full-width (except on mobile login screens where it spans 4/4)
- **Responsive semantics:** Same content spans different columns per breakpoint — always design for the grid, not pixel values

#### Grid Do's & Don'ts

**Do's:**
- ✓ DO: Snap layouts to the column grid — every block of content should align to column edges, not float at arbitrary x-positions
- ✓ DO: Use the breakpoint-appropriate margin (`16px` mobile / `36px` tablet / `64px` desktop) so the grid feels right at every viewport
- ✓ DO: Centre-constrain chat threads on tablet/desktop (6/8, 8/12) — full-width chat is unreadable on wide screens
- ✓ DO: Use a 4-up card grid on desktop (3/12 each) — denser layouts use space better than 2-up
- ✓ DO: Design mobile at 360px (canonical) and tablet at 800px so layouts hold across the breakpoint
- ✓ DO: Prefer column-span semantics ("4/8") over pixel widths — same design adapts cleanly across breakpoints

**Don'ts:**
- ✗ DON'T: Position elements by eye — always align to grid columns to keep visual rhythm consistent
- ✗ DON'T: Use desktop margins (`64px`) on mobile — content gets squeezed and feels cramped
- ✗ DON'T: Stretch chat thread to 12/12 on desktop — line length blows past readability limits (>80 chars)
- ✗ DON'T: Stretch buttons full-width on tablet/desktop — keep them at `280px` centred so they don't dominate the layout
- ✗ DON'T: Use mobile-only spans on desktop without re-spanning — a 4/4 mobile card becomes a 12/12 desktop banner if you forget to re-span it
- ✗ DON'T: Design without a breakpoint reference — guessing widths produces layouts that break between viewport sizes

#### Why Use a Grid?

- **Design–dev alignment:** A shared column grid removes ambiguity — designers and developers reference the same column counts and gutters instead of debating pixel values
- **Responsive by default:** A grid built on column spans (not fixed widths) adapts to any viewport without rework — the same `4/8` span just gets wider on a larger screen
- **Visual consistency:** Every screen feels like it belongs in the same product when content snaps to a predictable rhythm of columns and gutters
- **Faster decisions:** No "should this card be 312px or 320px wide?" debates — the grid answers it. More time on content, less on geometry
- **Predictable scaling:** When the design system grows, new components inherit the grid automatically — you don't have to redesign layouts for each new screen
