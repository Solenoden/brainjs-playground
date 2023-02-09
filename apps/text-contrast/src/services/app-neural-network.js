const brain = require('brain.js');
const { TrainingDataItem } = require("../models/training-data-item.model");
const { Colour } = require("../models/colour.model");
const { Contrast } = require("../models/contrast.model");

class AppNeuralNetwork {
    constructor(trainingDataSourceFileName) {
        this.brainNeuralNetwork = new brain.NeuralNetwork();
        this.trainingData = [
            new TrainingDataItem(
                new Colour(255, 255, 255), new Contrast(0, 1)
            ),
            new TrainingDataItem(
                new Colour(192, 192, 192), new Contrast(0, 1)
            ),
            new TrainingDataItem(
                new Colour(65, 65, 65), new Contrast(1, 0)
            ),
            new TrainingDataItem(
                new Colour(0, 0, 0), new Contrast(1, 0)
            )
        ];
        this.trainingDataSourceFileName = trainingDataSourceFileName;

        this.loadSourceTrainingData();
        this.train();
    }

    loadSourceTrainingData() {
        // TODO: Implement
    }

    train() {
        const compiledTrainingData = this.trainingData.map(x => x.compile());
        return this.brainNeuralNetwork.train(compiledTrainingData);
    }

    run(trainingDataInput) {
        return this.brainNeuralNetwork.run(trainingDataInput.compile());
    }

    addNewTrainingData(trainingDataItem) {
        this.trainingData.push(trainingDataItem);
        this.train();
    }
}

module.exports = { AppNeuralNetwork };