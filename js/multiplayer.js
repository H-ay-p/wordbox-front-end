let threeLetterWordsList = [];
fetch("three.json")
  .then((response) => response.json())
  .then((data) => {
    threeLetterWordsList = data;
  })
  .catch((error) => console.error("Error loading JSON:", error));

let fourLetterWordsList = [];
fetch("four.json")
  .then((response) => response.json())
  .then((data) => {
    fourLetterWordsList = data;
  })
  .catch((error) => console.error("Error loading JSON:", error));

const socket = new WebSocket("ws://localhost:3001");
let myPlayerNumber; // Will be 1 or 2
let currentTurn; // Whose turn it is (1 or 2)

// SEND LETTER FUNCTION (YOUR ORIGINAL + IMPROVEMENTS)
function sendLetter() {
  const letterInput = document.getElementById("letterInput");
  const letterToSend = letterInput.value.trim();
  letterInput.classList.contains("hidden")
    ? letterInput.classList.remove("hidden")
    : letterInput.classList.add("hidden");

  if (!letterToSend) return; // Don't send empty messages

  console.log("Sending letter:", letterToSend);

  socket.send(
    JSON.stringify({
      type: "letter", // Message type
      letter: letterToSend,
      sender: myPlayerNumber, // Who sent it
      timestamp: Date.now(), // Optional: helps with ordering
    })
  );

  letterInput.value = ""; // Clear input
  letterInput.focus(); // Ready for next letter
}

let letter = [];
// SINGLE ONMESSAGE HANDLER (COMBINES ALL FUNCTIONALITY)
socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    console.log("Received:", data);

    // 1. Handle player assignment
    if (data.type === "player_assignment") {
      myPlayerNumber = data.playerNumber;
      currentTurn = data.currentTurn;
      console.log(`You are Player ${myPlayerNumber}`);
      updateUI();
    }

    // 2. Handle opponent connection
    else if (data.type === "opponent_connected") {
      console.log("Your opponent has arrived!");
      updateUI();
    }

    // 3. Handle turn updates
    else if (data.type === "game_update") {
      currentTurn = data.nextTurn;
      console.log("Turn changed to Player", currentTurn);
      updateUI();
    }

    // 4. Handle incoming letters (YOUR NEW FUNCTIONALITY)
    else if (data.type === "letter") {
      console.log(`Player ${data.sender} sent: ${data.letter}`);
      displayLetter(data.letter, data.sender);
      letter.push(data.letter);
    }
  } catch (error) {
    console.error("Message error:", error);
  }
};

// HELPER FUNCTIONS
function displayLetter(letter, sender) {
  const newLetter = document.getElementById("newLetter");
  if (newLetter) {
    const messageDiv = document.createElement("div");
    messageDiv.className =
      sender === myPlayerNumber ? "my-letter" : "their-letter";
    messageDiv.textContent = `${letter}`;
    newLetter.appendChild(messageDiv);
  }
}

function updateUI() {
  // Update turn display, enable/disable controls, etc.
  const turnDisplay = document.getElementById("turn-indicator");
  if (turnDisplay) {
    turnDisplay.textContent =
      currentTurn === myPlayerNumber ? "Your turn!" : "Opponent's turn";
  }
}

function showText(id) {
  const text = document.getElementById(id);
  if (text.classList.contains("w3-show")) {
    text.classList.remove("w3-show");
  } else {
    text.classList.add("w3-show");
  }
}

const inputBox = document.getElementById("letterInput");
const gridBoxes = document.querySelectorAll(".letterbox");

gridBoxes.forEach((gridBox) => {
  gridBox.addEventListener("input", preventInvalidGridInput);
});

inputBox.addEventListener("input", validateInput);
inputBox.addEventListener("keypress", preventInvalidInput);
inputBox.addEventListener("input", (event) => {
  if (event.inputType === "deleteContentBackward") {
    console.log("delete pressed");
  }
});

