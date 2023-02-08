import * as brain from 'brain.js';
import {TrainingDataItem} from "../models/training-data-item.model";
import {Colour} from "../models/colour.model";
import {Contrast} from "../models/contrast.model";
import {INeuralNetworkState} from "brain.js/dist/src/neural-network-types";

export class AppNeuralNetwork<InputType, OutputType> {
    private brainNeuralNetwork: brain.NeuralNetwork<any, any> = new brain.NeuralNetwork<any, any>();
    private trainingData: TrainingDataItem<Colour, Contrast>[] = [
        new TrainingDataItem<Colour, Contrast>(
            new Colour(255, 255, 255), new Contrast(0, 1)
        ),
        new TrainingDataItem<Colour, Contrast>(
            new Colour(192, 192, 192), new Contrast(0, 1)
        ),
        new TrainingDataItem<Colour, Contrast>(
            new Colour(65, 65, 65), new Contrast(1, 0)
        ),
        new TrainingDataItem<Colour, Contrast>(
            new Colour(0, 0, 0), new Contrast(1, 0)
        )
    ];

    constructor(
        private trainingDataSourceFileName: string
    ) {
        this.loadSourceTrainingData();
    }

    private loadSourceTrainingData(): void {
        // TODO: Implement
    }

    public train(): INeuralNetworkState {
        const compiledTrainingData = this.trainingData.map(x => x.compile());
        return this.brainNeuralNetwork.train(compiledTrainingData);
    }
}