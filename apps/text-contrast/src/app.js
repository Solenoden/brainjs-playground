const express = require('express');
const { AppNeuralNetwork } = require("./services/app-neural-network");
const { Colour } = require("./models/colour.model");
const path = require("path");
const {TrainingDataItem} = require("./models/training-data-item.model");
const {Contrast} = require("./models/contrast.model");

const app = express();

const textContrastNeuralNetwork = new AppNeuralNetwork('');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", function (request, response) {
    response.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/ai/colour-contrast/predict", function (request, response) {
    const colour = decodeURI(request.query.colourRgbString);
    const prediction = textContrastNeuralNetwork.run(Colour.fromRgbString(colour));
    response.send(prediction);
});
app.post("/ai/colour-contrast/train", function (request, response) {
    const colour = decodeURI(request.body.colourRgbString);
    const hasDarkContrast = request.body.hasDarkContrast;
    const hasLightContrast = request.body.hasLightContrast;
    textContrastNeuralNetwork.addNewTrainingData(new TrainingDataItem(
        Colour.fromRgbString(colour),
        new Contrast(hasDarkContrast ? 1 : 0, hasLightContrast ? 1 : 0)
    ));
    response.send();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Node Application is running on port: `, port);
});