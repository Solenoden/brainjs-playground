const {TrainingDataInput} = require("./training-data-input");

class Colour extends TrainingDataInput {
    constructor(red, green, blue) {
        super();
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    compile() {
        return [
            this.red === 0 ? 0 : this.red / 255,
            this.green === 0 ? 0 : this.green / 255,
            this.blue === 0 ? 0 : this.blue / 255,
        ];
    }
}

module.exports = { Colour };
