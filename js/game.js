/*
  ============================================================
  📚 LESSON 16: HOW THIS GAME WORKS (BIG PICTURE)
  ============================================================
  Here's the flow of the game:
    1. Pick a random secret word from WORDS array
    2. Build the board (6 rows × 5 tiles) and keyboard in HTML
    3. Listen for keyboard input (physical or on-screen)
    4. When the player types a letter → fill the current tile
    5. When player presses ENTER → evaluate the guess:
         - Is it 5 letters? Is it a valid word?
         - Compare each letter to the secret word
         - Color tiles: correct / present / absent
         - Update the on-screen keyboard colors
         - Check win or loss condition
  ============================================================
*/

"use strict";
/*
  📚 "use strict" makes JavaScript stricter:
  - Can't use undeclared variables
  - Catches silent errors
  Always use it at the top of your scripts.
*/

// ── CONSTANTS ─────────────────────────────────────────────
/*
  📚 LESSON 17: CONSTANTS
  These values never change during the game.
  Naming constants in UPPERCASE is a convention to make
  them easy to spot.
*/
const MAX_ROWS    = 6;   // 6 guesses allowed
const WORD_LENGTH = 5;   // 5-letter words

// ── GAME STATE ─────────────────────────────────────────────
/*
  📚 LESSON 18: MUTABLE STATE WITH let
  These variables DO change as the game progresses.
  Keeping all state in one place makes it easy to manage.
*/
let secretWord   = "";          // the word the player must guess
let currentRow   = 0;           // which row (guess) we're on (0–5)
let currentCol   = 0;           // which column (letter) we're on (0–4)
let currentGuess = [];          // array of letters typed so far
let gameOver     = false;       // has the game ended?

// ── DOM REFERENCES ─────────────────────────────────────────
/*
  📚 LESSON 19: DOM — The Document Object Model
  The DOM is the browser's representation of your HTML as
  JavaScript objects. You can find elements and change them.

  document.getElementById("id")  → find ONE element by its id
  document.querySelector(".cls") → find first element with class

  We store references so we don't have to search the DOM
  repeatedly — it's faster and cleaner.
*/
const boardEl    = document.getElementById("board");
const keyboardEl = document.getElementById("keyboard");
const messageEl  = document.getElementById("message");
const modalEl    = document.getElementById("modal-overlay");

// ── INITIALISE ─────────────────────────────────────────────
/*
  📚 LESSON 20: FUNCTIONS
  A function is a reusable block of code.
  You DEFINE it once, then CALL it whenever needed.

  function name(parameters) {
    // code to run
  }

  Arrow functions are a shorter syntax:
  const name = (params) => { ... }
*/
function init() {
  secretWord = pickWord();         // choose a random answer
  buildBoard();                    // create the 6×5 tile grid
  buildKeyboard();                 // create the on-screen keyboard
  attachKeyboardListeners();       // listen for physical keyboard
}

// ── PICK A WORD ────────────────────────────────────────────
function pickWord() {
  /*
    📚 LESSON 21: MATH.RANDOM & ARRAY INDEXING
    Math.random()  → random decimal between 0 and 1 (e.g. 0.734)
    Math.floor()   → rounds DOWN to the nearest integer
    array.length   → number of items in the array

    So: Math.floor(Math.random() * WORDS.length)
    gives a random integer from 0 to WORDS.length - 1
    which is a valid index into the array.
  */
  const index = Math.floor(Math.random() * WORDS.length);
  return WORDS[index].toUpperCase();  // e.g. "CRANE"
}

// ── BUILD BOARD ────────────────────────────────────────────
function buildBoard() {
  boardEl.innerHTML = "";  // clear any existing content
  /*
    📚 LESSON 22: NESTED LOOPS
    A loop repeats code a number of times.
    for (let i = 0; i < max; i++) { ... }
      - let i = 0  → start at 0
      - i < max    → keep going while i is less than max
      - i++        → add 1 to i each time (i++ means i = i + 1)

    Here we loop 6 rows × 5 columns = 30 tiles total.
  */
  for (let row = 0; row < MAX_ROWS; row++) {
    for (let col = 0; col < WORD_LENGTH; col++) {
      const tile = document.createElement("div");
      /*
        document.createElement("div") creates a new <div>
        element in memory (not yet on the page).
      */
      tile.classList.add("tile");
      tile.id = `tile-${row}-${col}`;
      /*
        Template literals (backticks ``) let you embed
        variables into strings with ${variable}.
        tile-0-0, tile-0-1, ... tile-5-4
      */
      boardEl.appendChild(tile);
      /*
        .appendChild() adds the tile as the LAST child
        of the board element — now it's on the page!
      */
    }
  }
}

