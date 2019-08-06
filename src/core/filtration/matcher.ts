import {Company} from "../entities";

export interface Matcher {
    match(item: any): boolean;
}

export const AllMatcher = new class implements Matcher {
    match(item: Company): boolean {
        return true;
    }
};

export class MergeMatcher implements Matcher {
    constructor(
        private readonly source: Matcher,
        private readonly next: Matcher,
    ) {
    }

    match(item: Company): boolean {
        return this.source.match(item) && this.next.match(item);
    }
}

export interface MatcherBuilder {
    build(): Matcher;
}
