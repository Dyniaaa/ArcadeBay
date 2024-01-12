import { useEffect, useRef } from "react";
import "./style.scss";
import { NavLink } from "react-router-dom";

function Quiz() {
  class Quiz {
    currentQuestionIndex = -1;

    async init() {
      console.log("initapp");

      this.progress = document.querySelector(".progress");
      this.countDownInfo = document.querySelector(".countDown");
      this.questionHeading = document.querySelector(".questionHeading");

      this.questionAnswers = document.querySelector(".questionAnswers");

      this.summary = document.querySelector(".summary");

      this.submitButton = document.querySelector(".submitAnswer");
      this.submitButton.addEventListener("click", this.submitAnswer.bind(this));

      this.restartButton = document.querySelector(".restartQuiz");
      this.restartButton.addEventListener("click", this.restartQuiz.bind(this));

      await this.loadData();

      this.restartQuiz();
    }

    loadData = async () => {
      const serverData = await fetch("./Questions.json");
      const jsonData = await serverData.json();

      if (!jsonData.questions) {
        console.log("brak pytań");
        return;
      }

      this.questions = jsonData.questions;
    };

    submitAnswer = () => {
      let userSelectedInput = document.querySelector(
        'input[type="radio"]:checked'
      );

      if (userSelectedInput) {
        const userSelectedIndex = userSelectedInput.getAttribute("data-index");
        const question = this.questions[this.currentQuestionIndex];
        question.userSelectedIndex = userSelectedIndex;
        this.setNextQuestionData();
      }
    };

    restartQuiz = () => {
      this.questions.forEach((q) => (q.userSelectedIndex = -1));

      this.currentQuestionIndex = -1;
      this.countDown();
      this.setNextQuestionData();

      this.questionAnswers.classList.remove("hide");
      this.submitButton.classList.remove("hide");
      this.restartButton.classList.remove("show");
      this.summary.classList.add("hide");
    };

    countDown = () => {
      if (!this.countDownInterval) {
        this.quizStartTime = new Date().getTime();
        this.quizEndTime = this.quizStartTime + 52000;

        this.countDownInterval = setInterval(() => {
          const currentTime = new Date().getTime();

          if (currentTime >= this.quizEndTime) {
            console.log("koniec quizu");
            this.stopCountDown();
            this.showSummary();
            return;
          }

          let timeLeft = Math.floor((this.quizEndTime - currentTime) / 1000);

          this.countDownInfo.innerHTML = "Pozostało: " + timeLeft + " sekund";
        }, 1000);
      }
    };

    stopCountDown = () => {
      clearInterval(this.countDownInterval);
      this.countDownInterval = null;
      this.countDownInfo.innerHTML = "";
    };

    setNextQuestionData = () => {
      this.currentQuestionIndex++;

      if (this.currentQuestionIndex >= this.questions.length) {
        console.log("koniec quizu");
        this.showSummary();
        return;
      }

      const question = this.questions[this.currentQuestionIndex];

      this.questionHeading.innerHTML = question.q;

      const progressStr = `Pytanie ${this.currentQuestionIndex + 1} z ${
        this.questions.length
      }`;

      this.progress.innerHTML = progressStr;

      const answersHtml = question.answers
        .map((answersText, index) => {
          const answerId = "answer" + index;
          return `
        <li>
          <input type="radio" name="answer" className="answer" id="${answerId}" data-index="${index}" />
          <label for="${answerId}">
            ${answersText}
          </label>
        </li>
      `;
        })
        .join("");

      this.questionAnswers.innerHTML = answersHtml;
    };

    showSummary = () => {
      this.stopCountDown();

      this.questionAnswers.classList.add("hide");
      this.submitButton.classList.add("hide");
      this.restartButton.classList.add("show");
      this.summary.classList.remove("hide");

      this.questionHeading.innerHTML = "Podsumowanie Wyników:";

      let summaryHtml = this.questions
        .map((question, questionIndex) => {
          console.log(
            `Pytanie ${questionIndex + 1}, userSelectedIndex: ${
              question.userSelectedIndex
            }, correctAnswer: ${question.correctAnswer}`
          );

          const isCorrect = question.userSelectedIndex === question.correctAnswer;

          return `
          <h4>Pytanie nr. ${questionIndex + 1} : ${question.q}</h4>
          <ul>
            ${question.answers
              .map((answer, answerIndex) => {
                const isSelected =
                  answerIndex === parseInt(question.userSelectedIndex, 10);
                const isCorrectAnswer =
                  answerIndex === parseInt(question.correctAnswer, 10);

                console.log(
                  `  Odpowiedź ${answerIndex}, isSelected: ${isSelected}, isCorrectAnswer: ${isCorrectAnswer}`
                );

                return `
                <li class="${
                  isSelected && isCorrectAnswer
                    ? "correctAnswer"
                    : isSelected
                    ? "wrongAnswer"
                    : ""
                }">
                  <input ${
                    isSelected ? "checked" : ""
                  } disabled type="radio" name="answer" id="answer${answerIndex}" data-index="${answerIndex}" class="answer">
                  <label for="answer${answerIndex}">${answer}</label>
                </li>
              `;
              })
              .join("")}
          </ul>
        `;
        })
        .join("");

      this.summary.innerHTML = summaryHtml;
    };
  }

  let guiz = useRef(null);

  useEffect(() => {
    if (!guiz.current) {
      guiz.current = new Quiz();
      guiz.current.init();
    }
  });
  return (
    <div className="quizBackground">
      <section className="quizContainer">
        <div className="quizHeader">
          <div className="progress"></div>
          <div className="countDown"></div>
        </div>
        <NavLink to="/" className="fa fa-reply"></NavLink>

        <div className="quizQuestion">
          <div className="questionHeading">Pytanie</div>
        </div>

        <div className="quizBody">
          <ul className="questionAnswers"></ul>
        </div>
        <div className="summary"></div>
        <button className="submitAnswer">Dalej</button>
        <button className="restartQuiz hide">Restart</button>
      </section>
    </div>
  );
}

export default Quiz;
