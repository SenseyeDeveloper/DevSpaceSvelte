import {Matcher, MatcherBuilder} from "./matcher";
import {Company} from "../entities";

class CompanyMatcher implements Matcher {
    constructor(
        private readonly state: Company,
    ) {}

    match(item: Company) {
        return item === this.state;
    }
}

export default class CompanyMatcherBuilder implements MatcherBuilder {
    constructor(
        private readonly state: () => Company,
    ) {
    }

    build(): Matcher {
        const company = this.state();

        if (company === null) {
            return null;
        }

        return new CompanyMatcher(company);
    }
}
