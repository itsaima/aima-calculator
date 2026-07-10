# AIMA Calculator

A scientific calculator built with plain HTML, CSS, and JavaScript — no frameworks, no build step.

Started as a simple layout mock and grew into something a bit more useful, with real scientific functions and a muted, low-key color scheme instead of the usual flashy calculator look.

## Screenshot

![AIMA Calculator screenshot](./screenshot.png)

## Features

- Standard arithmetic: `+ − × ÷ %` , decimals, sign toggle
- Scientific functions: `sin cos tan`, `log`, `ln`, `√x`, `x²`, `x^y`, `n!`, `π`, `e`, parentheses
- `Inv` toggle for inverse trig, `Deg`/`Rad` toggle for angle mode
- Memory: `MC` `MR` `M−` `M+`
- `Ans` to recall the last result, `CE`/`C` to clear
- Keyboard input (numbers, `+ - * /`, `Enter`, `Backspace`, `Esc`)
- Responsive layout down to small phone widths

## Running it

No install needed — just open `index.html` in a browser.

If you want live-reload while editing, the VS Code **Live Server** extension works well: right-click `index.html` → "Open with Live Server".

## Project structure

```
aima-calculator/
├── index.html   # markup
├── style.css    # layout + theme
├── script.js    # calculator logic
├── screenshot.png
└── README.md
```

## Notes

The expression parser is intentionally simple — it builds a human-readable string (using `×`, `÷`, `π`, etc.) and converts it to a JS-evaluable expression only when it needs a result. It covers the common cases well but isn't a full-blown math parser, so some unusual nested expressions may not evaluate as expected.

## License

MIT — do whatever you'd like with it.
