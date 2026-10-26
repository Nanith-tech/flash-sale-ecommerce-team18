# DROP design direction

## North star

A contemporary independent design shop meets a limited-edition product drop. A pale lavender photographic stage, assertive black sans-serif type, electric orange actions, and precisely aligned commerce information. The shop is expressive; the cart is quiet and task-focused. Avoid marketplace clutter, decorative urgency claims, gradients and rounded dashboard panels.

## System ownership

Canonical runtime tokens live in `frontend/src/styles/tokens.css`. This document records intent; components consume the CSS variables directly. Update both when changing the system.

| Role          | Token          | Value   |
| ------------- | -------------- | ------- |
| Canvas        | --canvas       | #fcfcfa |
| Ink           | --ink          | #20211f |
| Muted text    | --muted        | #64645f |
| Action        | --accent       | #c94320 |
| Action hover  | --accent-hover | #ad3517 |
| Quiet surface | --surface      | #f0f0ec |
| Rule          | --line         | #deded8 |
| Hero          | --hero         | #e8e5ef |

## Typography and composition

Self-hosted DM Sans Variable for display, body and controls. Headline 88px on desktop, 48px mobile, weight 650, -0.04em tracking; body 15px with 1.6 leading. Tabular countdown numerals. Max content width 1440px; 56px desktop outer margin, 20px phone. Four-column product grid becomes two at tablet and one on small mobile. Hero is a 52/48 split stage with a large product photograph, stacking on mobile. Large whitespace separates sections; product details are grouped tightly.

## Shape, icon and motion grammar

Mostly square composition, 4px controls, 12px photographic stages, pill shape only for compact filters. Phosphor icons, regular weight. Quiet 180ms hover transitions. The single entrance moment is the hero image and headline revealing together; the cart enters in 240ms. All motion respects reduced-motion preferences. No continuous decorative animation.

## Behavior and states

Orange means an action; a dark pill identifies the current filter. Availability uses text plus a meaningful stock track. The persistent demo countdown uses a browser-local deadline and monotonic elapsed time. Product loading reserves image space. Errors include retry. Empty search offers clear filters. Cart is a native modal dialog with an accessible title, focus containment, Escape close and focus return. Saved items, categories, sort, search and product details all operate. Checkout shows pending, recoverable error and demo confirmation states. Cart quantities are checked against illustrative stock but reserve nothing.

## Surface brief: / (Persuade + Operate)

First viewport: slim announcement including a demo label, wordmark/navigation, large split hero announcing “Good design. Great timing.” and a single collection CTA. The right photographic stage features headphones at oversized scale against a muted mauve studio backdrop. A browser-local countdown strip leads directly into the filterable product collection. Signature interaction: a product's quick-add becomes an in-cart state; the cart drawer retains the visual context of the collection. No ratings, purchase counts or fabricated testimonials.
