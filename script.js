let trainingTime = 50; // 50초 훈련
let restTime = 60;     // 60초 휴식
let setRestTime = 300; // 세트 간 300초 (5분) 휴식
let totalSets = 3;     // 총 세트 수

let currentSet = 1;
let roundCount = 0;
let isTraining = true; // 훈련 상태 (true: 훈련, false: 휴식)
let isSetResting = false;
let timeLeft = trainingTime;

let timerInterval = null;

const timerDisplay = document.getElementById('timer-display');
const roundDisplay = document.getElementById('round-display');
const setDisplay = document.getElementById('set-display');

const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');
const skipButton = document.getElementById('skip-button');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;

    if (isSetResting) {
        roundDisplay.textContent = "세트 간 휴식";
        setDisplay.textContent = "";
    } else if (isTraining) {
        roundDisplay.textContent = `${roundCount + 1}번째 거총`;
        setDisplay.textContent = `세트 ${currentSet}/${totalSets}`;
    } else {
        roundDisplay.textContent = `${roundCount + 1}번째 휴식`;
        setDisplay.textContent = `세트 ${currentSet}/${totalSets}`;
    }
}

function startTimer() {
    if (timerInterval) return; // 이미 타이머가 실행 중이면 무시
    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            switchPhase();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    currentSet = 1;
    roundCount = 0;
    isTraining = true;
    isSetResting = false;
    timeLeft = trainingTime;
    updateDisplay();
}

function skipPhase() {
    timeLeft = 0;
    updateDisplay();
    if (!timerInterval) startTimer(); // 타이머가 중단된 상태라면 다시 시작
}

function switchPhase() {
    if (isSetResting) {
        isSetResting = false;
        roundCount = 0;
        isTraining = true;
        timeLeft = trainingTime;
    } else if (isTraining) {
        if (roundCount === 9) { // 마지막 라운드 -> 세트 간 휴식
            if (currentSet < totalSets) {
                currentSet++;
                timeLeft = setRestTime;
                isSetResting = true;
            } else {
                alert("훈련이 종료되었습니다!");
                resetTimer();
                return;
            }
        } else {
            isTraining = false;
            timeLeft = restTime;
        }
    } else { // 휴식 -> 다음 훈련
        roundCount++;
        isTraining = true;
        timeLeft = trainingTime;
    }
    updateDisplay();
    startTimer(); // 자동으로 타이머 시작
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
skipButton.addEventListener('click', skipPhase);

updateDisplay();
