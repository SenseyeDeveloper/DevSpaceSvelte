import {Matcher, MatcherBuilder} from "./matcher";
import {Company} from "../entities";

const companyPhotoExistsMatcher = new class implements Matcher {
    match(item: Company) {
        return item.photoExists;
    }
};

export default class CompanyPhotoExistsMatcherBuilder implements MatcherBuilder {
    constructor(
        private readonly state: () => boolean,
    ) {
    }

    build(): Matcher {
        if (this.state() === true) {
            return companyPhotoExistsMatcher;
        }

        return null;
    }
}
