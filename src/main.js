const MATRIX_STATE = {
  IDLE: "idle",
  ANIMATION: "animation",
  TEXT: "text",
};

let matrixState = MATRIX_STATE.IDLE;
let scrollPosition = 0;
let scrollTimer = null;

const pixels = document.querySelectorAll(".pixel");
const textInput = document.querySelector(".input");
const stickerBtn = document.querySelector(".icon");
const sendBtn = document.querySelector(".send-btn");
const stopBtn = document.querySelector(".stop-btn");
const closeicon = document.querySelector(".close-icon");
const iconpage = document.querySelector(".icon-page");

const heart = document.querySelector(".fa-heart");
const smile = document.querySelector(".smile-icon");
const music = document.querySelector(".fa-music");
const ghost = document.querySelector(".fa-ghost");
const fire = document.querySelector(".fa-fire");
const skull = document.querySelector(".fa-skull");

stickerBtn.addEventListener("click", () => {
  iconpage.classList.remove("hidden");
});

closeicon.addEventListener("click", () => {
  iconpage.classList.add("hidden");
});

function turnOnPixel(row, col) {
  const pixel = document.querySelector(
    `.pixel[data-row="${row}"][data-col="${col}"]`,
  );

  if (!pixel) return;

  pixel.querySelector(".on-pixel").classList.remove("hidden");
  pixel.querySelector(".off-pixel").classList.add("hidden");
}

function turnOffPixel(row, col) {
  const pixel = document.querySelector(
    `.pixel[data-row="${row}"][data-col="${col}"]`,
  );

  if (!pixel) return;

  pixel.querySelector(".on-pixel").classList.add("hidden");
  pixel.querySelector(".off-pixel").classList.remove("hidden");
}

function clearMatrix() {
  pixels.forEach((pixel) => {
    pixel.querySelector(".on-pixel").classList.add("hidden");
    pixel.querySelector(".off-pixel").classList.remove("hidden");
  });
}

const letters = {
  A: ["0110", "1001", "1111", "1001", "1001", "1001"],

  B: ["1110", "1001", "1110", "1001", "1001", "1110"],

  C: ["0111", "1000", "1000", "1000", "1000", "0111"],

  D: ["1110", "1001", "1001", "1001", "1001", "1110"],

  E: ["1111", "1000", "1110", "1000", "1000", "1111"],

  F: ["1111", "1000", "1110", "1000", "1000", "1000"],

  G: ["0111", "1000", "1011", "1001", "1001", "0111"],

  H: ["1001", "1001", "1111", "1001", "1001", "1001"],

  I: ["111", "010", "010", "010", "010", "111"],

  J: ["0011", "0001", "0001", "0001", "1001", "0110"],

  K: ["1001", "1010", "1100", "1100", "1010", "1001"],

  L: ["1000", "1000", "1000", "1000", "1000", "1111"],

  M: ["10001", "11011", "10101", "10101", "10001", "10001"],

  N: ["1001", "1101", "1101", "1011", "1011", "1001"],

  O: ["0110", "1001", "1001", "1001", "1001", "0110"],

  P: ["1110", "1001", "1001", "1110", "1000", "1000"],

  Q: ["0110", "1001", "1001", "1011", "0110", "0001"],

  R: ["1110", "1001", "1001", "1110", "1010", "1001"],

  S: ["0111", "1000", "0110", "0001", "0001", "1110"],

  T: ["11111", "00100", "00100", "00100", "00100", "00100"],

  U: ["1001", "1001", "1001", "1001", "1001", "0110"],

  V: ["10001", "10001", "10001", "10001", "01010", "00100"],

  W: ["10001", "10001", "10101", "10101", "11011", "10001"],

  X: ["1001", "1001", "0110", "0110", "1001", "1001"],

  Y: ["10001", "01010", "00100", "00100", "00100", "00100"],

  Z: ["1111", "0001", "0010", "0100", "1000", "1111"],
};

function showLetter(letter) {
  clearMatrix();

  const pattern = letters[letter.toUpperCase()];

  if (!pattern) return;

  const letterWidth = pattern[0].length;
  const startCol = Math.floor((13 - letterWidth) / 2);
  const startRow = Math.floor((8 - pattern.length) / 2);

  pattern.forEach((row, rowIndex) => {
    row.split("").forEach((pixel, colIndex) => {
      if (pixel === "1") {
        turnOnPixel(startRow + rowIndex, startCol + colIndex);
      }
    });
  });

  matrixState = MATRIX_STATE.TEXT;
}

function convertLetterToColumns(letter) {
  const pattern = letters[letter.toUpperCase()];

  if (!pattern) return [];

  const columns = [];

  for (let col = 0; col < pattern[0].length; col++) {
    const column = [];

    for (let row = 0; row < pattern.length; row++) {
      column.push(pattern[row][col]);
    }

    columns.push(column);
  }

  return columns;
}

