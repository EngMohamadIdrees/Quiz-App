// Select Elements
let infoCountSpan = document.querySelector(".quiz-app .count span");
let bulletsSpans = document.querySelector(".bullets .spans");
let theQuestion = document.querySelector(".quiz-area h2");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let myButton = document.querySelector(".submit-button");
let result = document.querySelector(".result");
let bullets = document.querySelector(".bullets");
let countDownSpan = document.querySelector(".countdown");
// Set Options
let currentIndex = 0;
let correctAnswerCounter = 0;
let countDownInterval;
let questionsCount;
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.open("GET", "./data.json", true);
  myRequest.send();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      questionsCount = questionsObject.length;

      //Create Bullets + Set Questions Count
      createBullets(questionsCount);
      //Add Question Data
      addQuestionData(questionsObject[currentIndex], questionsCount);
      //Start Duration
      countDown(60, questionsCount);
      //Check the Chosen Question
      myButton.onclick = () => {
        let theCorrectAnswer = questionsObject[currentIndex]["correct_answer"];
        currentIndex++;
        checkAnswer(theCorrectAnswer);
        // Remove previous Question
        theQuestion.innerHTML = "";
        answerArea.innerHTML = "";
        addQuestionData(questionsObject[currentIndex], questionsCount);
        // Handle Bullets Class
        handleBullets();
        clearInterval(countDownInterval);
        countDown(60, questionsCount);
        // ShowResult
        showResult(questionsCount);
      };
    }
  };
}

getQuestions();
function addQuestionData(questionObject, numberOfQuestions) {
  if (currentIndex < numberOfQuestions) {
    // Set the H2  = > Title Of Question
    theQuestion.innerHTML = questionObject[`title`];
    for (let i = 1; i <= 4; i++) {
      // Create div for each answer
      let answerDiv = document.createElement("div");
      answerDiv.className = "answer";

      // Create input for each answer
      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      if (i == 1) radioInput.checked = true;
      radioInput.dataset.answer = questionObject[`answer_${i}`];

      // Create label for each answer
      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      let theLabelText = document.createTextNode(questionObject[`answer_${i}`]);

      theLabel.appendChild(theLabelText);
      answerDiv.appendChild(radioInput);
      answerDiv.appendChild(theLabel);
      answerArea.appendChild(answerDiv);
    }
  }
}
function createBullets(numberOfQuestions) {
  infoCountSpan.innerHTML = numberOfQuestions;
  //   Create Bullets Spans
  for (let i = 0; i < numberOfQuestions; i++) {
    let oneBullet = document.createElement("span");
    if (i === 0) oneBullet.className = "on";
    bulletsSpans.appendChild(oneBullet);
  }
}
function checkAnswer(theCorrectAnswer) {
  let theAllAnswers = document.querySelectorAll("input");
  let theChosenAnswer;
  for (let i = 0; i < theAllAnswers.length; i++) {
    if (theAllAnswers[i].checked) {
      theChosenAnswer = theAllAnswers[i].dataset.answer;
    }
  }
  if (theChosenAnswer === theCorrectAnswer) {
    correctAnswerCounter++;
  }
}
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (index === currentIndex) {
      span.className = "on";
    }
  });
}
function showResult(count) {
  let theResult;
  if (currentIndex === count) {
    quizArea.remove();
    answerArea.remove();
    myButton.remove();
    bullets.remove();
    if (correctAnswerCounter > count / 2 && correctAnswerCounter < count) {
      theResult = `<span class="good">Good</span>, ${correctAnswerCounter} From ${count}`;
    } else if (correctAnswerCounter === count) {
      theResult = `<span class="perfect">Perfect</span>, ${correctAnswerCounter} From ${count}`;
    } else {
      theResult = `<span class="bad">Bad</span>, ${correctAnswerCounter} From ${count}`;
    }
    result.innerHTML = theResult;
  }
}
function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countDownSpan.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        myButton.click();
      }
    }, 1000);
  }
}
