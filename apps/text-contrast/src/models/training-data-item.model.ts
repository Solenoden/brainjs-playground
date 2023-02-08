import {TrainingDataInput} from "./training-data-input";

export class TrainingDataItem<InputType extends TrainingDataInput, OutputType> {
    constructor(
        public input: InputType,
        public output: OutputType
    ) {}

    public compile(): { input: number[], output: number[] | { [key: string]: any }} {
        return { input: this.input.compile(), output: this.output };
    }
}