// ── BUILD KEYBOARD ─────────────────────────────────────────
function buildKeyboard() {
  /*
    📚 LESSON 23: ARRAYS OF STRINGS
    We define the keyboard layout as 3 arrays of strings.
    Each string is one row of keys.
  */
  const rows = [
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["ENTER","Z","X","C","V","B","N","M","⌫"]
  ];

  keyboardEl.innerHTML = "";

  rows.forEach(rowKeys => {
    /*
      📚 LESSON 24: forEach
      array.forEach(callback) runs a function for EACH item.
      It's like a for-loop but reads more naturally.
      rowKeys → each sub-array (one row of letters)
    */
    const rowEl = document.createElement("div");
    rowEl.classList.add("keyboard-row");

    rowKeys.forEach(key => {
      const btn = document.createElement("button");
      btn.textContent = key;
      btn.classList.add("key");
      btn.dataset.key = key;
      /*
        dataset.key stores data in the HTML as data-key="Q"
        We use this later to identify which key was clicked.
      */

      if (key === "ENTER" || key === "⌫") {
        btn.classList.add("wide");
      }

      btn.addEventListener("click", () => handleKey(key));
      /*
        📚 LESSON 25: EVENT LISTENERS
        .addEventListener(event, handler) says:
        "When THIS event happens on THIS element,
         run THIS function."

        "click"  → fires when the element is clicked
        () => handleKey(key) is an arrow function.
        It calls handleKey with the key's label as argument.
      */

      rowEl.appendChild(btn);
    });

    keyboardEl.appendChild(rowEl);
  });
}

// ── PHYSICAL KEYBOARD LISTENER ──────────────────────────────
function attachKeyboardListeners() {
  document.addEventListener("keydown", (event) => {
    /*
      📚 LESSON 26: EVENT OBJECTS
      The browser passes an EVENT OBJECT to your handler.
      It contains info about what happened:
        event.key → the key that was pressed ("a", "Enter", etc.)
    */
    if (gameOver) return;  // do nothing if game has ended

    const key = event.key.toUpperCase();

    if (key === "ENTER") {
      handleKey("ENTER");
    } else if (key === "BACKSPACE") {
      handleKey("⌫");
    } else if (/^[A-Z]$/.test(key)) {
      /*
        📚 LESSON 27: REGULAR EXPRESSIONS (RegEx)
        /^[A-Z]$/ is a regular expression (pattern).
        ^     → start of string
        [A-Z] → any uppercase letter A through Z
        $     → end of string

        .test(key) returns true if key matches the pattern.
        So this checks: "is it exactly one letter A-Z?"
      */
      handleKey(key);
    }
  });
}

// ── HANDLE EACH KEY PRESS ──────────────────────────────────
function handleKey(key) {
  if (gameOver) return;

  if (key === "⌫") {
    deleteLetter();
  } else if (key === "ENTER") {
    submitGuess();
  } else {
    addLetter(key);
  }
}

// ── ADD A LETTER ───────────────────────────────────────────
function addLetter(letter) {
  if (currentCol >= WORD_LENGTH) return;  // row is full, ignore
  /*
    📚 LESSON 28: EARLY RETURN
    Returning early from a function is a clean way to handle
    conditions where you don't want to continue.
  */

  currentGuess.push(letter);  // add to our guess array
  /*
    array.push(item) adds an item to the END of an array.
    currentGuess might look like: ["C","R","A","N"]
  */

  const tile = getTile(currentRow, currentCol);
  tile.textContent = letter;       // show the letter
  tile.classList.add("filled");    // trigger the "pop" animation

  currentCol++;                    // advance to next column
}

// ── DELETE A LETTER ────────────────────────────────────────
function deleteLetter() {
  if (currentCol === 0) return;    // nothing to delete

  currentCol--;
  currentGuess.pop();
  /*
    array.pop() removes and returns the LAST item.
    The opposite of push().
  */

  const tile = getTile(currentRow, currentCol);
  tile.textContent = "";
  tile.classList.remove("filled");
}

