import {Matcher, MatcherBuilder} from "./matcher";
import {Company} from "../entities";

const topLargestMatcher = new class implements Matcher {
    match(item: Company) {
        return item.top50Largest;
    }
};

export default class TopLargestMatcherBuilder implements MatcherBuilder {
    constructor(
        private readonly state: () => boolean,
    ) {
    }

    build(): Matcher {
        if (this.state() === true) {
            return topLargestMatcher;
        }

        return null;
    }
}
