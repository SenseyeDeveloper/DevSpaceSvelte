import {Company} from "../entities";
import {AllMatcher, MatcherBuilder, MergeMatcher} from "./matcher";
import {MergeModifier, ModifierBuilder, SameModifier} from "./modifier";

// reuse memory
let result: Array<Company> = null;

export default class FilterContainer {
    constructor(
        private readonly matcherBuilderMap: { [s: string]: MatcherBuilder },
        private readonly modifierBuilderMap: { [s: string]: ModifierBuilder },
    ) {
    }

    filter(source: Array<Company>): Array<Company> {
        let count = 0;

        let matcher = AllMatcher;
        for (let criteriaName in this.matcherBuilderMap) {
            if (this.matcherBuilderMap.hasOwnProperty(criteriaName)) {
                const current = this.matcherBuilderMap[criteriaName].build();

                if (current === null) {
                    continue;
                }

                matcher = new MergeMatcher(matcher, current);

                count += 1;
            }
        }

        let modifier = SameModifier;
        for (let criteriaName in this.modifierBuilderMap) {
            if (this.modifierBuilderMap.hasOwnProperty(criteriaName)) {
                const current = this.modifierBuilderMap[criteriaName].build();

                if (current === null) {
                    continue;
                }

                modifier = new MergeModifier(modifier, current);

                count += 1;
            }
        }

        if (count === 0) {
            return source;
        }

        const length = source.length;

        if (result === null) {
            result = new Array<Company>(length);
        }

        let index = 0;

        for (let i = 0; i < length; i++) {
            const item = source[i];

            if (matcher.match(item)) {
                const modified = modifier.modify(item);

                if (modified === null) {
                    continue;
                }

                result[index] = modified;
                index += 1;
            }
        }

        // constant allocation
        return result.slice(0, index);
    }
}