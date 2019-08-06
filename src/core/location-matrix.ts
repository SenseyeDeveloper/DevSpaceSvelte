import {City, Company, Office, Vacancy} from "./entities";

export default class LocationMaxtrix {
    private readonly data: {};

    constructor(companies: Array<Company>) {
        this.data = {};

        for (let company of companies) {
            for (let office of company.offices) {
                const vacancies = currentOfficeVacancies(office, company.vacancies);

                if (vacancies.length === 0) {
                    continue;
                }

                this.add(
                    office.location.latitude,
                    office.location.longitude,
                    new Company(
                        company.alias,
                        company.name,
                        [office],
                        vacancies,
                        company.review_count,
                        company.employee_count,
                        company.type,
                        company.top50Largest,
                        company.photoExists,
                    )
                );
            }
        }
    }

    add(latitude, longitude, item: Company) {
        this.data[latitude] = this.data[latitude] || {};
        this.data[latitude][longitude] = this.data[latitude][longitude] || [];
        this.data[latitude][longitude].push(item);
    }

    matrix() {
        return this.data;
    }
}

function currentOfficeVacancies(office: Office, vacancies: Array<Vacancy>) {
    const result = [];

    for (let i = 0; i < vacancies.length; i++) {
        const vacancy = vacancies[i];

        if (vacancy.existsOffice === false || inCities(vacancy.cities, [office.city])) {
            result.push(vacancy);
        }
    }

    return result;
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
    return a.alias === b.alias || a.name === b.name;
}