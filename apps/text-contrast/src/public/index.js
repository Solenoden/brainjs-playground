const testBlockElement = document.getElementById('test-block');
const aiGuessBlockElement = document.getElementById('ai-guess-block');
const darkButtonElement = document.getElementById('btn-dark');
const lightButtonElement = document.getElementById('btn-light');

registerEventHandlers();
randomizeBackgroundColor();

function registerEventHandlers() {
    darkButtonElement.addEventListener('click', () => submitCorrectAnswer(true));
    lightButtonElement.addEventListener('click', () => submitCorrectAnswer(false));
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
    fetch(
        'http://localhost:3000/ai/colour-contrast/predict?colourRgbString=' + encodeURI(backgroundColour)
    )
    .then(result => result.json())
    .then(result => {
        const hasDarkContrast = result.darkProbability > result.lightProbability;
        console.log(result);
        const textColour = hasDarkContrast ? '#000000' : '#FFFFFF';
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
    ).then(result => {
        randomizeBackgroundColor();
    }).catch(error => console.error(error));
}