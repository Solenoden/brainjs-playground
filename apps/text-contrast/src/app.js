const express = require('express');
const { AppNeuralNetwork } = require("./services/app-neural-network");
const {Colour} = require("./models/colour.model");

const app = express();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Node Application is running on port: `, port);
});

const textContrastNeuralNetwork = new AppNeuralNetwork('');
console.log(textContrastNeuralNetwork.run(new Colour(255, 255, 255)));