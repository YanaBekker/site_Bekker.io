document.addEventListener("DOMContentLoaded", function () {
  loadComponents()
    .then(() => {
      if (typeof initNavigation === "function") {
        initNavigation();
      }
      initQuiz();
    })
    .catch(() => {
      initQuiz();
    });
});
const questions = [
  {
    question: "Если человека назвали мордофиля, то это…",
    answers: [
      {
        text: "Значит, что он тщеславный.",
        correct: true,
        explanation:
          "Ну зачем же вы так... В Этимологическом словаре русского языка Макса Фасмера поясняется, что мордофилей называют чванливого человека. Ну а «чванливый» — это высокомерный, тщеславный.",
      },
      { text: "Значит, что у него лицо как у хряка.", correct: false },
      { text: "Значит, что чумазый.", correct: false },
    ],
  },
  {
    question: "«Да этот Ярополк — фуфлыга!» Что не так с Ярополком?",
    answers: [
      {
        text: "Он маленький и невзрачный.",
        correct: true,
        explanation:
          "Точно! Словарь Даля говорит, что фуфлыгой называют невзрачного малорослого человека. А еще так называют прыщи.",
      },
      { text: "Он тот еще алкоголик.", correct: false },
      { text: "Он не держит свое слово.", correct: false },
    ],
  },
  {
    question: "Если человека прозвали пятигузом, значит, он…",
    answers: [
      {
        text: "Не держит слово.",
        correct: true,
        explanation:
          "Может сесть сразу на пять стульев. Согласно Этимологическому словарю русского языка Макса Фасмера, пятигуз — это ненадежный, непостоянный человек.",
      },
      { text: "Изменяет жене.", correct: false },
      { text: "Без гроша в кармане.", correct: false },
    ],
  },
  {
    question: "Кто такой шлындра?",
    answers: [
      { text: "Обманщик.", correct: false },
      { text: "Нытик.", correct: false },
      {
        text: "Бродяга.",
        correct: true,
        explanation:
          "Да! В Словаре русского арго «шлындрать» означает бездельничать, шляться.",
      },
    ],
  },
];

let currentQuestions = [];
let answeredQuestions = 0;
let correctAnswers = 0;
let canAnswer = true;
let userResults = [];

function initQuiz() {
  currentQuestions = [...questions].sort(() => Math.random() - 0.5);

  displayNextQuestion();
}

function displayNextQuestion() {
  const quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = "";

  if (currentQuestions.length === 0) {
    const noQuestionsElement = document.createElement("div");
    noQuestionsElement.className = "no-questions";
    noQuestionsElement.textContent = "Вопросы закончились";
    quizContainer.appendChild(noQuestionsElement);

    showStatistics();
    return;
  }

  const currentQuestion = currentQuestions[0];

  const questionBlock = document.createElement("div");
  questionBlock.className = "question-block";

  const questionHeader = document.createElement("div");
  questionHeader.className = "question-header";

  const questionNumber = document.createElement("div");
  questionNumber.className = "question-number";
  questionNumber.textContent = answeredQuestions + 1;

  const questionText = document.createElement("div");
  questionText.className = "question-text";
  questionText.textContent = currentQuestion.question;

  questionHeader.appendChild(questionNumber);
  questionHeader.appendChild(questionText);
  questionBlock.appendChild(questionHeader);
  const answersContainer = document.createElement("div");
  answersContainer.className = "answers-container";

  const shuffledAnswers = [...currentQuestion.answers].sort(
    () => Math.random() - 0.5
  );

  shuffledAnswers.forEach((answer, index) => {
    const answerElement = document.createElement("div");
    answerElement.className = "answer";
    answerElement.textContent = `${String.fromCharCode(97 + index)}) ${
      answer.text
    }`;
    answerElement.dataset.correct = answer.correct;

    answerElement.addEventListener("click", () =>
      handleAnswerClick(answerElement, answer, currentQuestion)
    );

    answerElement.addEventListener("mouseenter", () => {
      if (canAnswer) {
        answerElement.style.transform = "scale(1.05)";
      }
    });

    answerElement.addEventListener("mouseleave", () => {
      if (canAnswer && !answerElement.classList.contains("selected")) {
        answerElement.style.transform = "scale(1)";
      }
    });

    answersContainer.appendChild(answerElement);
  });

  questionBlock.appendChild(answersContainer);
  quizContainer.appendChild(questionBlock);

  canAnswer = true;
}

