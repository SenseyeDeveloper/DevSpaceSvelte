import {Matcher, MatcherBuilder} from "./matcher";
import {Company} from "../entities";
import {CS_1} from "../company-sizes";
import {createAliasMap} from "../alias-map";

class CompanySizesMatcher implements Matcher {
    constructor(
        private readonly aliasMap: { [s: string]: boolean },
    ) {
    }

    match(item: Company) {
        let employeeCount = item.employee_count;
        if (employeeCount === "") {
            employeeCount = CS_1;
        }

        return this.aliasMap.hasOwnProperty(employeeCount) && this.aliasMap[employeeCount] === true;
    }
}

export default class CompanySizesMatcherBuilder implements MatcherBuilder {
    constructor(
        private readonly state: () => Array<string>,
    ) {
    }

    build(): Matcher {
        const aliases = this.state();

        if (aliases.length === 0) {
            return null;
        }

        return new CompanySizesMatcher(createAliasMap(aliases, true));
    }
}