// ── SUBMIT A GUESS ─────────────────────────────────────────
function submitGuess() {
  if (currentCol < WORD_LENGTH) {
    showMessage("Not enough letters");
    shakeRow(currentRow);
    return;
  }

  const guessWord = currentGuess.join("");
  /*
    📚 LESSON 29: array.join()
    array.join(separator) combines all array items into a string.
    ["C","R","A","N","E"].join("") → "CRANE"
    ["C","R","A","N","E"].join("-") → "C-R-A-N-E"
  */

  if (!isValidWord(guessWord)) {
    showMessage("Not in word list");
    shakeRow(currentRow);
    return;
  }

  const result = evaluateGuess(guessWord);
  revealRow(currentRow, result);

  // Check win / loss AFTER the flip animation finishes
  const delay = WORD_LENGTH * 300 + 400;
  setTimeout(() => {
    /*
      📚 LESSON 30: setTimeout
      setTimeout(function, milliseconds) calls a function
      AFTER a delay. It's non-blocking — other code keeps
      running while we wait.
      Here we wait for the flip animations to finish first.
    */
    if (guessWord === secretWord) {
      celebrateWin();
    } else if (currentRow >= MAX_ROWS - 1) {
      showMessage(secretWord, 4000);
    }
  }, delay);

  currentRow++;
  currentCol   = 0;
  currentGuess = [];

  if (currentRow >= MAX_ROWS) {
    gameOver = true;
  }
}

// ── EVALUATE GUESS ─────────────────────────────────────────
/*
  📚 LESSON 31: THE CORE ALGORITHM
  This is the most complex part — let's walk through it.

  We compare guessWord to secretWord letter by letter.
  Each letter gets a status: "correct", "present", or "absent"

  The tricky part: handling DUPLICATE letters correctly.
  Example: secret = "CRANE", guess = "GREET"
    G → absent  (no G in CRANE)
    R → present (R is in CRANE but wrong position)
    E → correct (E is at position 2 in both)
    E → absent  (only ONE E in CRANE, already accounted for)
    T → absent  (no T in CRANE)

  Two-pass approach:
  Pass 1: Find all CORRECT letters (right letter, right spot)
  Pass 2: Find PRESENT letters (right letter, wrong spot)
          A letter can only be "present" if it's not been
          used up by a "correct" match.
*/
function evaluateGuess(guess) {
  const result    = Array(WORD_LENGTH).fill("absent");
  const secretArr = secretWord.split("");  // ["C","R","A","N","E"]
  const guessArr  = guess.split("");
  /*
    📚 String.split(separator) breaks a string into an array.
    "CRANE".split("") → ["C","R","A","N","E"]
  */

  // Track which secret letters have been "used up"
  const used = Array(WORD_LENGTH).fill(false);

  // PASS 1: Mark correct letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessArr[i] === secretArr[i]) {
      result[i] = "correct";
      used[i]   = true;
    }
  }

  // PASS 2: Mark present letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "correct") continue;
    /*
      continue skips the rest of this loop iteration
      and moves to the next one.
    */

    for (let j = 0; j < WORD_LENGTH; j++) {
      if (!used[j] && guessArr[i] === secretArr[j]) {
        result[i] = "present";
        used[j]   = true;
        break;
        /*
          break exits the inner loop entirely.
          We stop once we find a match for this letter.
        */
      }
    }
  }

  return result;  // e.g. ["absent","correct","present","absent","absent"]
}

// ── REVEAL ROW WITH FLIP ANIMATION ─────────────────────────
function revealRow(row, result) {
  result.forEach((status, col) => {
    /*
      📚 LESSON 32: forEach with INDEX
      .forEach((item, index) => { ... }) also gives you
      the index (position) of each item.
      Here: status = "correct"/"present"/"absent", col = 0–4
    */
    const tile = getTile(row, col);
    const delay = col * 300;  // stagger the flips: 0ms, 300ms, 600ms...

    setTimeout(() => {
      tile.classList.add("flip");
      setTimeout(() => {
        tile.classList.add(status);     // color the tile
        tile.classList.remove("flip");
        updateKeyColor(currentGuess[col] || tile.textContent, status);
      }, 250);  // halfway through the flip
    }, delay);
  });
}

// ── UPDATE KEYBOARD COLOR ──────────────────────────────────
/*
  📚 LESSON 33: PRIORITY / COLOR HIERARCHY
  We only UPDATE a key's color if the new status is "better."
  correct > present > absent
  Once a key is green (correct), we never downgrade it.
*/
const COLOR_PRIORITY = { correct: 3, present: 2, absent: 1 };

