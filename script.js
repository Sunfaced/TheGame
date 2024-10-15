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
let arr;

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
  score.textContent = 0;
  count = 0;
  timer.style.display = "flex";
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
      timer.textContent = 60;
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
      is_game_stopped = false;
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
    let listRaiting = document.createElement("div");
    navigateList.append(listRaiting);
    listRaiting.classList.add("topRaiting");

    let raitingList = `<li id=firstPlace>Первое место - ${
      arr[0] ? arr[0] : ""
    } </li>
                            <li id=secondPlace>Второе место - ${
                              arr[1] ? arr[1] : ""
                            } </li>
                            <li id=thirdPlace>Третье место - ${
                              arr[2] ? arr[2] : ""
                            } </li> 
                            <li id=fourthPlace>Четвертое место - ${
                              arr[3] ? arr[3] : ""
                            } </li>
                            <li id=fifthPlace>Пятое место - ${
                              arr[4] ? arr[4] : ""
                            } </li>`;

    listRaiting.insertAdjacentHTML("beforeend", raitingList);
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
