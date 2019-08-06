import {Company, Vacancy} from "./entities";
import normalize from "./hint_normalizer";
import solve from "./hint_solver";
import {COMPANY_HINT_LIMIT} from "./settings";

let all = [];
let normalizeNames: Array<string> = [];
const aliasMap: { [s: string]: Company } = {};

function lazyNormalizeNames(): Array<string> {
    if (normalizeNames.length > 0) {
        return normalizeNames;
    }

    if (all.length === 0) {
        return [];
    }

    normalizeNames = normalize(all);

    return normalizeNames;
}

function buildAliasMap(companies: Array<Company>) {
    for (let i = 0; i < companies.length; i++) {
        const company = companies[i];

        aliasMap[company.alias] = company;
    }
}

export function fillCompaniesProvider(companies: Array<Company>) {
    buildAliasMap(companies);

    all = companies;
}

export function findCompanyByAlias(alias): Company {
    if (aliasMap.hasOwnProperty(alias)) {
        return aliasMap[alias];
    }

    return null;
}

export function hintCompaniesProvider(s: string): Array<Company> {
    return solve(s, lazyNormalizeNames(), all, COMPANY_HINT_LIMIT);
}
