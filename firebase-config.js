
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmqL5PC6vil-1pU2xWkbMuS3w4QVFQ9kA",
  authDomain: "jsi05-35a7b.firebaseapp.com",
  databaseURL: "https://jsi05-35a7b-default-rtdb.firebaseio.com",
  projectId: "jsi05-35a7b",
  storageBucket: "jsi05-35a7b.firebasestorage.app",
  messagingSenderId: "881389229214",
  appId: "1:881389229214:web:a4eec1039aaf45c633578f",
  measurementId: "G-9QD9TD3KG0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app)
// Firebase SDK
const db = getFirestore(app);

// Global variables for exam
let examData = {};
let selectedQuestions = [];
let timer;
let timeLeft;
let startTime;


// Function to get questions from selected subject
async function getQuestionsFromSubject(subject) {
  const questionCollection = query(collection(db, subject));
  const querySnapshot = await getDocs(questionCollection);

  let questions = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.question) {
      // Extract questions from the question object
      Object.keys(data.question).forEach(key => {
        if (key.startsWith('question') && data.question[key].question) {
          questions.push({
            id: key,
            ...data.question[key]
          });
        }
      });
    }
  });

  return questions;
}

// Function to start exam
window.startExam = async function () {
  const subject = document.getElementById('subject').value;
  const questionCount = parseInt(document.getElementById('questionCount').value);
  const timeLimit = parseInt(document.getElementById('timeLimit').value);

  if (!subject) {
    alert('Vui lòng chọn môn học!');
    return;
  }

  // Get questions from database
  const allQuestions = await getQuestionsFromSubject(subject);

  if (allQuestions.length === 0) {
    alert('Không có câu hỏi nào trong môn học này!');
    return;
  }

  // Randomly select questions
  selectedQuestions = shuffleArray(allQuestions).slice(0, Math.min(questionCount, allQuestions.length));

  // Setup exam
  examData = {
    subject: subject,
    questionCount: selectedQuestions.length,
    timeLimit: timeLimit,
    answers: {}
  };

  // Hide setup, show exam
  document.getElementById('examSetup').style.display = 'none';
  document.getElementById('examContent').style.display = 'block';

  // Set exam title
  const subjectName = subject === 'xoai' ? 'Hóa học' : 'Sinh học';
  document.getElementById('examTitle').textContent = `Bài kiểm tra ${subjectName} (${selectedQuestions.length} câu - ${timeLimit} phút)`;

  // Display questions
  displayQuestions();

  // Start timer
  startTimer(timeLimit);
}

// Function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Function to display questions
function displayQuestions() {
  const container = document.getElementById('questionsContainer');
  container.innerHTML = '';

  selectedQuestions.forEach((question, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.id = `question-${index}`;

    let optionsHtml = '';
    if (question.option) {
      Object.keys(question.option).forEach(key => {
        optionsHtml += `
          <div class="option" onclick="selectOption(${index}, '${key}')">
            <input type="radio" name="question_${index}" value="${key}" id="q${index}_${key}" onchange="updateProgress()">
            <label for="q${index}_${key}">${key}. ${question.option[key]}</label>
          </div>
        `;
      });
    }

    questionDiv.innerHTML = `
      <div class="question-number">Câu ${index + 1}</div>
      <div class="question-title">${question.question}</div>
      <div class="options">
        ${optionsHtml}
      </div>
    `;

    container.appendChild(questionDiv);
  });

  // Initialize progress
  updateProgress();
}

// Function to select option and update UI
window.selectOption = function (questionIndex, optionValue) {
  const questionDiv = document.getElementById(`question-${questionIndex}`);
  questionDiv.classList.add('answered');
}

// Function to update progress
window.updateProgress = function () {
  let answeredCount = 0;
  const totalQuestions = selectedQuestions.length;

  for (let i = 0; i < totalQuestions; i++) {
    const selectedOption = document.querySelector(`input[name="question_${i}"]:checked`);
    if (selectedOption) {
      answeredCount++;
      document.getElementById(`question-${i}`).classList.add('answered');
    }
  }

  // Update progress bar
  const progressPercent = (answeredCount / totalQuestions) * 100;
  document.getElementById('progressFill').style.width = `${progressPercent}%`;
  document.getElementById('progressText').textContent = `Đã trả lời: ${answeredCount}/${totalQuestions} câu hỏi`;

  // Enable/disable submit button
  const submitBtn = document.getElementById('submitBtn');
  if (answeredCount === totalQuestions) {
    submitBtn.classList.add('enabled');
    submitBtn.disabled = false;
  } else {
    submitBtn.classList.remove('enabled');
    submitBtn.disabled = true;
  }
}

