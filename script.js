
const exprEl = document.getElementById("expr");
const resultEl = document.getElementById("result");
const modeDeg = document.getElementById("mode-deg");
const modeRad = document.getElementById("mode-rad");
const modeInv = document.getElementById("mode-inv");
const modeMem = document.getElementById("mode-mem");

let expr = "";
let isRad = false;
let isInv = false;
let memory = 0;
let hasMemory = false;
let lastAnswer = 0;
let justEvaluated = false;

function updateDisplay() {
  exprEl.textContent = expr.length ? expr : "\u00A0";
  modeMem.classList.toggle("on", hasMemory);
  modeInv.classList.toggle("on", isInv);
}

function setResult(text) {
  resultEl.textContent = text;
}

function factorial(n) {
  if (n < 0 || Math.floor(n) !== n) return NaN;
  if (n > 170) return Infinity; // past this JS just gives Infinity anyway
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

// Turn the display string into something eval() can run.
function toEvaluable(str) {
  let s = str
    .replaceAll("×", "*")
    .replaceAll("÷", "/")
    .replaceAll("−", "-")
    .replaceAll("π", "Math.PI")
    .replaceAll("e", "Math.E");

  ["sin", "cos", "tan"].forEach((fn) => {
    s = s.replaceAll(fn + "(", `__${fn}__(`);
  });

  s = s.replaceAll("sqrt(", "Math.sqrt(");
  s = s.replaceAll("log(", "Math.log10(");
  s = s.replaceAll("ln(", "Math.log(");
  s = s.replace(/(\d+(\.\d+)?)!/g, "FACT($1)");
  s = s.replaceAll("^", "**");

  return s;
}

function evaluateExpression(str) {
  const deg = !isRad;
  const FACT = factorial;
  const __sin__ = (x) => Math.sin(deg ? degToRad(x) : x);
  const __cos__ = (x) => Math.cos(deg ? degToRad(x) : x);
  const __tan__ = (x) => Math.tan(deg ? degToRad(x) : x);

  const evaluable = toEvaluable(str);
  // eslint-disable-next-line no-eval
  return eval(evaluable);
}

function evaluate() {
  if (!expr.length) return;
  try {
    let val = evaluateExpression(expr);

    if (typeof val !== "number" || !isFinite(val)) {
      setResult(Number.isNaN(val) ? "Error" : val > 0 ? "∞" : "-∞");
      return;
    }

    // trim floating point noise
    val = Math.round((val + Number.EPSILON) * 1e10) / 1e10;

    lastAnswer = val;
    setResult(String(val));
    expr = String(val);
    justEvaluated = true;
  } catch (err) {
    setResult("Error");
  }
}

function pressDigitOrDot(value) {
  if (justEvaluated) {
    expr = "";
    justEvaluated = false;
  }
  expr += value;
  setResult(expr);
}

function appendOperator(symbol) {
  if (!expr.length && symbol !== "−") return;
  justEvaluated = false;

  const ops = ["+", "−", "×", "÷"];
  const lastChar = expr.trim().slice(-1);

  // swap a trailing operator instead of stacking two in a row
  if (ops.includes(lastChar) && ops.includes(symbol)) {
    expr = expr.slice(0, -1) + symbol;
  } else {
    expr += symbol;
  }
  setResult(expr);
}

function appendFunction(name) {
  if (justEvaluated) {
    expr = "";
    justEvaluated = false;
  }
  expr += name + "(";
  setResult(expr);
}

// used by M+ / M- so memory reflects whatever is on screen right now
function currentValue() {
  if (!expr.length) return parseFloat(resultEl.textContent) || 0;
  try {
    const val = evaluateExpression(expr);
    return typeof val === "number" && isFinite(val) ? val : 0;
  } catch (e) {
    return 0;
  }
}

function handleKey(action) {
  if (/^[0-9]$/.test(action)) {
    pressDigitOrDot(action);
    return;
  }

  switch (action) {
    case ".":
      pressDigitOrDot(".");
      break;

    case "add":
      appendOperator("+");
      break;
    case "sub":
      appendOperator("−");
      break;
    case "mul":
      appendOperator("×");
      break;
    case "div":
      appendOperator("÷");
      break;

    case "lparen":
      if (justEvaluated) {
        expr = "";
        justEvaluated = false;
      }
      expr += "(";
      setResult(expr);
      break;

    case "rparen":
      expr += ")";
      setResult(expr);
      break;

    case "equals":
      evaluate();
      break;

    case "clear":
    case "ce":
      expr = "";
      justEvaluated = false;
      setResult("0");
      break;

    case "back":
      if (justEvaluated) {
        expr = "";
        justEvaluated = false;
      } else {
        expr = expr.slice(0, -1);
      }
      setResult(expr.length ? expr : "0");
      break;

    case "sign":
      if (!expr.length) break;
      if (expr.startsWith("-(") && expr.endsWith(")")) {
        expr = expr.slice(2, -1);
      } else {
        expr = `-(${expr})`;
      }
      setResult(expr);
      break;

    case "percent":
      if (!expr.length) break;
      expr = `(${expr})/100`;
      evaluate();
      break;

    case "sin":
    case "cos":
    case "tan":
    case "log":
    case "ln":
    case "sqrt":
      appendFunction(action);
      break;

    case "pow2":
      expr += "^2";
      setResult(expr);
      break;

    case "powy":
      expr += "^";
      setResult(expr);
      break;

    case "fact":
      expr += "!";
      setResult(expr);
      break;

    case "pi":
      if (justEvaluated) {
        expr = "";
        justEvaluated = false;
      }
      expr += "π";
      setResult(expr);
      break;

    case "e":
      if (justEvaluated) {
        expr = "";
        justEvaluated = false;
      }
      expr += "e";
      setResult(expr);
      break;

    case "ans":
      if (justEvaluated) {
        expr = "";
        justEvaluated = false;
      }
      expr += String(lastAnswer);
      setResult(expr);
      break;

    case "inv":
      isInv = !isInv;
      break;

    case "rad":
      isRad = !isRad;
      modeDeg.classList.toggle("on", !isRad);
      modeRad.classList.toggle("on", isRad);
      break;

    case "mplus":
      memory += currentValue();
      hasMemory = memory !== 0;
      break;

    case "mminus":
      memory -= currentValue();
      hasMemory = memory !== 0;
      break;

    case "mr":
      if (justEvaluated) {
        expr = "";
        justEvaluated = false;
      }
      expr += String(memory);
      setResult(expr);
      break;

    case "mc":
      memory = 0;
      hasMemory = false;
      break;

    default:
      return;
  }

  updateDisplay();
}

document.querySelectorAll(".key").forEach((btn) => {
  btn.addEventListener("click", () => handleKey(btn.dataset.act));
});

// basic keyboard support — nice to have, not required
window.addEventListener("keydown", (e) => {
  const key = e.key;
  if (/^[0-9]$/.test(key)) return handleKey(key);

  const map = {
    ".": ".",
    "+": "add",
    "-": "sub",
    "*": "mul",
    "/": "div",
    "(": "lparen",
    ")": "rparen",
    Enter: "equals",
    "=": "equals",
    Backspace: "back",
    Escape: "clear",
    "%": "percent",
  };

  if (map[key]) {
    if (key === "/" || key === "Enter" || key === "=") e.preventDefault();
    handleKey(map[key]);
  }
});

updateDisplay();
setResult("0");