function createTextStrip(text) {
  const textColumns = [];

  for (const letter of text.toUpperCase()) {
    const letterColumns = convertLetterToColumns(letter);

    if (letterColumns.length === 0) continue;

    textColumns.push(...letterColumns);

    // یک ستون فاصله بین حروف
    textColumns.push(["0", "0", "0", "0", "0", "0"]);
  }

  return textColumns;
}

function renderFrame(textColumns, position) {
  clearMatrix();

  const startRow = Math.floor((8 - 6) / 2);

  for (let col = 0; col < 13; col++) {
    const currentColumn = textColumns[position + col];

    if (!currentColumn) continue;

    for (let row = 0; row < 6; row++) {
      if (currentColumn[row] === "1") {
        turnOnPixel(startRow + row, col);
      }
    }
  }
}

function startScrolling(text) {
  const textColumns = createTextStrip(text);

  if (textColumns.length === 0) return;

  clearInterval(scrollTimer);

  const blankColumn = ["0", "0", "0", "0", "0", "0"];

  const scrollColumns = [
    ...Array(13).fill(blankColumn),
    ...textColumns,
    ...Array(13).fill(blankColumn),
  ];

  scrollPosition = 0;

  matrixState = MATRIX_STATE.ANIMATION;

  renderFrame(scrollColumns, scrollPosition);

  scrollTimer = setInterval(() => {
    scrollPosition++;

    if (scrollPosition > scrollColumns.length - 13) {
      scrollPosition = 0;
    }

    renderFrame(scrollColumns, scrollPosition);
  }, 150);
}

function handleTextSubmit() {
  const text = textInput.value.trim();

  if (!text) return;

  startScrolling(text);

  textInput.value = "";

  sendBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
}

function stopScrolling() {
  clearInterval(scrollTimer);

  matrixState = MATRIX_STATE.IDLE;

  clearMatrix();

  stopBtn.classList.add("hidden");
  sendBtn.classList.remove("hidden");

  clearInterval(heartAnimationTimer);
  clearTimeout(heartTimeout);

  heartAnimationTimer = null;
  heartTimeout = null;

  clearMatrix();
}

stopBtn.addEventListener("click", stopScrolling);
sendBtn.addEventListener("click", handleTextSubmit);

// icon animation
const heartPattern = [
  "0000000000000",
  "0011100011100",
  "0111110111110",
  "0111111111110",
  "0011111111100",
  "0001111111000",
  "0000111110000",
  "0000011100000",
];

// Smile Animation
const smilePattern = [
  "0000000000000",
  "0000111110000",
  "0001000001000",
  "0010100010100",
  "0010100010100",
  "0010000000100",
  "0001011101000",
  "0000111110000",
];

// Music Animation
const musicPattern = [
  "0000000",
  "0011110",
  "0010010",
  "0010010",
  "0010010",
  "0110110",
  "0110110",
  "0000000",
];

// Ghost Animation
const ghostFrames = [
  [
    "0000111110000",
    "0001000001000",
    "0010110110100",
    "0010110110100",
    "0010000000100",
    "0010000000100",
    "0011111111100",
    "0010010100100",
  ],

  [
    "0000111110000",
    "0001000001000",
    "0010110110100",
    "0010110110100",
    "0010000000100",
    "0010000000100",
    "0001111111000",
    "0001010101000",
  ],

  [
    "0000111110000",
    "0001000001000",
    "0010110110100",
    "0010110110100",
    "0010000000100",
    "0010000000100",
    "0011111111100",
    "0000101010000",
  ],
];

// Fire Animation
const fireFrames = [
  // فریم اول
  [
    "0000100010000",
    "0001100110000",
    "0011101111000",
    "0011111111100",
    "0111010111110",
    "0111111111110",
    "0011111111100",
    "0001111111000",
  ],

  // فریم دوم
  [
    "0000010001000",
    "0000110011000",
    "0001110111000",
    "0011111111100",
    "0111110101110",
    "0111111111110",
    "0011111111100",
    "0001111111000",
  ],

  // فریم سوم
  [
    "0000100010000",
    "0001100111000",
    "0011101110000",
    "0011111111100",
    "0111011111110",
    "0111111111110",
    "0011111111100",
    "0001111111000",
  ],
];

// Skull Sticker
const skullPattern = [
  "0000111110000",
  "0001111111000",
  "0011000001100",
  "0010110110100",
  "0010110110100",
  "0001100011000",
  "0000111110000",
  "0000010100000",
];

function showSkull() {
  clearMatrix();

  skullPattern.forEach((row, rowIndex) => {
    row.split("").forEach((pixel, colIndex) => {
      if (pixel === "1") {
        turnOnPixel(rowIndex, colIndex);
      }
    });
  });

  matrixState = MATRIX_STATE.TEXT;
}

