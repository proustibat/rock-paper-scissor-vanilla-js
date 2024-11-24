import utils from "./utils";
import { CHOICES, base64Icons, winnerRules, resultMessages } from "./refs";

const bestScoreKey = "best-score";

let humanScore = 0;
let computerScore = 0;
let currentResultState = "";
let currentResultComputer = "";
let currentHumanChoice = "";
let currentRound = 0;

const getComputerChoice = () => Object.values(CHOICES)[utils.getRandomInt(0, Object.values(CHOICES).length  - 1)];
const getHumanChoice = (humanValue) => Object.values(CHOICES).some(val => val === humanValue) ? humanValue : "";
const isHumanWinner = (humanChoice, computerChoice) => winnerRules[humanChoice] === computerChoice;

const updateDom = () => {
  // current result
  if(currentResultState.length > 0) {
    document.querySelector(".currentResult").innerText = `${currentResultState}`;
    document.querySelector(".currentResult").animate(
      [
        { opacity: 0, easing: "ease-out", transform: "scale(0)" },
        { opacity: 1, easing: "ease-in", transform: "scale(1)" }
      ], {
        duration: 150,
        iterations: 1
      }
    );
  }

  // current played choice by computer
  document.querySelector(".currentResultIcon").src =  base64Icons[currentResultComputer ? currentResultComputer : "empty"];

  // current played choice by human
  document.querySelector(".currentHumanIcon").src =  base64Icons[currentHumanChoice ? currentHumanChoice : "empty"];

  // scores
  const elHumanScore = document.querySelector(".humanScore .data");
  const elComputerScore = document.querySelector(".computerScore .data");
  elHumanScore.innerHTML = `${humanScore}`;
  elComputerScore.innerHTML = `${computerScore}`;

  // round
  const elRound = document.querySelector(".round-state .round span");
  elRound.innerHTML = currentRound.toString();
}

const enableButtons = (enabled) => {
  const elButtons = document.querySelectorAll(".ui button");
  elButtons.forEach((button) => {
    button.disabled = !enabled;
  });
}


const saveBestScore = () => {
  console.log("SAVE BEST SCORE")
  const previousBestScore = parseInt(localStorage.getItem(bestScoreKey));
  if ( isNaN(previousBestScore) || (humanScore > previousBestScore) ) {
    const elRound = document.querySelector(".round-state .best-score span");
    elRound.innerHTML = " improving";
    document.querySelector(".round-state .best-score").animate(
      [
        { opacity: 0, easing: "ease-out", transform: "scale(0.8)" },
        { opacity: 1, easing: "ease-in", transform: "scale(1)" }
      ], {
        duration: 400,
        iterations: 1
      }
    );
    localStorage.setItem(bestScoreKey, humanScore);
  }
}

const updateBestScoreInDom = () => {
  const elBestScore = document.querySelector(".best-score span");
  elBestScore.innerHTML = (parseInt(localStorage.getItem(bestScoreKey)) || 0).toString();
};

const playGame = (humanChoice) => {
  const computerChoice = getComputerChoice();
  const isWinner = isHumanWinner(humanChoice, computerChoice);

  // update game values
  if (humanChoice !== computerChoice) {
    isWinner ? humanScore++ : computerScore++;
    currentResultState = isWinner ? resultMessages.WIN: resultMessages.LOSE;
  } else {
    currentResultState = resultMessages.TIE;
  }
  currentHumanChoice = humanChoice;
  currentResultComputer = computerChoice;
  currentRound++;

  // update best score
  saveBestScore()

  // dom
  updateDom();
}

(function app(){
  window.addEventListener('DOMContentLoaded', () => {
    console.info('Dom Loaded')

    updateDom();

    updateBestScoreInDom();

    const elButtons = document.querySelectorAll(".ui button");
    elButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const button = event.currentTarget;
        if(!event.currentTarget.disabled) {
          enableButtons(false);
          playGame(getHumanChoice(button.getAttribute("value")));
          enableButtons(true);
        }
        else {
          return false
        }
      })
    });

    document.querySelector(".round-state .best-score button").addEventListener("click", (event) => {
      event.stopPropagation();
      if(confirm(`Do you wanna clear your best score? (${localStorage.getItem(bestScoreKey)})` )) {
        localStorage.clear();
        updateBestScoreInDom();
        return false;
      }
    })

    const resetButton = document.querySelector(".reset button");
    resetButton.addEventListener('click', () => {
      humanScore = 0;
      computerScore = 0;
      currentHumanChoice = "";
      currentResultComputer = "";
      currentResultState = resultMessages.READY;
      currentRound = 0;
      updateDom();
      updateBestScoreInDom();
    });
  }, {once: true});
}());
