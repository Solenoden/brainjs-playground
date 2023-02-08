class TrainingDataItem {
    constructor(input, output) {
        this.input = input;
        this.output = output;
    }

    compile() {
        return { input: this.input.compile(), output: this.output };
    }
}

module.exports = { TrainingDataItem };