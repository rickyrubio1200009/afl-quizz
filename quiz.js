let questions = [];
let score = 0;
let timer;
let currentIndex = 0;
let timeLeft = 15;

const queryParams = new URLSearchParams(window.location.search);
const mode = queryParams.get('mode');

function loadQuestions() {
  let script = document.createElement('script');
  let src = '';

  if (!mode) {
    alert('No quiz mode specified');
    return;
  }

  if (mode.startsWith('clubs/')) {
    let clubName = mode.split('/')[1];
    src = `js/clubs/${clubName}.js`;
  } else {
    src = `js/questions-${mode}.js`;
  }

  script.src = src;
  script.onload = () => {
    questions = shuffle(questions).slice(0, 200);
    if (questions.length === 0) {
      alert('No questions found for this quiz.');
      return;
    }
    showQuestion();
    startTimer();
  };
  script.onerror = () => alert('Failed to load questions file: ' + src);
  document.body.appendChild(script);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showQuestion() {
  if (currentIndex >= questions.length) {
    clearInterval(timer);
    alert('🎉 You have finished all questions! Your score: ' + score);
    window.location.href = 'done.html';
    return;
  }
  document.getElementById('question-box').innerText = questions[currentIndex].question;
  document.getElementById('answer').value = '';
  timeLeft = 15;
  updateTimerDisplay();
}

function submitAnswer() {
  const userAnswer = document.getElementById('answer').value.trim().toLowerCase();
  const correct = questions[currentIndex].answer.toLowerCase();

  if (userAnswer === correct) {
    document.body.style.backgroundColor = 'lightgreen';
    score++;
    document.getElementById('score').innerText = `Score: ${score}`;
    clearInterval(timer);
    setTimeout(() => {
      document.body.style.backgroundColor = '';
      currentIndex++;
      showQuestion();
      startTimer();
    }, 500);
  } else {
    document.body.style.backgroundColor = 'red';
    clearInterval(timer);
    setTimeout(() => {
      document.body.style.backgroundColor = '';
      alert('Wrong answer! Your score resets to 0. Try again!');
      score = 0;
      document.getElementById('score').innerText = `Score: ${score}`;
      currentIndex = 0;
      questions = shuffle(questions);
      showQuestion();
      startTimer();
    }, 1000);
  }
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert('Time is up!');
      submitAnswer();
    }
  }, 1000);
}

function updateTimerDisplay() {
  document.getElementById('timer').innerText = `Time left: ${timeLeft}s`;
}

window.onload = loadQuestions;