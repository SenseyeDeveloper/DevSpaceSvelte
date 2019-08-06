import {Matcher, MatcherBuilder} from "./matcher";
import {Company} from "../entities";

const reviewExistsMatcher = new class implements Matcher {
    match(item: Company) {
        return item.review_count > 0;
    }
};

export default class ReviewsMatcherBuilder implements MatcherBuilder {
    constructor(
        private readonly state: () => boolean,
    ) {
    }

    build(): Matcher {
        const checked = this.state();

        if (checked === true) {
            return reviewExistsMatcher;
        }

        return null;
    }
}
