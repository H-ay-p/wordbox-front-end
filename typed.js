import { getLetters } from "./api.js";

let threeLetterWordsList = [];
fetch("three.json")
  .then((response) => response.json())
  .then((data) => {
    threeLetterWordsList = data;
  })
  .catch((error) => console.error("Error loading JSON:", error));

let fourLetterWordsList = [];
fetch("three.json")
  .then((response) => response.json())
  .then((data) => {
    fourLetterWordsList = data;
  })
  .catch((error) => console.error("Error loading JSON:", error));

function showText(id) {
  const text = document.getElementById(id);
  if (text.classList.contains("w3-show")) {
    text.classList.remove("w3-show");
  } else {
    text.classList.add("w3-show");
  }
}

const letters = await getLetters();

const lettersCopy = [...letters];

const inputBoxes = document.querySelectorAll(".letter-input");

inputBoxes.forEach((inputBox) => {
  inputBox.addEventListener("input", validateInput);
  inputBox.addEventListener("keypress", preventInvalidInput);
  inputBox.addEventListener("focus", focusFunc);
  inputBox.addEventListener("input", (event) => {
    if (event.inputType === "deleteContentBackward") {
      restoreLetter(); // event.data holds the deleted character
    }
  });
});

const letterpool = document.getElementById("letterpool");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let lettersDone = false;

function showletters(letter) {
  let element = document.createElement("div");
  element.innerHTML = letter;
  element.classList.add("newletter");
  element.classList.add("margin");
  element.setAttribute("id", letter + getRandomInt(100000));
  // Append the element to the parent element
  letterpool.append(element);
}

letters.map((letter) => {
  showletters(letter);
});

lettersDone = true;

function validateInput(e) {
  const currentValue = e.target.value.toUpperCase();
  const newLetters = document.querySelectorAll(".newletter");
  if (letterpool.childElementCount === 1) {
    document.getElementById("score").removeAttribute("disabled", true);
  }

  for (let i = 0; i < newLetters.length; i++) {
    if (newLetters[i].textContent == currentValue) {
      letterpool.removeChild(newLetters[i]);
      let index = lettersCopy.indexOf(currentValue);
      lettersCopy.splice(index, 1);
      letterInDanger.push(newLetters[i].textContent);
      break;
    }
  }
}

// Function to prevent invalid characters from being entered
function preventInvalidInput(event) {
  if (!lettersCopy.includes(event.key)) {
    event.preventDefault();
  }
}

let letterInDanger = [];
function focusFunc(e) {
  letterInDanger = [];
  if (e.target.value != "") {
    letterInDanger.push(e.target.value);
  }
}

function restoreLetter() {
  console.log(letterInDanger);
  letterInDanger.map((letter) => {
    showletters(letter);
    lettersCopy.push(letter);
  });
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
    if (fourLetterWordsList.words.includes(word)) {
      points += 2;
      correctwords.push(" " + word);
    }
  });

  threeLetterWords.forEach((word) => {
    if (threeLetterWordsList.words.includes(word)) {
      points += 1;
      correctwords.push(" " + word);
    }
  });

  const newLetterButton = document.getElementById("new-letters");
  const tryAgainButton = document.getElementById("try-again");

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

function replaceLetters() {
  lettersCopy.map((letter) => {
    showletters(letter);
    boxes.forEach((box) => {
      box.innerHTML = "";
    });
  });
}

window.score = score;
window.replaceLetters = replaceLetters;
window.focusFunc = focusFunc;
window.showText = showText;
