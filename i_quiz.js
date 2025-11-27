// Quiz Questions
const quizData = [
  {
    question: "1. What does HTML stand for?",
    options: ["HyperText Markup Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
    answer: 1
  },
  {
    question: "2. Which CSS property controls text size?",
    options: ["font-style", "text-size", "font-size"],
    answer: 2
  },
  {
    question: "3.Which language is used to style a web page?",
    options: ["Html","Css","Bootsrap"],
    answer: 2
  },
  {
    question: "4. Bootstrap is a ______ framework.",
    options: ["Backend", "CSS", "Database"],
    answer: 1
  },
  {
    question: "5.DOM is a.",
    options: ["Doucment object model", "Document opretion module", "Disk os module"],
    answer: 1
  }
];

// Inject questions into the form
function loadQuiz() {
  const quizForm = document.getElementById("quizForm");
  quizForm.innerHTML = ""; // clear old content

  quizData.forEach((q, index) => {
    const questionBlock = document.createElement("div");
    questionBlock.className = "question-block";

    questionBlock.innerHTML = `
      <h3>${q.question}</h3>
      ${q.options
        .map(
          (option, i) => `
        <label>
          <input type="radio" name="q${index}" value="${i}"> ${option}
        </label><br>
      `
        )
        .join("")}
    `;

    quizForm.appendChild(questionBlock);
  });
}

// Evaluate answers
function checkAnswers() {
  let score = 0;

  quizData.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    if (selected && parseInt(selected.value) === q.answer) {
      score++;
    }
  });

  const result = document.getElementById("result");
  result.innerHTML = `<h2>Your Score: ${score} / ${quizData.length}</h2>`;
}

// Button event listener
document.getElementById("submitBtn").addEventListener("click", checkAnswers);

// Load quiz on page start
window.onload = loadQuiz;