function playFireAnimation() {
  clearInterval(scrollTimer);
  clearInterval(heartAnimationTimer);
  clearTimeout(heartTimeout);

  clearMatrix();

  let frameIndex = 0;

  function renderFire(pattern) {
    clearMatrix();

    pattern.forEach((row, rowIndex) => {
      row.split("").forEach((pixel, colIndex) => {
        if (pixel === "1") {
          turnOnPixel(rowIndex, colIndex);
        }
      });
    });
  }

  renderFire(fireFrames[0]);

  heartAnimationTimer = setInterval(() => {
    frameIndex = (frameIndex + 1) % fireFrames.length;

    renderFire(fireFrames[frameIndex]);
  }, 250);
}

function playGhostAnimation() {
  clearInterval(scrollTimer);
  clearInterval(heartAnimationTimer);
  clearTimeout(heartTimeout);

  clearMatrix();

  let frameIndex = 0;

  function renderGhost(pattern) {
    clearMatrix();

    pattern.forEach((row, rowIndex) => {
      row.split("").forEach((pixel, colIndex) => {
        if (pixel === "1") {
          turnOnPixel(rowIndex, colIndex);
        }
      });
    });
  }

  renderGhost(ghostFrames[0]);

  heartAnimationTimer = setInterval(() => {
    frameIndex = (frameIndex + 1) % ghostFrames.length;

    renderGhost(ghostFrames[frameIndex]);
  }, 200);
}

function playMusicAnimation() {
  clearInterval(scrollTimer);
  clearInterval(heartAnimationTimer);
  clearTimeout(heartTimeout);

  clearMatrix();

  let shakePosition = 0;

  const shakeFrames = [0, -1, 0, 1];

  function renderMusic(offset) {
    clearMatrix();

    const startRow = Math.floor((8 - musicPattern.length) / 2);
    const startCol = Math.floor((13 - musicPattern[0].length) / 2);

    musicPattern.forEach((row, rowIndex) => {
      row.split("").forEach((pixel, colIndex) => {
        if (pixel === "1") {
          turnOnPixel(startRow + rowIndex, startCol + colIndex + offset);
        }
      });
    });
  }

  renderMusic(0);

  heartAnimationTimer = setInterval(() => {
    const offset = shakeFrames[shakePosition];

    renderMusic(offset);

    shakePosition = (shakePosition + 1) % shakeFrames.length;
  }, 500);
}

function showSmile() {
  clearMatrix();

  smilePattern.forEach((row, rowIndex) => {
    row.split("").forEach((pixel, colIndex) => {
      if (pixel === "1") {
        turnOnPixel(rowIndex, colIndex);
      }
    });
  });

  matrixState = MATRIX_STATE.TEXT;
}

function getHeartPixels() {
  const heartPixels = [];

  heartPattern.forEach((row, rowIndex) => {
    for (let col = 12; col >= 0; col--) {
      if (row[col] === "1") {
        heartPixels.push({
          row: rowIndex,
          col: col,
        });
      }
    }
  });

  return heartPixels;
}

let heartAnimationTimer = null;
let heartTimeout = null;

function playHeartAnimation() {
  clearInterval(scrollTimer);
  clearInterval(heartAnimationTimer);
  clearTimeout(heartTimeout);

  const heartPixels = getHeartPixels();

  let pixelIndex = 0;
  let phase = "enter";

  clearMatrix();

  heartAnimationTimer = setInterval(() => {
    if (phase === "enter") {
      const pixel = heartPixels[pixelIndex];

      turnOnPixel(pixel.row, pixel.col);

      pixelIndex++;

      if (pixelIndex >= heartPixels.length) {
        clearInterval(heartAnimationTimer);

        phase = "wait";

        heartTimeout = setTimeout(() => {
          phase = "exit";
          pixelIndex = 0;

          heartAnimationTimer = setInterval(runExit, 35);
        }, 5000);
      }
    }
  }, 35);

  function runExit() {
    const pixel = heartPixels[pixelIndex];

    turnOffPixel(pixel.row, pixel.col);

    pixelIndex++;

    if (pixelIndex >= heartPixels.length) {
      clearInterval(heartAnimationTimer);
      heartAnimationTimer = null;

      heartTimeout = setTimeout(() => {
        playHeartAnimation();
      }, 300);
    }
  }
}

heart.addEventListener("click", () => {
  playHeartAnimation();
  iconpage.classList.add("hidden");
  sendBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
});

smile.addEventListener("click", () => {
  showSmile();
  iconpage.classList.add("hidden");
  sendBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
});

music.addEventListener("click", () => {
  playMusicAnimation();
  iconpage.classList.add("hidden");
  sendBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
});

ghost.addEventListener("click", () => {
  playGhostAnimation();
  iconpage.classList.add("hidden");
  sendBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
});