const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const lowerCaseLetters = [
  "a",
  "b",
  "c",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

function validateInput() {
  console.log("entering");
}
function preventInvalidInput(event) {
  console.log(event.key);
  if (
    (!letters.includes(event.key) && !lowerCaseLetters.includes(event.key)) ||
    event.target.value.length > 0
  ) {
    event.preventDefault();
  }
}

// function validateGridInput(e) {
//   const currentValue = e.target.value.toUpperCase();
//   const lowerValue = currentValue.toLowerCase();
//   const newLetters = document.querySelectorAll(".newletter");
//   if (letterpool.childElementCount === 1) {
//     scoreBtn.removeAttribute("disabled", true);
//     scoreBtn.classList.remove("disabled");
//   }
//   for (let i = 0; i < newLetters.length; i++) {
//     if (newLetters[i].textContent == currentValue) {
//       letterpool.removeChild(newLetters[i]);
//       let index = lettersCopy.indexOf(currentValue);
//       let lowerIndex = lowerCaseLetters.indexOf(lowerValue);
//       lettersCopy.splice(index, 1);
//       lowerCaseLetters.splice(lowerIndex, 1);
//       letterInDanger = [];
//       letterInDanger.push(newLetters[i].textContent);

//       break;
//     }
//   }
// }

function preventInvalidGridInput(event) {
  console.log(letter);
  console.log(event.key);
  if (!letter.includes(event.key)) {
    event.preventDefault();
  }
}

export function score() {
  let letters = [];

  for (let i = 1; i < 17; i++) {
    const box = document.getElementById("box" + i);
    letters.push(box.value);
  }

  // console.log(stringedLetters);

  const fourLetterWords = [];
  const threeLetterWords = [];

  for (let i = 0; i < 16; i += 4) {
    fourLetterWords.push(letters.slice(i, i + 4).join(""));
  }

  for (let i = 0; i < 15; i += 4) {
    threeLetterWords.push(letters.slice(i, i + 3).join(""));
  }

  for (let i = 1; i < 15; i += 4) {
    threeLetterWords.push(letters.slice(i, i + 3).join(""));
  }

  for (let i = 0; i < 4; i++) {
    fourLetterWords.push(
      letters[i] + letters[i + 4] + letters[i + 8] + letters[i + 12]
    );
  }

  for (let i = 0; i < 4; i++) {
    threeLetterWords.push(letters[i] + letters[i + 4] + letters[i + 8]);
  }

  for (let i = 4; i < 8; i++) {
    threeLetterWords.push(letters[i] + letters[i + 4] + letters[i + 8]);
  }

  fourLetterWords.push(letters[0] + letters[5] + letters[10] + letters[15]);

  threeLetterWords.push(
    letters[0] + letters[5] + letters[10],
    letters[5] + letters[10] + letters[15]
  );
  threeLetterWords.push(
    letters[1] + letters[6] + letters[11],
    letters[4] + letters[9] + letters[14]
  );

  let points = 0;
  let correctwords = [];

  fourLetterWords.forEach((word) => {
    if (fourLetterWordsList.words.includes(word.toUpperCase())) {
      points += 2;
      correctwords.push(" " + word);
    }
  });

  threeLetterWords.forEach((word) => {
    if (threeLetterWordsList.words.includes(word.toUpperCase())) {
      points += 1;
      correctwords.push(" " + word);
    }
  });

  if (points === 0) {
    document.getElementById("scoretext").textContent =
      "Sorry, there are no words. And no points. Try again, or get new letters!";

    newLetterButton.classList.remove("hidden");
    tryAgainButton.classList.remove("hidden");
  } else {
    document.getElementById("scoretext").textContent = `You got
      ${points} 
       points. Your scoring words were:
      ${correctwords}. Try again with these, or get new letters!`;
    newLetterButton.classList.remove("hidden");
    tryAgainButton.classList.remove("hidden");
  }
}

window.score = score;
window.showText = showText;
window.sendLetter = sendLetter;
