class Contrast {
    constructor(darkProbability, lightProbability) {
        this.darkProbability = darkProbability;
        this.lightProbability = lightProbability;
    }

    static fromJson(json) {
        return new Contrast(json.darkProbability, json.lightProbability);
    }

    toJson() {
        return {
            darkProbability: this.darkProbability,
            lightProbability: this.lightProbability
        }
    }
}

module.exports = { Contrast };