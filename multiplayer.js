console.log("page open");
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
let myPlayerNumber;
let currentTurn;

socket.onopen = () => {
  console.log("Connected to server");
};

socket.onmessage = (event) => {
  console.log("entering");
  try {
    // Parse the incoming message
    const data =
      typeof event.data === "string" ? JSON.parse(event.data) : event.data;

    if (data.type === "player_assignment") {
      myPlayerNumber = data.playerNumber;
      currentTurn = data.currentTurn;
      console.log(`You are Player ${myPlayerNumber}`);
      updateUI();
    } else if (data.type === "opponent_connected") {
      console.log("Opponent has connected!");
      updateUI();
    } else if (data.type === "game_update") {
      console.log(`Move received: ${JSON.stringify(data.move)}`);
      currentTurn = data.nextTurn;
      updateUI();
      // Handle the game state update here
    }
  } catch (error) {
    console.error("Error processing message:", error);
  }
};

function makeMove(move) {
  if (myPlayerNumber === currentTurn) {
    socket.send(
      JSON.stringify({
        type: "move",
        playerNumber: myPlayerNumber,
        move: move,
      })
    );
  } else {
    console.log("Not your turn!");
  }
}

function updateUI() {
  // Update your HTML to show whose turn it is
  document.getElementById("turn-indicator").textContent =
    currentTurn === myPlayerNumber ? "Your turn!" : "Opponent's turn";

  // Disable/enable controls based on turn
  document.getElementById("send").disabled = currentTurn !== myPlayerNumber;
}

function showText(id) {
  const text = document.getElementById(id);
  if (text.classList.contains("w3-show")) {
    text.classList.remove("w3-show");
  } else {
    text.classList.add("w3-show");
  }
}

const inputBoxes = document.querySelectorAll(".letter-input");

// inputBoxes.forEach((inputBox) => {
//   inputBox.addEventListener("input", validateInput);
//   inputBox.addEventListener("keypress", preventInvalidInput);
//   inputBox.addEventListener("focus", focusFunc);
//   inputBox.addEventListener("input", (event) => {
//     if (event.inputType === "deleteContentBackward") {
//       console.log("delete pressed");
//     }
//   });
// });

// Function to prevent invalid characters from being entered
// function preventInvalidInput(event) {
//   if (
//     (!lettersCopy.includes(event.key) &&
//       !lowerCaseLetters.includes(event.key)) ||
//     event.target.value.length > 0
//   ) {
//     event.preventDefault();
//   }
// }

const playAgainButton = document.getElementById("play-again");

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
      "Sorry, there are no words. And no points. Play again?";
    playAgainButton.classList.remove("hidden");
  } else {
    document.getElementById("scoretext").textContent = `You got
      ${points} 
       points. Your scoring words were:
      ${correctwords}. Your opponent got [placeholder] points. [placeholder] wins`;
    playAgainButton.classList.remove("hidden");
  }
}

function playAgain() {
  //TBC
}

window.score = score;
window.showText = showText;
window.playAgain = playAgain;
