const testBlockElement = document.getElementById('test-block');
const aiGuessBlockElement = document.getElementById('ai-guess-block');
const darkButtonElement = document.getElementById('btn-dark');
const lightButtonElement = document.getElementById('btn-light');
const persistTrainingDataButtonElement = document.getElementById('btn-persist-training-data');
const clearTrainingDataButtonElement = document.getElementById('past-five-guesses');
const pastFiveGuessesElement = document.getElementById('past-five-guesses');
const pastFifteenGuessesElement = document.getElementById('past-fifteen-guesses');
const lastClearGuessesElement = document.getElementById('last-clear-guesses');

let aiCurrentGuess = { darkProbability: null, lightProbability: null };
let guessesSinceReload = [];
let previousGuessCorrectPercentages = {
    5: 0,
    15: 0
};

registerEventHandlers();
randomizeBackgroundColor();
setButtonTextColors();

function registerEventHandlers() {
    darkButtonElement.addEventListener('click', () => submitCorrectAnswer(true));
    lightButtonElement.addEventListener('click', () => submitCorrectAnswer(false));
    persistTrainingDataButtonElement.addEventListener('click', () => persistTrainingData());
    clearTrainingDataButtonElement.addEventListener('click', () => clearTrainingData());
}

function randomizeBackgroundColor() {
    const colour = getRandomColour();
    testBlockElement.style.backgroundColor = colour;
    aiGuessBlockElement.style.backgroundColor = colour;

    getAiPrediction();
}

function getRandomColour() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return "rgb(" + red + ", " + green + ", " + blue + ")";
}

function getCurrentBackgroundColour() {
    return testBlockElement.style.backgroundColor;
}

function getAiPrediction() {
    const backgroundColour = getCurrentBackgroundColour();
    aiGuessBlockElement.innerHTML = '<span>Loading Guess</span>';

    fetch(
        'http://localhost:3000/ai/colour-contrast/predict?colourRgbString=' + encodeURI(backgroundColour)
    )
    .then(result => result.json())
    .then(result => {
        aiCurrentGuess = result;
        const hasDarkContrast = result.darkProbability > result.lightProbability;
        const textColour = hasDarkContrast ? '#000000' : '#FFFFFF';
        aiGuessBlockElement.innerHTML = `<span style="color: ${ textColour }">${ hasDarkContrast ? 'Dark Text' : 'Light Text' }</span>`
        aiGuessBlockElement.style.color = textColour;
    }).catch(error => console.error(error));
}

function submitCorrectAnswer(hasDarkContrast) {
    const backgroundColour = getCurrentBackgroundColour();
    fetch(
        'http://localhost:3000/ai/colour-contrast/train',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ colourRgbString: encodeURI(backgroundColour), hasDarkContrast, hasLightContrast: !hasDarkContrast})
        }
    ).then(() => {
        trackGuess();
        setGuessStats();
        randomizeBackgroundColor();
        if (guessesSinceReload.length % 5 === 0) setButtonTextColors();
    }).catch(error => console.error(error));
}

function persistTrainingData() {
    fetch(
        'http://localhost:3000/ai/colour-contrast/training-data/persist',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then(result => {
        console.log('Training data has been persisted.');
    }).catch(error => console.error(error));
}

function clearTrainingData() {
    fetch(
        'http://localhost:3000/ai/colour-contrast/training-data/clear',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then(() => {
        console.log('Training data has been cleared.');
    }).catch(error => console.error(error));
}

function trackGuess(isCorrectAnswerDarkContrast) {
    guessesSinceReload.push({
        isCorrect: isCorrectAnswerDarkContrast
            ? aiCurrentGuess.darkProbability > aiCurrentGuess.lightProbability
            : aiCurrentGuess.darkProbability < aiCurrentGuess.lightProbability,
        guess: aiCurrentGuess
    })
}

function setGuessStats() {
    guessesSinceReload.length > 4
        ? pastFiveGuessesElement.innerHTML = getPastGuessStatsWithin(5)
        : pastFiveGuessesElement.display = 'none';
    guessesSinceReload.length > 14
        ? pastFifteenGuessesElement.innerHTML = getPastGuessStatsWithin(15)
        : pastFifteenGuessesElement.display = 'none';

    lastClearGuessesElement.innerHTML = getPastGuessStatsWithin(guessesSinceReload.length);
}

function getPastGuessStatsWithin(guesses) {
    const guessesWithinRange = guessesSinceReload.slice(0, guesses);
    const correctGuessesCount = guessesWithinRange.filter(x => x.isCorrect).length;
    const correctGuessPercentage = Math.round(correctGuessesCount / guesses * 100);

    const isTotalGuesses = guesses === guessesSinceReload.length;
    const isImprovement = correctGuessPercentage > previousGuessCorrectPercentages[guesses];

    previousGuessCorrectPercentages[guesses] = correctGuessPercentage;

    return isTotalGuesses
        ? `${correctGuessesCount} / ${guesses} (${correctGuessPercentage}%)`
        : `<span style="color: ${isImprovement ? 'green' : 'red'}">${correctGuessesCount} / ${guesses} (${correctGuessPercentage}%) ${isImprovement ? '^' : 'v'}</span>`;
}

function setButtonTextColors() {
    const buttons = [
        lightButtonElement,
        darkButtonElement,
        persistTrainingDataButtonElement,
        clearTrainingDataButtonElement
    ]
    buttons.forEach(button => {
        fetch(
            'http://localhost:3000/ai/colour-contrast/predict?colourRgbString=' + encodeURI(button.style.backgroundColor)
        )
            .then(result => result.json())
            .then(result => {
                const hasDarkContrast = result.darkProbability > result.lightProbability;
                button.style.color = hasDarkContrast ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
            });
    })
}