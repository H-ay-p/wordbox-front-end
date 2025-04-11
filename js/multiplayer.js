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

socket.onopen = () => {
  socket.send(JSON.stringify({ type: "join", name: "Player1" }));
};

socket.onmessage = (event) => {
  //   const data = JSON.parse(event.data);
  console.log("Server says:", event);
};

const letterToSend = document.getElementById("letterInput").value;

function sendLetter(e) {
  console.log(letterToSend);
  console.log("sending info");
  socket.send(JSON.stringify({ letter: letterToSend }));
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
