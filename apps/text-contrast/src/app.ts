import express from 'express';
import {AppNeuralNetwork} from "./services/app-neural-network";
import {Contrast} from "./models/contrast.model";
import {Colour} from "./models/colour.model";

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    return console.log(`Node Application is running on port: `, port);
});

const textContrastNeuralNetwork = new AppNeuralNetwork<Colour, Contrast>('');
console.log(textContrastNeuralNetwork.train());