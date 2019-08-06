import {ModifierBuilder, Modifier} from "./modifier";
import VacancyModifier from "./vacancy-modifier";

export default class NewestModifierBuilder implements ModifierBuilder {
    constructor(
        private readonly state: () => boolean,
    ) {
    }

    build(): Modifier {
        const range = this.state();

        if (range === true) {
            return newestModifier;
        }

        return null;
    }
}

const newestModifier = new class extends VacancyModifier {
    constructor() {
        const published = subNdays(7);

        super(function (vacancy) {
            return vacancy.published >= published;
        });
    }
};

function subNdays(n) {
    const offset = (24 * 60 * 60 * 1000) * n;
    const now = new Date();
    now.setTime(now.getTime() - offset);

    return `${now.getFullYear()}-${leftPadNumber(now.getMonth() + 1)}-${leftPadNumber(now.getDate())}`;
}

function leftPadNumber(number) {
    if (number > 9) {
        return number;
    }

    return "0" + number;
}