// Function to validate all questions answered
function validateAllAnswered() {
  const totalQuestions = selectedQuestions.length;
  let answeredCount = 0;

  for (let i = 0; i < totalQuestions; i++) {
    const selectedOption = document.querySelector(`input[name="question_${i}"]:checked`);
    if (selectedOption) {
      answeredCount++;
    }
  }

  return answeredCount === totalQuestions;
}

// Function to start timer
function startTimer(minutes) {
  timeLeft = minutes * 60;
  startTime = Date.now();

  timer = setInterval(() => {
    timeLeft--;

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;

    document.getElementById('timer').textContent =
      `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      submitExam();
    }
  }, 1000);
}

// Function to submit exam
window.submitExam = function () {
  // Validate all questions are answered
  if (!validateAllAnswered()) {
    const validationMessage = document.getElementById('validationMessage');
    validationMessage.style.display = 'block';

    // Hide message after 3 seconds
    setTimeout(() => {
      validationMessage.style.display = 'none';
    }, 3000);

    // Scroll to first unanswered question
    for (let i = 0; i < selectedQuestions.length; i++) {
      const selectedOption = document.querySelector(`input[name="question_${i}"]:checked`);
      if (!selectedOption) {
        document.getElementById(`question-${i}`).scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        break;
      }
    }

    return;
  }

  clearInterval(timer);

  // Collect answers
  selectedQuestions.forEach((question, index) => {
    const selectedOption = document.querySelector(`input[name="question_${index}"]:checked`);
    examData.answers[index] = selectedOption ? selectedOption.value : null;
  });

  // Calculate score
  let correctAnswers = 0;
  selectedQuestions.forEach((question, index) => {
    if (examData.answers[index] === question.answer) {
      correctAnswers++;
    }
  });

  const score = Math.round((correctAnswers / selectedQuestions.length) * 100);

  // Show results
  displayResults(score, correctAnswers);
}

// Function to display results
function displayResults(score, correctAnswers) {
  document.getElementById('examContent').style.display = 'none';
  document.getElementById('resultContainer').style.display = 'block';

  document.getElementById('score').textContent = `${score}% (${correctAnswers}/${selectedQuestions.length} câu đúng)`;

  let resultHtml = '<h3 style="margin-bottom: 30px; color: #2c3e50;">Chi tiết kết quả:</h3>';
  selectedQuestions.forEach((question, index) => {
    const userAnswer = examData.answers[index];
    const correctAnswer = question.answer;
    const isCorrect = userAnswer === correctAnswer;

    resultHtml += `
      <div class="result-item ${isCorrect ? 'correct' : 'incorrect'}">
        <p style="font-weight: 600; margin-bottom: 15px; font-size: 1.1em;">
          <span style="background: ${isCorrect ? '#2ecc71' : '#e74c3c'}; color: white; padding: 5px 10px; border-radius: 5px; margin-right: 10px;">
            Câu ${index + 1}
          </span>
          ${question.question}
        </p>
        <p style="margin-bottom: 10px;">
          <strong>Đáp án của bạn:</strong> 
          <span style="color: ${isCorrect ? '#2ecc71' : '#e74c3c'}; font-weight: 600;">
            ${userAnswer || 'Không trả lời'} ${isCorrect ? '✓' : '✗'}
          </span>
        </p>
        <p style="margin-bottom: 10px;">
          <strong>Đáp án đúng:</strong> 
          <span style="color: #2ecc71; font-weight: 600;">${correctAnswer}</span>
        </p>
        ${question.Explanation ? `<p style="margin-top: 15px; padding: 10px; background: rgba(52, 73, 94, 0.1); border-radius: 8px; font-style: italic;"><strong>Giải thích:</strong> ${question.Explanation}</p>` : ''}
      </div>
    `;
  });

  document.getElementById('resultDetails').innerHTML = resultHtml;
}

// Function to reset exam
window.resetExam = function () {
  document.getElementById('resultContainer').style.display = 'none';
  document.getElementById('examSetup').style.display = 'block';

  // Reset all data
  examData = {};
  selectedQuestions = [];
  clearInterval(timer);
}
