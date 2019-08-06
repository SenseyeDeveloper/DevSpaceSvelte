import {ModifierBuilder, Modifier} from "./modifier";
import {City, Company} from "../entities";

class CityModifier implements Modifier {
    constructor(
        private readonly city: City,
    ) {
    }

    modify(item: Company) {
        const matchOffices = [];
        const officeCities = [];

        for (let i = 0; i < item.offices.length; i++) {
            const office = item.offices[i];

            if (sameCity(office.city, this.city)) {
                matchOffices.push(office);
                officeCities.push(office.city);
            }
        }

        if (matchOffices.length === 0) {
            return null;
        }

        const matchVacancies = [];

        for (let j = 0; j < item.vacancies.length; j++) {
            const vacancy = item.vacancies[j];

            if (vacancy.existsOffice === false || inCities(vacancy.cities, officeCities)) {
                matchVacancies.push(vacancy);
            }
        }

        if (matchVacancies.length === 0) {
            return null;
        }

        return new Company(
            item.alias,
            item.name,
            matchOffices,
            matchVacancies,
            item.review_count,
            item.employee_count,
            item.type,
            item.top50Largest,
            item.photoExists,
        );
    }
}

export default class CityModifierBuilder implements ModifierBuilder {
    constructor(
        private readonly state: () => City,
    ) {
    }

    build(): Modifier {
        const city = this.state();

        if (city === null) {
            return null;
        }

        return new CityModifier(city);
    }
}

function inCities(vacancyCities: Array<City>, officeCities: Array<City>) {
    for (let j = 0; j < officeCities.length; j++) {
        for (let i = 0; i < vacancyCities.length; i++) {
            if (sameCity(vacancyCities[i], officeCities[j])) {
                return true
            }
        }
    }

    return false;
}

function sameCity(a: City, b: City): boolean {
    return a === b;
}