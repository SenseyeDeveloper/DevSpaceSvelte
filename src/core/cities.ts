import {City} from "./entities";
import normalize from "./hint_normalizer";
import solve from "./hint_solver";
import {CITY_HINT_LIMIT} from "./settings";

// all with alias
const all: Array<City> = [];
let normalizeNames: Array<string> = [];
const aliasMap: { [s: string]: City } = {};

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

class Aggregation {
    private readonly city: City;
    private count: number;

    constructor(city: City) {
        this.city = city;
        this.count = 1;
    }

    add() {
        this.count += 1;
    }

    getCity() {
        return this.city;
    }

    getCount() {
        return this.count;
    }
}

export class CityService {
    private readonly cityAliasMap: { [s: string]: Aggregation };
    private readonly cityNameMap: { [s: string]: City };

    constructor() {
        this.cityAliasMap = {};
        this.cityNameMap = {};
    }

    find(alias, name): City {
        if (alias !== "") {
            if (this.cityAliasMap.hasOwnProperty(alias)) {
                const result = this.cityAliasMap[alias];

                result.add();

                return result.getCity();
            }

            const result = new City(alias, name);

            this.cityAliasMap[alias] = new Aggregation(result);

            return result;
        }

        if (this.cityNameMap.hasOwnProperty(name)) {
            return this.cityNameMap[name];
        }

        const result = new City(alias, name);

        this.cityNameMap[alias] = result;

        return result;
    }

    store() {
        const aggregations = Object.values(this.cityAliasMap);

        aggregations.sort(function (a, b) {
            return b.getCount() - a.getCount();
        });

        const length = aggregations.length;
        for (let i = 0; i < length; i++) {
            const aggregation = aggregations[i];
            const city = aggregation.getCity();

            all.push(city);
            aliasMap[city.alias] = city;
        }
    }
}

export function findCityByAlias(alias): City {
    if (aliasMap.hasOwnProperty(alias)) {
        return aliasMap[alias];
    }

    return null;
}

export function popularCities(): Array<City> {
    return all;
}

export function hintCitiesProvider(s: string): Array<City> {
    return solve(s, lazyNormalizeNames(), all, CITY_HINT_LIMIT);
}