function updateKeyColor(letter, status) {
  const btn = keyboardEl.querySelector(`[data-key="${letter}"]`);
  if (!btn) return;

  const current = btn.dataset.status || "none";
  const oldPriority = COLOR_PRIORITY[current] || 0;
  const newPriority = COLOR_PRIORITY[status]  || 0;

  if (newPriority > oldPriority) {
    btn.classList.remove("correct", "present", "absent");
    btn.classList.add(status);
    btn.dataset.status = status;
  }
}

// ── VALIDATE WORD ──────────────────────────────────────────
function isValidWord(word) {
  /*
    📚 LESSON 34: Set.has()
    A Set is like an array but:
    - No duplicate values
    - Super fast to check if a value exists (.has())
    We use it for VALID_GUESSES for O(1) lookup speed.
  */
  return VALID_GUESSES.has(word) || WORDS.includes(word.toLowerCase());
}

// ── WIN! ───────────────────────────────────────────────────
function celebrateWin() {
  gameOver = true;
  const messages = ["Genius!", "Magnificent!", "Impressive!", "Splendid!", "Great!", "Phew!"];
  showMessage(messages[Math.min(currentRow - 1, messages.length - 1)], 3000);
  /*
    Math.min(a, b) returns the smaller of a or b.
    This prevents going out of bounds on the messages array.
    currentRow - 1 because we already incremented it.
  */
  bounceTiles(currentRow - 1);
  setTimeout(offerRestart, 2000);
}

function bounceTiles(row) {
  for (let col = 0; col < WORD_LENGTH; col++) {
    const tile  = getTile(row, col);
    const delay = col * 100;
    setTimeout(() => tile.classList.add("bounce"), delay);
  }
}

// ── RESTART ────────────────────────────────────────────────
function offerRestart() {
  showMessage("▶ Play Again? Click here!", 0);
  messageEl.style.cursor = "pointer";
  messageEl.addEventListener("click", restartGame, { once: true });
  /*
    { once: true } means the listener fires only ONCE
    then automatically removes itself. Very handy!
  */
}

function restartGame() {
  // Reset all state
  gameOver     = false;
  currentRow   = 0;
  currentCol   = 0;
  currentGuess = [];
  messageEl.style.cursor = "default";
  hideMessage();

  // Reset keyboard colors
  keyboardEl.querySelectorAll(".key").forEach(btn => {
    btn.classList.remove("correct", "present", "absent");
    delete btn.dataset.status;
    /*
      delete removes a property from an object entirely.
    */
  });

  // Pick new word and rebuild board
  secretWord = pickWord();
  buildBoard();
}

// ── ANIMATIONS & HELPERS ───────────────────────────────────
function shakeRow(row) {
  for (let col = 0; col < WORD_LENGTH; col++) {
    const tile = getTile(row, col);
    tile.classList.add("shake");
    tile.addEventListener("animationend", () => tile.classList.remove("shake"), { once: true });
    /*
      "animationend" fires when a CSS animation finishes.
      We remove the class so the animation can fire again next time.
    */
  }
}

function getTile(row, col) {
  return document.getElementById(`tile-${row}-${col}`);
}

// ── MESSAGES ───────────────────────────────────────────────
let messageTimer = null;

function showMessage(text, duration = 1500) {
  /*
    📚 LESSON 35: DEFAULT PARAMETERS
    duration = 1500 means: if the caller doesn't pass a value,
    duration defaults to 1500.
    You can override it: showMessage("Hey", 3000)
  */
  messageEl.textContent = text;
  messageEl.classList.add("show");

  if (messageTimer) clearTimeout(messageTimer);
  /*
    clearTimeout() cancels a pending setTimeout so we
    don't hide the message too early if a new one appears.
  */

  if (duration > 0) {
    messageTimer = setTimeout(hideMessage, duration);
  }
}

function hideMessage() {
  messageEl.classList.remove("show");
  messageEl.textContent = "";
}

// ── MODAL (How to Play) ─────────────────────────────────────
document.getElementById("modal-close").addEventListener("click", () => {
  modalEl.classList.add("hidden");
  init();
  /*
    We only start the game AFTER the modal is dismissed.
    This way the player sees the instructions first.
  */
});

document.getElementById("play-btn").addEventListener("click", () => {
  modalEl.classList.add("hidden");
  init();
});

/*
  📚 LESSON 36: DOMContentLoaded
  This event fires when the HTML is fully parsed but before
  images and stylesheets finish loading. It's a safe place
  to run code that touches the DOM.

  We show the "How to Play" modal first, then init() is called
  when the player clicks Play!
*/
document.addEventListener("DOMContentLoaded", () => {
  // Modal is shown by default (no "hidden" class in HTML)
  // Game starts after player dismisses the modal.
});
