const playGround = document.querySelector(".play__ground");
const navigateList = document.querySelector(".navigate__menu");
const navigate = document.querySelector(".navigate");
const btnOne = document.querySelector("#btn-1");
const btnTwo = document.querySelector("#btn-2");
const btnThree = document.querySelector("#btn-3");
const modal = document.querySelector(".modal");
const btnModal = document.querySelector(".modal__close");
const timer = document.querySelector(".timer");
const score = document.querySelector(".score");
const text = document.querySelector(".text");

let is_game_active = false;
let is_game_stopped = false;
let count = 0;
let arr = [];

if (localStorage.places) {
  arr = JSON.parse(localStorage.getItem("places"));
} else {
  arr = [];
}

timer.style.display = "none";

function useModal() {
  modal.style.display = "flex";
}
setTimeout(useModal, 500);

btnModal.addEventListener("click", () => {
  let count = 1;
  modal.style.display = "none";
  text.style.display = "block";
  score.style.display = "flex";
  for (let i = 0; i < 9; i++) {
    let divSquare = document.createElement("div");
    playGround.append(divSquare);
    divSquare.dataset.number = count++;
    divSquare.id = count - 1;
    divSquare.classList.add("passiveSquares");
  }
});

btnOne.addEventListener("click", startGame);

function startGame() {
  is_game_active = true;
  is_game_stopped = false;
  score.textContent = 0;
  count = 0;
  timer.style.display = "flex";
  timer.textContent = 60;
  const changeTime = +timer.getAttribute("time");
  let n = +timer.textContent;
  const min = +timer.getAttribute("min");

  const newDivs = document.querySelectorAll(".passiveSquares");
  const ourDivs = [...newDivs];

  const intervalTimer = setInterval(function () {
    n--;
    timer.textContent = n;
    if (n < min || is_game_stopped) {
      timer.style.display = "none";
      clearInterval(intervalTimer);
      let audio = new Audio();
      audio.src = "music3-3.mp3";
      audio.play();
    }
  }, changeTime / n);

  const intervalDivs = setInterval(function () {
    if (n < min || is_game_stopped) {
      if (!is_game_stopped) {
        arr.push(count);
        arr.sort((a, b) => b - a);
        saveToLocalStorage(arr);
      }
      clearInterval(intervalDivs);
      ourDivs.forEach(function (el, i) {
        el.classList.add("passiveSquares");
        el.classList.remove("activeSquares");
      });
      is_game_active = false;
    } else {
      const randomIndex = Math.floor(Math.random() * ourDivs.length);
      ourDivs.forEach(function (el, i) {
        if (randomIndex === i) {
          el.classList.add("activeSquares");
          el.classList.remove("passiveSquares");
        } else {
          el.classList.remove("activeSquares");
          el.classList.add("passiveSquares");
        }
      });
    }
  }, 500);
}

btnTwo.addEventListener("click", function () {
  is_game_stopped = true;
  score.textContent = "Your score:";
});

playGround.addEventListener("click", sumScore);

function sumScore(event) {
  if (is_game_active) {
    let target = event.target;
    if (target.classList.contains("activeSquares")) {
      count = count + 100;
      score.textContent = count;
      let audio = new Audio();
      audio.src = "music1-1.mp3";
      audio.play();
    } else {
      if (target.classList.contains("passiveSquares")) {
        count = count - 50;
        score.textContent = count;
        let audio = new Audio();
        audio.src = "music2-2.mp3";
        audio.play();
      }
    }
  }
}

btnThree.addEventListener("click", showRaiting);

let check = 2;

function showRaiting() {
  if (check % 2 === 0) {
    const ratingContainer = document.querySelector(".rating-container");
    let listRaiting = document.createElement("div");
    listRaiting.classList.add("topRaiting");

    let raitingList = `
      <ul class="rating-list">
        <li id="firstPlace">1st place - ${arr[0] || "Empty"}</li>
        <li id="secondPlace">2nd place - ${arr[1] || "Empty"}</li>
        <li id="thirdPlace">3rd place - ${arr[2] || "Empty"}</li>
        <li id="fourthPlace">4th place - ${arr[3] || "Empty"}</li>
        <li id="fifthPlace">5th place - ${arr[4] || "Empty"}</li>
      </ul>
    `;

    listRaiting.insertAdjacentHTML("beforeend", raitingList);
    ratingContainer.appendChild(listRaiting);
    check = check + 1;
  } else {
    let listRaiting = document.querySelector(".topRaiting");
    listRaiting.remove();
    check = check + 1;
  }
}

function saveToLocalStorage(arg) {
  localStorage.setItem("places", JSON.stringify(arg));
}
