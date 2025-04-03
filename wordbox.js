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

function myFunction(id) {
  var x = document.getElementById(id);
  const classes = x.classList;
  console.log(classes);
  if (x.classList.contains("w3-show")) {
    x.classList.remove("w3-show");
  } else {
    x.classList.add("w3-show");
  }
}

const letters = await getLetters();

const lettersCopy = [...letters];

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
  element.setAttribute("draggable", true);
  element.setAttribute("id", letter + getRandomInt(100000));
  element.addEventListener("dragstart", dragStart);
  // Append the element to the parent element
  letterpool.append(element);
}

letters.map((letter) => {
  showletters(letter);
});

lettersDone = true;

const boxes = document.querySelectorAll(".letterbox");
boxes.forEach((box) => {
  box.addEventListener("dragenter", dragEnter);
  box.addEventListener("dragover", dragOver);
  box.addEventListener("dragleave", dragLeave);
  box.addEventListener("drop", drop);
});

function dragStart(e) {
  e.target.classList.add("dragging");
  e.dataTransfer.setData("text/plain", e.target.id);
}

function dragEnter(e) {
  e.preventDefault();
  e.target.classList.add("drag-over");
}

function dragOver(e) {
  e.preventDefault();
  e.target.classList.add("drag-over");
}

function dragLeave(e) {
  e.target.classList.remove("drag-over");
}

function drop(e) {
  const id = e.dataTransfer.getData("text/plain");
  const draggable = document.getElementById(id);
  if (!e.target.classList.contains("letterbox")) {
    e.target.classList.remove("drag-over");
    draggable.classList.remove("dragging");
    return;
  }
  if (e.target.children.length > 0) {
    e.target.classList.remove("drag-over");
    draggable.classList.remove("dragging");
    return;
  }

  e.target.classList.remove("drag-over", "dragging");
  e.target.classList.remove("dragging");
  e.target.appendChild(draggable);
  draggable.classList.add("dropped");
  if (letterpool.childElementCount === 0) {
    document.getElementById("score").removeAttribute("disabled", true);
  }
}

export function score() {
  let letters = [];

  for (let i = 1; i < 17; i++) {
    const box = document.getElementById("box" + i);
    letters.push(box.children[0].textContent.toUpperCase());
  }

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
window.myFunction = myFunction;
