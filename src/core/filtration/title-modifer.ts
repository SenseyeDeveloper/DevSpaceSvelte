import {ModifierBuilder, Modifier} from "./modifier";
import VacancyModifier from "./vacancy-modifier";
import {dataProviderIndexes} from "../normalizer";

class TitleModifier extends VacancyModifier {
    constructor(indexes: {[k: number]: boolean}) {
        super(function (vacancy) {
            return indexes.hasOwnProperty(vacancy.titleIndex);
        });
    }
}

export default class TitleModifierBuilder implements ModifierBuilder {
    constructor(
        private readonly state: () => string,
    ) {
    }

    build(): Modifier {
        const title = this.state().trim();

        if (title === "") {
            return null;
        }

        const indexes = dataProviderIndexes(title);

        const indexMap = {};
        const length = indexes.length;

        for (let i = 0; i < length; i++) {
            indexMap[indexes[i]] = true;
        }

        return new TitleModifier(indexMap);
    }
}
