import {City, Company, Office, Vacancy} from "./entities";
import {Location} from "./location"
import {NormalizeService} from "./normalizer";
import {CityService} from "./cities";

export default function unmarshal(source: Array<any>): Array<Company> {
    const length = source.length;
    const result = new Array(length);

    const normalizeService = new NormalizeService();
    const cityService = new CityService();

    for (let i = 0; i < length; i++) {
        const company = source[i];

        result[i] = new Company(
            company[0],
            company[1],
            unzipOffices(cityService, company[2]),
            unzipVacancies(cityService, normalizeService, company[3]),
            company[4],
            company[5],
            company[6],
            company[7],
            company[8],
        );
    }

    normalizeService.store();
    cityService.store();

    return result;
}

function unzipOffices(cityService: CityService, source): Array<Office> {
    const length = source.length,
        result = new Array(length);

    for (let i = 0; i < length; i++) {
        const office = source[i],
            location = office[2];

        result[i] = new Office(
            unzipCity(cityService, office[0]),
            office[1],
            new Location(location[0], location[1]),
        );
    }

    return result;
}

function unzipVacancies(cityService: CityService, normalizeService: NormalizeService, source: Array<any>): Array<Vacancy> {
    const length = source.length;

    const result = new Array(length);

    for (let i = 0; i < length; i++) {
        const vacancy = source[i],
            title = vacancy[1];

        result[i] = new Vacancy(
            vacancy[0],
            title,
            normalizeService.index(title),
            unzipCities(cityService, vacancy[2]),
            vacancy[3],
            vacancy[4],
            vacancy[5]
        );
    }

    return result;
}

function unzipCity(cityService: CityService, source: Array<any>): City {
    return cityService.find(source[0], source[1])
}

function unzipCities(cityService: CityService, source: Array<any>): Array<City> {
    return source.map(function (data) {
        return unzipCity(cityService, data);
    });
}