fire.addEventListener("click", () => {
  playFireAnimation();
  iconpage.classList.add("hidden");
  sendBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
});

skull.addEventListener("click", () => {
  showSkull();
  iconpage.classList.add("hidden");
  sendBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
});

// Loding
window.addEventListener("load", async () => {
  const images = [...document.images];

  await Promise.all(images.map((img) => img.decode().catch(() => {})));

  await document.fonts.ready;

  document.querySelector(".loader-page").classList.add("hidden");
});

document.querySelector(".loader-page").classList.add("hidden");

// playIntroAnimation
async function playTetrisFillAnimation() {
  clearMatrix();
  matrixState = MATRIX_STATE.ANIMATION;

  const ROWS = 8;
  const COLS = 13;
  const SPEED = 100;

  const board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const pieces = [
    { x: 0, y: 1, shape: ["10", "11", "01"] },
    { x: 1, y: 1, shape: ["111", "001"] },
    { x: 0, y: 3, shape: ["1", "1", "1", "1"] },
    { x: 0, y: 6, shape: ["011", "110"] },
    { x: 2, y: 6, shape: ["01", "11"] },

    { x: 2, y: 2, shape: ["10", "11", "10"] },
    { x: 1, y: 4, shape: ["100", "111"] },
    { x: 3, y: 4, shape: ["110", "011"] },
    { x: 4, y: 6, shape: ["11", "11"] },

    { x: 4, y: 1, shape: ["111", "100"] },
    { x: 4, y: 2, shape: ["010", "111"] },
    { x: 5, y: 4, shape: ["111", "010"] },
    { x: 6, y: 1, shape: ["010", "110", "010"] },

    { x: 6, y: 5, shape: ["01", "11", "10"] },
    { x: 7, y: 6, shape: ["001", "111"] },
    { x: 8, y: 4, shape: ["10", "11", "10"] },

    { x: 8, y: 1, shape: ["1111"] },
    { x: 10, y: 1, shape: ["001", "111"] },
    { x: 8, y: 2, shape: ["11", "11"] },
    { x: 9, y: 4, shape: ["111", "001"] },
    { x: 10, y: 3, shape: ["111", "001"] },
    { x: 10, y: 5, shape: ["10", "10", "11"] },
    { x: 11, y: 5, shape: ["01", "11", "01"] },
  ];

  pieces.sort((a, b) => b.y - a.y);

  function render(activePiece = null, activeY = 0) {
    clearMatrix();

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c]) {
          turnOnPixel(r, c);
        }
      }
    }

    if (activePiece) {
      activePiece.shape.forEach((line, r) => {
        [...line].forEach((value, c) => {
          if (value === "1") {
            const row = activeY + r;
            const col = activePiece.x + c;

            if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
              turnOnPixel(row, col);
            }
          }
        });
      });
    }
  }

  for (const piece of pieces) {
    const height = piece.shape.length;
    const startY = -height;

    for (let y = startY; y <= piece.y; y++) {
      render(piece, y);
      await wait(SPEED);
    }

    piece.shape.forEach((line, r) => {
      [...line].forEach((value, c) => {
        if (value === "1") {
          board[piece.y + r][piece.x + c] = 1;
        }
      });
    });

    render();
    await wait(120);
  }

  render();

  for (let i = 0; i < 3; i++) {
    clearMatrix();
    await wait(300);

    // روشن شدن تمام 104 پیکسل
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        turnOnPixel(r, c);
      }
    }

    await wait(300);
  }

  clearMatrix();

  matrixState = MATRIX_STATE.IDLE;
}

playTetrisFillAnimation();

// developer mode
const developerBtn = document.querySelector(".developer-btn");
const developerPage = document.querySelector(".developer-page");
const backBtn = document.querySelector(".back-btn");
const runCodeBtn = document.querySelector(".run-code-btn");

const codeInputs = document.querySelectorAll(".code-row input");

developerBtn.addEventListener("click", () => {
  developerPage.classList.remove("hidden");
});

backBtn.addEventListener("click", () => {
  developerPage.classList.add("hidden");
});

codeInputs.forEach((input) => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[^01]/g, "").slice(0, 13);
  });
});

runCodeBtn.addEventListener("click", () => {
  const matrixCode = [];

  codeInputs.forEach((input) => {
    matrixCode.push(input.value);
  });

  if (matrixCode.some((row) => row.length !== 13)) {
    alert("Please enter 13 digits in every row!");
    return;
  }

  clearMatrix();

  matrixState = MATRIX_STATE.TEXT;

  matrixCode.forEach((row, r) => {
    [...row].forEach((value, c) => {
      if (value === "1") {
        turnOnPixel(r, c);
      }
    });
  });

  sendBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");

  developerPage.classList.add("hidden");
});
