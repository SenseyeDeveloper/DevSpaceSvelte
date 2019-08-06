import {Company} from "../entities";
import {Matcher} from "./matcher";

export interface Modifier {
    modify(item: Company): Company;
}

export const SameModifier = new class implements Modifier {
    modify(item: Company): Company {
        return item;
    }
};

export class MergeModifier implements Modifier {
    constructor(
        private readonly source: Modifier,
        private readonly next: Modifier,
    ) {
    }

    modify(item: Company): Company {
        const result = this.source.modify(item);

        if (result === null) {
            return null;
        }

        return this.next.modify(result);
    }
}

export interface ModifierBuilder {
    build(): Modifier;
}
