import {TrainingDataInput} from "./training-data-input";

export class Colour extends TrainingDataInput {
    constructor(
        public red: number,
        public green: number,
        public blue: number
    ) {
        super();
    }

    public compile(): number[] {
        return [
            this.red === 0 ? 0 : this.red / 255,
            this.red === 0 ? 0 : this.green / 255,
            this.red === 0 ? 0 : this.blue / 255,
        ];
    }
}