function handleAnswerClick(answerElement, answerData, questionData) {
  if (!canAnswer) return;

  canAnswer = false;

  answerElement.classList.add("shake");

  setTimeout(() => {
    answerElement.classList.remove("shake");

    const isCorrect = answerData.correct;

    userResults.push({
      question: questionData.question,
      isCorrect: isCorrect,
    });

    const marker = document.createElement("div");
    marker.className = `marker ${
      isCorrect ? "correct-marker" : "incorrect-marker"
    }`;
    marker.innerHTML = isCorrect ? "✓" : "✗";

    const questionBlock = answerElement.closest(".question-block");
    const questionHeader = questionBlock.querySelector(".question-header");
    questionHeader.appendChild(marker);

    if (isCorrect) {
      correctAnswers++;

      answerElement.classList.add("correct");

      if (answerData.explanation) {
        const explanation = document.createElement("div");
        explanation.className = "explanation";
        explanation.textContent = answerData.explanation;
        explanation.style.display = "block";

        answerElement.classList.add("expand");

        setTimeout(() => {
          answerElement.appendChild(explanation);
        }, 500);
      }

      const allAnswers = questionBlock.querySelectorAll(".answer");
      allAnswers.forEach((ans) => {
        if (!ans.classList.contains("correct")) {
          ans.classList.add("slide-down");
        }
      });

      setTimeout(() => {
        answerElement.classList.add("slide-down");

        setTimeout(() => {
          currentQuestions.shift();
          answeredQuestions++;
          displayNextQuestion();
        }, 1000);
      }, 3000);
    } else {
      answerElement.classList.add("incorrect");

      const correctAnswer = questionBlock.querySelector(
        '.answer[data-correct="true"]'
      );
      correctAnswer.classList.add("correct");

      const allAnswers = questionBlock.querySelectorAll(".answer");
      allAnswers.forEach((ans) => {
        ans.classList.add("slide-down");
      });

      setTimeout(() => {
        currentQuestions.shift();
        answeredQuestions++;
        displayNextQuestion();
      }, 2000);
    }
  }, 500);
}

function showStatistics() {
  const statisticsElement = document.getElementById("statistics");
  statisticsElement.style.display = "block";

  let resultsHTML = `
                <h2>Результаты викторины</h2>
                <div class="results-summary">
                    <p>Вы ответили правильно на <strong>${correctAnswers}</strong> из <strong>${
    questions.length
  }</strong> вопросов</p>
                    <p>Это <strong>${Math.round(
                      (correctAnswers / questions.length) * 100
                    )}%</strong> правильных ответов</p>
                </div>
                
                <div class="results-list">
                    <h3>Список вопросов и результаты:</h3>
            `;

  userResults.forEach((result, index) => {
    const statusClass = result.isCorrect ? "correct" : "incorrect";
    const statusIcon = result.isCorrect ? "✓" : "✗";
    const statusText = result.isCorrect ? "Правильно" : "Неправильно";

    resultsHTML += `
                    <div class="result-item ${statusClass}">
                        <div class="result-status ${statusClass}">${statusIcon}</div>
                        <div class="result-question">
                            <strong>${index + 1}. ${result.question}</strong>
                            <div style="color: ${
                              result.isCorrect
                                ? "var(--correct-color)"
                                : "var(--incorrect-color)"
                            }; font-size: 0.9em; margin-top: 5px;">
                                ${statusText}
                            </div>
                        </div>
                    </div>
                `;
  });

  resultsHTML += `</div>`;
  statisticsElement.innerHTML = resultsHTML;
}
