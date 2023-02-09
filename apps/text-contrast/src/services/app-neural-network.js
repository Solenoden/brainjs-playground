const brain = require('brain.js');
const { TrainingDataItem } = require("../models/training-data-item.model");
const { Colour } = require("../models/colour.model");
const { Contrast } = require("../models/contrast.model");
const fs = require('fs');

class AppNeuralNetwork {
    trainingData = [];
    constructor(trainingDataSourceFileName) {
        this.brainNeuralNetwork = new brain.NeuralNetwork();
        this.trainingDataSourceFileName = trainingDataSourceFileName;

        this.loadSourceTrainingData().then(() => {
            this.train();
        }).catch(error => console.error(error));
    }

    get trainingDataSourceFilePath() {
        return './training-data/' + this.trainingDataSourceFileName + '.json';
    }

    loadSourceTrainingData() {
        return new Promise((resolve, reject) => {
            this.readTrainingDataSourceFile().then(data => {
                const trainingDataItemsJson = data;
                this.trainingData = trainingDataItemsJson.map(item => {
                    return new TrainingDataItem(
                        Colour.fromJson(item.input),
                        Contrast.fromJson(item.output)
                    )
                });

                resolve();
            }).catch(error => reject(error));
        })
    }

    clearTrainingData() {
        return new Promise((resolve, reject) => {
            this.createTrainingDataSourceFile().then(() => {
                return this.persistTrainingData();
            }).then(() => {
                resolve();
            }).catch(error => reject(error));
        });
    }

    persistTrainingData() {
        return new Promise((resolve, reject) => {
            const trainingDataJson = this.trainingData.map(item => {
                return {
                    input: item.input.toJson(),
                    output: item.output.toJson()
                }
            });

            console.log();
            console.log('Persisted Training Data');
            this.logCurrentTrainingData();

            fs.writeFile(this.trainingDataSourceFilePath, JSON.stringify(trainingDataJson), (error) => {
                if (error) {
                    console.error(error);
                    reject(error);
                    return;
                }

                resolve();
            });
        })
    }

    createTrainingDataSourceFile() {
        return new Promise((resolve, reject) => {
            this.trainingData = [
                new TrainingDataItem(
                    new Colour(255, 255, 255), new Contrast(0, 1),
                ),
                new TrainingDataItem(
                    new Colour(0, 0, 0), new Contrast(1, 0),
                ),
            ];
            this.persistTrainingData().then(() => resolve()).catch(error => reject(error));
        });
    }

    readTrainingDataSourceFile() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.trainingDataSourceFilePath, (error, data) => {
                if (error) {
                    this.createTrainingDataSourceFile().then(() => {
                        this.readTrainingDataSourceFile().then(result => resolve(result));
                    }).catch(error => {
                        reject({
                            error: new Error('An error occurred while trying to load the training data from source.'),
                            originalError: error
                        })
                    });
                    return;
                }

                resolve(JSON.parse(data.toString()));
            });
        })
    }

    logCurrentTrainingData() {
        console.log('==================== Training Data ====================');
        this.trainingData.forEach((item) => {
            console.log({
               input: item.input.toJson(),
               output: item.output.toJson(),
            });
        })
        console.log('=======================================================');
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