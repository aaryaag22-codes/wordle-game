# 🟩 Wordle — Learn While You Code

A fully working Wordle clone built with **HTML, CSS, and JavaScript**.
Every file is filled with educational comments explaining the concepts used.

---

## 📁 Project Structure

```
wordle/
├── index.html        ← The page structure
├── css/
│   └── style.css     ← All the visual styling
├── js/
│   ├── words.js      ← Word list (answers + valid guesses)
│   └── game.js       ← All the game logic
└── README.md         ← This file
```

---

## 🚀 How to Open in VS Code

1. Open VS Code
2. Go to **File → Open Folder** and select the `wordle` folder
3. Install the **Live Server** extension (Extensions tab → search "Live Server")
4. Right-click `index.html` → **"Open with Live Server"**
5. The game opens in your browser at `http://127.0.0.1:5500`

> **Why Live Server?** It auto-refreshes the browser whenever you save a file — super useful for development.

---

## 📚 What You'll Learn (Lessons in the Code)

Each lesson is commented directly in the source files:

| # | Concept | File |
|---|---------|------|
| 1 | HTML Document Structure | index.html |
| 2 | Linking CSS & JS files | index.html |
| 3 | HTML Elements & Nesting | index.html |
| 4 | `id` vs `class` | index.html |
| 5 | Script load order | index.html |
| 6 | CSS — what it is | style.css |
| 7 | CSS Custom Properties (variables) | style.css |
| 8 | The Box Model & Reset | style.css |
| 9 | Flexbox layout | style.css |
| 10 | CSS Grid | style.css |
| 11 | CSS Transitions | style.css |
| 12 | CSS Keyframe Animations | style.css |
| 13 | CSS Positioning (fixed, absolute) | style.css |
| 14 | Media Queries (responsive design) | style.css |
| 15 | JS Variables & Arrays | words.js |
| 16 | Big-picture game architecture | game.js |
| 17 | Constants | game.js |
| 18 | Mutable state with `let` | game.js |
| 19 | The DOM | game.js |
| 20 | Functions | game.js |
| 21 | `Math.random()` & array indexing | game.js |
| 22 | Nested `for` loops | game.js |
| 23 | Arrays of strings | game.js |
| 24 | `forEach` | game.js |
| 25 | Event Listeners | game.js |
| 26 | Event Objects | game.js |
| 27 | Regular Expressions | game.js |
| 28 | Early Return pattern | game.js |
| 29 | `array.join()` | game.js |
| 30 | `setTimeout` | game.js |
| 31 | The core guess-evaluation algorithm | game.js |
| 32 | `forEach` with index | game.js |
| 33 | Priority / color hierarchy | game.js |
| 34 | `Set` for fast lookup | game.js |
| 35 | Default Parameters | game.js |
| 36 | `DOMContentLoaded` | game.js |

---

## 🎮 How to Play

- Type any 5-letter word and press **Enter**
- You have **6 attempts** to guess the secret word
- After each guess, tiles reveal colours:
  - 🟩 **Green** — right letter, right position
  - 🟨 **Yellow** — right letter, wrong position
  - ⬛ **Grey** — letter not in the word

---

## 💡 Challenges to Try (After Understanding the Code)

1. **Hard Mode**: Once a correct/present letter is found, force it to be used in subsequent guesses
2. **Statistics**: Track wins/losses using `localStorage`
3. **Dark/Light toggle**: Use a CSS class on `<body>` and toggle it with a button
4. **Countdown timer**: Add a timer showing time taken to solve
5. **Custom word**: Let the player set their own word for a friend to guess

---

## 🔧 VS Code Tips

- **Alt + Z** → toggle word wrap
- **Ctrl + /` (backtick) → open the integrated terminal
- **Ctrl + Shift + P** → command palette (search any VS Code action)
- **Ctrl + Click** on a function name → jump to its definition
- Install **"Prettier"** extension for auto-formatting your code
